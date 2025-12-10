import type { TourConfig } from '../types/types';
import { StyleManager } from '../ui/styleManager';
import { ConfigLoader } from '../config/configLoader';
import { DomainValidator } from '../config/domainValidator';
import { TourRenderer } from './tourRenderer';
import { AvatarAssistant } from '../ui/avatar';
import { Analytics } from '../analytics/analytics';
import { getFirestoreClient } from '../services/firebaseClient';
import { doc, setDoc } from 'firebase/firestore';

/**
 * Main tour manager - orchestrates the entire tour flow
 */
export class TourManager {
  private static renderer: TourRenderer | null = null;
  private static sessionId: string | null = null;

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

      // Validate domain - critical security check
      if (!DomainValidator.validate(tourConfig.id, tourConfig.allowed_domains)) {
        console.error(
          `Tour ${tourConfig.id} is not allowed on this domain. Allowed domains: ${tourConfig.allowed_domains.join(', ')}`
        );
        return;
      }

      // Prevent rerun if already completed
      if (this.hasCompleted(tourConfig.id)) {
        console.log(`Tour ${tourConfig.id} already completed. Skipping playback.`);
        return;
      }

      // Load or create session
      await this.initializeSession(tourConfig.id);

      // Initialize analytics with session
      await Analytics.loadSession(tourConfig.id);

      // Load styles after we know the theme and that we need to run
      StyleManager.ensureStyles(tourConfig.theme);

      // Create renderer and start tour
      this.renderer = new TourRenderer(
        tourConfig,
        async () => {
          try {
            this.markCompleted(tourConfig.id);
            const totalSteps = this.renderer?.getTotalSteps?.() || tourConfig.steps.length;
            await Analytics.finalizeSession(totalSteps).catch((error) => {
              console.warn('Failed to finalize session:', error);
            });
          } finally {
            // Ensure teardown even if analytics fails.
            await this.cleanup();
          }
        },
        async () => {
          try {
            const totalSteps = this.renderer?.getTotalSteps?.() || tourConfig.steps.length;
            await Analytics.finalizeSession(totalSteps).catch((error) => {
              console.warn('Failed to finalize session on skip:', error);
            });
          } finally {
            // Ensure teardown even if analytics fails.
            await this.cleanup();
          }
        }
      );
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
    try {
      if (this.renderer) {
        const handled = this.renderer.skip();
        if (!handled) {
          const totalSteps = this.renderer.getTotalSteps?.() || 5;
          // Finalize analytics asynchronously without blocking
          Analytics.finalizeSession(totalSteps).catch((error) => {
            console.warn('Failed to finalize session on skip:', error);
          });
          this.renderer = null;
        }
      }
    } finally {
      // Ensure avatar and styles are always cleaned up, even if skip throws.
      AvatarAssistant.destroy();
      StyleManager.cleanup();
    }
  }

  static async cleanup(): Promise<void> {
    try {
      if (this.renderer) {
        this.renderer.destroy();
        this.renderer = null;
      }
    } finally {
      // Always tear down avatar and injected styles.
      AvatarAssistant.destroy();
      StyleManager.cleanup();
    }
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
      this.clearSessionId(tourId);
    } catch (err) {
      console.warn('Unable to persist completion state:', err);
    }
  }

  private static sessionStorageKey(tourId: string): string {
    return `onboarding_tour_${tourId}_session`;
  }

  private static async initializeSession(tourId: string): Promise<void> {
    // Check localStorage for existing session
    const storedSessionId = this.getStoredSessionId(tourId);

    if (storedSessionId) {
      this.sessionId = storedSessionId;
      Analytics.setSessionId(this.sessionId);
      console.log(`Resumed session ${this.sessionId} for tour ${tourId}`);
      return;
    }

    // Create new session
    this.sessionId = this.generateSessionId();
    Analytics.setSessionId(this.sessionId);

    // Save session to localStorage
    try {
      localStorage.setItem(this.sessionStorageKey(tourId), this.sessionId);
    } catch (err) {
      console.warn('Unable to save session to localStorage:', err);
    }

    // Save session to Firestore
    const db = getFirestoreClient();
    if (db && this.sessionId) {
      try {
        const sessionRef = doc(db, 'tours', tourId, 'sessions', this.sessionId);
        await setDoc(sessionRef, {
          created_at: new Date().toISOString(),
          status: 'active',
        });
        console.log(`Created session ${this.sessionId} for tour ${tourId}`);
      } catch (err) {
        console.warn('Unable to save session to Firestore:', err);
      }
    }
  }

  private static getStoredSessionId(tourId: string): string | null {
    try {
      return localStorage.getItem(this.sessionStorageKey(tourId));
    } catch (err) {
      console.warn('Unable to read session from localStorage:', err);
      return null;
    }
  }

  private static generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  private static clearSessionId(tourId: string): void {
    try {
      localStorage.removeItem(this.sessionStorageKey(tourId));
    } catch (err) {
      console.warn('Unable to clear session from localStorage:', err);
    }
  }
}
