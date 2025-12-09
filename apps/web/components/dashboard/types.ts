export type Tour = {
  id: string;
  name: string;
  baseUrl: string;
  steps: number;
  completion: number;
  status: string;
  updated: string;
  color: string;
};

export type Step = {
  order: number;
  target: string;
  text: string;
  position: string;
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

