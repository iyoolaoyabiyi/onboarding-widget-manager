import type { TourConfig } from './types';
import { DEFAULT_TOUR_CONFIG } from './constants';

export class ConfigLoader {
  static async loadTourConfig(tourId: string): Promise<TourConfig> {
    try {
      // Try to fetch from the public directory first (for development/demo)
      const response = await fetch('/mock-tour.json', { cache: 'no-cache' });
      if (response.ok) {
        const config = (await response.json()) as TourConfig;
        console.log(`Loaded tour config: ${config.name || config.id}`);
        return config;
      }
    } catch (error) {
      console.warn('Failed to fetch tour config from mock file:', error);
    }

    // Fall back to default configuration
    console.warn(`Using default tour config. Could not load tour: ${tourId}`);
    return DEFAULT_TOUR_CONFIG;
  }

  static getTourIdFromScript(): string | null {
    const scriptTag = document.querySelector('script[src*="onboarding-tour"]');
    if (scriptTag) {
      return scriptTag.getAttribute('data-tour-id');
    }
    return null;
  }

  static validateConfig(config: TourConfig): boolean {
    if (!config.steps || config.steps.length === 0) {
      console.error('Tour configuration is missing steps.');
      return false;
    }

    if (config.steps.length < 5) {
      console.warn(`Tour only has ${config.steps.length} steps. Minimum recommended is 5.`);
    }

    return true;
  }
}
