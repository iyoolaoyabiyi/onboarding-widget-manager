/**
 * Domain validation utility for tour security
 * Ensures tours are only shown on authorized domains
 */

export class DomainValidator {
  /**
   * Get the current origin (scheme + domain + port)
   * @example "https://example.com" or "http://localhost:3000"
   */
  static getCurrentOrigin(): string {
    if (typeof window === 'undefined') {
      return '';
    }
    return window.location.origin;
  }

  /**
   * Get the current domain (without scheme and port)
   * @example "example.com" from "https://example.com:443"
   */
  static getCurrentDomain(): string {
    if (typeof window === 'undefined') {
      return '';
    }
    return window.location.hostname;
  }

  /**
   * Extract domain from a URL string
   * @example "https://example.com/path" -> "example.com"
   */
  static extractDomain(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      // If not a valid URL, try treating it as a domain
      return url.replace(/^https?:\/\//, '').split('/')[0];
    }
  }

  /**
   * Check if current domain is allowed by tour's allowed_domains list
   * Supports:
   * - Exact matches: "example.com"
   * - Wildcard subdomains: "*.example.com"
   * - Localhost with ports: "localhost", "localhost:3000"
   */
  static isAllowedDomain(allowedDomains: string[]): boolean {
    if (!allowedDomains || allowedDomains.length === 0) {
      console.warn('No allowed domains configured. Tour will not display.');
      return false;
    }

    const currentDomain = this.getCurrentDomain();

    // Check each allowed domain
    for (const allowed of allowedDomains) {
      // Exact match
      if (currentDomain === allowed) {
        return true;
      }

      // Wildcard match (*.example.com matches api.example.com, app.example.com, etc.)
      if (allowed.startsWith('*.')) {
        const baseDomain = allowed.slice(2); // Remove "*."
        if (currentDomain.endsWith('.' + baseDomain) || currentDomain === baseDomain) {
          return true;
        }
      }

      // localhost with or without port
      if (allowed === 'localhost' && (currentDomain === 'localhost' || currentDomain === '127.0.0.1')) {
        return true;
      }
    }

    return false;
  }

  /**
   * Log unauthorized domain attempt for monitoring
   */
  static logUnauthorizedAttempt(tourId: string, allowedDomains: string[]): void {
    const currentOrigin = this.getCurrentOrigin();
    const message = `Unauthorized domain attempt: Tour "${tourId}" accessed from "${currentOrigin}". Allowed domains: ${allowedDomains.join(', ')}`;
    
    // Log to console for debugging
    console.warn(message);

    // In production, this could be sent to an analytics service
    // Try to send to a logging endpoint if available
    try {
      // This is optional - could be implemented later
      // fetch('/api/log-unauthorized', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     tourId,
      //     origin: currentOrigin,
      //     allowedDomains,
      //     timestamp: new Date().toISOString()
      //   })
      // }).catch(() => {}); // Silently fail
    } catch {
      // Ignore errors in logging
    }
  }

  /**
   * Validate domain and return boolean with optional logging
   */
  static validate(tourId: string, allowedDomains: string[], logUnauthorized = true): boolean {
    const isAllowed = this.isAllowedDomain(allowedDomains);

    if (!isAllowed && logUnauthorized) {
      this.logUnauthorizedAttempt(tourId, allowedDomains);
    }

    return isAllowed;
  }
}
