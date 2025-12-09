import type { AnalyticsEvent, AnalyticsAction } from '../types/types';
import { getFirestoreClient } from '../services/firebaseClient';
import { collection, addDoc, doc } from 'firebase/firestore';

/**
 * Handles analytics event tracking
 */
export class Analytics {
  private static events: AnalyticsEvent[] = [];
  private static uploadEndpoint: string | null = null;
  private static firestoreDb = getFirestoreClient();
  private static sessionId: string | null = null;

  static setEndpoint(endpoint: string): void {
    this.uploadEndpoint = endpoint;
  }

  static setSessionId(sessionId: string): void {
    this.sessionId = sessionId;
  }

  static track(
    action: AnalyticsAction,
    tourId: string,
    stepId?: string
  ): void {
    if (!this.sessionId) {
      console.warn('Session ID not set. Analytics event not tracked.');
      return;
    }

    const event: AnalyticsEvent = {
      tour_id: tourId,
      session_id: this.sessionId,
      action,
      timestamp: new Date().toISOString(),
      ...(stepId !== undefined ? { step_id: stepId } : {}),
    };

    this.events.push(event);
    console.log('[Analytics]', event);

    // If endpoint is configured, send immediately
    if (this.uploadEndpoint) {
      this.sendEvent(event).catch((error) => {
        console.warn('Failed to send analytics event:', error);
      });
    }

    // If Firestore is available, write analytics to session subcollection
    if (this.firestoreDb) {
      try {
        const docRef = doc(this.firestoreDb, 'tours', tourId, 'sessions', this.sessionId);
        const colRef = collection(docRef, 'events');
        // fire-and-forget, do not block the main flow
        addDoc(colRef, event).catch((err) => {
          console.warn('Failed to write analytics event to Firestore:', err);
        });
      } catch (err) {
        console.warn('Analytics Firestore write failed:', err);
      }
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
