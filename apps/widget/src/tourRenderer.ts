import type { TourConfig, TourStep } from './types';
import { HIGHLIGHT_CLASS } from './constants';
import { TooltipManager, TooltipPositioner } from './tooltip';
import { Analytics } from './analytics';

/**
 * Manages the tour state and step rendering
 */
export class TourRenderer {
  private config: TourConfig;
  private currentStepIndex: number = 0;
  private highlightedElement: HTMLElement | null = null;
  private resizeHandler: (() => void) | null = null;
  private scrollHandler: (() => void) | null = null;

  constructor(config: TourConfig) {
    this.config = config;
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
    document.documentElement.style.setProperty('--tour-theme', this.config.theme_color);
    targetElement.classList.add(HIGHLIGHT_CLASS);
    targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

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
    });

    // Track analytics
    Analytics.track('started', this.config.id, step.id);
  }

  nextStep(): void {
    if (this.currentStepIndex >= this.config.steps.length - 1) {
      // Tour finished
      const currentStep = this.config.steps[this.currentStepIndex];
      Analytics.track('completed', this.config.id, currentStep?.id);
      Analytics.track('tour_finished', this.config.id);
      this.destroy();
      return;
    }

    const currentStep = this.config.steps[this.currentStepIndex];
    Analytics.track('completed', this.config.id, currentStep?.id);

    this.renderStep(this.currentStepIndex + 1);
  }

  previousStep(): void {
    if (this.currentStepIndex > 0) {
      this.renderStep(this.currentStepIndex - 1);
    }
  }

  skip(): void {
    const currentStep = this.config.steps[this.currentStepIndex];
    Analytics.track('skipped', this.config.id, currentStep?.id);
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

  getCurrentStepIndex(): number {
    return this.currentStepIndex;
  }

  getCurrentStep(): TourStep | null {
    return this.config.steps[this.currentStepIndex] || null;
  }
}
