"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import {
  FileText,
  Code,
  Globe,
  BarChart3,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.5, 1]);

  const steps = [
    {
      number: 1,
      icon: <FileText className="w-6 h-6" />,
      title: "Create Your Tour",
      description:
        "Define steps, target elements, and messages in our intuitive dashboard.",
      color: "from-blue-500/20 to-blue-600/20",
    },
    {
      number: 2,
      icon: <Code className="w-6 h-6" />,
      title: "Get Embed Code",
      description: "Copy the generated script tag ready for integration.",
      color: "from-blue-600/20 to-blue-700/20",
    },
    {
      number: 3,
      icon: <Globe className="w-6 h-6" />,
      title: "Add to Website",
      description: "Paste the script and see your onboarding appear instantly.",
      color: "from-blue-500/20 to-blue-600/20",
    },
    {
      number: 4,
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Track & Optimize",
      description: "Monitor completions, engagement, and optimize your tours.",
      color: "from-blue-600/20 to-blue-700/20",
    },
  ];

  return (
    <motion.div
      ref={sectionRef}
      style={{ y, opacity }}
      className="relative py-20 md:py-32 overflow-hidden"
      id="how-it-works"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-800 bg-gray-900/50 mb-6"
          >
            <CheckCircle className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-gray-300">
              Simple Integration
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
          >
            <span className="block text-gray-100">Get started in</span>
            <span className="block mt-2 bg-linear-to-r from-blue-400 via-blue-300 to-blue-400 bg-clip-text text-transparent">
              four simple steps
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-gray-400 max-w-2xl mx-auto"
          >
            Integrate beautiful onboarding tours in minutes with our streamlined
            workflow.
          </motion.p>
        </div>

        {/* Circular Carousel */}
        <div className="relative">
          <div className="flex justify-center items-center min-h-[700px] relative">
            <motion.div
              className="relative w-full max-w-3xl aspect-square"
              onHoverStart={() => setIsPaused(true)}
              onHoverEnd={() => setIsPaused(false)}
            >
              {/* Orbit Rings */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border-2 border-blue-500/10"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.1 }}
                viewport={{ once: true }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full border border-blue-500/5"
              />

              {/* Center Circle */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
                viewport={{ once: true }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-linear-to-br from-blue-600/30 to-blue-500/20 backdrop-blur-xl border-2 border-blue-500/30 flex items-center justify-center z-10 shadow-2xl shadow-blue-500/20"
              >
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-400 mb-1">4</div>
                  <div className="text-sm text-gray-400 font-medium">Steps</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Hover to Pause
                  </div>
                </div>
              </motion.div>

              {/* Orbiting Steps */}
              {steps.map((step, index) => {
                const angle = index * 90 - 90; // Start from top, 90 degrees apart
                const radius = 250; // Distance from center

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    animate={{
                      rotate: isPaused ? 0 : 360,
                    }}
                    transition={{
                      opacity: { duration: 0.6, delay: index * 0.15 },
                      scale: { duration: 0.6, delay: index * 0.15 },
                      rotate: {
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                      },
                    }}
                    className="absolute top-1/2 left-1/2"
                    style={{
                      transformOrigin: "0 0",
                    }}
                  >
                    <motion.div
                      animate={{
                        rotate: isPaused ? 0 : -360,
                      }}
                      transition={{
                        rotate: {
                          duration: 20,
                          repeat: Infinity,
                          ease: "linear",
                        },
                      }}
                      style={{
                        x: Math.cos((angle * Math.PI) / 180) * radius - 100,
                        y: Math.sin((angle * Math.PI) / 180) * radius - 100,
                      }}
                      whileHover={{ scale: 1.15, zIndex: 50 }}
                      className="group cursor-pointer"
                    >
                      <div className="w-48 p-5 rounded-2xl border-2 border-gray-800 bg-gray-900/95 backdrop-blur-xl hover:border-blue-500/60 hover:bg-gray-900 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300">
                        <div className="flex flex-col items-center text-center">
                          {/* Step Number */}
                          <div className="relative mb-4">
                            <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-600 to-blue-500 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/30">
                              {step.number}
                            </div>
                            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-gray-950 animate-pulse" />
                          </div>

                          {/* Icon */}
                          <div
                            className={`w-14 h-14 rounded-xl bg-linear-to-br ${step.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}
                          >
                            <div className="text-blue-400">{step.icon}</div>
                          </div>

                          {/* Content */}
                          <h4 className="text-base font-semibold mb-2 text-gray-100 group-hover:text-blue-400 transition-colors">
                            {step.title}
                          </h4>
                          <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>

                      {/* Connection Line to Center */}
                      <div
                        className="absolute top-1/2 left-1/2 w-1 bg-linear-to-b from-blue-500/20 to-transparent pointer-events-none"
                        style={{
                          height: `${radius - 80}px`,
                          transformOrigin: "top center",
                          transform: `rotate(${angle + 90}deg)`,
                        }}
                      />
                    </motion.div>
                  </motion.div>
                );
              })}

              {/* Animated Glow Effect */}
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-3xl pointer-events-none"
              />
            </motion.div>
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 rounded-xl border border-gray-800 bg-linear-to-br from-gray-900/50 to-gray-900/30 backdrop-blur-sm">
              <div className="text-left">
                <h4 className="text-lg font-semibold text-gray-100 mb-1">
                  Ready to get started?
                </h4>
                <p className="text-gray-400 text-sm">
                  Create your first tour in minutes
                </p>
              </div>
              <a
                href="/sign-up"
                className="group inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-blue-600 to-blue-500 text-white font-medium rounded-lg hover:from-blue-500 hover:to-blue-400 transition-all duration-300 shadow-lg shadow-blue-500/20"
              >
                Try It Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}