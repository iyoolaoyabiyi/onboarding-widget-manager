'use client';

import { useState, useEffect } from 'react';
import { Step } from './types';

interface StepModalProps {
  isOpen: boolean;
  step?: Step | null;
  onClose: () => void;
  onSave: (step: Step) => void;
}

const defaultStep: Step = {
  order: 1,
  text: '',
  target: '',
  position: 'bottom',
};

export default function StepModal({ isOpen, step, onClose, onSave }: StepModalProps) {
  const [formData, setFormData] = useState<Step>(step || defaultStep);

  // When modal opens, update form with step data
  useEffect(() => {
    if (isOpen && step) {
      setFormData(step);
    } else if (isOpen && !step) {
      setFormData(defaultStep);
    }
  }, [isOpen, step]);

  const handleSave = () => {
    if (!formData.text.trim()) {
      alert('Step text is required');
      return;
    }
    if (!formData.target.trim()) {
      alert('Target selector is required');
      return;
    }

    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            {step ? 'Edit Step' : 'New Step'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <label className="flex flex-col gap-2">
            <span className="text-sm text-gray-300">Step Order</span>
            <input
              type="number"
              value={formData.order}
              onChange={(e) =>
                setFormData({ ...formData, order: parseInt(e.target.value) || 1 })
              }
              min="1"
              max="10"
              className="px-4 py-2 rounded-lg bg-black/30 border border-white/10 focus:outline-none focus:border-white/30 text-white"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm text-gray-300">Target Element (CSS Selector) *</span>
            <input
              type="text"
              value={formData.target}
              onChange={(e) =>
                setFormData({ ...formData, target: e.target.value })
              }
              placeholder="e.g., #signup-btn or .start-button"
              className="px-4 py-2 rounded-lg bg-black/30 border border-white/10 focus:outline-none focus:border-white/30 text-white text-sm"
            />
            <p className="text-xs text-gray-400">
              CSS selector to highlight on the page
            </p>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm text-gray-300">Title *</span>
            <input
              type="text"
              value={formData.text}
              onChange={(e) =>
                setFormData({ ...formData, text: e.target.value })
              }
              placeholder="e.g., Click to get started"
              className="px-4 py-2 rounded-lg bg-black/30 border border-white/10 focus:outline-none focus:border-white/30 text-white"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm text-gray-300">Content</span>
            <textarea
              value={formData.content || ''}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              placeholder="Detailed explanation of this step..."
              rows={2}
              className="px-4 py-2 rounded-lg bg-black/30 border border-white/10 focus:outline-none focus:border-white/30 text-white resize-none"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm text-gray-300">Position</span>
            <select
              value={formData.position}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  position: e.target.value,
                })
              }
              className="px-4 py-2 rounded-lg bg-black/30 border border-white/10 focus:outline-none focus:border-white/30 text-white"
            >
              <option value="top">Top</option>
              <option value="bottom">Bottom</option>
              <option value="left">Left</option>
              <option value="right">Right</option>
              <option value="center">Center</option>
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm text-gray-300">CTA Text (optional)</span>
            <input
              type="text"
              value={formData.cta_text || ''}
              onChange={(e) =>
                setFormData({ ...formData, cta_text: e.target.value })
              }
              placeholder="e.g., Learn More"
              className="px-4 py-2 rounded-lg bg-black/30 border border-white/10 focus:outline-none focus:border-white/30 text-white text-sm"
            />
          </label>

          {formData.cta_text && (
            <label className="flex flex-col gap-2">
              <span className="text-sm text-gray-300">CTA URL</span>
              <input
                type="url"
                value={formData.cta_url || ''}
                onChange={(e) =>
                  setFormData({ ...formData, cta_url: e.target.value })
                }
                placeholder="https://example.com"
                className="px-4 py-2 rounded-lg bg-black/30 border border-white/10 focus:outline-none focus:border-white/30 text-white text-sm"
              />
            </label>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg border border-white/10 text-gray-300 hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 rounded-lg bg-white text-black font-semibold hover:opacity-90 transition-colors"
          >
            Save Step
          </button>
        </div>
      </div>
    </div>
  );
}
