import type { TourConfig } from './types';
import { StyleManager } from './styleManager';
import { ConfigLoader } from './configLoader';
import { TourRenderer } from './tourRenderer';

/**
 * Main tour manager - orchestrates the entire tour flow
 */
export class TourManager {
  private static renderer: TourRenderer | null = null;

  static async initialize(config?: TourConfig): Promise<void> {
    try {
      // Load styles first
      StyleManager.ensureStyles(config?.theme_color);

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

      // Create renderer and start tour
      this.renderer = new TourRenderer(tourConfig);
      this.renderer.setupEventListeners();
      this.renderer.renderStep(0);

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
    }
  }

  static cleanup(): void {
    if (this.renderer) {
      this.renderer.destroy();
      this.renderer = null;
    }
    StyleManager.cleanup();
  }

  static getRenderer(): TourRenderer | null {
    return this.renderer;
  }

  static isActive(): boolean {
    return this.renderer !== null;
  }
}
