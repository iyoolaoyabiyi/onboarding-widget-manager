"use client"

import { motion } from "framer-motion";
import { Copy, FileText, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function DocumentationPreview() {
    const [copied, setCopied] = useState(false);
    
    const codeExample = `<script src="https://yourproject.com/embed.js" data-tour-id="your-tour-id"></script>`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(codeExample);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative py-20 md:py-32 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
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
                        <FileText className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-medium text-gray-300">Easy Integration</span>
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
                            one line of code
                        </span>
                    </motion.h2>
                    
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="text-lg text-gray-400 max-w-2xl mx-auto"
                    >
                        Add beautiful onboarding tours to your website with a single script tag.
                    </motion.p>
                </div>

                {/* Code Example */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="max-w-3xl mx-auto mb-8"
                >
                    <div className="relative rounded-xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm overflow-hidden shadow-2xl shadow-blue-500/5">
                        {/* Code Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-900/80">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                            </div>
                            <button
                                onClick={copyToClipboard}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-700 text-sm text-gray-300 hover:text-gray-200 hover:border-gray-600 hover:bg-gray-800 transition-all duration-300"
                            >
                                {copied ? (
                                    <>
                                        <span className="text-green-400">✓ Copied!</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-4 h-4" />
                                        Copy Code
                                    </>
                                )}
                            </button>
                        </div>
                        
                        {/* Code Content */}
                        <div className="p-6">
                            <pre className="text-sm text-gray-300 overflow-x-auto font-mono">
                                <code>{codeExample}</code>
                            </pre>
                        </div>
                    </div>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12"
                >
                    {[
                        { text: "No build process required" },
                        { text: "Zero dependencies" },
                        { text: "Works with any framework" }
                    ].map((feature, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-2 justify-center px-4 py-3 rounded-lg border border-gray-800 bg-gray-900/30"
                        >
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                            <span className="text-sm text-gray-300">{feature.text}</span>
                        </div>
                    ))}
                </motion.div>

                {/* CTA Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href="/documentation"
                        className="group inline-flex items-center gap-3 px-8 py-4 bg-linear-to-r from-blue-600 to-blue-500 text-white font-medium rounded-lg hover:from-blue-500 hover:to-blue-400 transition-all duration-300 shadow-lg shadow-blue-500/20"
                    >
                        <FileText className="w-5 h-5" />
                        View Full Documentation
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </motion.a>
                </motion.div>

                {/* Additional Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    viewport={{ once: true }}
                    className="mt-12 pt-8 border-t border-gray-800/50 text-center"
                >
                    <p className="text-sm text-gray-500">
                        Already integrated? <a href="/dashboard" className="text-blue-400 hover:text-blue-300 transition-colors">Go to Dashboard →</a>
                    </p>
                </motion.div>
            </div>
        </div>
    )
}