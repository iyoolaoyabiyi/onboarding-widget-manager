import type { TourConfig } from './types';

export const STYLE_ID = 'onboarding-tour-styles';
export const TOOLTIP_CLASS = 'onboarding-tour-tooltip';
export const HIGHLIGHT_CLASS = 'tour-highlighted-element';
export const ACTIONS_CLASS = 'onboarding-tour-actions';

export const DEFAULT_TOUR_CONFIG: TourConfig = {
  id: 'tour_12345',
  name: 'New User Onboarding',
  theme_color: '#3498db',
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
