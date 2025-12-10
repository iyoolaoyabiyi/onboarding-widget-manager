import type { TourConfig, TourStep } from '../types/types';
import { HIGHLIGHT_CLASS } from '../config/constants';
import { TooltipManager, TooltipPositioner } from '../ui/tooltip/tooltip';
import { Analytics } from '../analytics/analytics';
import { gsap } from 'gsap';

/**
 * Manages the tour state and step rendering
 */
export class TourRenderer {
  private config: TourConfig;
  private currentStepIndex: number = 0;
  private highlightedElement: HTMLElement | null = null;
  private resizeHandler: (() => void) | null = null;
  private scrollHandler: (() => void) | null = null;
  private onFinish: () => void;

  constructor(config: TourConfig, onFinish: () => void) {
    this.config = config;
    this.currentStepIndex = this.loadSavedStepIndex();
    this.onFinish = onFinish;
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

  skip(): void {
    const currentStep = this.config.steps[this.currentStepIndex];
    Analytics.track('step_skipped', this.config.id, currentStep?.id);
    this.clearPersistedStep();
    this.destroy();
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
    if (this.highlightedElement) {
      this.highlightedElement.classList.remove(HIGHLIGHT_CLASS);
      this.highlightedElement = null;
    }
  }

  setupEventListeners(): void {
    this.resizeHandler = () => this.reposition();
    this.scrollHandler = () => this.reposition();

    window.addEventListener('resize', this.resizeHandler);
    window.addEventListener('scroll', this.scrollHandler);
  }

  private reposition(): void {
    if (!this.highlightedElement) return;

    const tooltip = TooltipManager.getInstance();
    if (!tooltip) return;

    const step = this.config.steps[this.currentStepIndex];
    TooltipPositioner.position(tooltip, this.highlightedElement, step.position);
  }

  destroy(): void {
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
}
