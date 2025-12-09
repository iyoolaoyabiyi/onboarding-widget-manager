"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Menu, X, FileText, Code, Settings, HelpCircle } from "lucide-react";

export default function Navbar() {
  const { user, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully!");
    } catch (error) {
      toast.error("Failed to log out.");
    }
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  const menuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3
      }
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3
      }
    }
  };

  const itemVariants = {
    closed: { opacity: 0, x: -20 },
    open: { opacity: 1, x: 0 }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-800 backdrop-blur supports-backdrop-filter:bg-gray-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-semibold text-gray-200">Tour</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/documentation"
                className="text-gray-400 hover:text-gray-200 transition-colors text-sm flex items-center gap-1"
              >
                <Code className="w-4 h-4" />
                Documentation
              </Link>
              <Link
                href="/about"
                className="text-gray-400 hover:text-gray-200 transition-colors text-sm flex items-center gap-1"
              >
                <HelpCircle className="w-4 h-4" />
                About
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {!loading && (
              <>
                {!user && (
                  <Link
                    href="/sign-up"
                    className="px-4 py-2 bg-linear-to-r from-blue-600 to-blue-500 text-white rounded-lg text-sm font-medium hover:from-blue-500 hover:to-blue-400 transition-all"
                  >
                    Get Started
                  </Link>
                )}

                {user && (
                  <>
                    <Link
                      href="/dashboard"
                      className="px-4 py-2 text-gray-400 hover:text-gray-200 rounded-lg text-sm transition-colors"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="inline-flex items-center gap-2 px-4 py-2 border border-gray-700 text-gray-300 font-medium rounded-lg hover:border-gray-600 hover:text-gray-200 hover:bg-gray-900/50 transition-all duration-300"
                    >
                      Logout
                    </button>
                  </>
                )}
              </>
            )}
          </div>

          <button
            onClick={toggleMenu}
            className="md:hidden text-gray-400 hover:text-gray-200 transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
              className="md:hidden overflow-hidden border-t border-gray-800"
            >
              <div className="py-4 space-y-3">
                <motion.div variants={itemVariants} className="space-y-1">
                  <Link
                    href="/documentation"
                    onClick={toggleMenu}
                    className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <Code className="w-4 h-4" />
                    Documentation
                  </Link>
                  <Link
                    href="/examples"
                    onClick={toggleMenu}
                    className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Examples
                  </Link>
                  <Link
                    href="/about"
                    onClick={toggleMenu}
                    className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <HelpCircle className="w-4 h-4" />
                    About
                  </Link>
                </motion.div>

                {!loading && (
                  <motion.div variants={itemVariants} className="pt-3 space-y-2">
                    {!user && (
                      <Link
                        href="/sign-up"
                        onClick={toggleMenu}
                        className="block px-4 py-2.5 bg-linear-to-r from-blue-600 to-blue-500 text-white font-medium text-center rounded-lg text-sm hover:from-blue-500 hover:to-blue-400 transition-all"
                      >
                        Get Started
                      </Link>
                    )}

                    {user && (
                      <>
                        <Link
                          href="/dashboard"
                          onClick={toggleMenu}
                          className="block px-4 py-2.5 text-gray-400 hover:text-gray-200 hover:bg-gray-800 text-center rounded-lg transition-colors"
                        >
                          Dashboard
                        </Link>
                        <button
                          onClick={() => {
                            handleLogout();
                            toggleMenu();
                          }}
                          className="w-full px-4 py-2.5 border border-gray-700 text-gray-400 hover:text-gray-200 hover:border-gray-600 rounded-lg text-sm transition-colors"
                        >
                          Logout
                        </button>
                      </>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}