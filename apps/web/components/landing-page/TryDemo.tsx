"use client"

import { motion } from "framer-motion";
import { Play, ArrowRight, Sparkles, Eye } from "lucide-react";
import { useState } from "react";

export default function TryDemo() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [inputValue, setInputValue] = useState("");
  
  const demoSteps = [
    {
      title: "Welcome to your first tour!",
      description: "Use interactive tooltips to guide users through key features.",
      buttonText: "Next: Features",
      action: "intro"
    },
    {
      title: "Discover features",
      description: "Try clicking the highlighted button below to continue.",
      buttonText: "Click me to continue!",
      action: "click"
    },
    {
      title: "Type something!",
      description: "Enter your name in the field below to complete the tour.",
      buttonText: "Complete Tour",
      action: "input"
    }
  ];

  const nextStep = () => {
    if (currentStep === 1 && demoSteps[currentStep].action === "click") {
      setTaskCompleted(true);
      setTimeout(() => {
        setCurrentStep((prev) => (prev + 1) % demoSteps.length);
        setTaskCompleted(false);
      }, 600);
    } else if (currentStep === 2 && demoSteps[currentStep].action === "input" && inputValue.trim()) {
      setTaskCompleted(true);
      setTimeout(() => {
        setCurrentStep(0);
        setTaskCompleted(false);
        setInputValue("");
        setIsActive(false);
      }, 1000);
    } else if (demoSteps[currentStep].action === "intro") {
      setCurrentStep((prev) => (prev + 1) % demoSteps.length);
    }
  };

  const startDemo = () => {
    setCurrentStep(0);
    setIsActive(true);
    setTaskCompleted(false);
    setInputValue("");
  };

  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-700/3 rounded-full blur-3xl" />
      </div>

      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-500/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -10, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              delay: i * 0.2,
              repeat: Infinity,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-800 bg-gray-900/50 mb-6"
          >
            <Play className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-gray-300">Interactive Demo</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
          >
            <span className="block text-gray-100">See it in action</span>
            <span className="block mt-2 bg-linear-to-r from-blue-400 via-blue-300 to-blue-400 bg-clip-text text-transparent">
              Try the demo yourself
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-gray-400 max-w-2xl mx-auto"
          >
            Experience how users will navigate through smooth, guided onboarding steps.
          </motion.p>
        </div>

        {/* Demo Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-3xl mx-auto mb-12"
        >
          <div className="relative rounded-xl border border-gray-800 bg-linear-to-br from-gray-900/50 to-gray-900/30 backdrop-blur-sm overflow-hidden shadow-2xl shadow-blue-500/5">
            {/* Pulsing glow effect */}
            <motion.div
              className="absolute inset-0 rounded-xl"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(59, 130, 246, 0.1)",
                  "0 0 40px rgba(59, 130, 246, 0.2)",
                  "0 0 20px rgba(59, 130, 246, 0.1)",
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 opacity-30"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent)",
              }}
              animate={{
                x: ["-100%", "200%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
                repeatDelay: 2,
              }}
            />

            {/* Demo Header */}
            <div className="relative px-6 py-4 border-b border-gray-800 bg-gray-900/80">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-gray-300">Live Demo Preview</span>
                {isActive && (
                  <div className="ml-auto flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {demoSteps.map((_, index) => (
                        <motion.div
                          key={index}
                          className={`w-1.5 h-1.5 rounded-full transition-colors ${
                            index === currentStep ? 'bg-blue-500' : 'bg-gray-700'
                          }`}
                          animate={index === currentStep ? {
                            scale: [1, 1.3, 1],
                          } : {}}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 ml-2">
                      Step {currentStep + 1} of {demoSteps.length}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Demo Content */}
            <div className="relative p-8">
              {!isActive ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <motion.div
                    className="w-16 h-16 rounded-full bg-linear-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center mb-4"
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  >
                    <Play className="w-8 h-8 text-blue-400" />
                  </motion.div>
                  <h4 className="text-xl font-semibold text-gray-100 mb-2">
                    Ready to try the demo?
                  </h4>
                  <p className="text-gray-400 mb-6">
                    Click the button below to start the interactive tour
                  </p>
                  <motion.button
                    onClick={startDemo}
                    className="group inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-blue-600 to-blue-500 text-white font-medium rounded-lg hover:from-blue-500 hover:to-blue-400 transition-all duration-300 shadow-lg shadow-blue-500/20 relative overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent"
                      animate={{
                        x: ["-100%", "200%"],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                        repeatDelay: 1,
                      }}
                    />
                    <Play className="w-4 h-4 relative" />
                    <span className="relative">Start Live Demo</span>
                  </motion.button>
                </div>
              ) : (
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-6"
                >
                  {/* Tooltip Card */}
                  <div className="relative">
                    {/* Pointer with bounce animation */}
                    <motion.div
                      className="absolute -top-3 left-6 w-4 h-4 rotate-45 bg-gray-800 border-l border-t border-gray-700"
                      animate={{
                        y: [0, -4, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    
                    {/* Card */}
                    <div className="p-6 rounded-lg border border-gray-700 bg-gray-800/50 backdrop-blur-sm shadow-lg">
                      <div className="flex items-start gap-3">
                        <motion.div
                          className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center"
                          animate={{
                            rotate: taskCompleted ? 0 : [0, 360],
                            scale: taskCompleted ? [1, 1.2, 1] : 1,
                          }}
                          transition={{
                            duration: taskCompleted ? 0.5 : 20,
                            repeat: taskCompleted ? 0 : Infinity,
                            ease: "linear",
                          }}
                        >
                          <Sparkles className="w-4 h-4 text-blue-400" />
                        </motion.div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-100 mb-2">
                            {demoSteps[currentStep].title}
                          </h4>
                          <p className="text-gray-400">
                            {demoSteps[currentStep].description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Interactive Elements */}
                  {currentStep === 2 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Enter your name..."
                        className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800/50 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                      />
                    </motion.div>
                  )}
                  
                  {/* Demo Controls */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-800/50">
                    <button
                      onClick={startDemo}
                      className="px-4 py-2 rounded-lg border border-gray-700 text-sm text-gray-400 hover:text-gray-300 hover:border-gray-600 transition-colors"
                    >
                      Restart Demo
                    </button>
                    
                    <motion.button
                      onClick={nextStep}
                      disabled={currentStep === 2 && !inputValue.trim()}
                      className={`group inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-blue-600 to-blue-500 text-white font-medium rounded-lg hover:from-blue-500 hover:to-blue-400 transition-all duration-300 shadow-lg shadow-blue-500/20 relative overflow-hidden ${
                        currentStep === 2 && !inputValue.trim() ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      whileHover={currentStep === 2 && !inputValue.trim() ? {} : { scale: 1.02 }}
                      whileTap={currentStep === 2 && !inputValue.trim() ? {} : { scale: 0.98 }}
                      animate={taskCompleted ? {
                        scale: [1, 1.05, 1],
                        backgroundColor: ["rgb(37, 99, 235)", "rgb(34, 197, 94)", "rgb(37, 99, 235)"],
                      } : {}}
                    >
                      {/* Animated gradient overlay */}
                      <motion.div
                        className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent"
                        animate={{
                          x: ["-100%", "200%"],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                          repeatDelay: 1,
                        }}
                      />
                      <span className="relative">{demoSteps[currentStep].buttonText}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform relative" />
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startDemo}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-linear-to-r from-blue-600 to-blue-500 text-white font-medium rounded-lg hover:from-blue-500 hover:to-blue-400 transition-all duration-300 shadow-lg shadow-blue-500/20 relative overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"
              animate={{
                x: ["-100%", "200%"],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "linear",
                repeatDelay: 1.5,
              }}
            />
            <Play className="w-5 h-5 relative" />
            <span className="relative">Start Interactive Demo</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform relative" />
          </motion.button>
        </motion.div> */}

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-gray-800/50 text-center"
        >
          <p className="text-sm text-gray-500">
            Want to customize this demo? <a href="/sign-up" className="text-blue-400 hover:text-blue-300 transition-colors">Sign up for free →</a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}