import { STYLE_ID, DEFAULT_TOUR_CONFIG, HIGH_Z_INDEX, HIGHEST_Z_INDEX } from './constants';

/**
 * Manages all CSS styles for the tour overlay and tooltip
 */
export class StyleManager {
  private static isInitialized = false;

  static ensureStyles(themeColor: string = DEFAULT_TOUR_CONFIG.theme_color): void {
    if (this.isInitialized || document.getElementById(STYLE_ID)) {
      return;
    }

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = this.generateStyles(themeColor);

    document.head.appendChild(style);
    this.isInitialized = true;
  }

  private static generateStyles(themeColor: string): string {
    return `
      .tour-highlighted-element {
        position: relative;
        z-index: ${HIGH_Z_INDEX};
        box-shadow: 0 0 0 3px var(--tour-theme, ${themeColor}), 0 0 0 9999px rgba(0,0,0,0.45);
        border-radius: 12px;
        transition: box-shadow 0.2s ease, transform 0.2s ease;
      }
      .onboarding-tour-tooltip {
        position: fixed;
        z-index: ${HIGHEST_Z_INDEX};
        min-width: 240px;
        max-width: 320px;
        padding: 12px;
        border-radius: 12px;
        border: 1px solid rgba(255,255,255,0.14);
        background: #0e162d;
        color: #e7ecff;
        box-shadow: 0 18px 40px rgba(0,0,0,0.45);
        font-family: system-ui, -apple-system, sans-serif;
        opacity: 0;
        transform: translateY(4px);
        transition: opacity 0.16s ease, transform 0.16s ease;
      }
      .onboarding-tour-tooltip.visible {
        opacity: 1;
        transform: translateY(0);
      }
      .onboarding-tour-tooltip h3 {
        margin: 0 0 6px;
        font-size: 15px;
        font-weight: 600;
      }
      .onboarding-tour-tooltip p {
        margin: 0 0 10px;
        color: #9fb3ff;
        line-height: 1.5;
        font-size: 13px;
      }
      .onboarding-tour-actions {
        display: flex;
        justify-content: space-between;
        gap: 8px;
      }
      .onboarding-tour-actions .nav-buttons {
        display: flex;
        gap: 8px;
      }
      .onboarding-tour-actions button {
        padding: 7px 11px;
        border-radius: 10px;
        border: 1px solid rgba(255,255,255,0.14);
        background: rgba(255,255,255,0.06);
        color: #e7ecff;
        font-weight: 600;
        cursor: pointer;
        font-size: 12px;
        transition: background 0.2s ease, border-color 0.2s ease;
      }
      .onboarding-tour-actions button:hover:not(:disabled) {
        background: rgba(255,255,255,0.12);
      }
      .onboarding-tour-actions button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      .onboarding-tour-actions .primary {
        border-color: transparent;
        background: var(--tour-theme, ${themeColor});
        color: #fff;
      }
      .onboarding-tour-actions .primary:hover {
        opacity: 0.9;
      }
    `;
  }

  static cleanup(): void {
    const style = document.getElementById(STYLE_ID);
    if (style) {
      style.remove();
    }
    this.isInitialized = false;
  }
}
