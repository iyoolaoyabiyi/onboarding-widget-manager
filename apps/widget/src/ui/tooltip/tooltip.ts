import type { TourStep, TooltipPosition } from '../../types/types';
import { TOOLTIP_PADDING } from '../../config/constants';

/**
 * Handles positioning of the tooltip relative to highlighted elements
 */
export class TooltipPositioner {
  static position(
    tooltip: HTMLElement,
    target: HTMLElement,
    position: TooltipPosition
  ): void {
    // Ensure visibility before measuring
    tooltip.classList.add('visible');

    const rect = target.getBoundingClientRect();
    const tooltipWidth = tooltip.offsetWidth;
    const tooltipHeight = tooltip.offsetHeight;

    let top = 0;
    let left = 0;

    switch (position) {
      case 'top':
        top = rect.top - tooltipHeight - TOOLTIP_PADDING;
        left = rect.left + rect.width / 2 - tooltipWidth / 2;
        break;
      case 'bottom':
        top = rect.bottom + TOOLTIP_PADDING;
        left = rect.left + rect.width / 2 - tooltipWidth / 2;
        break;
      case 'left':
        top = rect.top + rect.height / 2 - tooltipHeight / 2;
        left = rect.left - tooltipWidth - TOOLTIP_PADDING;
        break;
      case 'right':
      default:
        top = rect.top + rect.height / 2 - tooltipHeight / 2;
        left = rect.right + TOOLTIP_PADDING;
        break;
    }

    // Prevent overflow off-screen
    top = Math.max(10, Math.min(top, window.innerHeight - tooltipHeight - 10));
    left = Math.max(10, Math.min(left, window.innerWidth - tooltipWidth - 10));

    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
  }
}

/**
 * Manages tooltip creation and content rendering
 */
export class TooltipManager {
  private static instance: HTMLDivElement | null = null;
  private static clickHandler: ((event: Event) => void) | null = null;

  static create(): HTMLDivElement {
    if (this.instance) {
      return this.instance;
    }

    const tooltip = document.createElement('div');
    tooltip.className = 'onboarding-tour-tooltip';
    document.body.appendChild(tooltip);

    this.instance = tooltip;
    return tooltip;
  }

  static setContent(
    tooltip: HTMLDivElement,
    step: TourStep,
    stepIndex: number,
    totalSteps: number,
    onButtonClick: (action: string) => void
  ): void {
    const isLastStep = stepIndex === totalSteps - 1;
    const isFirstStep = stepIndex === 0;

    tooltip.innerHTML = `
      <h3>${step.title} (${stepIndex + 1}/${totalSteps})</h3>
      <p>${step.content}</p>
      <div class="onboarding-tour-actions">
        <button data-action="skip" type="button">Skip Tour</button>
        <div class="nav-buttons">
          <button data-action="back" ${isFirstStep ? 'disabled' : ''} type="button">Back</button>
          <button class="primary" data-action="next" type="button">${isLastStep ? 'Finish' : 'Next'}</button>
        </div>
      </div>
    `;

    // Remove old handler
    if (this.clickHandler && this.instance) {
      this.instance.removeEventListener('click', this.clickHandler);
    }

    // Add new handler
    this.clickHandler = (event: Event) => {
      const target = event.target as HTMLElement;
      const action = target.getAttribute('data-action');
      if (action) {
        onButtonClick(action);
      }
    };

    tooltip.addEventListener('click', this.clickHandler);
  }

  static show(tooltip: HTMLDivElement): void {
    tooltip.classList.add('visible');
  }

  static hide(tooltip: HTMLDivElement): void {
    tooltip.classList.remove('visible');
  }

  static destroy(): void {
    if (this.instance) {
      if (this.clickHandler) {
        this.instance.removeEventListener('click', this.clickHandler);
      }
      this.instance.remove();
      this.instance = null;
      this.clickHandler = null;
    }
  }

  static getInstance(): HTMLDivElement | null {
    return this.instance;
  }
}
