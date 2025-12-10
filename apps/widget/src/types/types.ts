/**
 * Core type definitions for the onboarding widget
 */

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right' | 'center';
export type ThemeName = 'greyscale' | 'blue' | 'green' | 'red';
export type TourStatus = 'draft' | 'active' | 'paused' | 'archived';

export interface TourStep {
  id: string;
  tour_id?: string;
  order: number;
  
  // Targeting
  target_element: string; // CSS Selector (e.g., '#signup-btn')
  position: TooltipPosition;
  
  // Content
  title: string;
  content: string;
  image_url?: string;
  video_url?: string;
  
  // CTA
  cta_text?: string;
  cta_url?: string;
  
  // Metadata
  created_at?: string;
  updated_at?: string;
}

export interface TourConfig {
  id: string;
  name: string;
  description?: string;
  
  // Theme and validation
  theme: ThemeName;                          // Named theme instead of hex color
  allowed_domains: string[];                 // Domain whitelist for security
  
  // Owner and status
  owner_id: string;
  status: TourStatus;
  
  // Configuration
  avatar_enabled: boolean;
  min_steps: number;
  
  // Steps
  steps: TourStep[];
  
  // Statistics (denormalized for quick reads)
  total_views: number;
  total_completions: number;
  completion_rate: number;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  last_viewed_at?: string;
}

export type AnalyticsAction = 'tour_started' 
                            | 'step_viewed' 
                            | 'step_completed' 
                            | 'step_skipped' 
                            | 'tour_completed' 
                            | 'tour_abandoned';

export interface AnalyticsEvent {
  event_id: string;
  session_id: string;
  tour_id: string;
  step_id?: string;
  
  // Event details
  action: AnalyticsAction;
  timestamp: string;
  
  // Context
  time_on_step_ms?: number;
  interaction?: 'next' | 'back' | 'skip' | 'close';
}

export type AnalyticsSessionStatus = 'in_progress' | 'completed' | 'skipped' | 'abandoned';

export interface AnalyticsSession {
  session_id: string;
  tour_id: string;
  
  // Timeline
  started_at: string;
  ended_at?: string;
  duration_ms?: number;
  
  // Context
  url: string;
  domain: string;
  referrer?: string;
  user_agent: string;
  viewport_width: number;
  viewport_height: number;
  
  // Outcome
  status: AnalyticsSessionStatus;
  steps_viewed: number;
  steps_completed: number;
  completion_rate: number;
  
  // Anonymous tracking
  visitor_id?: string;
}
