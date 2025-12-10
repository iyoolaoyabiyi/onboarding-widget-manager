"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { FirestoreService } from "@/lib/firestore";

type TourStep = {
  order: number;
  target_element: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  title: string;
  content: string;
  cta_text?: string;
  cta_url?: string;
};

const positionOptions: Array<'top' | 'bottom' | 'left' | 'right' | 'center'> = ['top', 'bottom', 'left', 'right', 'center'];

export default function CreateTourPage() {
  const router = useRouter();
  const [tourName, setTourName] = useState("");
  const [description, setDescription] = useState("");
  const [allowedDomains, setAllowedDomains] = useState("localhost");
  const [theme, setTheme] = useState<"greyscale" | "blue" | "green" | "red">("blue");
  const [avatarEnabled, setAvatarEnabled] = useState(false);
  const [steps, setSteps] = useState<TourStep[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSave = tourName.trim() && allowedDomains.trim() && steps.length >= 5;

  const handleAddStep = () => {
    if (steps.length >= 10) {
      alert("Maximum 10 steps allowed");
      return;
    }

    const newStep: TourStep = {
      order: steps.length + 1,
      target_element: "#element-id",
      position: "bottom",
      title: `Step ${steps.length + 1}`,
      content: "Add description for this step",
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

  const handleUpdateStep = (index: number, field: keyof TourStep, value: string) => {
    const updated = [...steps];
    updated[index] = { ...updated[index], [field]: value };
    setSteps(updated);
  };

  const handleSave = async () => {
    if (!canSave) return;

    setSaving(true);
    setError(null);

    try {
      const now = new Date().toISOString();
      const domains = allowedDomains.split(',').map(d => d.trim()).filter(Boolean);
      
      const tourId = `tour_${Date.now()}`;
      
      const tourConfig = {
        id: tourId,
        name: tourName,
        ...(description && { description }), // Only add if not empty
        theme: theme,
        allowed_domains: domains,
        owner_id: '', // Will be set by FirestoreService
        status: 'draft' as const,
        avatar_enabled: avatarEnabled,
        min_steps: 5,
        total_views: 0,
        total_completions: 0,
        completion_rate: 0,
        steps: steps.map(step => ({
          id: `${tourId}_step_${step.order}`,
          tour_id: tourId,
          order: step.order,
          target_element: step.target_element,
          position: step.position,
          title: step.title,
          content: step.content,
          ...(step.cta_text && { cta_text: step.cta_text }),
          ...(step.cta_url && { cta_url: step.cta_url }),
          created_at: now,
          updated_at: now,
        })),
        created_at: now,
        updated_at: now,
      };

      await FirestoreService.createTour(tourConfig);
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create tour';
      setError(message);
      console.error('Error creating tour:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[radial-gradient(circle_at_20%_20%,#1a1a1a_0%,#0a0a0a_50%)] text-white">
        <div className="max-w-5xl mx-auto px-6 py-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Create New Tour</h1>
              <p className="text-gray-400 mt-2">Build an onboarding experience for your users</p>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
              {error}
            </div>
          )}

          <div className="space-y-8">
            {/* Basic Info */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-6">
              <h2 className="text-xl font-semibold">Basic Information</h2>
              
              <label className="flex flex-col gap-2">
                <span className="text-sm text-gray-300">Tour Name *</span>
                <input
                  className="px-4 py-3 rounded-lg bg-black/30 border border-white/10 focus:outline-none focus:border-white/30 transition-colors text-white"
                  value={tourName}
                  onChange={(e) => setTourName(e.target.value)}
                  placeholder="My App Onboarding"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm text-gray-300">Description</span>
                <textarea
                  className="px-4 py-3 rounded-lg bg-black/30 border border-white/10 focus:outline-none focus:border-white/30 transition-colors text-white resize-none"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="A guided tour to help new users get started..."
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm text-gray-300">Allowed Domains * (comma-separated)</span>
                <input
                  className="px-4 py-3 rounded-lg bg-black/30 border border-white/10 focus:outline-none focus:border-white/30 transition-colors text-white"
                  value={allowedDomains}
                  onChange={(e) => setAllowedDomains(e.target.value)}
                  placeholder="localhost, example.com, *.myapp.com"
                />
                <p className="text-xs text-gray-400">
                  Specify domains where this tour can run. Use * for wildcards (e.g., *.example.com)
                </p>
              </label>

              <div className="grid md:grid-cols-2 gap-6">
                <label className="flex flex-col gap-2">
                  <span className="text-sm text-gray-300">Theme</span>
                  <select
                    className="px-4 py-3 rounded-lg bg-black/30 border border-white/10 focus:outline-none focus:border-white/30 transition-colors text-white"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value as typeof theme)}
                  >
                    <option value="greyscale">Greyscale</option>
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                    <option value="red">Red</option>
                  </select>
                </label>

                <label className="flex items-center gap-3 pt-8">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded bg-black/30 border border-white/10"
                    checked={avatarEnabled}
                    onChange={(e) => setAvatarEnabled(e.target.checked)}
                  />
                  <span className="text-sm text-gray-300">Enable Avatar (experimental)</span>
                </label>
              </div>
            </div>

            {/* Steps */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Tour Steps</h2>
                  <p className="text-sm text-gray-400 mt-1">
                    Add at least 5 steps ({steps.length}/5 minimum, max 10)
                  </p>
                </div>
                <button
                  className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors disabled:opacity-50"
                  onClick={handleAddStep}
                  disabled={steps.length >= 10}
                >
                  + Add Step
                </button>
              </div>

              {steps.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/15 bg-black/20 p-8 text-center text-gray-400">
                  No steps yet. Click &quot;Add Step&quot; to create your first tour step.
                </div>
              ) : (
                <div className="space-y-4">
                  {steps.map((step, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-white/10 bg-black/30 p-4 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center font-semibold text-sm">
                            {step.order}
                          </div>
                          <span className="text-sm font-medium">Step {step.order}</span>
                        </div>
                        <button
                          className="text-xs px-3 py-1.5 rounded border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
                          onClick={() => handleRemoveStep(index)}
                        >
                          Remove
                        </button>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <label className="flex flex-col gap-2">
                          <span className="text-xs text-gray-400">Target Element (CSS Selector)</span>
                          <input
                            className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 focus:outline-none focus:border-white/30 text-sm transition-colors text-white"
                            value={step.target_element}
                            onChange={(e) => handleUpdateStep(index, "target_element", e.target.value)}
                            placeholder="#button-id or .class-name"
                          />
                        </label>

                        <label className="flex flex-col gap-2">
                          <span className="text-xs text-gray-400">Position</span>
                          <select
                            className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 focus:outline-none focus:border-white/30 text-sm transition-colors text-white"
                            value={step.position}
                            onChange={(e) => handleUpdateStep(index, "position", e.target.value)}
                          >
                            {positionOptions.map((pos) => (
                              <option key={pos} value={pos}>{pos.charAt(0).toUpperCase() + pos.slice(1)}</option>
                            ))}
                          </select>
                        </label>

                        <label className="flex flex-col gap-2">
                          <span className="text-xs text-gray-400">Title</span>
                          <input
                            className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 focus:outline-none focus:border-white/30 text-sm transition-colors text-white"
                            value={step.title}
                            onChange={(e) => handleUpdateStep(index, "title", e.target.value)}
                            placeholder="Welcome to the dashboard"
                          />
                        </label>

                        <label className="flex flex-col gap-2">
                          <span className="text-xs text-gray-400">CTA Text (optional)</span>
                          <input
                            className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 focus:outline-none focus:border-white/30 text-sm transition-colors text-white"
                            value={step.cta_text || ''}
                            onChange={(e) => handleUpdateStep(index, "cta_text", e.target.value)}
                            placeholder="Learn more"
                          />
                        </label>
                      </div>

                      <label className="flex flex-col gap-2">
                        <span className="text-xs text-gray-400">Content</span>
                        <textarea
                          className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 focus:outline-none focus:border-white/30 text-sm transition-colors text-white resize-none"
                          rows={2}
                          value={step.content}
                          onChange={(e) => handleUpdateStep(index, "content", e.target.value)}
                          placeholder="This is where you can find important information..."
                        />
                      </label>

                      {step.cta_text && (
                        <label className="flex flex-col gap-2">
                          <span className="text-xs text-gray-400">CTA URL</span>
                          <input
                            className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 focus:outline-none focus:border-white/30 text-sm transition-colors text-white"
                            value={step.cta_url || ''}
                            onChange={(e) => handleUpdateStep(index, "cta_url", e.target.value)}
                            placeholder="https://docs.example.com"
                          />
                        </label>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-4 pt-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="px-6 py-3 rounded-lg border border-white/10 hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!canSave || saving}
                className="px-8 py-3 rounded-lg bg-white text-black font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Creating...' : 'Create Tour'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
