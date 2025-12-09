import type { TourConfig } from './types';
import { StyleManager } from './styleManager';
import { ConfigLoader } from './configLoader';
import { TourRenderer } from './tourRenderer';
import { AvatarAssistant } from './avatar';

/**
 * Main tour manager - orchestrates the entire tour flow
 */
export class TourManager {
  private static renderer: TourRenderer | null = null;

  static async initialize(config?: TourConfig): Promise<void> {
    try {
      // Get tour ID from script tag
      const tourId = ConfigLoader.getTourIdFromScript();

      // Load configuration
      const tourConfig = config || (tourId ? await ConfigLoader.loadTourConfig(tourId) : null);

      if (!tourConfig) {
        console.error(
          "No tour configuration provided and no 'data-tour-id' found in script tag."
        );
        return;
      }

      // Validate configuration
      if (!ConfigLoader.validateConfig(tourConfig)) {
        return;
      }

      // Prevent rerun if already completed
      if (this.hasCompleted(tourConfig.id)) {
        console.log(`Tour ${tourConfig.id} already completed. Skipping playback.`);
        return;
      }

      // Load styles after we know the theme and that we need to run
      StyleManager.ensureStyles(tourConfig.theme_color);

      // Create renderer and start tour
      this.renderer = new TourRenderer(tourConfig, () => {
        this.markCompleted(tourConfig.id);
        this.cleanup();
      });
      this.renderer.setupEventListeners();
      this.renderer.renderStep(this.renderer.getCurrentStepIndex());

      // Optional avatar (minimal Three.js sphere)
      if (tourConfig.avatar_enabled) {
        AvatarAssistant.mount();
      }

      console.log(`Tour initialized: ${tourConfig.name || tourConfig.id}`);
    } catch (error) {
      console.error('Failed to initialize tour:', error);
      this.cleanup();
    }
  }

  static next(): void {
    if (this.renderer) {
      this.renderer.nextStep();
    }
  }

  static back(): void {
    if (this.renderer) {
      this.renderer.previousStep();
    }
  }

  static skip(): void {
    if (this.renderer) {
      this.renderer.skip();
      this.renderer = null;
    }
    AvatarAssistant.destroy();
    StyleManager.cleanup();
  }

  static cleanup(): void {
    if (this.renderer) {
      this.renderer.destroy();
      this.renderer = null;
    }
    AvatarAssistant.destroy();
    StyleManager.cleanup();
  }

  static getRenderer(): TourRenderer | null {
    return this.renderer;
  }

  static isActive(): boolean {
    return this.renderer !== null;
  }

  private static completionKey(tourId: string): string {
    return `onboarding_tour_${tourId}_completed`;
  }

  private static hasCompleted(tourId: string): boolean {
    try {
      return localStorage.getItem(this.completionKey(tourId)) === 'true';
    } catch (err) {
      console.warn('Unable to read completion state:', err);
      return false;
    }
  }

  private static markCompleted(tourId: string): void {
    try {
      localStorage.setItem(this.completionKey(tourId), 'true');
    } catch (err) {
      console.warn('Unable to persist completion state:', err);
    }
  }
}
