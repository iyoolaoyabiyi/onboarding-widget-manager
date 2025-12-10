"use client"

import { useState } from "react";
import { motion } from "framer-motion";
import { FiCopy, FiCheck, FiChevronRight, FiCode, FiSettings, FiHelpCircle, FiFileText, FiPlay } from "react-icons/fi";

export default function Documentation() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const codeExamples = {
    installation: `<script src="https://onboarding-tour-app.web.app/ota-widget.js" data-tour-id="tour_1765353019027"></script>`,
    initialization: `<script>
  Tour.init({
    steps: [
      { id: "step-1", target: "#hero", content: "Welcome!" },
      { id: "step-2", target: "#features", content: "Check this out." },
      { id: "step-3", target: "#cta", content: "Get started here!" }
    ]
  });
</script>`,
    fullConfig: `Tour.init({
  autoStart: false,
  theme: "dark",
  steps: [
    { 
      id: "welcome",
      target: "#header",
      title: "Welcome",
      content: "Welcome to our platform!",
      position: "bottom"
    },
    { 
      id: "dashboard",
      target: ".dashboard",
      title: "Dashboard",
      content: "Your main workspace",
      position: "right"
    }
  ],
  onComplete: () => {
    console.log("Tour completed!");
  }
});`
  };

  const features = [
    {
      icon: <FiCode className="w-5 h-5" />,
      title: "Simple Integration",
      description: "Add with just one script tag, no dependencies required."
    },
    {
      icon: <FiSettings className="w-5 h-5" />,
      title: "Customizable",
      description: "Full control over styling, positioning, and behavior."
    },
    {
      icon: <FiPlay className="w-5 h-5" />,
      title: "Interactive",
      description: "Engage users with interactive tooltips and highlights."
    },
    {
      icon: <FiHelpCircle className="w-5 h-5" />,
      title: "Accessible",
      description: "Full keyboard navigation and screen reader support."
    }
  ];

  const stepsDetails = [
    { property: "id", type: "string", required: true, description: "Unique identifier for the step" },
    { property: "target", type: "string", required: true, description: "CSS selector for the element to highlight" },
    { property: "title", type: "string", required: false, description: "Optional title for the step" },
    { property: "content", type: "string", required: true, description: "Content to display in the tooltip" },
    { property: "position", type: "string", required: false, description: "Tooltip position (top, right, bottom, left)" },
    { property: "action", type: "function", required: false, description: "Callback function to execute before step" }
  ];

  return (
    <div className="min-h-screen text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 shrink-0">
            <div className="sticky top-24 space-y-8">
              <nav className="space-y-1">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Getting Started</h3>
                <a href="#introduction" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg transition-colors group">
                  <FiChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Introduction
                </a>
                <a href="#installation" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg transition-colors group">
                  <FiChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Installation
                </a>
                <a href="#quick-start" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg transition-colors group">
                  <FiChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Quick Start
                </a>
              </nav>

              <nav className="space-y-1">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">API Reference</h3>
                <a href="#configuration" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg transition-colors group">
                  <FiChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Configuration
                </a>
                <a href="#step-properties" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg transition-colors group">
                  <FiChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Step Properties
                </a>
              </nav>

              <nav className="space-y-1">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Guides</h3>
                <a href="#examples" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg transition-colors group">
                  <FiChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Examples
                </a>
                <a href="#faq" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg transition-colors group">
                  <FiChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  FAQ
                </a>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <motion.section
              id="introduction"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              <div className="mb-8">
                <h1 className="text-4xl font-bold mb-4 bg-linear-to-r from-gray-100 via-blue-100 to-gray-100 bg-clip-text text-transparent">
                  Tour Documentation
                </h1>
                <p className="text-lg text-gray-400">
                  A lightweight, customizable onboarding tour library for modern web applications.
                  Engage users with interactive walkthroughs that guide them through your application's features.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 rounded-xl border border-gray-800 bg-gray-900/50 hover:bg-gray-900 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-linear-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center mb-4">
                      <div className="text-blue-400">{feature.icon}</div>
                    </div>
                    <h3 className="font-semibold mb-2 text-gray-200">{feature.title}</h3>
                    <p className="text-sm text-gray-400">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            <motion.section
              id="installation"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-200">
                <div className="w-1 h-6 bg-linear-to-b from-blue-500 to-blue-600 rounded-full"></div>
                Installation
              </h2>
              
              <div className="mb-6">
                <p className="text-gray-400 mb-4">
                  Add the following script tag to your HTML file's <code className="px-2 py-1 bg-gray-800 text-blue-300 rounded text-sm">&lt;head&gt;</code> section:
                </p>
                
                <div className="relative group">
                  <div className="absolute right-3 top-3">
                    <button
                      onClick={() => copyToClipboard(codeExamples.installation, 'installation')}
                      className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                      aria-label="Copy code"
                    >
                      {copied === 'installation' ? (
                        <FiCheck className="w-4 h-4 text-green-400" />
                      ) : (
                        <FiCopy className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <pre className="bg-gray-900 border border-gray-800 text-gray-300 p-4 rounded-lg text-sm overflow-x-auto">
                    <code>{codeExamples.installation}</code>
                  </pre>
                </div>
              </div>
            </motion.section>

            <motion.section
              id="quick-start"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-200">
                <div className="w-1 h-6 bg-linear-to-b from-blue-500 to-blue-600 rounded-full"></div>
                Quick Start
              </h2>
              
              <p className="text-gray-400 mb-4">
                Initialize the tour after the DOM has loaded:
              </p>
              
              <div className="relative group mb-6">
                <div className="absolute right-3 top-3">
                  <button
                    onClick={() => copyToClipboard(codeExamples.initialization, 'initialization')}
                    className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                    aria-label="Copy code"
                  >
                    {copied === 'initialization' ? (
                      <FiCheck className="w-4 h-4 text-green-400" />
                    ) : (
                      <FiCopy className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
                <pre className="bg-gray-900 border border-gray-800 text-gray-300 p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{codeExamples.initialization}</code>
                </pre>
              </div>
            </motion.section>

            <motion.section
              id="configuration"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-200">
                <div className="w-1 h-6 bg-linear-to-b from-blue-500 to-blue-600 rounded-full"></div>
                Configuration
              </h2>
              
              <p className="text-gray-400 mb-6">
                Here's a complete configuration example with all available options:
              </p>
              
              <div className="relative group mb-8">
                <div className="absolute right-3 top-3">
                  <button
                    onClick={() => copyToClipboard(codeExamples.fullConfig, 'fullConfig')}
                    className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                    aria-label="Copy code"
                  >
                    {copied === 'fullConfig' ? (
                      <FiCheck className="w-4 h-4 text-green-400" />
                    ) : (
                      <FiCopy className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
                <pre className="bg-gray-900 border border-gray-800 text-gray-300 p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{codeExamples.fullConfig}</code>
                </pre>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-200">Configuration Options</h3>
                <div className="border border-gray-800 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-800 bg-gray-900">
                        <th className="py-3 px-4 text-left font-medium text-gray-300">Option</th>
                        <th className="py-3 px-4 text-left font-medium text-gray-300">Type</th>
                        <th className="py-3 px-4 text-left font-medium text-gray-300">Default</th>
                        <th className="py-3 px-4 text-left font-medium text-gray-300">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-800 hover:bg-gray-900/50">
                        <td className="py-3 px-4 font-medium text-blue-400">autoStart</td>
                        <td className="py-3 px-4 text-gray-400">boolean</td>
                        <td className="py-3 px-4 text-gray-400">false</td>
                        <td className="py-3 px-4 text-gray-400">Start tour automatically on page load</td>
                      </tr>
                      <tr className="border-b border-gray-800 hover:bg-gray-900/50">
                        <td className="py-3 px-4 font-medium text-blue-400">theme</td>
                        <td className="py-3 px-4 text-gray-400">"light" | "dark"</td>
                        <td className="py-3 px-4 text-gray-400">"light"</td>
                        <td className="py-3 px-4 text-gray-400">Visual theme for the tour</td>
                      </tr>
                      <tr className="border-b border-gray-800 hover:bg-gray-900/50">
                        <td className="py-3 px-4 font-medium text-blue-400">steps</td>
                        <td className="py-3 px-4 text-gray-400">Step[]</td>
                        <td className="py-3 px-4 text-gray-400">[]</td>
                        <td className="py-3 px-4 text-gray-400">Array of tour steps</td>
                      </tr>
                      <tr className="border-b border-gray-800 hover:bg-gray-900/50">
                        <td className="py-3 px-4 font-medium text-blue-400">onComplete</td>
                        <td className="py-3 px-4 text-gray-400">function</td>
                        <td className="py-3 px-4 text-gray-400">undefined</td>
                        <td className="py-3 px-4 text-gray-400">Callback when tour completes</td>
                      </tr>
                      <tr className="hover:bg-gray-900/50">
                        <td className="py-3 px-4 font-medium text-blue-400">onSkip</td>
                        <td className="py-3 px-4 text-gray-400">function</td>
                        <td className="py-3 px-4 text-gray-400">undefined</td>
                        <td className="py-3 px-4 text-gray-400">Callback when tour is skipped</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div id="step-properties">
                <h3 className="text-lg font-semibold mb-4 text-gray-200">Step Properties</h3>
                <div className="border border-gray-800 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-800 bg-gray-900">
                        <th className="py-3 px-4 text-left font-medium text-gray-300">Property</th>
                        <th className="py-3 px-4 text-left font-medium text-gray-300">Type</th>
                        <th className="py-3 px-4 text-left font-medium text-gray-300">Required</th>
                        <th className="py-3 px-4 text-left font-medium text-gray-300">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stepsDetails.map((step, index) => (
                        <tr key={index} className="border-b border-gray-800 hover:bg-gray-900/50 last:border-b-0">
                          <td className="py-3 px-4 font-medium text-blue-400">{step.property}</td>
                          <td className="py-3 px-4 text-gray-400">{step.type}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded text-xs ${step.required ? 'bg-red-500/20 text-red-400' : 'bg-gray-800 text-gray-400'}`}>
                              {step.required ? 'Required' : 'Optional'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-400">{step.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.section>

            <motion.section
              id="faq"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-200">
                <div className="w-1 h-6 bg-linear-to-b from-blue-500 to-blue-600 rounded-full"></div>
                Frequently Asked Questions
              </h2>
              
              <div className="space-y-6">
                {[
                  {
                    q: "Is the tour framework agnostic?",
                    a: "Yes, Tour works with any JavaScript framework or vanilla JS. It operates purely on the DOM level."
                  },
                  {
                    q: "Can I customize the styling?",
                    a: "Absolutely. The tour provides CSS classes for all elements and supports custom themes via CSS variables."
                  },
                  {
                    q: "Is it accessible?",
                    a: "Yes, Tour follows WAI-ARIA guidelines, supports keyboard navigation, and is fully screen reader compatible."
                  },
                  {
                    q: "What browsers are supported?",
                    a: "All modern browsers including Chrome, Firefox, Safari, and Edge. IE11 requires polyfills."
                  },
                  {
                    q: "Can I dynamically update steps?",
                    a: "Yes, you can update the steps array dynamically and call Tour.refresh() to update the tour."
                  }
                ].map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors"
                  >
                    <h3 className="font-semibold mb-2 text-gray-200">{faq.q}</h3>
                    <p className="text-gray-400">{faq.a}</p>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          </main>
        </div>
      </div>
    </div>
  );
}