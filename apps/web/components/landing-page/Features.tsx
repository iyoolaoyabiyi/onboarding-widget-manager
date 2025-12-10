"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Code, Settings, Zap, Palette, Sparkles, TrendingUp, ArrowDown } from "lucide-react";

export default function Features() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  // Create 6 steps from 0-1
  const step = useTransform(scrollYProgress, [0, 0.16, 0.32, 0.48, 0.64, 0.8, 1], [0, 1, 2, 3, 4, 5, 6]);
  
  // Create separate transforms for the mobile indicator
  const mobileProgressWidth = useTransform(step, v => `${Math.min((v / 6) * 100, 100)}%`);
  const mobileProgressText = useTransform(step, v => 
    `${Math.min(Math.floor(v) + 1, 6)}/6`
  );

  const features = [
    {
      icon: <Code className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "No-Code Integration",
      description: "Add with a single script tag—no build process or dependencies required.",
      color: "from-blue-500/20 to-blue-600/20"
    },
    {
      icon: <Settings className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Customizable Steps",
      description: "Define steps, target elements, and messages for any product layout.",
      color: "from-blue-600/20 to-blue-700/20"
    },
    {
      icon: <Zap className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Lightweight & Fast",
      description: "Optimized script that loads instantly without slowing down your app.",
      color: "from-blue-500/20 to-blue-600/20"
    },
    {
      icon: <Palette className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Theme Customization",
      description: "Match your brand with light/dark themes and custom styling options.",
      color: "from-blue-600/20 to-blue-700/20"
    },
    {
      icon: <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Interactive Elements",
      description: "Engage users with interactive tooltips, highlights, and animations.",
      color: "from-blue-500/20 to-blue-600/20"
    },
    {
      icon: <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Analytics Ready",
      description: "Track user engagement and completion rates with built-in analytics.",
      color: "from-blue-600/20 to-blue-700/20"
    }
  ];

  return (
    <div ref={sectionRef} className="relative h-[600vh] bg-black">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-64 sm:h-64 bg-blue-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-64 sm:h-64 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      {/* Sticky container */}
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden px-4">
        {/* Section Header */}
        <div className="absolute top-16 sm:top-20 text-center px-4 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-gray-800 bg-gray-900/50 mb-4 sm:mb-6"
          >
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
            <span className="text-xs sm:text-sm font-medium text-gray-300">Features</span>
          </motion.div>
        </div>

        {/* Animated Cards Container */}
        <div ref={containerRef} className="relative w-full max-w-4xl h-[350px] sm:h-[400px] flex items-center justify-center" style={{ perspective: "1000px" }}>
          {/* Cards arranged in a circle that rotates */}
          {features.map((item, index) => {
            const totalCards = features.length;
            const anglePerCard = 360 / totalCards;
            const baseAngle = index * anglePerCard;
            
            return (
              <motion.div
                key={index}
                style={{
                  opacity: useTransform(step, v => {
                    const currentIndex = Math.floor(v);
                    if (currentIndex === index) return 1;
                    if (Math.abs(currentIndex - index) === 1) return 0.4;
                    if (Math.abs(currentIndex - index) === totalCards - 1) return 0.4;
                    return 0;
                  }),
                  scale: useTransform(step, v => {
                    const currentIndex = Math.floor(v);
                    if (currentIndex === index) return 1;
                    return 0.7;
                  }),
                  rotateY: useTransform(step, v => {
                    const rotation = -v * anglePerCard;
                    return baseAngle + rotation;
                  }),
                  z: useTransform(step, v => {
                    const currentIndex = Math.floor(v);
                    if (currentIndex === index) return 0;
                    return -200;
                  }),
                  x: useTransform(step, v => {
                    const currentAngle = baseAngle - v * anglePerCard;
                    const radians = (currentAngle * Math.PI) / 180;
                    return Math.sin(radians) * 400;
                  }),
                  y: useTransform(step, v => {
                    const currentIndex = Math.floor(v);
                    const progress = v - currentIndex;
                    if (currentIndex === index) {
                      return Math.sin(progress * Math.PI) * -20;
                    }
                    return 0;
                  }),
                }}
                className="absolute w-full max-w-[90%] sm:max-w-md bg-gray-900/70 backdrop-blur-lg border border-gray-700 rounded-2xl p-6 sm:p-8 shadow-2xl"
              >
                <div className="flex flex-col items-center text-center">
                  {/* Icon with pulse effect */}
                  <motion.div 
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-linear-to-br ${item.color} flex items-center justify-center mb-4 sm:mb-6`}
                  >
                    <div className="text-blue-400">
                      {item.icon}
                    </div>
                  </motion.div>
                  
                  {/* Content */}
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-100 mb-2 sm:mb-3">{item.title}</h3>
                  <p className="text-sm sm:text-lg text-gray-400 mb-4 sm:mb-6">{item.description}</p>
                  
                  {/* Step Indicator */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {features.map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          scale: i === index ? [1, 1.2, 1] : 1,
                        }}
                        transition={{
                          duration: 0.5,
                          repeat: i === index ? Infinity : 0,
                          repeatDelay: 1
                        }}
                        className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors duration-300 ${
                          i === index ? 'bg-blue-500' : i < index ? 'bg-blue-500/30' : 'bg-gray-700'
                        }`}
                      />
                    ))}
                    <span className="text-xs sm:text-sm text-gray-500 ml-1 sm:ml-2">
                      {index + 1} of {features.length}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Next Card Indicator */}
          <motion.div
            style={{
              opacity: useTransform(step, v => {
                const currentStep = Math.floor(v);
                return currentStep < features.length - 1 ? 1 : 0;
              })
            }}
            className="absolute -bottom-16 sm:-bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 sm:gap-2 text-gray-400"
          >
            <ArrowDown className="w-5 h-5 sm:w-6 sm:h-6 animate-bounce" />
            <span className="text-xs sm:text-sm">Scroll for next feature</span>
          </motion.div>

          <div className="absolute -left-20 top-1/2 -translate-y-1/2 hidden lg:block">
            <div className="h-64 w-1 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                style={{ scaleY: scrollYProgress }}
                className="h-full w-full bg-linear-to-b from-blue-600 to-blue-500 origin-top"
              />
            </div>
          </div>
        </div>

        {/* Progress Indicator (Mobile & Tablet) */}
        <div className="lg:hidden absolute bottom-16 sm:bottom-20 px-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-32 sm:w-48 h-1 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                style={{ width: mobileProgressWidth }}
                className="h-full bg-linear-to-r from-blue-600 to-blue-500 rounded-full"
              />
            </div>
            <motion.span 
              className="text-xs sm:text-sm text-gray-400 whitespace-nowrap"
            >
              {mobileProgressText}
            </motion.span>
          </div>
        </div>
      </div>
    </div>
  );
}