import type { AnalyticsEvent, AnalyticsAction } from './types';

/**
 * Handles analytics event tracking
 */
export class Analytics {
  private static events: AnalyticsEvent[] = [];
  private static uploadEndpoint: string | null = null;

  static setEndpoint(endpoint: string): void {
    this.uploadEndpoint = endpoint;
  }

  static track(
    action: AnalyticsAction,
    tourId: string,
    stepId?: string
  ): void {
    const event: AnalyticsEvent = {
      tour_id: tourId,
      step_id: stepId,
      action,
      timestamp: new Date().toISOString(),
    };

    this.events.push(event);
    console.log('[Analytics]', event);

    // If endpoint is configured, send immediately
    if (this.uploadEndpoint) {
      this.sendEvent(event).catch((error) => {
        console.warn('Failed to send analytics event:', error);
      });
    }
  }

  private static async sendEvent(event: AnalyticsEvent): Promise<void> {
    if (!this.uploadEndpoint) {
      return;
    }

    try {
      const response = await fetch(this.uploadEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });

      if (!response.ok) {
        console.warn(`Analytics upload failed: ${response.status}`);
      }
    } catch (error) {
      console.warn('Failed to send analytics event:', error);
    }
  }

  static getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  static clearEvents(): void {
    this.events = [];
  }
}
