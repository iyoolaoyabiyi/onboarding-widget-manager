import { STYLE_ID, DEFAULT_TOUR_CONFIG, HIGH_Z_INDEX, HIGHEST_Z_INDEX, THEME_DEFINITIONS } from '../config/constants';
import type { ThemeName } from '../types/types';

/**
 * Manages all CSS styles for the tour overlay and tooltip
 */
export class StyleManager {
  private static isInitialized = false;

  static ensureStyles(themeName: ThemeName = DEFAULT_TOUR_CONFIG.theme): void {
    if (this.isInitialized || document.getElementById(STYLE_ID)) {
      return;
    }

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = this.generateStyles(themeName);

    document.head.appendChild(style);
    this.isInitialized = true;
  }

  private static generateStyles(themeName: ThemeName): string {
    const theme = THEME_DEFINITIONS[themeName];
    return `
      .tour-highlighted-element {
        position: relative;
        z-index: ${HIGH_Z_INDEX};
        box-shadow: 0 0 0 3px ${theme.border}, 0 0 0 9999px rgba(0,0,0,0.45);
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
        border: 1px solid ${theme.border};
        background: ${theme.background};
        color: ${theme.text};
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
        color: ${theme.highlight};
      }
      .onboarding-tour-tooltip p {
        margin: 0 0 10px;
        color: ${theme.textSecondary};
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
        border: 1px solid ${theme.accent};
        background: ${theme.accent}20;
        color: ${theme.accent};
        font-weight: 600;
        cursor: pointer;
        font-size: 12px;
        transition: background 0.2s ease, border-color 0.2s ease;
      }
      .onboarding-tour-actions button:hover:not(:disabled) {
        background: ${theme.accent}40;
      }
      .onboarding-tour-actions button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      .onboarding-tour-actions .primary {
        border-color: transparent;
        background: ${theme.accent};
        color: ${theme.background};
      }
      .onboarding-tour-actions .primary:hover {
        opacity: 0.9;
      }
      .onboarding-tour-avatar {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 160px;
        height: 160px;
        z-index: ${HIGHEST_Z_INDEX};
        pointer-events: none;
      }
      .onboarding-tour-avatar canvas {
        width: 100%;
        height: 100%;
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
