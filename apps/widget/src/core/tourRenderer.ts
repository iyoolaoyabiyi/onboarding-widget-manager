import type { TourConfig, TourStep } from '../types/types';
import { HIGHLIGHT_CLASS } from '../config/constants';
import { TooltipManager, TooltipPositioner } from '../ui/tooltip/tooltip';
import { Analytics } from '../analytics/analytics';
import { gsap } from 'gsap';

type HistoryPatchedWindow = Window & {
  __originalPushState?: History['pushState'];
  __originalReplaceState?: History['replaceState'];
};

/**
 * Manages the tour state and step rendering
 */
export class TourRenderer {
  private config: TourConfig;
  private currentStepIndex: number = 0;
  private highlightedElement: HTMLElement | null = null;
  private resizeHandler: (() => void) | null = null;
  private scrollHandler: (() => void) | null = null;
  private routeChangeHandler: (() => void) | null = null;
  private lastPathname: string = '';
  private onFinish: () => void;
  private onCancel?: () => void;

  /**
   * Cancel any active GSAP tweens to avoid lingering animations when skipping.
   */
  private clearAnimations(): void {
    if (this.highlightedElement) {
      gsap.killTweensOf(this.highlightedElement);
    }
    const tooltip = TooltipManager.getInstance();
    if (tooltip) {
      gsap.killTweensOf(tooltip);
    }
  }

  constructor(config: TourConfig, onFinish: () => void, onCancel?: () => void) {
    this.config = config;
    this.currentStepIndex = this.loadSavedStepIndex();
    this.onFinish = onFinish;
    this.onCancel = onCancel;
    this.lastPathname = typeof window !== 'undefined' ? window.location.pathname : '';
  }

  renderStep(index: number): void {
    if (index < 0 || index >= this.config.steps.length) {
      console.error(`Invalid step index: ${index}`);
      return;
    }

    this.currentStepIndex = index;
    const step = this.config.steps[index];

    // Remove highlight from previous element
    this.removeHighlight();

    // Find and highlight the new target
    const targetElement = document.querySelector(step.target_element) as HTMLElement | null;
    if (!targetElement) {
      console.warn(
        `Step ${step.order}: could not find target element "${step.target_element}". Skipping step.`
      );
      // Auto-advance if element is missing
      if (index < this.config.steps.length - 1) {
        this.nextStep();
      }
      return;
    }
    // Apply highlight
    this.highlightedElement = targetElement;
    targetElement.classList.add(HIGHLIGHT_CLASS);
    targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Animate highlight pop-in
    gsap.fromTo(
      targetElement,
      { scale: 0.98 },
      { scale: 1, duration: 0.25, ease: 'power2.out' }
    );

    // Update tooltip
    const tooltip = TooltipManager.create();
    TooltipManager.setContent(
      tooltip,
      step,
      index,
      this.config.steps.length,
      this.handleButtonClick.bind(this)
    );

    // Position tooltip
    requestAnimationFrame(() => {
      TooltipPositioner.position(tooltip, targetElement, step.position);
      // Animate tooltip entrance
      gsap.fromTo(
        tooltip,
        { opacity: 0, y: 8, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.32, ease: 'power2.out' }
      );
    });

    // Track analytics
    Analytics.track('step_viewed', this.config.id, step.id);

    // Persist progress so reload resumes at the same step
    this.persistStepIndex(index);
  }

  nextStep(): void {
    if (this.currentStepIndex >= this.config.steps.length - 1) {
      // Tour finished
      const currentStep = this.config.steps[this.currentStepIndex];
      Analytics.track('step_completed', this.config.id, currentStep?.id);
      Analytics.track('tour_completed', this.config.id);
      this.clearPersistedStep();
      this.onFinish();
      return;
    }

    const currentStep = this.config.steps[this.currentStepIndex];
    Analytics.track('step_completed', this.config.id, currentStep?.id);

    this.renderStep(this.currentStepIndex + 1);
  }

  previousStep(): void {
    if (this.currentStepIndex > 0) {
      this.renderStep(this.currentStepIndex - 1);
    }
  }

  skip(): boolean {
    const currentStep = this.config.steps[this.currentStepIndex];
    Analytics.track('step_skipped', this.config.id, currentStep?.id);
    this.clearPersistedStep();
    this.clearAnimations();
    if (this.onCancel) {
      this.onCancel();
      return true;
    }
    this.destroy();
    return false;
  }

  private handleButtonClick(action: string): void {
    switch (action) {
      case 'next':
        this.nextStep();
        break;
      case 'back':
        this.previousStep();
        break;
      case 'skip':
        this.skip();
        break;
    }
  }

