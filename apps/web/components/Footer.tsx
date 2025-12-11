"use client"

import { motion } from "framer-motion";
import Link from "next/link";
import { FileText, Code, Settings, HelpCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-200">OnTour</span>
          </motion.div>
          
          {/* Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-wrap justify-center items-center gap-6"
          >
            <Link
              href="/documentation"
              className="text-gray-400 hover:text-gray-200 transition-colors text-sm flex items-center gap-1"
            >
              <Code className="w-4 h-4" />
              Documentation
            </Link>
            <Link
              href="/dashboard"
              className="text-gray-400 hover:text-gray-200 transition-colors text-sm flex items-center gap-1"
            >
              <Settings className="w-4 h-4" />
              Dashboard
            </Link>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 pt-6 border-t border-gray-800 text-center"
        >
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Tour Docs. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}