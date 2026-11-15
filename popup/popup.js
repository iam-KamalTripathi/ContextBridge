// ContextBridge Popup Controller

document.addEventListener("DOMContentLoaded", () => {
  let scrapedData = null;
  let customPreamble = "";
  let defaultTarget = "none";
  let activeMode = "full";

  const DEFAULT_PREAMBLE = `[System Instruction: You are continuing a conversation that began with another AI. Below is the structured transcript of that conversation. Please read the transcript carefully, absorb all context, details, and goals discussed, and then continue responding as the assistant. Acknowledge this context and wait for my next prompt, or proceed directly by answering the last turn.]`;

  // UI Elements
  const detectedPanel      = document.getElementById("detected-panel");
  const emptyPanel         = document.getElementById("empty-panel");
  const settingsPanel      = document.getElementById("settings-panel");
  const settingsToggleBtn  = document.getElementById("settings-toggle-btn");
  const settingsCloseBtn   = document.getElementById("settings-close-btn");
  const platformBadge      = document.getElementById("platform-badge");
  const detectedPlatformText = document.getElementById("detected-platform-text");
  const chatTitle          = document.getElementById("chat-title");
  const messageCountBadge  = document.getElementById("message-count-badge");
  const charCountBadge     = document.getElementById("char-count-badge");
  const segmentButtons     = document.querySelectorAll(".segment-btn");
  const aiStatusBox        = document.getElementById("ai-status-box");
  const aiStatusText       = document.getElementById("ai-status-text");
  const outlineTrigger     = document.getElementById("outline-trigger");
  const accordionOutline   = outlineTrigger.closest(".accordion");
  const turnsContainer     = document.getElementById("turns-container");
  const turnSearch         = document.getElementById("turn-search");
  const selectAllTurns     = document.getElementById("select-all-turns");
  const manualTrigger      = document.getElementById("manual-trigger");
  const manualContent      = document.getElementById("manual-content");
  const manualInput        = document.getElementById("manual-input");
  const copyManualBtn      = document.getElementById("copy-manual-btn");
  const preambleInput      = document.getElementById("preamble-input");
  const defaultTargetSelect = document.getElementById("default-target");
  const saveSettingsBtn    = document.getElementById("save-settings-btn");
  const resetSettingsBtn   = document.getElementById("reset-settings-btn");
  const autoSendToggle     = document.getElementById("auto-send-toggle");
  const autoCompressToggle = document.getElementById("auto-compress-toggle");
  const compressionModeSelect = document.getElementById("compression-mode");
  const exportStateBtn     = document.getElementById("export-state-btn");
  const oneClickResumeBtn  = document.getElementById("one-click-resume-btn");
  const copyPromptBtn      = document.getElementById("copy-prompt-btn");
  const targetButtons      = document.querySelectorAll(".target-btn");
  const toast              = document.getElementById("toast");
  const limitWarning       = document.getElementById("limit-warning");

  // API Key elements
  const apiKeyInput        = document.getElementById("api-key-input");
  const apiKeyToggle       = document.getElementById("api-key-toggle");
  const apiKeyStatus       = document.getElementById("api-key-status");

  // ── Load Settings ─────────────────────────────────────────────────────────
  const loadSettings = () => {
    chrome.storage.local.get([
      "preamble", "defaultTarget", "autoSendEnabled",
      "autoCompressEnabled", "compressionMode", "anthropicApiKey"
    ], (result) => {
      customPreamble = result.preamble || DEFAULT_PREAMBLE;
      defaultTarget  = result.defaultTarget || "none";

      preambleInput.value         = customPreamble;
      defaultTargetSelect.value   = defaultTarget;
      autoSendToggle.checked      = result.autoSendEnabled === true;
      autoCompressToggle.checked  = result.autoCompressEnabled !== false;
      compressionModeSelect.value = result.compressionMode || "compact";

      // API key — show masked if exists
      if (result.anthropicApiKey) {
        apiKeyInput.value = result.anthropicApiKey;
        apiKeyStatus.textContent = "✅ API key saved";
        apiKeyStatus.style.color = "#4ade80";
      }
    });
  };

  loadSettings();

  // ── API Key toggle show/hide ───────────────────────────────────────────────
  apiKeyToggle.addEventListener("click", () => {
    if (apiKeyInput.type === "password") {
      apiKeyInput.type = "text";
      apiKeyToggle.textContent = "🙈";
    } else {
      apiKeyInput.type = "password";
      apiKeyToggle.textContent = "👁";
    }
  });

  // ── Settings handlers ─────────────────────────────────────────────────────
  settingsToggleBtn.addEventListener("click", () => settingsPanel.classList.remove("hidden"));
  settingsCloseBtn.addEventListener("click",  () => settingsPanel.classList.add("hidden"));

  saveSettingsBtn.addEventListener("click", () => {
    const preambleVal     = preambleInput.value.trim() || DEFAULT_PREAMBLE;
    const defaultTargetVal = defaultTargetSelect.value;
    const apiKeyVal       = apiKeyInput.value.trim();

    // Validate API key format
    if (apiKeyVal && !apiKeyVal.startsWith("sk-ant-")) {
      apiKeyStatus.textContent = "⚠️ Key should start with sk-ant-";
      apiKeyStatus.style.color = "#f59e0b";
      return;
    }

    chrome.storage.local.set({
      preamble:           preambleVal,
      defaultTarget:      defaultTargetVal,
      autoSendEnabled:    autoSendToggle.checked,
      autoCompressEnabled: autoCompressToggle.checked,
      compressionMode:    compressionModeSelect.value,
      anthropicApiKey:    apiKeyVal
    }, () => {
      customPreamble = preambleVal;
      defaultTarget  = defaultTargetVal;

      if (apiKeyVal) {
        apiKeyStatus.textContent = "✅ API key saved";
        apiKeyStatus.style.color = "#4ade80";
      }

      showToast("✅ Settings saved!");
      settingsPanel.classList.add("hidden");
    });
  });

  resetSettingsBtn.addEventListener("click", () => {
    if (confirm("Reset all settings to defaults?")) {
      preambleInput.value         = DEFAULT_PREAMBLE;
      defaultTargetSelect.value   = "none";
      autoSendToggle.checked      = false;
      autoCompressToggle.checked  = true;
      compressionModeSelect.value = "compact";
      apiKeyInput.value           = "";
      apiKeyStatus.textContent    = "";

      chrome.storage.local.set({
        preamble: DEFAULT_PREAMBLE, defaultTarget: "none",
        autoSendEnabled: false, autoCompressEnabled: true,
        compressionMode: "compact", anthropicApiKey: ""
      }, () => {
        customPreamble = DEFAULT_PREAMBLE;
        defaultTarget  = "none";
        showToast("✅ Settings reset to defaults");
      });
    }
  });

  // ── Accordion ────────────────────────────────────────────────────────────
  outlineTrigger.addEventListener("click", () => accordionOutline.classList.toggle("expanded"));
  manualTrigger.addEventListener("click", () => {
    const isHidden = manualContent.classList.contains("hidden");
    manualContent.classList.toggle("hidden", !isHidden);
    manualTrigger.querySelector(".arrow").textContent = isHidden ? "▲" : "▼";
  });

  // ── Toast ─────────────────────────────────────────────────────────────────
  const showToast = (message) => {
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2500);
  };

  // ── Mode segment ─────────────────────────────────────────────────────────
  segmentButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      segmentButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeMode = btn.dataset.mode;
      if (activeMode === "ai") { aiStatusBox.classList.remove("hidden"); checkChromeAI(); }
      else aiStatusBox.classList.add("hidden");
      updateCounts();
    });
  });

  const checkChromeAI = async () => {
    if (window.ai && window.ai.assistant) updateAIStatus("⚡ Local AI (Gemini Nano) detected!", false);
    else updateAIStatus("⚠️ Local AI not active. Falling back to Smart Compactor.", true);
  };

  const updateAIStatus = (text, isWarning) => {
    aiStatusText.textContent = text;
    aiStatusBox.classList.toggle("warning", isWarning);
  };

  // ── Scrape ───────────────────────────────────────────────────────────────
  const initScrape = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs.length) return;
      const tab = tabs[0];
      const url = tab.url || "";
      const isSupported = ["chatgpt.com", "chat.openai.com", "claude.ai",
        "gemini.google.com", "copilot.microsoft.com", "copilot.com", "grok.com"]
        .some(d => url.includes(d));

      if (!isSupported) return showEmptyUI();

      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content/scraper.js"]
      }, (results) => {
        if (results?.[0]?.result) {
          scrapedData = results[0].result;
          if (scrapedData.messages?.length > 0) {
            renderScrapedUI();
            // Show limit warning if detected
            if (scrapedData.limitDetected) {
              limitWarning.classList.remove("hidden");
            }
          } else {
            showEmptyUI();
          }
        } else {
          showEmptyUI();
        }
      });
    });
  };

  const showEmptyUI = () => {
    detectedPanel.classList.add("hidden");
    emptyPanel.classList.remove("hidden");
  };

  const renderScrapedUI = () => {
    emptyPanel.classList.add("hidden");
    detectedPanel.classList.remove("hidden");
    platformBadge.className = `status-badge ${scrapedData.platform}`;
    detectedPlatformText.textContent = `Active: ${scrapedData.platform}`;
    chatTitle.textContent = scrapedData.title;
    renderTurnsList();
  };

  const renderTurnsList = () => {
    turnsContainer.innerHTML = "";
    let turnNum = 1;
    scrapedData.messages.forEach((msg, idx) => {
      if (msg.role !== "user") return;
      const itemDiv = document.createElement("div");
      itemDiv.className = "turn-item";
      itemDiv.dataset.index = idx;
      itemDiv.dataset.text = msg.text.toLowerCase();

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = true;
      checkbox.className = "turn-checkbox";
      checkbox.id = `turn-cb-${idx}`;
      checkbox.dataset.index = idx;
      checkbox.addEventListener("change", updateCounts);
      itemDiv.appendChild(checkbox);

      const textSpan = document.createElement("span");
      textSpan.className = "turn-text";
      textSpan.textContent = `${turnNum}. ${msg.text}`;
      textSpan.addEventListener("click", () => { checkbox.checked = !checkbox.checked; updateCounts(); });
      itemDiv.appendChild(textSpan);

      const metaSpan = document.createElement("span");
      metaSpan.className = "turn-meta";
      let totalLen = msg.text.length;
      if (scrapedData.messages[idx + 1]?.role === "assistant") totalLen += scrapedData.messages[idx + 1].text.length;
      metaSpan.textContent = `${totalLen} chars`;
      itemDiv.appendChild(metaSpan);

      turnsContainer.appendChild(itemDiv);
      turnNum++;
    });
    updateCounts();
  };

  const updateCounts = () => {
    if (!scrapedData) return;
    const checkboxes = document.querySelectorAll(".turn-checkbox");
    let selectedTurnsCount = 0;
    let selectedMessages = [];

    checkboxes.forEach((cb) => {
      if (!cb.checked) return;
      selectedTurnsCount++;
      const idx = parseInt(cb.dataset.index);
      selectedMessages.push(scrapedData.messages[idx]);
      if (scrapedData.messages[idx + 1]?.role === "assistant") selectedMessages.push(scrapedData.messages[idx + 1]);
    });

    let displayChars = 0;
    if (activeMode === "full") displayChars = selectedMessages.reduce((a, m) => a + m.text.length, 0);
    else displayChars = getCompactPrompt(selectedMessages).reduce((a, m) => a + m.text.length, 0);

    messageCountBadge.textContent = `${selectedTurnsCount} turns selected`;
    charCountBadge.textContent = `~${displayChars.toLocaleString()} chars`;

    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    const someChecked = Array.from(checkboxes).some(cb => cb.checked);
    selectAllTurns.checked = allChecked;
    selectAllTurns.indeterminate = someChecked && !allChecked;
  };

  const getCompactPrompt = (messages) => {
    if (!messages.length) return [];
    let compactMsg = [messages[0]];
    const codeRegex = /```[\s\S]*?```/g;
    const codes = [];
    for (let i = 1; i < messages.length - 3; i++) {
      const matches = messages[i].text.match(codeRegex);
      if (matches) matches.forEach(c => codes.push(c));
    }
    if (codes.length) compactMsg.push({ role: "user", text: `[System State Info: Code snippets from intermediate turns:\n\n${codes.join("\n\n")}]` });
    const lastIdx = Math.max(1, messages.length - 3);
    for (let i = lastIdx; i < messages.length; i++) compactMsg.push(messages[i]);
    return compactMsg;
  };

  selectAllTurns.addEventListener("change", (e) => {
    document.querySelectorAll(".turn-item:not([style*='display: none']) .turn-checkbox")
      .forEach(cb => cb.checked = e.target.checked);
    updateCounts();
  });

  turnSearch.addEventListener("input", (e) => {
    const q = e.target.value.toLowerCase();
    document.querySelectorAll(".turn-item").forEach(item => {
      item.classList.toggle("hidden", !item.dataset.text.includes(q));
    });
  });

  // ── Build continuation prompt ─────────────────────────────────────────────
  const buildContinuationPrompt = async () => {
    if (!scrapedData) return "";
    const checkboxes = document.querySelectorAll(".turn-checkbox");
    const selectedMessages = [];

    checkboxes.forEach((cb) => {
      if (!cb.checked) return;
      const idx = parseInt(cb.dataset.index);
      selectedMessages.push({ role: "user", text: scrapedData.messages[idx].text });
      if (scrapedData.messages[idx + 1]?.role === "assistant")
        selectedMessages.push({ role: "assistant", text: scrapedData.messages[idx + 1].text });
    });

    if (!selectedMessages.length) { alert("Please select at least one turn."); return ""; }

    let transcript = "";

    if (activeMode === "full") {
      selectedMessages.forEach(m => { transcript += `${m.role === "user" ? "User" : "Assistant"}: ${m.text}\n---\n`; });
    } else if (activeMode === "compact" || (activeMode === "ai" && !window.ai?.assistant)) {
      getCompactPrompt(selectedMessages).forEach(m => { transcript += `${m.role === "user" ? "User" : "Assistant"}: ${m.text}\n---\n`; });
    } else if (activeMode === "ai" && window.ai?.assistant) {
      try {
        updateAIStatus("⚡ Summarizing with Gemini Nano...", false);
        const raw = selectedMessages.map(m => `${m.role}: ${m.text}`).join("\n");
        const session = await window.ai.assistant.create();
        const summary = await session.prompt(`Summarize this conversation for another AI to resume:\n\n${raw}`);
        session.destroy();
        updateAIStatus("✨ Summarized!", false);
        return `${customPreamble}\n\n=== CONVERSATION SUMMARY START ===\n${summary.trim()}\n=== CONVERSATION SUMMARY END ===\n\nPlease resume based on this summary.`;
      } catch (err) {
        updateAIStatus("⚠️ AI error. Falling back to Compact.", true);
        getCompactPrompt(selectedMessages).forEach(m => { transcript += `${m.role === "user" ? "User" : "Assistant"}: ${m.text}\n---\n`; });
      }
    }

    return `${customPreamble}\n\n=== CONVERSATION TRANSCRIPT START ===\n${transcript.trim()}\n=== CONVERSATION TRANSCRIPT END ===\n\nPlease review the transcript above and await my instructions, or proceed by continuing from the last turn.`;
  };

  // ── Copy button ───────────────────────────────────────────────────────────
  copyPromptBtn.addEventListener("click", async () => {
    const promptText = await buildContinuationPrompt();
    if (!promptText) return;
    navigator.clipboard.writeText(promptText).then(() => {
      showToast("Continuation prompt copied!");
      copyPromptBtn.style.transform = "scale(0.97)";
      setTimeout(() => copyPromptBtn.style.transform = "", 200);
      if (defaultTarget !== "none") {
        const urls = { chatgpt: "https://chatgpt.com", claude: "https://claude.ai", gemini: "https://gemini.google.com", copilot: "https://copilot.microsoft.com", grok: "https://grok.com" };
        chrome.storage.local.set({ pendingContext: promptText, pendingTarget: defaultTarget, autoSendOnInject: autoSendToggle.checked }, () => {
          setTimeout(() => chrome.tabs.create({ url: urls[defaultTarget] }), 600);
        });
      }
    }).catch(() => showToast("Failed to copy."));
  });

  // ── One-Click Resume ──────────────────────────────────────────────────────
  oneClickResumeBtn.addEventListener("click", async () => {
    if (defaultTarget === "none") { alert("Set a default target in Settings first!"); return; }
    const promptText = await buildContinuationPrompt();
    if (!promptText) return;
    const urls = { chatgpt: "https://chatgpt.com", claude: "https://claude.ai", gemini: "https://gemini.google.com", copilot: "https://copilot.microsoft.com", grok: "https://grok.com" };
    chrome.storage.local.set({ pendingContext: promptText, pendingTarget: defaultTarget, autoSendOnInject: autoSendToggle.checked }, () => {
      showToast("🚀 One-click resume initiated!");
      chrome.tabs.create({ url: urls[defaultTarget] });
    });
  });

  // ── Export State ──────────────────────────────────────────────────────────
  exportStateBtn.addEventListener("click", async () => {
    if (!scrapedData) { alert("No conversation to export!"); return; }
    const checkboxes = document.querySelectorAll(".turn-checkbox");
    const selectedMessages = [];
    checkboxes.forEach((cb) => {
      if (!cb.checked) return;
      const idx = parseInt(cb.dataset.index);
      selectedMessages.push({ role: "user", text: scrapedData.messages[idx].text });
      if (scrapedData.messages[idx + 1]?.role === "assistant") selectedMessages.push({ role: "assistant", text: scrapedData.messages[idx + 1].text });
    });
    const stateFile = { version: "1.0", format: "ContextBridge State File", exportedAt: new Date().toISOString(), platform: scrapedData.platform, title: scrapedData.title, statistics: { totalTurns: selectedMessages.length, totalCharacters: selectedMessages.reduce((s, m) => s + m.text.length, 0) }, transcript: selectedMessages };
    const blob = new Blob([JSON.stringify(stateFile, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `contextbridge-${scrapedData.platform}-${Date.now()}.json`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    showToast("💾 Exported!");
  });

  // ── Target buttons ────────────────────────────────────────────────────────
  targetButtons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const targetUrl  = btn.dataset.url;
      const targetName = Array.from(btn.classList).find(c => ["chatgpt","claude","gemini","copilot","grok"].includes(c)) || "chatgpt";
      const promptText = await buildContinuationPrompt();
      if (promptText) {
        chrome.storage.local.set({ pendingContext: promptText, pendingTarget: targetName, autoSendOnInject: autoSendToggle.checked }, () => {
          showToast("🌉 Context bridged! Opening tab...");
          setTimeout(() => chrome.tabs.create({ url: targetUrl }), 800);
        });
      } else {
        chrome.tabs.create({ url: targetUrl });
      }
    });
  });

  // ── Manual copy ───────────────────────────────────────────────────────────
  copyManualBtn.addEventListener("click", () => {
    const val = manualInput.value.trim();
    if (!val) { alert("Paste some text first."); return; }
    const wrapped = `${customPreamble}\n\n=== MANUAL CONTEXT START ===\n${val}\n=== MANUAL CONTEXT END ===\n\nPlease review this context and await my instructions.`;
    navigator.clipboard.writeText(wrapped).then(() => { showToast("Manual context copied!"); manualInput.value = ""; });
  });

  initScrape();
});