import type { TourConfig, ThemeName } from '../types/types';

export const STYLE_ID = 'onboarding-tour-styles';
export const TOOLTIP_CLASS = 'onboarding-tour-tooltip';
export const HIGHLIGHT_CLASS = 'tour-highlighted-element';
export const ACTIONS_CLASS = 'onboarding-tour-actions';

// Valid theme names
export const VALID_THEMES: ThemeName[] = ['greyscale', 'blue', 'green', 'red'];
export const VALID_STATUSES = ['draft', 'active', 'paused', 'archived'];

// Theme color definitions
export const THEME_DEFINITIONS: Record<ThemeName, {
  background: string;
  text: string;
  textSecondary: string;
  border: string;
  accent: string;
  highlight: string;
}> = {
  greyscale: {
    background: '#1a1a1a',
    text: '#ffffff',
    textSecondary: '#a0a0a0',
    border: '#333333',
    accent: '#666666',
    highlight: '#ffffff',
  },
  blue: {
    background: '#1e3a8a',
    text: '#ffffff',
    textSecondary: '#bfdbfe',
    border: '#3b82f6',
    accent: '#60a5fa',
    highlight: '#dbeafe',
  },
  green: {
    background: '#14532d',
    text: '#ffffff',
    textSecondary: '#bbf7d0',
    border: '#22c55e',
    accent: '#4ade80',
    highlight: '#dcfce7',
  },
  red: {
    background: '#7f1d1d',
    text: '#ffffff',
    textSecondary: '#fecaca',
    border: '#ef4444',
    accent: '#f87171',
    highlight: '#fee2e2',
  },
};

export const DEFAULT_TOUR_CONFIG: TourConfig = {
  id: 'tour_12345',
  name: 'New User Onboarding',
  description: 'Onboard new users to your product',
  owner_id: 'user_demo',
  allowed_domains: ['localhost', 'example.com'],
  theme: 'blue',
  status: 'active',
  avatar_enabled: false,
  min_steps: 5,
  total_views: 0,
  total_completions: 0,
  completion_rate: 0,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  steps: [
    {
      id: 'step_01',
      order: 1,
      target_element: '#signup-btn',
      title: 'Start here',
      content: 'Click to create your first tour.',
      position: 'bottom',
    },
    {
      id: 'step_02',
      order: 2,
      target_element: '#dashboard-header',
      title: 'Dashboard overview',
      content: 'We anchor to headers as well.',
      position: 'right',
    },
    {
      id: 'step_03',
      order: 3,
      target_element: '#stat-activation',
      title: 'Metrics',
      content: 'Explain why each card matters.',
      position: 'top',
    },
    {
      id: 'step_04',
      order: 4,
      target_element: '#analytics-card',
      title: 'Analytics block',
      content: 'Shows events we will later collect.',
      position: 'left',
    },
    {
      id: 'step_05',
      order: 5,
      target_element: '#support-card',
      title: 'Help entry',
      content: 'Link your docs or chat widget. This is the last step!',
      position: 'top',
    },
  ],
};

export const TOOLTIP_PADDING = 10;
export const HIGH_Z_INDEX = 2147483646;
export const HIGHEST_Z_INDEX = 2147483647;
