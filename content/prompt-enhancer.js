// ContextBridge Prompt Enhancer
// Detects when user types a prompt and offers an AI-enhanced version

(() => {
  "use strict";

  const HOSTNAME = window.location.hostname;

  // ── Platform detection ────────────────────────────────────────────────────
  const getPlatform = () => {
    if (HOSTNAME.includes("chatgpt.com") || HOSTNAME.includes("chat.openai.com")) return "chatgpt";
    if (HOSTNAME.includes("claude.ai")) return "claude";
    if (HOSTNAME.includes("gemini.google.com")) return "gemini";
    if (HOSTNAME.includes("copilot.microsoft.com") || HOSTNAME.includes("copilot.com")) return "copilot";
    if (HOSTNAME.includes("grok.com")) return "grok";
    return null;
  };

  const platform = getPlatform();
  if (!platform) return;

  // ── Textarea selectors per platform ──────────────────────────────────────
  const TEXTAREA_SELECTORS = {
    chatgpt:  '#prompt-textarea, textarea[data-id="root"], [contenteditable="true"][data-virtualkeyboard-dismissal]',
    claude:   'div[contenteditable="true"].ProseMirror, fieldset textarea, [contenteditable="true"]',
    gemini:   'rich-textarea div[contenteditable="true"], textarea.query-box, [contenteditable="true"]',
    copilot:  'textarea#userInput, [contenteditable="true"], textarea',
    grok:     'textarea, [contenteditable="true"]',
  };

  const findTextarea = () => {
    const selectors = TEXTAREA_SELECTORS[platform] || 'textarea, [contenteditable="true"]';
    const els = document.querySelectorAll(selectors);
    // Return the visible one
    for (const el of els) {
      if (el.offsetParent !== null && !el.closest('#contextbridge-enhancer-host')) return el;
    }
    return null;
  };

  const getTextareaValue = (el) => {
    if (!el) return "";
    return el.value !== undefined ? el.value : el.innerText || el.textContent || "";
  };

  const setTextareaValue = (el, value) => {
    if (!el) return;
    // Focus first
    el.focus();
    if (el.value !== undefined) {
      // Native input
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set
        || Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
      if (nativeInputValueSetter) {
        nativeInputValueSetter.call(el, value);
      } else {
        el.value = value;
      }
      el.dispatchEvent(new Event('input', { bubbles: true }));
    } else {
      // contenteditable
      el.innerText = value;
      el.dispatchEvent(new InputEvent('input', { bubbles: true }));
      // Move cursor to end
      const range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  };

  // ── Enhance via Anthropic API ─────────────────────────────────────────────
  const enhancePrompt = async (originalPrompt) => {
    // Read API key from storage
    const { anthropicApiKey } = await new Promise(resolve => chrome.storage.local.get("anthropicApiKey", resolve));
    if (!anthropicApiKey) throw new Error("No API key. Please add it in Settings.");

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: `You are a prompt engineering expert. Your job is to enhance user prompts to get better results from AI assistants.

Rules:
- Make the prompt clearer, more specific, and more actionable
- Add relevant context if missing
- Specify output format if helpful
- Keep the same intent — don't change what the user wants
- Keep it concise — don't make it unnecessarily long
- Return ONLY the enhanced prompt, nothing else. No explanation, no preamble.`,
        messages: [{ role: "user", content: `Enhance this prompt:\n\n${originalPrompt}` }]
      })
    });

    if (!response.ok) throw new Error("API error: " + response.status);
    const data = await response.json();
    return data.content?.[0]?.text?.trim() || originalPrompt;
  };

  // ── Shadow DOM UI ─────────────────────────────────────────────────────────
  const host = document.createElement("div");
  host.id = "contextbridge-enhancer-host";
  host.style.cssText = `
    position: fixed;
    bottom: 0; left: 0; right: 0;
    z-index: 99998;
    pointer-events: none;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  `;

  const shadow = host.attachShadow({ mode: "open" });
  document.body.appendChild(host);

  shadow.innerHTML = `
    <style>
      .enhancer-panel {
        position: absolute;
        bottom: 90px;
        left: 50%;
        transform: translateX(-50%) translateY(20px);
        width: min(760px, 92vw);
        background: rgba(16, 16, 20, 0.97);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 16px;
        box-shadow: 0 -4px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04);
        padding: 16px;
        opacity: 0;
        pointer-events: none;
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .enhancer-panel.visible {
        opacity: 1;
        pointer-events: auto;
        transform: translateX(-50%) translateY(0);
      }

      .panel-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12px;
      }

      .panel-title {
        font-size: 11px;
        font-weight: 700;
        color: #c8c8d4;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .panel-title-dot {
        width: 6px; height: 6px;
        border-radius: 50%;
        background: #c8c8d4;
        box-shadow: 0 0 6px #c8c8d4;
        animation: blink 1.5s infinite;
      }

      @keyframes blink {
        0%,100% { opacity: 1; }
        50%      { opacity: 0.3; }
      }

      .close-btn {
        background: transparent;
        border: none;
        color: #555568;
        cursor: pointer;
        font-size: 16px;
        line-height: 1;
        padding: 2px 6px;
        border-radius: 4px;
        transition: color 0.2s;
      }
      .close-btn:hover { color: #e8e8f0; }

      /* Side by side columns */
      .columns {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        margin-bottom: 12px;
      }

      .col {
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(255,255,255,0.07);
        border-radius: 10px;
        padding: 12px;
      }

      .col-label {
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        gap: 5px;
      }

      .col-label.original { color: #555568; }
      .col-label.enhanced { color: #c8c8d4; }

      .col-label-dot {
        width: 5px; height: 5px;
        border-radius: 50%;
      }
      .original .col-label-dot { background: #555568; }
      .enhanced .col-label-dot { background: #c8c8d4; }

      .col-text {
        font-size: 12px;
        color: #8888a0;
        line-height: 1.6;
        max-height: 100px;
        overflow-y: auto;
        scrollbar-width: thin;
        scrollbar-color: rgba(255,255,255,0.1) transparent;
      }

      .col.enhanced-col .col-text {
        color: #e8e8f0;
      }

      /* Loading skeleton */
      .skeleton {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .skeleton-line {
        height: 10px;
        border-radius: 4px;
        background: linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 100%);
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
      }
      .skeleton-line:nth-child(2) { width: 85%; }
      .skeleton-line:nth-child(3) { width: 70%; }
      @keyframes shimmer {
        0%   { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }

      /* Action buttons */
      .actions {
        display: flex;
        align-items: center;
        gap: 8px;
        justify-content: flex-end;
      }

      .btn-dismiss {
        padding: 7px 14px;
        background: transparent;
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 8px;
        color: #555568;
        font-size: 11px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }
      .btn-dismiss:hover { border-color: rgba(255,255,255,0.2); color: #8888a0; }

      .btn-use {
        padding: 7px 16px;
        background: linear-gradient(135deg, #38383e 0%, #252530 100%);
        border: 1px solid rgba(255,255,255,0.15);
        border-radius: 8px;
        color: #fff;
        font-size: 11px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        gap: 5px;
      }
      .btn-use:hover { transform: translateY(-1px); opacity: 0.9; }
      .btn-use:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

      .char-diff {
        font-size: 9px;
        font-family: monospace;
        color: #525260;
        margin-right: auto;
      }
      .char-diff.positive { color: #4ade80; }
    </style>

    <div class="enhancer-panel" id="enhancer-panel">
      <div class="panel-header">
        <div class="panel-title">
          <span class="panel-title-dot" id="status-dot"></span>
          <span id="panel-title-text">✨ Prompt Enhancer</span>
        </div>
        <button class="close-btn" id="enhancer-close">✕</button>
      </div>

      <div class="columns">
        <!-- Original -->
        <div class="col">
          <div class="col-label original">
            <span class="col-label-dot"></span>
            Original
          </div>
          <div class="col-text" id="original-text"></div>
        </div>

        <!-- Enhanced -->
        <div class="col enhanced-col">
          <div class="col-label enhanced">
            <span class="col-label-dot"></span>
            Enhanced
          </div>
          <div class="col-text" id="enhanced-text">
            <div class="skeleton">
              <div class="skeleton-line"></div>
              <div class="skeleton-line"></div>
              <div class="skeleton-line"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="actions">
        <span class="char-diff" id="char-diff"></span>
        <button class="btn-dismiss" id="btn-dismiss">Keep Original</button>
        <button class="btn-use" id="btn-use" disabled>
          <span>✨</span> Use Enhanced
        </button>
      </div>
    </div>
  `;

  // ── UI refs ───────────────────────────────────────────────────────────────
  const panel        = shadow.getElementById("enhancer-panel");
  const closeBtn     = shadow.getElementById("enhancer-close");
  const dismissBtn   = shadow.getElementById("btn-dismiss");
  const useBtn       = shadow.getElementById("btn-use");
  const originalText = shadow.getElementById("original-text");
  const enhancedText = shadow.getElementById("enhanced-text");
  const charDiff     = shadow.getElementById("char-diff");
  const titleText    = shadow.getElementById("panel-title-text");

  let debounceTimer = null;
  let currentEnhanced = "";
  let lastPrompt = "";
  let isVisible = false;

  const showPanel = () => {
    panel.classList.add("visible");
    host.style.pointerEvents = "auto";
    isVisible = true;
  };

  const hidePanel = () => {
    panel.classList.remove("visible");
    host.style.pointerEvents = "none";
    isVisible = false;
    currentEnhanced = "";
  };

  const showLoading = () => {
    titleText.textContent = "✨ Enhancing prompt...";
    enhancedText.innerHTML = `
      <div class="skeleton">
        <div class="skeleton-line"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-line"></div>
      </div>`;
    useBtn.disabled = true;
    charDiff.textContent = "";
  };

  const showEnhanced = (enhanced, original) => {
    titleText.textContent = "✨ Prompt Enhanced";
    enhancedText.textContent = enhanced;
    useBtn.disabled = false;

    const diff = enhanced.length - original.length;
    if (diff > 0) {
      charDiff.textContent = `+${diff} chars`;
      charDiff.className = "char-diff positive";
    } else {
      charDiff.textContent = `${diff} chars`;
      charDiff.className = "char-diff";
    }
  };

  const showError = (msg) => {
    titleText.textContent = "✨ Prompt Enhancer";
    enhancedText.textContent = msg || "Could not enhance. Check your connection.";
    enhancedText.style.color = "#ff5f5f";
    useBtn.disabled = true;
  };

  // ── Listeners ─────────────────────────────────────────────────────────────
  closeBtn.addEventListener("click", hidePanel);
  dismissBtn.addEventListener("click", hidePanel);

  useBtn.addEventListener("click", () => {
    if (!currentEnhanced) return;
    const textarea = findTextarea();
    if (textarea) {
      setTextareaValue(textarea, currentEnhanced);
      hidePanel();
    }
  });

  // ── Input watcher ─────────────────────────────────────────────────────────
  const handleInput = async (e) => {
    const textarea = e.target;
    const value = getTextareaValue(textarea).trim();

    // Only trigger for meaningful prompts (> 20 chars)
    if (value.length < 20) {
      if (isVisible) hidePanel();
      return;
    }

    // Debounce — wait 1.5s after user stops typing
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      // Don't re-enhance same prompt
      if (value === lastPrompt) return;
      lastPrompt = value;

      originalText.textContent = value;
      currentEnhanced = "";
      showLoading();
      showPanel();

      try {
        const enhanced = await enhancePrompt(value);
        currentEnhanced = enhanced;
        showEnhanced(enhanced, value);
      } catch (err) {
        console.error("ContextBridge Enhancer:", err);
        showError(err.message);
      }
    }, 1500);
  };

  // ── Observe textarea ──────────────────────────────────────────────────────
  // Watch for textarea appearing in DOM (some AIs render late)
  let attachedTo = null;

  const attachListener = () => {
    const textarea = findTextarea();
    if (textarea && textarea !== attachedTo) {
      if (attachedTo) attachedTo.removeEventListener("input", handleInput);
      textarea.addEventListener("input", handleInput);
      attachedTo = textarea;
    }
  };

  // Try immediately and keep watching
  attachListener();
  const domObserver = new MutationObserver(attachListener);
  domObserver.observe(document.body, { childList: true, subtree: true });

  // Also hide panel when user submits (presses Enter or clicks send)
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && isVisible) {
      hidePanel();
    }
  }, true);

})();