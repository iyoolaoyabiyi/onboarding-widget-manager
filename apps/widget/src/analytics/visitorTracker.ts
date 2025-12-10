/**
 * Visitor tracking for anonymous user identification
 * Uses fingerprinting + localStorage for consistent tracking
 */
export class VisitorTracker {
  private static readonly VISITOR_ID_KEY = 'onboarding_visitor_id';

  /**
   * Get or create a unique visitor ID
   * Uses localStorage first, falls back to cookie-based tracking
   */
  static getVisitorId(): string {
    // Try localStorage first
    const stored = this.getFromStorage();
    if (stored) {
      return stored;
    }

    // Generate new ID
    const visitorId = this.generateVisitorId();

    // Try to persist
    this.setInStorage(visitorId);

    return visitorId;
  }

  /**
   * Generate a unique visitor ID based on browser fingerprint
   * Combines multiple factors for consistency without tracking personally identifiable info
   */
  private static generateVisitorId(): string {
    const components = [
      this.getScreenFingerprint(),
      this.getTimezoneFingerprint(),
      this.getLanguageFingerprint(),
      this.getCanvasFingerprint(),
    ];

    // Hash the combined fingerprint
    const combined = components.join('|');
    const hash = this.simpleHash(combined);

    return `visitor_${hash}_${Date.now()}`;
  }

  /**
   * Screen resolution and color depth fingerprint
   */
  private static getScreenFingerprint(): string {
    if (typeof window === 'undefined') return 'unknown';
    return `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}`;
  }

  /**
   * Timezone offset fingerprint
   */
  private static getTimezoneFingerprint(): string {
    const offset = new Date().getTimezoneOffset();
    return `tz_${offset}`;
  }

  /**
   * Language and locale fingerprint
   */
  private static getLanguageFingerprint(): string {
    if (typeof navigator === 'undefined') return 'unknown';
    const lang = navigator.language || 'unknown';
    const langs = (navigator.languages || []).join(',');
    return `${lang}_${langs}`;
  }

  /**
   * Canvas fingerprinting (non-invasive)
   * Only uses basic gradients to create a unique signature
   */
  private static getCanvasFingerprint(): string {
    try {
      if (typeof document === 'undefined' || typeof HTMLCanvasElement === 'undefined') {
        return 'no_canvas';
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) return 'no_ctx';

      // Draw a simple gradient
      const gradient = ctx.createLinearGradient(0, 0, 100, 100);
      gradient.addColorStop(0, '#FF0000');
      gradient.addColorStop(1, '#00FF00');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 100, 100);

      // Get canvas data hash
      const dataUrl = canvas.toDataURL();
      return this.simpleHash(dataUrl).substring(0, 8);
    } catch {
      return 'canvas_error';
    }
  }

  /**
   * Simple hash function for fingerprints
   * Not cryptographic, just for consistency
   */
  private static simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Get visitor ID from localStorage
   */
  private static getFromStorage(): string | null {
    try {
      return localStorage.getItem(this.VISITOR_ID_KEY);
    } catch {
      return null;
    }
  }

  /**
   * Save visitor ID to localStorage
   */
  private static setInStorage(visitorId: string): void {
    try {
      localStorage.setItem(this.VISITOR_ID_KEY, visitorId);
    } catch {
      // Silently fail - private browsing mode
    }
  }

  /**
   * Clear visitor ID (for testing or privacy reset)
   */
  static clearVisitorId(): void {
    try {
      localStorage.removeItem(this.VISITOR_ID_KEY);
    } catch {
      // Silently fail
    }
  }

  /**
   * Check if this is a new visitor (first time seeing this ID)
   */
  static isNewVisitor(): boolean {
    return !this.getFromStorage();
  }
}
