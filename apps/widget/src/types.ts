/**
 * Core type definitions for the onboarding widget
 */

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

export interface TourStep {
  id: string;
  order: number;
  target_element: string; // CSS Selector (e.g., '#signup-btn')
  title: string;
  content: string;
  position: TooltipPosition;
}

export interface TourConfig {
  id: string;
  steps: TourStep[];
  theme_color: string;
  name?: string;
  owner_id?: string;
  base_url?: string;
  created_at?: string;
  avatar_enabled?: boolean;
}

export type AnalyticsAction = 'started' | 'completed' | 'skipped' | 'tour_finished';

export interface AnalyticsEvent {
  tour_id: string;
  step_id?: string;
  action: AnalyticsAction;
  timestamp: string;
}
