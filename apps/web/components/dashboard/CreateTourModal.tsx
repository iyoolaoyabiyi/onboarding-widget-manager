'use client';

import { useState } from "react";
import { Step, Tour } from "./types";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (data: { tour: Tour; steps: Step[] }) => void;
};

const positionOptions = ["Top", "Bottom", "Left", "Right"];

export default function CreateTourModal({ open, onClose, onSave }: Props) {
  const [tourName, setTourName] = useState("");
  const [allowedDomains, setAllowedDomains] = useState("");
  const [theme, setTheme] = useState<"greyscale" | "blue" | "green" | "red">("blue");
  const [ctaCopy, setCtaCopy] = useState("Take a quick tour?");
  const [steps, setSteps] = useState<Step[]>([]);

  if (!open) return null;

  const canSave = tourName.trim() && allowedDomains.trim() && steps.length >= 5;

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

    const now = new Date().toISOString();
    const domains = allowedDomains.split(',').map(d => d.trim()).filter(Boolean);
    
    const newTour: Tour = {
      id: `tour_${Date.now()}`,
      name: tourName,
      description: ctaCopy,
      allowed_domains: domains,
      steps: steps.length,
      completion: 0,
      status: "draft",
      updated: "Just now",
      theme: theme,
      owner_id: "", // Will be set by Firestore service
      avatar_enabled: false,
      min_steps: 5,
      total_views: 0,
      total_completions: 0,
      completion_rate: 0,
      created_at: now,
      updated_at: now,
    };

    onSave({ tour: newTour, steps });
    
    // Reset form
    setTourName("");
    setAllowedDomains("");
    setTheme("blue");
    setCtaCopy("Take a quick tour?");
    setSteps([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-8 overflow-y-auto">
      <div className="w-full max-w-4xl rounded-2xl border border-white/10 bg-[#0f0f0f] p-6 shadow-2xl space-y-6 my-auto">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400">New tour</p>
            <h3 className="text-2xl font-semibold">Create your onboarding tour</h3>
          </div>
          <button
            className="text-sm px-3 py-2 rounded-lg border border-white/15 hover:bg-white/5 transition-colors"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-sm text-gray-300">Tour Name</span>
            <input
              className="px-4 py-3 rounded-lg bg-black/30 border border-white/10 focus:outline-none focus:border-white/30 transition-colors"
              value={tourName}
              onChange={(e) => setTourName(e.target.value)}
              placeholder="Name your tour"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm text-gray-300">Allowed Domains (comma-separated)</span>
            <input
              className="px-4 py-3 rounded-lg bg-black/30 border border-white/10 focus:outline-none focus:border-white/30 transition-colors"
              value={allowedDomains}
              onChange={(e) => setAllowedDomains(e.target.value)}
              placeholder="localhost, example.com, *.myapp.com"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm text-gray-300">Theme</span>
            <select
              className="px-4 py-3 rounded-lg bg-black/30 border border-white/10 focus:outline-none focus:border-white/30 transition-colors text-white"
              value={theme}
              onChange={(e) => setTheme(e.target.value as "greyscale" | "blue" | "green" | "red")}
            >
              <option value="greyscale">Greyscale</option>
              <option value="blue">Blue</option>
              <option value="green">Green</option>
              <option value="red">Red</option>
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm text-gray-300">CTA Copy</span>
            <input
              className="px-4 py-3 rounded-lg bg-black/30 border border-white/10 focus:outline-none focus:border-white/30 transition-colors"
              value={ctaCopy}
              onChange={(e) => setCtaCopy(e.target.value)}
              placeholder="Prompt users to start the tour"
            />
          </label>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">Steps</h3>
              <p className="text-sm text-gray-400">
                Add at least 5 steps to create your tour ({steps.length}/5 minimum)
              </p>
            </div>
            <button
              className="px-4 py-2 rounded-lg border border-white/15 text-sm hover:bg-white/5 transition-colors"
              onClick={handleAddStep}
            >
              + Add Step
            </button>
          </div>

          {steps.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/15 bg-black/20 px-4 py-6 text-sm text-gray-400 text-center">
              No steps yet. Click &quot;+ Add Step&quot; to begin creating your tour steps.
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-white/10 bg-black/30 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center font-semibold text-sm">
                        {step.order}
                      </div>
                      <span className="text-sm font-medium">Step {step.order}</span>
                    </div>
                    {steps.length > 0 && (
                      <button
                        className="text-xs px-2 py-1 rounded border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
                        onClick={() => handleRemoveStep(index)}
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-3">
                    <label className="flex flex-col gap-1">
                      <span className="text-xs text-gray-400">Target Element</span>
                      <input
                        className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 focus:outline-none focus:border-white/30 text-sm transition-colors"
                        value={step.target}
                        onChange={(e) => handleUpdateStep(index, "target", e.target.value)}
                        placeholder="#nav-logo"
                      />
                    </label>

                    <label className="flex flex-col gap-1">
                      <span className="text-xs text-gray-400">Position</span>
                      <select
                        className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 focus:outline-none focus:border-white/30 text-sm transition-colors"
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

                  <label className="flex flex-col gap-1">
                    <span className="text-xs text-gray-400">Step Text</span>
                    <textarea
                      className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 focus:outline-none focus:border-white/30 text-sm transition-colors resize-none"
                      value={step.text}
                      onChange={(e) => handleUpdateStep(index, "text", e.target.value)}
                      placeholder="Welcome to the app!"
                      rows={2}
                    />
                  </label>
                </div>
              ))}
            </div>
          )}

          {steps.length > 0 && steps.length < 5 && (
            <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-400">
              ⚠️ You need at least 5 steps to create a tour. Add {5 - steps.length} more step{5 - steps.length !== 1 ? 's' : ''}.
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
          <button
            className="px-4 py-2 rounded-lg border border-white/15 hover:bg-white/5 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={`px-5 py-2 rounded-lg font-semibold transition-opacity ${
              canSave
                ? "bg-white text-black hover:opacity-90"
                : "bg-white/20 text-white/50 cursor-not-allowed"
            }`}
            onClick={handleSave}
            disabled={!canSave}
          >
            Save & Continue
          </button>
        </div>
      </div>
    </div>
  );
}