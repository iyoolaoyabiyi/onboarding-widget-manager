"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Code, Play, Zap } from "lucide-react";
import React from "react";

export default function Hero() {
  const { user, loading } = useAuth();

  // -------------------- WORD ROTATION ANIMATION --------------------
  const rotatingPhrases = [
    "Build Interactive",
    "Build Beautiful", 
    "Build Engaging",
    "Build Seamless"
  ];
  const [currentPhraseIndex, setCurrentPhraseIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhraseIndex((prev) => (prev + 1) % rotatingPhrases.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);
  // ----------------------------------------------------------

  // -------------------- TYPING ANIMATION --------------------
  const fullCode = `// Initialize tour in seconds
Tour.init({
  steps: [
    { target: '#hero', content: 'Welcome!' },
    { target: '.features', content: 'Discover features' },
    { target: '#cta', content: 'Get started now' }
  ]
});`;

  const [displayed, setDisplayed] = React.useState("");
  const [showCursor, setShowCursor] = React.useState(true);

  React.useEffect(() => {
    let index = 0;

    function typeChar() {
      if (index <= fullCode.length) {
        setDisplayed(fullCode.slice(0, index));
        index++;

        // random typing delay: 20–120ms
        const randomDelay = Math.floor(Math.random() * 80) + 40;
        setTimeout(typeChar, randomDelay);
      }
    }

    typeChar();

    // blinking cursor
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);
  // ----------------------------------------------------------

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-size-[4rem_4rem] opacity-20" />
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -left-40 w-80 h-80 bg-linear-to-br from-blue-600/20 to-blue-400/10 rounded-full blur-3xl"
          animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-80 h-80 bg-linear-to-br from-blue-500/20 to-blue-600/10 rounded-full blur-3xl"
          animate={{ x: [0, -100, 0], y: [0, 50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-linear-to-br from-blue-700/10 to-blue-500/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-500/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2 + Math.random() * 2, delay: i * 0.2, repeat: Infinity }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto text-center py-20">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={currentPhraseIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="block text-gray-100"
            >
              {rotatingPhrases[currentPhraseIndex]}
            </motion.span>
          </AnimatePresence>
          <span className="block mt-2 bg-linear-to-r from-blue-400 via-blue-300 to-blue-400 bg-clip-text text-transparent">
            Onboarding Tours
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto mb-10 px-4"
        >
          A lightweight, customizable tour library that helps users discover your
          product's features with beautiful, interactive walkthroughs.
        </motion.p>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-12"
        >
          {[
            { icon: <Code className="w-5 h-5" />, text: "Simple Integration" },
            { icon: <Play className="w-5 h-5" />, text: "Interactive Steps" },
            { icon: <Zap className="w-5 h-5" />, text: "Lightweight & Fast" }
          ].map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-2 justify-center px-4 py-3 rounded-lg border border-gray-800 bg-gray-900/30"
            >
              <div className="text-blue-400">{feature.icon}</div>
              <span className="text-sm text-gray-300">{feature.text}</span>
            </div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            {!user ? (
              <Link
                href="/sign-up"
                className="group inline-flex items-center gap-2 px-8 py-3.5 bg-linear-to-r from-blue-600 to-blue-500 text-white font-medium rounded-lg hover:from-blue-500 hover:to-blue-400 transition-all duration-300 shadow-lg shadow-blue-500/20"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <Link
                href="/dashboard"
                className="group inline-flex items-center gap-2 px-8 py-3.5 bg-linear-to-r from-blue-600 to-blue-500 text-white font-medium rounded-lg hover:from-blue-500 hover:to-blue-400 transition-all duration-300 shadow-lg shadow-blue-500/20"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}

            <Link
              href="/documentation"
              className="inline-flex items-center gap-2 px-8 py-3.5 border border-gray-700 text-gray-300 font-medium rounded-lg hover:border-gray-600 hover:text-gray-200 hover:bg-gray-900/50 transition-all duration-300"
            >
              View Documentation
            </Link>
          </motion.div>
        )}

        {/* Code Example Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 max-w-3xl mx-auto"
        >
          <div className="text-left bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm text-gray-400 ml-auto">tour.js</span>
            </div>

            <pre className="text-sm text-gray-300 overflow-x-auto">
              <code>
                {displayed}
                {showCursor ? "|" : " "}
              </code>
            </pre>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 pt-8 border-t border-gray-800/50 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
        >
          {[
            { value: "2kb", label: "Bundle Size" },
            { value: "100%", label: "Customizable" },
            { value: "0", label: "Dependencies" }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl font-bold text-gray-100">{stat.value}</div>
              <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}