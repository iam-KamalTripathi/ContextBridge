import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Features', href: '/#features' },
      { name: 'How it Works', href: '/about#how-it-works' },
      { name: 'Pricing', href: '/#pricing' },
      { name: 'API', href: '/#api' }
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Careers', href: '/#careers' },
      { name: 'Blog', href: '/#blog' },
      { name: 'Press', href: '/#press' }
    ],
    support: [
      { name: 'Help Center', href: '/#help' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Privacy Policy', href: '/#privacy' },
      { name: 'Terms of Service', href: '/#terms' }
    ],
    resources: [
      { name: 'Career Guide', href: '/#guide' },
      { name: 'Assessment Tips', href: '/#tips' },
      { name: 'Industry Reports', href: '/#reports' },
      { name: 'Success Stories', href: '/#stories' }
    ]
  };

  const socialLinks = [
    { name: 'GitHub', icon: Github, href: 'https://github.com' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com' },
    { name: 'Email', icon: Mail, href: 'mailto:support@careercompass.ai' }
  ];

  return (
    <footer className="bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm border-t border-white/20 dark:border-dark-700/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-dark-800 dark:text-white">
                NextStep
              </span>
            </Link>
            <p className="text-dark-600 dark:text-dark-300 mb-6 max-w-md">
              Discover your ideal career path with AI-powered guidance based on psychological science. 
              Find careers that truly match your personality and interests.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/10 dark:bg-dark-700/50 rounded-lg hover:bg-white/20 dark:hover:bg-dark-600/50 transition-colors duration-200"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5 text-dark-600 dark:text-dark-300" />
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-lg font-semibold text-dark-800 dark:text-white mb-4">
              Product
            </h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-dark-600 dark:text-dark-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold text-dark-800 dark:text-white mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-dark-600 dark:text-dark-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-semibold text-dark-800 dark:text-white mb-4">
              Support
            </h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-dark-600 dark:text-dark-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-lg font-semibold text-dark-800 dark:text-white mb-4">
              Resources
            </h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-dark-600 dark:text-dark-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20 dark:border-dark-700/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-dark-600 dark:text-dark-300 text-sm">
              © {currentYear} NextStep. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                to="/#privacy"
                className="text-dark-600 dark:text-dark-300 hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                to="/#terms"
                className="text-dark-600 dark:text-dark-300 hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors duration-200"
              >
                Terms of Service
              </Link>
              <Link
                to="/#cookies"
                className="text-dark-600 dark:text-dark-300 hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors duration-200"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
