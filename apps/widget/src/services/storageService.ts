/**
 * Wrapper around localStorage for safe, consistent access
 * Handles errors gracefully (private browsing mode, quota exceeded, etc.)
 */
export class StorageService {
  /**
   * Get value from localStorage
   */
  static getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      console.warn(`Failed to read from localStorage: ${key}`);
      return null;
    }
  }

  /**
   * Set value in localStorage
   */
  static setItem(key: string, value: string): boolean {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      if (error instanceof DOMException && error.code === 22) {
        console.warn('localStorage quota exceeded');
      } else {
        console.warn(`Failed to write to localStorage: ${key}`);
      }
      return false;
    }
  }

  /**
   * Set JSON object in localStorage
   */
  static setJSON<T>(key: string, value: T): boolean {
    try {
      const json = JSON.stringify(value);
      return this.setItem(key, json);
    } catch (error) {
      console.warn(`Failed to serialize and store JSON: ${key}`, error);
      return false;
    }
  }

  /**
   * Get JSON object from localStorage
   */
  static getJSON<T>(key: string): T | null {
    try {
      const item = this.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.warn(`Failed to parse JSON from localStorage: ${key}`, error);
      return null;
    }
  }

  /**
   * Remove item from localStorage
   */
  static removeItem(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      console.warn(`Failed to remove from localStorage: ${key}`);
      return false;
    }
  }

  /**
   * Clear all items in localStorage
   */
  static clear(): boolean {
    try {
      localStorage.clear();
      return true;
    } catch {
      console.warn('Failed to clear localStorage');
      return false;
    }
  }

  /**
   * Check if localStorage is available and working
   */
  static isAvailable(): boolean {
    try {
      const testKey = '__storage_test__';
      this.setItem(testKey, 'test');
      const success = this.getItem(testKey) === 'test';
      this.removeItem(testKey);
      return success;
    } catch {
      return false;
    }
  }

  /**
   * Get all keys in localStorage
   */
  static getAllKeys(): string[] {
    try {
      return Object.keys(localStorage);
    } catch {
      return [];
    }
  }

  /**
   * Get value by pattern (useful for finding tour-related keys)
   */
  static getKeysByPattern(pattern: RegExp): Map<string, string | null> {
    const result = new Map<string, string | null>();
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (pattern.test(key)) {
          result.set(key, this.getItem(key));
        }
      });
    } catch {
      console.warn('Failed to get keys by pattern');
    }
    return result;
  }
}