  private removeHighlight(): void {
    this.clearAnimations();
    if (this.highlightedElement) {
      this.highlightedElement.classList.remove(HIGHLIGHT_CLASS);
      this.highlightedElement = null;
    }
  }

  setupEventListeners(): void {
    this.resizeHandler = () => this.reposition();
    this.scrollHandler = () => this.reposition();
    this.routeChangeHandler = () => this.handleRouteChange();

    window.addEventListener('resize', this.resizeHandler);
    window.addEventListener('scroll', this.scrollHandler);
    
    // Listen for route changes in SPAs
    this.setupRouteChangeListeners();
  }

  getTotalSteps(): number {
    return this.config.steps.length;
  }

  /**
   * Set up listeners for route changes in SPAs
   */
  private setupRouteChangeListeners(): void {
    if (!this.routeChangeHandler) return;

    const historyWindow = this.getHistoryWindow();
    // Listen for browser history changes (pushState, replaceState)
    window.addEventListener('popstate', this.routeChangeHandler);
    
    // Intercept pushState and replaceState
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = (...args: Parameters<History['pushState']>) => {
      originalPushState.apply(history, args);
      if (this.routeChangeHandler) this.routeChangeHandler();
    };
    
    history.replaceState = (...args: Parameters<History['replaceState']>) => {
      originalReplaceState.apply(history, args);
      if (this.routeChangeHandler) this.routeChangeHandler();
    };
    
    // Store originals for cleanup
    historyWindow.__originalPushState = originalPushState;
    historyWindow.__originalReplaceState = originalReplaceState;
  }

  /**
   * Handle route change by closing the tour
   */
  private handleRouteChange(): void {
    // Check if we've actually navigated to a different path
    const currentPathname = window.location.pathname;
    
    if (currentPathname !== this.lastPathname) {
      console.log(`Route change detected from ${this.lastPathname} to ${currentPathname}, closing tour...`);
      Analytics.track('tour_closed_route_change', this.config.id);
      this.skip();
    }
    
    // Update the last pathname
    this.lastPathname = currentPathname;
  }

  private reposition(): void {
    if (!this.highlightedElement) return;

    const tooltip = TooltipManager.getInstance();
    if (!tooltip) return;

    const step = this.config.steps[this.currentStepIndex];
    TooltipPositioner.position(tooltip, this.highlightedElement, step.position);
  }

  destroy(): void {
    this.clearAnimations();
    this.removeHighlight();
    TooltipManager.destroy();

    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
      this.resizeHandler = null;
    }
    if (this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler);
      this.scrollHandler = null;
    }
    if (this.routeChangeHandler) {
      window.removeEventListener('popstate', this.routeChangeHandler);
      this.routeChangeHandler = null;
    }
    
    // Restore original history methods
    const historyWindow = this.getHistoryWindow();
    if (historyWindow.__originalPushState) {
      history.pushState = historyWindow.__originalPushState;
      delete historyWindow.__originalPushState;
    }
    if (historyWindow.__originalReplaceState) {
      history.replaceState = historyWindow.__originalReplaceState;
      delete historyWindow.__originalReplaceState;
    }

    document.documentElement.style.removeProperty('--tour-theme');
    console.log('Tour stopped and cleaned up.');
  }

  private storageKey(): string {
    return `onboarding_tour_${this.config.id}_step`;
  }

  private loadSavedStepIndex(): number {
    try {
      const value = localStorage.getItem(this.storageKey());
      if (value === null) return 0;
      const parsed = parseInt(value, 10);
      if (Number.isNaN(parsed)) return 0;
      return Math.max(0, Math.min(parsed, this.config.steps.length - 1));
    } catch (err) {
      console.warn('Unable to read saved tour progress:', err);
      return 0;
    }
  }

  private persistStepIndex(index: number): void {
    try {
      localStorage.setItem(this.storageKey(), String(index));
    } catch (err) {
      console.warn('Unable to persist tour progress:', err);
    }
  }

  private clearPersistedStep(): void {
    try {
      localStorage.removeItem(this.storageKey());
    } catch (err) {
      console.warn('Unable to clear saved tour progress:', err);
    }
  }

  getCurrentStepIndex(): number {
    return this.currentStepIndex;
  }

  getCurrentStep(): TourStep | null {
    return this.config.steps[this.currentStepIndex] || null;
  }

  private getHistoryWindow(): HistoryPatchedWindow {
    return window as HistoryPatchedWindow;
  }
}
