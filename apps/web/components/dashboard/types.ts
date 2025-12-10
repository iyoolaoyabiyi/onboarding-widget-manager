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
};

