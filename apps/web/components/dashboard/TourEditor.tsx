import { motion } from "framer-motion";
import { Edit3, Eye, Plus, Save, Code2, Rocket, Info } from "lucide-react";
import { Step } from "./types";

type Props = {
  steps: Step[];
  defaultTourName?: string;
  defaultBaseUrl?: string;
  defaultThemeColor?: string;
  defaultCtaCopy?: string;
};

export default function TourEditor({
  steps,
  defaultTourName,
  defaultBaseUrl,
  defaultThemeColor,
  defaultCtaCopy,
}: Props) {
  const hasSteps = steps.length > 0;

  return (
    <div className="lg:col-span-2 rounded-2xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm p-6 space-y-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-100">Tour Editor</h2>
          <p className="text-gray-400 text-sm mt-1">Define the base URL, theme, and step-by-step messaging.</p>
        </div>
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 text-xs border border-blue-500/20 text-blue-400 font-medium w-fit">
          <Info className="w-3.5 h-3.5" />
          Minimum 5 steps
        </span>
      </div>

      {/* Tour Configuration */}
      <div className="grid md:grid-cols-2 gap-4">
        <label className="flex flex-col gap-2">
          <span className="text-sm text-gray-300 font-medium">Tour Name</span>
          <input
            className="px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
            defaultValue={defaultTourName ?? ""}
            placeholder="Name your tour"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm text-gray-300 font-medium">Base URL</span>
          <input
            className="px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
            defaultValue={defaultBaseUrl ?? ""}
            placeholder="https://your-app.com"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm text-gray-300 font-medium">Theme Color</span>
          <div className="flex items-center gap-3">
            <div
              className="h-12 w-12 rounded-lg border-2 border-gray-700 shrink-0 shadow-inner"
              style={{ background: defaultThemeColor ?? "#0070F3" }}
            />
            <input
              className="flex-1 px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
              defaultValue={defaultThemeColor ?? ""}
              placeholder="#0070F3"
            />
          </div>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm text-gray-300 font-medium">CTA Copy</span>
          <input
            className="px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
            defaultValue={defaultCtaCopy ?? ""}
            placeholder="Prompt users to start the tour"
          />
        </label>
      </div>

      {/* Steps Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-100">Steps</h3>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-sm text-gray-300 hover:bg-gray-800 hover:border-gray-600 transition-all">
            <Plus className="w-4 h-4" />
            Add Step
          </button>
        </div>

        {hasSteps ? (
          <div className="space-y-3">
            {steps.map((step, index) => (
              <motion.div
                key={step.order}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-xl border border-gray-700 bg-gray-800/40 px-4 py-4 hover:border-gray-600 hover:bg-gray-800/60 transition-all"
              >
                <div className="flex items-start gap-3 flex-1">
                  <div className="h-9 w-9 rounded-full bg-linear-to-br from-blue-600 to-blue-500 flex items-center justify-center font-semibold text-white shadow-lg shadow-blue-500/20 shrink-0">
                    {step.order}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-100 mb-1">{step.text}</p>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-400">
                      <span className="px-2 py-0.5 rounded bg-gray-700/50 border border-gray-700">
                        Target: {step.target}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-gray-700/50 border border-gray-700">
                        Position: {step.position}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-700 bg-gray-800/50 text-sm text-gray-300 hover:bg-gray-800 hover:border-gray-600 transition-all">
                    <Edit3 className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-700 bg-gray-800/50 text-sm text-gray-300 hover:bg-gray-800 hover:border-gray-600 transition-all">
                    <Eye className="w-3.5 h-3.5" />
                    Preview
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-700 bg-gray-800/30 px-4 py-8 text-center">
            <Plus className="w-10 h-10 text-gray-600 mx-auto mb-2" />
            <p className="text-sm text-gray-400">
              No steps yet. Add at least 5 steps to launch your first tour.
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-800">
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-linear-to-r from-blue-600 to-blue-500 text-white font-semibold hover:from-blue-500 hover:to-blue-400 transition-all duration-300 shadow-lg shadow-blue-500/20">
          <Save className="w-4 h-4" />
          Save Tour
        </button>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-700 bg-gray-800/50 text-gray-300 hover:bg-gray-800 hover:border-gray-600 transition-all">
          <Code2 className="w-4 h-4" />
          Get Embed Code
        </button>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-700 bg-gray-800/50 text-gray-300 hover:bg-gray-800 hover:border-gray-600 transition-all">
          <Rocket className="w-4 h-4" />
          Launch Draft
        </button>
      </div>
    </div>
  );
}