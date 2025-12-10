import { motion } from "framer-motion";
import { Plus, Eye, Share2 } from "lucide-react";

type Props = {
  onCreate: () => void;
};

export default function DashboardHeader({ onCreate }: Props) {
  return (
    <header className="flex flex-col gap-6 w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col gap-3"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-100">
          Onboarding Dashboard
        </h1>
        <p className="text-gray-400 max-w-3xl leading-relaxed">
          Build, preview, and hand off guided tours without leaving this workspace.
          Everything here is wired for the flow in the product brief—tour creation,
          embed delivery, and baseline analytics.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex flex-wrap gap-3"
      >
        <button
          className="group flex items-center gap-2 px-5 py-2.5 rounded-lg bg-linear-to-r from-blue-600 to-blue-500 text-white font-semibold hover:from-blue-500 hover:to-blue-400 transition-all duration-300 shadow-lg shadow-blue-500/20"
          onClick={onCreate}
        >
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
          Create New Tour
        </button>

        <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-700 bg-gray-800/50 text-gray-300 hover:bg-gray-800 hover:border-gray-600 hover:text-gray-200 transition-all duration-300">
          <Eye className="w-4 h-4" />
          Preview Widget
        </button>

        <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-700 bg-gray-800/50 text-gray-300 hover:bg-gray-800 hover:border-gray-600 hover:text-gray-200 transition-all duration-300">
          <Share2 className="w-4 h-4" />
          Share with Devs
        </button>
      </motion.div>
    </header>
  );
}