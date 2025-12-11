'use client';

import { useState, useEffect } from 'react';
import { Step, Tour } from './types';
import DomainManager from './DomainManager';

// Theme definitions matching widget
const THEMES = {
  greyscale: { bg: '#1a1a1a', name: 'Greyscale' },
  blue: { bg: '#1e3a8a', name: 'Blue' },
  green: { bg: '#14532d', name: 'Green' },
  red: { bg: '#7f1d1d', name: 'Red' },
} as const;

type ThemeName = keyof typeof THEMES;

interface TourEditorProps {
  tour?: Tour | null;
  steps: Step[];
  onSaveConfig: (tour: Partial<Tour>) => Promise<void>;
  onSaveDomains: (domains: string[]) => Promise<void>;
  onAddStep: () => void;
  onEditStep: (order: number) => void;
  onDeleteStep: (order: number) => void;
}

export default function TourEditor({ tour, steps, onSaveConfig, onSaveDomains, onAddStep, onEditStep, onDeleteStep }: TourEditorProps) {
  const [formData, setFormData] = useState({
    name: tour?.name || '',
    description: tour?.description || '',
    theme: (tour?.theme as ThemeName) || 'blue',
    avatar_enabled: tour?.avatar_enabled || false,
    allowed_domains: tour?.allowed_domains || [],
    status: tour?.status || 'draft',
  });

  const [configSaving, setConfigSaving] = useState(false);
  const [configSaved, setConfigSaved] = useState(false);
  const [domainSaving, setDomainSaving] = useState(false);
  const [domainSaved, setDomainSaved] = useState(false);

  // Sync form data when tour changes
  useEffect(() => {
    setFormData({
      name: tour?.name || '',
      description: tour?.description || '',
      theme: (tour?.theme as ThemeName) || 'blue',
      avatar_enabled: tour?.avatar_enabled || false,
      allowed_domains: tour?.allowed_domains || [],
      status: tour?.status || 'draft',
    });
    // Reset save states when switching tours
    setConfigSaved(false);
    setDomainSaved(false);
  }, 
  [
    tour?.id, tour?.name, tour?.description, tour?.theme, tour?.avatar_enabled, 
    tour?.allowed_domains, tour?.status
  ]);

  const handleSaveConfig = async () => {
    if (!formData.name.trim()) {
      alert('Tour name is required');
      return;
    }

    setConfigSaving(true);
    try {
      await onSaveConfig({
        name: formData.name,
        description: formData.description,
        theme: formData.theme,
        avatar_enabled: formData.avatar_enabled,
        status: formData.status,
      });
      setConfigSaved(true);
      setTimeout(() => setConfigSaved(false), 2000);
    } catch (error) {
      alert('Failed to save configuration: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setConfigSaving(false);
    }
  };

  const handleSaveDomains = async () => {
    if (formData.allowed_domains.length === 0) {
      alert('At least one domain is required');
      return;
    }

    setDomainSaving(true);
    try {
      await onSaveDomains(formData.allowed_domains);
      setDomainSaved(true);
      setTimeout(() => setDomainSaved(false), 2000);
    } catch (error) {
      alert('Failed to save domains: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setDomainSaving(false);
    }
  };

  const hasSteps = steps.length >= 5;

  return (
    <div className="space-y-6">
      <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-6 space-y-6" id='tour-editor-header'>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Tour Configuration</h2>
            <p className="text-gray-400 text-sm">Set up your tour properties and settings.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs border ${hasSteps ? 'bg-green-500/20 border-green-500/50 text-green-300' : 'bg-white/5 border-white/10'}`}>
              {steps.length}/5 steps
            </span>
            <button
              onClick={handleSaveConfig}
              disabled={configSaving}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                configSaved
                  ? 'bg-green-500 text-black'
                  : configSaving
                    ? 'bg-white/50 text-black/50'
                    : 'bg-white text-black hover:opacity-90'
              }`}
            >
              {configSaved ? '✓ Saved' : configSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <label className="flex flex-col gap-2" id='tour-name-input'>
              <span className="text-sm text-gray-300">Tour Name *</span>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="px-4 py-3 rounded-lg bg-black/30 border border-white/10 focus:outline-none focus:border-white/30"
                placeholder="My Onboarding Tour"
              />
            </label>

            <label className="flex flex-col gap-2" id='tour-status-input'>
              <span className="text-sm text-gray-300">Status</span>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'active' | 'paused' | 'archived' })}
                className="px-4 py-3 rounded-lg bg-black/30 border border-white/10 focus:outline-none focus:border-white/30 text-white"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="archived">Archived</option>
              </select>
            </label>
          </div>

          <label className="flex flex-col gap-2" id='tour-desc-input'>
            <span className="text-sm text-gray-300">Description</span>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="px-4 py-3 rounded-lg bg-black/30 border border-white/10 focus:outline-none focus:border-white/30 resize-none"
              placeholder="Describe what users will learn in this tour..."
              rows={3}
            />
          </label>

          {/* Theme & Avatar */}
          <div className="space-y-4" id='other-tour-settings'>
            <label className="flex flex-col gap-2">
              <span className="text-sm text-gray-300">Theme</span>
              <div className="flex items-center gap-3">
                <select
                  value={formData.theme}
                  onChange={(e) => setFormData({ ...formData, theme: e.target.value as ThemeName })}
                  className="flex-1 px-4 py-3 rounded-lg bg-black/30 border border-white/10 focus:outline-none focus:border-white/30 text-white"
                >
                  {(Object.entries(THEMES) as Array<[ThemeName, typeof THEMES[ThemeName]]>).map(
                    ([key, { name }]) => (
                      <option key={key} value={key} className="bg-black text-white">
                        {name}
                      </option>
                    )
                  )}
                </select>
                <div
                  className="h-10 w-10 rounded-lg border border-white/10 shrink-0"
                  style={{ backgroundColor: THEMES[formData.theme].bg }}
                  title={THEMES[formData.theme].name}
                />
              </div>
            </label>

            {/* Avatar Toggle */}
            <div className="flex items-center justify-between bg-black/30 border border-white/10 rounded-lg px-4 py-3">
              <span className="text-sm text-gray-300">Show avatar assistant</span>
              <button
                onClick={() => setFormData({ ...formData, avatar_enabled: !formData.avatar_enabled })}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                  formData.avatar_enabled ? 'bg-blue-600' : 'bg-white/20'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    formData.avatar_enabled ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Domain Management */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <DomainManager
          domains={formData.allowed_domains}
          onDomainsChange={(domains) => setFormData({ ...formData, allowed_domains: domains })}
          onSave={handleSaveDomains}
          isSaving={domainSaving}
          isSaved={domainSaved}
        />
      </div>

      {/* Steps Section */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Tour Steps ({steps.length}/5)</h3>
          <button
            onClick={onAddStep}
            className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/5 text-sm font-medium"
          >
            + Add Step
          </button>
        </div>

        {steps.length > 0 ? (
          <div className="space-y-3">
            {steps.map((step) => (
              <div
                key={step.order}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 rounded-xl border border-white/10 bg-black/30 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center font-semibold text-sm">
                    {step.order}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{step.text}</p>
                    <p className="text-xs text-gray-400">
                      Target: {step.target} • Position: {step.position}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEditStep(step.order)}
                    className="px-3 py-1 rounded-lg border border-white/15 text-xs hover:bg-white/5"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDeleteStep(step.order)}
                    className="px-3 py-1 rounded-lg border border-white/15 text-xs hover:bg-white/5 text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-white/15 bg-black/20 px-4 py-6 text-center text-sm text-gray-400">
            No steps yet. Add at least 5 steps before deploying your tour.
          </div>
        )}
      </div>


    </div>
  );
}
