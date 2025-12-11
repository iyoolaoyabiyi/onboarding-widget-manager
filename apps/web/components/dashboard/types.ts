export type Tour = {
  id: string;
  name: string;
  description?: string;
  allowed_domains: string[];
  steps: number;
  completion: number;
  status: 'draft' | 'active' | 'paused' | 'archived';
  updated: string;
  theme: 'greyscale' | 'blue' | 'green' | 'red';
  owner_id: string;
  avatar_enabled: boolean;
  min_steps: number;
  total_views: number;
  total_completions: number;
  completion_rate: number;
  created_at: string;
  updated_at: string;
};

export type Step = {
  order: number;
  target: string;
  text: string;
  position: string;
  content?: string;
  cta_text?: string;
  cta_url?: string;
};

export type Metric = {
  label: string;
  value: number | string;
  suffix?: string;
};

export type DropOffItem = {
  step: number;
  percent: number;
};

export type EventEntry = {
  tour_id: string;
  step: number;
  action: string;
  step_title?: string;
};

export type AnalyticsEvent = {
  event_id: string;
  session_id: string;
  tour_id: string;
  step_id?: string;
  action: 'tour_started' | 'step_viewed' | 'step_completed' | 'step_skipped' | 'tour_completed' | 'tour_abandoned';
  timestamp: string;
  time_on_step_ms?: number;
  interaction?: 'next' | 'back' | 'skip' | 'close';
};

export type AnalyticsSession = {
  session_id: string;
  tour_id: string;
  started_at: string;
  ended_at?: string;
  duration_ms?: number;
  url: string;
  domain: string;
  referrer?: string;
  user_agent: string;
  viewport_width: number;
  viewport_height: number;
  status: 'in_progress' | 'completed' | 'skipped' | 'abandoned';
  steps_viewed: number;
  steps_completed: number;
  completion_rate: number;
  visitor_id?: string;
  updated_at?: string;
};

