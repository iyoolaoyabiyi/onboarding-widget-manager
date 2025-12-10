'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2, AlertCircle } from "lucide-react";
import { Step, Tour } from "./types";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (data: { tour: Tour; steps: Step[] }) => void;
};

const positionOptions = ["Top", "Bottom", "Left", "Right"];

export default function CreateTourModal({ open, onClose, onSave }: Props) {
  const [tourName, setTourName] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [themeColor, setThemeColor] = useState("#0070F3");
  const [ctaCopy, setCtaCopy] = useState("Take a quick tour?");
  const [steps, setSteps] = useState<Step[]>([]);

  const canSave = tourName.trim() && baseUrl.trim() && steps.length >= 5;

  const handleAddStep = () => {
    const newStep: Step = {
      order: steps.length + 1,
      target: "",
      text: "",
      position: "Bottom",
    };
    setSteps([...steps, newStep]);
  };

  const handleRemoveStep = (index: number) => {
    const updated = steps.filter((_, i) => i !== index).map((step, i) => ({
      ...step,
      order: i + 1,
    }));
    setSteps(updated);
  };

  const handleUpdateStep = (index: number, field: keyof Step, value: string) => {
    const updated = [...steps];
    updated[index] = { ...updated[index], [field]: value };
    setSteps(updated);
  };

  const handleSave = () => {
    if (!canSave) return;

    const newTour: Tour = {
      id: `tour_${Date.now()}`,
      name: tourName,
      baseUrl: baseUrl,
      steps: steps.length,
      completion: 0,
      status: "Draft",
      updated: "Just now",
      color: themeColor,
    };

    onSave({ tour: newTour, steps });
    
    // Reset form
    setTourName("");
    setBaseUrl("");
    setThemeColor("#0070F3");
    setCtaCopy("Take a quick tour?");
    setSteps([]);
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 py-8 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-4xl rounded-2xl border border-gray-800 bg-gray-900/95 backdrop-blur-md p-6 shadow-2xl space-y-6 my-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-blue-400 font-medium mb-1">New Tour</p>
                <h3 className="text-2xl font-bold text-gray-100">Create your onboarding tour</h3>
              </div>
              <button
                className="text-gray-400 hover:text-gray-200 transition-colors p-2 hover:bg-gray-800/50 rounded-lg"
                onClick={onClose}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tour Details */}
            <div className="grid md:grid-cols-2 gap-4">
              <label className="flex flex-col gap-2">
                <span className="text-sm text-gray-300 font-medium">Tour Name</span>
                <input
                  className="px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
                  value={tourName}
                  onChange={(e) => setTourName(e.target.value)}
                  placeholder="Name your tour"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm text-gray-300 font-medium">Base URL</span>
                <input
                  className="px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  placeholder="https://your-app.com"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm text-gray-300 font-medium">Theme Color</span>
                <div className="flex items-center gap-3">
                  <div
                    className="h-12 w-12 rounded-lg border-2 border-gray-700 shrink-0 shadow-inner"
                    style={{ background: themeColor }}
                  />
                  <input
                    className="flex-1 px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
                    value={themeColor}
                    onChange={(e) => setThemeColor(e.target.value)}
                    placeholder="#0070F3"
                  />
                </div>
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm text-gray-300 font-medium">CTA Copy</span>
                <input
                  className="px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
                  value={ctaCopy}
                  onChange={(e) => setCtaCopy(e.target.value)}
                  placeholder="Prompt users to start the tour"
                />
              </label>
            </div>

            {/* Steps Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-gray-100">Steps</h3>
                  <p className="text-sm text-gray-400">
                    Add at least 5 steps to create your tour ({steps.length}/5 minimum)
                  </p>
                </div>
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-gray-600 transition-all"
                  onClick={handleAddStep}
                >
                  <Plus className="w-4 h-4" />
                  Add Step
                </button>
              </div>

              {steps.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-700 bg-gray-800/30 px-4 py-8 text-sm text-gray-400 text-center">
                  No steps yet. Click &quot;Add Step&quot; to begin creating your tour steps.
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                  {steps.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="rounded-xl border border-gray-700 bg-gray-800/40 p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-linear-to-br from-blue-600 to-blue-500 flex items-center justify-center font-semibold text-sm text-white shadow-lg shadow-blue-500/20">
                            {step.order}
                          </div>
                          <span className="text-sm font-medium text-gray-200">Step {step.order}</span>
                        </div>
                        {steps.length > 0 && (
                          <button
                            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
                            onClick={() => handleRemoveStep(index)}
                          >
                            <Trash2 className="w-3 h-3" />
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="grid md:grid-cols-2 gap-3">
                        <label className="flex flex-col gap-1.5">
                          <span className="text-xs text-gray-400 font-medium">Target Element</span>
                          <input
                            className="px-3 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 text-sm transition-all"
                            value={step.target}
                            onChange={(e) => handleUpdateStep(index, "target", e.target.value)}
                            placeholder="#nav-logo"
                          />
                        </label>

                        <label className="flex flex-col gap-1.5">
                          <span className="text-xs text-gray-400 font-medium">Position</span>
                          <select
                            className="px-3 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 text-sm transition-all"
                            value={step.position}
                            onChange={(e) => handleUpdateStep(index, "position", e.target.value)}
                          >
                            {positionOptions.map((pos) => (
                              <option key={pos} value={pos}>
                                {pos}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>

                      <label className="flex flex-col gap-1.5">
                        <span className="text-xs text-gray-400 font-medium">Step Text</span>
                        <textarea
                          className="px-3 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 text-sm transition-all resize-none"
                          value={step.text}
                          onChange={(e) => handleUpdateStep(index, "text", e.target.value)}
                          placeholder="Welcome to the app!"
                          rows={2}
                        />
                      </label>
                    </motion.div>
                  ))}
                </div>
              )}

              {steps.length > 0 && steps.length < 5 && (
                <div className="flex items-center gap-3 rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-400">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>You need at least 5 steps to create a tour. Add {5 - steps.length} more step{5 - steps.length !== 1 ? 's' : ''}.</span>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
              <button
                className="px-5 py-2.5 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800/50 hover:border-gray-600 transition-all"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className={`px-6 py-2.5 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                  canSave
                    ? "bg-linear-to-r from-blue-600 to-blue-500 text-white hover:from-blue-500 hover:to-blue-400 shadow-lg shadow-blue-500/20"
                    : "bg-gray-800 text-gray-500 cursor-not-allowed"
                }`}
                onClick={handleSave}
                disabled={!canSave}
              >
                Save & Continue
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}