/**
 * Production validation utilities for widget deployment
 * Validates configuration and detects common issues before deployment
 */

type TourStep = {
  title?: string;
  content?: string;
  target_element?: string;
  position?: string;
};

type TourConfigInput = {
  id?: string;
  name?: string;
  owner_id?: string;
  status?: string;
  theme?: string;
  steps?: TourStep[];
  allowed_domains?: string[];
  created_at?: string;
  updated_at?: string;
  min_steps?: number;
  total_views?: number;
};

export class DeploymentValidator {
  /**
   * Validate tour configuration for production
   */
  static validateTourConfig(config: TourConfigInput): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check required fields
    if (!config.id) errors.push('Tour ID is required');
    if (!config.name) errors.push('Tour name is required');
    if (!config.owner_id) errors.push('Owner ID is required');
    if (!config.status) errors.push('Tour status is required');
    if (!config.theme) errors.push('Theme is required');

    // Validate theme
    const validThemes = ['greyscale', 'blue', 'green', 'red'];
    if (config.theme && !validThemes.includes(config.theme)) {
      errors.push(`Invalid theme: ${config.theme}. Must be one of: ${validThemes.join(', ')}`);
    }

    // Validate status
    const validStatuses = ['draft', 'active', 'paused', 'archived'];
    if (config.status && !validStatuses.includes(config.status)) {
      errors.push(`Invalid status: ${config.status}. Must be one of: ${validStatuses.join(', ')}`);
    }

    // Check steps
    if (!config.steps || config.steps.length === 0) {
      errors.push('Tour must have at least one step');
    } else if (config.steps.length < 5) {
      errors.push(`Tour has ${config.steps.length} steps. Minimum required is 5.`);
    }

    // Validate steps
    if (config.steps && Array.isArray(config.steps)) {
      config.steps.forEach((step: TourStep, index: number) => {
        if (!step.title) errors.push(`Step ${index + 1}: Title is required`);
        if (!step.content) errors.push(`Step ${index + 1}: Content is required`);
        if (!step.target_element) errors.push(`Step ${index + 1}: Target element is required`);
        if (!step.position) errors.push(`Step ${index + 1}: Position is required`);

        const validPositions = ['top', 'bottom', 'left', 'right', 'center'];
        if (step.position && !validPositions.includes(step.position)) {
          errors.push(`Step ${index + 1}: Invalid position "${step.position}"`);
        }
      });
    }

    // Check allowed domains
    if (!config.allowed_domains || config.allowed_domains.length === 0) {
      errors.push('Tour must have at least one allowed domain');
    }

    // Validate domains format
    if (config.allowed_domains && Array.isArray(config.allowed_domains)) {
      config.allowed_domains.forEach((domain: string, index: number) => {
        if (!domain || typeof domain !== 'string' || domain.trim() === '') {
          errors.push(`Allowed domain ${index + 1}: Empty or invalid domain`);
        }
      });
    }

    // Check timestamps
    if (!config.created_at) errors.push('Created timestamp is required');
    if (!config.updated_at) errors.push('Updated timestamp is required');

    // Check numeric fields
    if (config.min_steps !== undefined && config.min_steps < 1) {
      errors.push('Minimum steps must be at least 1');
    }
    if (config.total_views !== undefined && config.total_views < 0) {
      errors.push('Total views cannot be negative');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate widget embed code
   */
  static validateEmbedCode(code: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!code.includes('src=')) errors.push('Embed code missing src attribute');
    if (!code.includes('data-tour-id=')) errors.push('Embed code missing data-tour-id attribute');
    if (!code.includes('.js')) errors.push('Widget URL must be a .js file');

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Check if domain is valid format
   */
  static isValidDomainFormat(domain: string): boolean {
    // Remove wildcard if present
    const cleanDomain = domain.replace(/^\*\./, '');

    // Basic domain format validation
    const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)*[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(:?\d+)?$/;

    if (cleanDomain === 'localhost' || cleanDomain.startsWith('localhost:')) {
      return true; // localhost is valid
    }

    return domainRegex.test(cleanDomain);
  }

  /**
   * Check if target element exists in DOM
   */
  static checkTargetElement(selector: string): { exists: boolean; count: number } {
    try {
      const elements = document.querySelectorAll(selector);
      return {
        exists: elements.length > 0,
        count: elements.length,
      };
    } catch {
      return {
        exists: false,
        count: 0,
      };
    }
  }

  /**
   * Test widget initialization (for debugging)
   */
  static testWidgetInitialization(tourId: string, allowedDomains: string[]): {
    ready: boolean;
    warnings: string[];
  } {
    const warnings: string[] = [];

    // Check if script is loaded
    const scriptTag = document.querySelector(`script[data-tour-id="${tourId}"]`);
    if (!scriptTag) {
      warnings.push(`Widget script not found for tour "${tourId}"`);
    }

    // Check domain validation
    const currentDomain = window.location.hostname;
    let domainAllowed = false;

    for (const allowed of allowedDomains) {
      const baseDomain = allowed.replace('*.', '');
      if (currentDomain === allowed || currentDomain.endsWith('.' + baseDomain)) {
        domainAllowed = true;
        break;
      }
    }

    if (!domainAllowed) {
      warnings.push(`Current domain "${currentDomain}" is not in allowed domains: ${allowedDomains.join(', ')}`);
    }

    // Check if Firestore is available (optional but recommended)
    if (!window.location.pathname.includes('test') && !window.location.hostname.includes('localhost')) {
      // Only warn on non-local, non-test environments
      try {
        const windowObj = window as unknown;
        const hasFirebase = !!(windowObj && typeof windowObj === 'object' && 'firebase' in windowObj);
        if (!hasFirebase) {
          warnings.push('Firebase SDK not detected. Analytics will not work.');
        }
      } catch {
        // Ignore
      }
    }

    return {
      ready: warnings.length === 0,
      warnings,
    };
  }

  /**
   * Generate comprehensive deployment checklist
   */
  static generateDeploymentChecklist(config: TourConfigInput): {
    items: Array<{ task: string; completed: boolean; notes?: string }>;
    readyForDeployment: boolean;
  } {
    const configValidation = this.validateTourConfig(config);
    const items: Array<{ task: string; completed: boolean; notes?: string }> = [
      {
        task: 'Tour configuration valid',
        completed: configValidation.valid,
        notes: configValidation.valid ? undefined : configValidation.errors.join('; '),
      },
      {
        task: 'Minimum 5 steps created',
        completed: (config.steps?.length ?? 0) >= 5,
        notes: config.steps ? `${config.steps.length} steps created` : 'No steps',
      },
      {
        task: 'Domain whitelist configured',
        completed: (config.allowed_domains?.length ?? 0) > 0,
        notes: config.allowed_domains ? config.allowed_domains.join(', ') : 'No domains',
      },
      {
        task: 'Theme selected',
        completed: !!config.theme,
        notes: config.theme || 'No theme',
      },
      {
        task: 'Tour status is active',
        completed: config.status === 'active',
        notes: `Status: ${config.status || 'unknown'}`,
      },
      {
        task: 'All step selectors valid',
        completed: config.steps ? config.steps.every((s: TourStep) => !!s.target_element) : false,
        notes: 'Verify selectors match your website',
      },
      {
        task: 'Embed code generated',
        completed: !!config.id,
        notes: config.id || 'No tour ID',
      },
    ];

    const readyForDeployment = items.every((item) => item.completed);

    return {
      items,
      readyForDeployment,
    };
  }
}
