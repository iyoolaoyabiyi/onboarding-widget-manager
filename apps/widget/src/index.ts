import { TourManager } from './core/tourManager';
import type { TourConfig, TourStep } from './types/types';

// Auto-initialize on DOM ready if data-tour-id is present
document.addEventListener('DOMContentLoaded', () => {
  TourManager.initialize().catch((error) => {
    console.error('Failed to initialize tour:', error);
    TourManager.cleanup();
  });
});

// Public API exports for UMD build
export { TourManager };
export type { TourConfig, TourStep };

// Global namespace API for script tag usage
declare global {
  interface Window {
    OnboardingTour: {
      init: (config?: TourConfig) => Promise<void>;
      next: () => void;
      back: () => void;
      skip: () => void;
      stop: () => void;
    };
  }
}

window.OnboardingTour = {
  init: (config?: TourConfig) => TourManager.initialize(config),
  next: () => TourManager.next(),
  back: () => TourManager.back(),
  skip: () => TourManager.skip(),
  stop: () => TourManager.cleanup(),
};
