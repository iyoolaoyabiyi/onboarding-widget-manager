import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

type Props = {
  onCreate: () => void;
};

export default function OnboardingEmpty({ onCreate }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-3xl mx-auto rounded-2xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm p-12 flex flex-col gap-6 items-center text-center shadow-2xl"
    >

      {/* Content */}
      <div className="space-y-3">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-3xl font-bold text-gray-100"
        >
          Create your first tour
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-gray-400 text-base md:text-lg max-w-xl mx-auto"
        >
          Add a tour name, base URL, and at least five steps. Use the button below to begin building beautiful onboarding experiences.
        </motion.p>
      </div>

      {/* Button */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="group px-8 py-3.5 rounded-lg bg-linear-to-r from-blue-600 to-blue-500 text-white font-semibold hover:from-blue-500 hover:to-blue-400 transition-all duration-300 shadow-lg shadow-blue-500/20 flex items-center gap-2"
        onClick={onCreate}
      >
        <span className="text-xl">+</span>
        Create New Tour
      </motion.button>

      {/* Features List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="flex flex-wrap gap-4 justify-center mt-4 text-sm text-gray-500"
      >
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          <span>Interactive Steps</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          <span>Full Customization</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          <span>Analytics Tracking</span>
        </div>
      </motion.div>
    </motion.div>
  );
}