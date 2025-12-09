"use client"

import { motion } from "framer-motion";
import { Target, Rocket, TrendingUp, Users, Zap, Globe } from "lucide-react";

export default function About() {
  return (
    <div className="relative py-20 md:py-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-700/3 rounded-full blur-3xl" />
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
            <Target className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-gray-300">Our Vision</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
          >
            <span className="block text-gray-100">Redefining how users</span>
            <span className="block mt-2 bg-linear-to-r from-blue-400 via-blue-300 to-blue-400 bg-clip-text text-transparent">
              discover your product
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-gray-400 max-w-3xl mx-auto"
          >
            We empower teams to create seamless, intuitive product tours that guide 
            users step-by-step and dramatically increase product adoption.
          </motion.p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-8 rounded-xl border border-gray-800 bg-linear-to-br from-gray-900/50 to-gray-900/30 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-linear-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center">
                <Rocket className="w-6 h-6 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-100">Our Mission</h2>
            </div>
            <p className="text-lg text-gray-400 leading-relaxed">
              To make user onboarding effortless for both developers and end-users. 
              We believe every product deserves a clear, helpful tour that makes users 
              feel confident from their very first interaction.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="p-8 rounded-xl border border-gray-800 bg-linear-to-br from-gray-900/30 to-gray-900/50 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-linear-to-br from-blue-600/20 to-blue-700/20 flex items-center justify-center">
                <Globe className="w-6 h-6 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-100">Our Vision</h2>
            </div>
            <p className="text-lg text-gray-400 leading-relaxed">
              To create intelligent, adaptive onboarding experiences that personalize 
              guidance based on user behavior and context, transforming how people 
              learn and engage with digital products.
            </p>
          </motion.div>
        </div>

        {/* Why It Matters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-100 mb-4">
              Why Onboarding Matters
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              First impressions shape user retention and product success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Users className="w-6 h-6" />,
                title: "User Retention",
                description: "Users are 80% more likely to stay when they understand your product",
                color: "from-blue-500/20 to-blue-600/20"
              },
              {
                icon: <TrendingUp className="w-6 h-6" />,
                title: "Product Adoption",
                description: "Guided tours increase feature discovery by 3x",
                color: "from-blue-600/20 to-blue-700/20"
              },
              {
                icon: <Zap className="w-6 h-6" />,
                title: "Support Efficiency",
                description: "Reduce support requests by 65% with clear onboarding",
                color: "from-blue-500/20 to-blue-600/20"
              },
              {
                icon: <Target className="w-6 h-6" />,
                title: "Conversion Rates",
                description: "Improve conversion by 40% with better user guidance",
                color: "from-blue-600/20 to-blue-700/20"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="p-6 rounded-xl border border-gray-800 bg-gray-900/30 hover:bg-gray-900/50 transition-colors"
              >
                <div className={`w-12 h-12 rounded-lg bg-linear-to-br ${item.color} flex items-center justify-center mb-4`}>
                  <div className="text-blue-400">
                    {item.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-100 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-400">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* What We're Building */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="p-8 rounded-xl border border-gray-800 bg-linear-to-br from-gray-900/50 to-gray-900/30 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-lg bg-linear-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-100">What We're Building</h2>
          </div>
          
          <div className="space-y-4">
            <p className="text-lg text-gray-400 leading-relaxed">
              A powerful onboarding platform that enables teams to create interactive, 
              guided tours with customizable steps, smooth animations, and effortless 
              embed integration.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              {[
                "No-code visual tour builder",
                "Real-time analytics dashboard",
                "Multi-platform support",
                "Enterprise-grade security"
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-6 p-8 rounded-xl border border-gray-800 bg-linear-to-br from-gray-900/50 to-gray-900/30 backdrop-blur-sm">
            <div className="text-left">
              <h4 className="text-xl font-semibold text-gray-100 mb-2">
                Ready to transform your onboarding?
              </h4>
              <p className="text-gray-400">
                Join thousands of teams delivering better user experiences
              </p>
            </div>
            <a
              href="/sign-up"
              className="px-8 py-3 bg-linear-to-r from-blue-600 to-blue-500 text-white font-medium rounded-lg hover:from-blue-500 hover:to-blue-400 transition-all duration-300 shadow-lg shadow-blue-500/20"
            >
              Get Started Free
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}