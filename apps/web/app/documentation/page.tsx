"use client"

import { motion } from "framer-motion";

export default function Documentation() {
  return (
    <div className="min-h-screen flex">
      <aside className="hidden md:flex flex-col w-64 border-r border-purple-500/20 px-6 py-8 gap-6 sticky top-0 h-screen bg-gray-900/30">
        <h2 className="text-xl font-semibold bg-linear-to-r from-purple-300 to-fuchsia-300 bg-clip-text text-transparent">
          Documentation
        </h2>

        <nav className="flex flex-col gap-4 text-sm">
          <a href="#introduction" className="text-gray-300 hover:text-purple-400 transition-colors">
            Introduction
          </a>
          <a href="#installation" className="text-gray-300 hover:text-purple-400 transition-colors">
            Installation
          </a>
          <a href="#embed" className="text-gray-300 hover:text-purple-400 transition-colors">
            Embed Script
          </a>
          <a href="#config" className="text-gray-300 hover:text-purple-400 transition-colors">
            Configuration
          </a>
          <a href="#example" className="text-gray-300 hover:text-purple-400 transition-colors">
            Example Tour
          </a>
          <a href="#faq" className="text-gray-300 hover:text-purple-400 transition-colors">
            FAQ
          </a>
        </nav>
      </aside>

      <main className="flex-1 px-6 md:px-12 py-12 max-w-3xl mx-auto">
        <motion.section
          id="introduction"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h1 className="text-4xl font-bold mb-4 bg-linear-to-r from-white via-purple-200 to-fuchsia-200 bg-clip-text text-transparent">
            Introduction
          </h1>
          <p className="text-lg text-gray-300">
            Welcome to the onboarding tour documentation. This guide will show
            you how to embed and configure your interactive onboarding flow.
          </p>
        </motion.section>

        <motion.section
          id="installation"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-semibold mb-3 text-purple-300">Installation</h2>
          <p className="mb-4 text-gray-300">
            Add the script tag below to your website's <code className="px-2 py-1 bg-purple-900/30 text-purple-300 rounded">&lt;head&gt;</code>{" "}
            section:
          </p>

          <pre className="bg-gray-900/80 border border-purple-500/20 text-purple-200 p-4 rounded-lg text-sm overflow-auto shadow-lg">
            {`<script src="https://cdn.yoursite.com/tour.js"></script>`}
          </pre>
        </motion.section>

        <motion.section
          id="embed"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-semibold mb-3 text-purple-300">Embed Script</h2>
          <p className="mb-4 text-gray-300">
            Initialize the onboarding tour using the following code snippet:
          </p>

          <pre className="bg-gray-900/80 border border-purple-500/20 text-purple-200 p-4 rounded-lg text-sm overflow-auto shadow-lg">
            {`<script>
  Tour.init({
    steps: [
      { id: "step-1", target: "#hero", content: "Welcome to the product!" },
      { id: "step-2", target: "#feature-one", content: "Check this feature." },
      { id: "step-3", target: "#cta", content: "Try it out here!" }
    ]
  });
</script>`}
          </pre>
        </motion.section>

        <motion.section
          id="config"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-semibold mb-3 text-purple-300">Configuration</h2>
          <p className="mb-4 text-gray-300">Below are the available configuration options:</p>

          <ul className="list-none pl-0 space-y-3">
            <li className="flex items-start gap-3 text-gray-300">
              <span className="text-purple-400 mt-1">•</span>
              <span>
                <code className="px-2 py-1 bg-purple-900/30 text-purple-300 rounded">steps</code> — Array of tour steps (required)
              </span>
            </li>
            <li className="flex items-start gap-3 text-gray-300">
              <span className="text-purple-400 mt-1">•</span>
              <span>
                <code className="px-2 py-1 bg-purple-900/30 text-purple-300 rounded">autoStart</code> — Start the tour automatically
              </span>
            </li>
            <li className="flex items-start gap-3 text-gray-300">
              <span className="text-purple-400 mt-1">•</span>
              <span>
                <code className="px-2 py-1 bg-purple-900/30 text-purple-300 rounded">theme</code> — Light or dark theme
              </span>
            </li>
            <li className="flex items-start gap-3 text-gray-300">
              <span className="text-purple-400 mt-1">•</span>
              <span>
                <code className="px-2 py-1 bg-purple-900/30 text-purple-300 rounded">onComplete</code> — Callback when user finishes
              </span>
            </li>
          </ul>
        </motion.section>

        <motion.section
          id="example"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-semibold mb-3 text-purple-300">Example Tour</h2>

          <pre className="bg-gray-900/80 border border-purple-500/20 text-purple-200 p-4 rounded-lg text-sm overflow-auto shadow-lg">
            {`Tour.init({
  autoStart: true,
  steps: [
    { id: "welcome", target: "#header", content: "Welcome to the onboarding tour!" },
    { id: "dashboard", target: "#dashboard", content: "Your dashboard lives here." }
  ]
});`}
          </pre>
        </motion.section>

        <motion.section
          id="faq"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-semibold mb-3 text-purple-300">FAQ</h2>

          <div className="space-y-6">
            <div>
              <p className="font-medium text-gray-200 mt-4">Is the tour customizable?</p>
              <p className="text-gray-400 mt-2">
                Yes, themes and animations can be modified.
              </p>
            </div>

            <div>
              <p className="font-medium text-gray-200">Can I add more than 5 steps?</p>
              <p className="text-gray-400 mt-2">
                Absolutely — the system supports unlimited steps.
              </p>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
}