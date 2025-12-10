"use client"

import { useState } from "react";
import { motion } from "framer-motion";
import { FiCopy, FiCheck, FiChevronRight, FiCode, FiSettings, FiHelpCircle, FiFileText, FiPlay, FiExternalLink, FiGlobe, FiUsers, FiBarChart, FiPackage, FiTerminal } from "react-icons/fi";

export default function Documentation() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const codeExamples = {
    installation: `<script src="https://cdn.yoursite.com/tour.js"></script>`,
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
});`,
    embedCode: `<script 
  src="https://onboarding-widget-app.vercel.app/ota-widget.js" 
  data-tour-id="YOUR_TOUR_ID"
></script>`,
    nextjsIntegration: `// app/layout.tsx
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Script
          src="https://onboarding-widget-app.vercel.app/ota-widget.js"
          strategy="lazyOnInteractive"
          data-tour-id="YOUR_TOUR_ID"
        />
      </body>
    </html>
  );
}`,
    manualInitialization: `window.OnboardingTour.init({
  id: 'my-tour',
  name: 'Welcome Tour',
  theme: 'blue',
  steps: [
    {
      id: 'step_1',
      order: 1,
      target_element: '#my-button',
      title: 'Get Started',
      content: 'Click here to begin',
      position: 'bottom'
    }
    // ... add at least 5 steps
  ]
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

  const quickStartSteps = [
    {
      number: "1",
      title: "Create a Tour",
      description: "Sign up and log into the dashboard to create a new tour with at least 5 steps."
    },
    {
      number: "2",
      title: "Define Steps",
      description: "Specify target elements using CSS selectors and customize content for each step."
    },
    {
      number: "3",
      title: "Customize Theme",
      description: "Choose from 4 theme colors (blue, green, red, greyscale) and configure positioning."
    },
    {
      number: "4",
      title: "Copy Embed Code",
      description: "Copy the generated embed code snippet from your dashboard."
    },
    {
      number: "5",
      title: "Add to Your Site",
      description: "Paste the script tag into your website's HTML or integrate using Next.js Script component."
    }
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
                <a href="#quick-start-guide" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg transition-colors group">
                  <FiChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Quick Start Guide
                </a>
                <a href="#live-app" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg transition-colors group">
                  <FiChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Live App
                </a>
              </nav>

              <nav className="space-y-1">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Integration</h3>
                <a href="#embedding-widget" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg transition-colors group">
                  <FiChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Embedding Widget
                </a>
                <a href="#nextjs-integration" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg transition-colors group">
                  <FiChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Next.js Integration
                </a>
                <a href="#manual-initialization" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg transition-colors group">
                  <FiChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Manual Initialization
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
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Development</h3>
                <a href="#project-structure" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg transition-colors group">
                  <FiChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Project Structure
                </a>
                <a href="#building-production" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg transition-colors group">
                  <FiChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Building for Production
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
                  Onboarding Widget Manager Documentation
                </h1>
                <p className="text-lg text-gray-400">
                  Create and manage guided onboarding tours for your website with an intuitive dashboard and lightweight embeddable widget.
                </p>
              </div>

              <motion.div
                id="live-app"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <div className="p-6 rounded-xl border border-gray-800 bg-linear-to-br from-gray-900/50 to-gray-800/50">
                  <div className="flex items-center gap-3 mb-4">
                    <FiExternalLink className="w-6 h-6 text-blue-400" />
                    <h3 className="text-xl font-semibold text-gray-200">Live Application</h3>
                  </div>
                  <p className="text-gray-400 mb-4">
                    Access our live dashboard and widget at:
                  </p>
                  <div className="p-4 bg-gray-900 rounded-lg border border-gray-800">
                    <code className="text-blue-300 text-lg">https://onboarding-widget-app.vercel.app/</code>
                    <p className="text-sm text-gray-400 mt-2">
                      Dashboard • Widget Script • Documentation
                    </p>
                  </div>
                </div>
              </motion.div>

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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-6 rounded-xl border border-gray-800 bg-gray-900/50">
                  <div className="flex items-center gap-3 mb-3">
                    <FiGlobe className="w-5 h-5 text-green-400" />
                    <h4 className="font-semibold text-gray-200">Dashboard</h4>
                  </div>
                  <p className="text-sm text-gray-400">
                    User authentication, tour management, analytics, and embed code generation.
                  </p>
                </div>
                <div className="p-6 rounded-xl border border-gray-800 bg-gray-900/50">
                  <div className="flex items-center gap-3 mb-3">
                    <FiPackage className="w-5 h-5 text-purple-400" />
                    <h4 className="font-semibold text-gray-200">Embeddable Widget</h4>
                  </div>
                  <p className="text-sm text-gray-400">
                    Lightweight (11KB gzipped), multi-step tours, customizable themes, analytics tracking.
                  </p>
                </div>
                <div className="p-6 rounded-xl border border-gray-800 bg-gray-900/50">
                  <div className="flex items-center gap-3 mb-3">
                    <FiBarChart className="w-5 h-5 text-yellow-400" />
                    <h4 className="font-semibold text-gray-200">Analytics</h4>
                  </div>
                  <p className="text-sm text-gray-400">
                    Real-time tracking, completion rates, skip metrics, and performance insights.
                  </p>
                </div>
              </div>
            </motion.section>

            <motion.section
              id="quick-start-guide"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-200">
                <div className="w-1 h-6 bg-linear-to-b from-blue-500 to-blue-600 rounded-full"></div>
                Quick Start Guide
              </h2>
              
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-200">For Tour Creators</h3>
                <div className="space-y-4">
                  {quickStartSteps.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-4 p-4 rounded-lg border border-gray-800 bg-gray-900/30"
                    >
                      <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center shrink-0">
                        <span className="font-semibold text-blue-400">{step.number}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-200 mb-1">{step.title}</h4>
                        <p className="text-gray-400 text-sm">{step.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-200">For End Users</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border border-gray-800 bg-gray-900/30">
                    <h4 className="font-semibold text-gray-200 mb-2">1. Visit Website</h4>
                    <p className="text-gray-400 text-sm">Users visit a website with the embedded tour script.</p>
                  </div>
                  <div className="p-4 rounded-lg border border-gray-800 bg-gray-900/30">
                    <h4 className="font-semibold text-gray-200 mb-2">2. Guided Tour</h4>
                    <p className="text-gray-400 text-sm">See a guided tour highlighting key interface elements.</p>
                  </div>
                  <div className="p-4 rounded-lg border border-gray-800 bg-gray-900/30">
                    <h4 className="font-semibold text-gray-200 mb-2">3. Navigate Steps</h4>
                    <p className="text-gray-400 text-sm">Use Next/Back buttons to navigate through steps.</p>
                  </div>
                  <div className="p-4 rounded-lg border border-gray-800 bg-gray-900/30">
                    <h4 className="font-semibold text-gray-200 mb-2">4. Skip or Complete</h4>
                    <p className="text-gray-400 text-sm">Skip the tour anytime or complete it.</p>
                  </div>
                </div>
              </div>
            </motion.section>

            <motion.section
              id="embedding-widget"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-200">
                <div className="w-1 h-6 bg-linear-to-b from-blue-500 to-blue-600 rounded-full"></div>
                Embedding the Widget
              </h2>
              
              <div className="mb-6">
                <p className="text-gray-400 mb-4">
                  Add the embed code to your website's HTML. Replace <code className="px-2 py-1 bg-gray-800 text-blue-300 rounded text-sm">YOUR_TOUR_ID</code> with your actual tour ID:
                </p>
                
                <div className="relative group">
                  <div className="absolute right-3 top-3">
                    <button
                      onClick={() => copyToClipboard(codeExamples.embedCode, 'embedCode')}
                      className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                      aria-label="Copy code"
                    >
                      {copied === 'embedCode' ? (
                        <FiCheck className="w-4 h-4 text-green-400" />
                      ) : (
                        <FiCopy className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <pre className="bg-gray-900 border border-gray-800 text-gray-300 p-4 rounded-lg text-sm overflow-x-auto">
                    <code>{codeExamples.embedCode}</code>
                  </pre>
                </div>
              </div>
            </motion.section>

            <motion.section
              id="nextjs-integration"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-200">
                <div className="w-1 h-6 bg-linear-to-b from-blue-500 to-blue-600 rounded-full"></div>
                Next.js Integration
              </h2>
              
              <p className="text-gray-400 mb-6">
                For Next.js projects, use the built-in Script component for optimal performance:
              </p>
              
              <div className="relative group mb-6">
                <div className="absolute right-3 top-3">
                  <button
                    onClick={() => copyToClipboard(codeExamples.nextjsIntegration, 'nextjsIntegration')}
                    className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                    aria-label="Copy code"
                  >
                    {copied === 'nextjsIntegration' ? (
                      <FiCheck className="w-4 h-4 text-green-400" />
                    ) : (
                      <FiCopy className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
                <pre className="bg-gray-900 border border-gray-800 text-gray-300 p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{codeExamples.nextjsIntegration}</code>
                </pre>
              </div>
            </motion.section>

            <motion.section
              id="manual-initialization"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-200">
                <div className="w-1 h-6 bg-linear-to-b from-blue-500 to-blue-600 rounded-full"></div>
                Manual Initialization (Optional)
              </h2>
              
              <p className="text-gray-400 mb-6">
                For advanced use cases, you can initialize the tour manually:
              </p>
              
              <div className="relative group mb-6">
                <div className="absolute right-3 top-3">
                  <button
                    onClick={() => copyToClipboard(codeExamples.manualInitialization, 'manualInitialization')}
                    className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                    aria-label="Copy code"
                  >
                    {copied === 'manualInitialization' ? (
                      <FiCheck className="w-4 h-4 text-green-400" />
                    ) : (
                      <FiCopy className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
                <pre className="bg-gray-900 border border-gray-800 text-gray-300 p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{codeExamples.manualInitialization}</code>
                </pre>
              </div>
            </motion.section>

            <motion.section
              id="project-structure"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-200">
                <div className="w-1 h-6 bg-linear-to-b from-blue-500 to-blue-600 rounded-full"></div>
                Project Structure
              </h2>
              
              <div className="p-6 rounded-xl border border-gray-800 bg-gray-900/50">
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-200 mb-2">Technology Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm">Next.js</span>
                    <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm">React</span>
                    <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm">TypeScript</span>
                    <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm">Vite</span>
                    <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm">Firebase Auth</span>
                    <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm">Firestore</span>
                    <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm">CSS-in-JS</span>
                    <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm">GSAP</span>
                    <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm">Vercel</span>
                  </div>
                </div>
                
                <div className="border border-gray-800 rounded-lg p-4 bg-gray-900/30">
                  <code className="text-gray-300 text-sm">
                    <pre>{`├── apps/
│   ├── web/             # Dashboard application (Next.js + React)
│   │   ├── app/         # Pages and layouts
│   │   ├── components/  # Reusable components
│   │   ├── hooks/       # Custom React hooks
│   │   └── lib/         # Utilities and services
│   ├── widget/          # Embeddable widget (Vite + TypeScript)
│   └── docs/            # Technical documentation
└── package.json         # Workspace root configuration`}</pre>
                  </code>
                </div>
              </div>
            </motion.section>

            <motion.section
              id="building-production"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-200">
                <div className="w-1 h-6 bg-linear-to-b from-blue-500 to-blue-600 rounded-full"></div>
                Building for Production
              </h2>
              
              <div className="space-y-4">
                <div className="p-4 rounded-lg border border-gray-800 bg-gray-900/30">
                  <h4 className="font-semibold text-gray-200 mb-2">Build Widget</h4>
                  <div className="relative group">
                    <pre className="bg-gray-900 border border-gray-800 text-gray-300 p-3 rounded-lg text-sm overflow-x-auto">
                      <code>cd apps/widget && pnpm build</code>
                    </pre>
                  </div>
                  <p className="text-gray-400 text-sm mt-2">
                    Output: dist/ota-widget.js (11KB gzipped, 3.62KB minified)
                  </p>
                </div>
                
                <div className="p-4 rounded-lg border border-gray-800 bg-gray-900/30">
                  <h4 className="font-semibold text-gray-200 mb-2">Build Dashboard</h4>
                  <div className="relative group">
                    <pre className="bg-gray-900 border border-gray-800 text-gray-300 p-3 rounded-lg text-sm overflow-x-auto">
                      <code>cd apps/web && pnpm build</code>
                    </pre>
                  </div>
                  <p className="text-gray-400 text-sm mt-2">
                    Output: .next/ directory
                  </p>
                </div>
                
                <div className="p-4 rounded-lg border border-gray-800 bg-gray-900/30">
                  <h4 className="font-semibold text-gray-200 mb-2">Build All</h4>
                  <div className="relative group">
                    <pre className="bg-gray-900 border border-gray-800 text-gray-300 p-3 rounded-lg text-sm overflow-x-auto">
                      <code>pnpm run build</code>
                    </pre>
                  </div>
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
                  },
                  {
                    q: "How lightweight is the widget?",
                    a: "The widget is 11KB gzipped (3.62KB minified) - designed for optimal performance."
                  },
                  {
                    q: "Where is the live application hosted?",
                    a: "The application is deployed on Vercel at https://onboarding-widget-app.vercel.app/"
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