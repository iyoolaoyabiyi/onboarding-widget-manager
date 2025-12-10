import { THEME_DEFINITIONS } from '../config/constants';
import type { ThemeName } from '../types/types';

/**
 * Theme color palette definition
 */
export interface ThemeColors {
  background: string;
  text: string;
  textSecondary: string;
  border: string;
  accent: string;
  highlight: string;
}

/**
 * Manages theme selection and color palette resolution
 */
export class ThemeManager {
  /**
   * Get the color palette for a given theme
   */
  static getTheme(themeName: ThemeName): ThemeColors {
    const theme = THEME_DEFINITIONS[themeName];
    
    if (!theme) {
      console.warn(`Theme "${themeName}" not found, falling back to "blue"`);
      return THEME_DEFINITIONS.blue;
    }
    
    return theme;
  }

  /**
   * Get all available theme names
   */
  static getAvailableThemes(): ThemeName[] {
    return Object.keys(THEME_DEFINITIONS) as ThemeName[];
  }

  /**
   * Check if a theme name is valid
   */
  static isValidTheme(themeName: string): themeName is ThemeName {
    return themeName in THEME_DEFINITIONS;
  }

  /**
   * Get theme information for UI display
   */
  static getThemeInfo(themeName: ThemeName): {
    name: ThemeName;
    label: string;
    colors: ThemeColors;
  } {
    return {
      name: themeName,
      label: this.formatThemeName(themeName),
      colors: this.getTheme(themeName),
    };
  }

  /**
   * Get all themes with formatted labels
   */
  static getAllThemesInfo() {
    return this.getAvailableThemes().map(theme => this.getThemeInfo(theme));
  }

  /**
   * Format theme name for display (e.g., "greyscale" -> "Greyscale")
   */
  private static formatThemeName(themeName: ThemeName): string {
    return themeName.charAt(0).toUpperCase() + themeName.slice(1);
  }
}
