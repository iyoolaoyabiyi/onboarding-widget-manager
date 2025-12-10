import type { AnalyticsEvent, AnalyticsAction, AnalyticsSession } from '../types/types';
import { getFirestoreClient } from '../services/firebaseClient';
import { collection, addDoc, doc } from 'firebase/firestore';
import { SessionManager } from './sessionManager';
import { VisitorTracker } from './visitorTracker';
import { StorageService } from '../services/storageService';

/**
 * Handles analytics event tracking with session aggregation
 * Tracks events, manages sessions, and persists data to Firestore
 */
export class Analytics {
  private static events: AnalyticsEvent[] = [];
  private static uploadEndpoint: string | null = null;
  private static firestoreDb = getFirestoreClient();
  private static sessionId: string | null = null;
  private static currentSession: AnalyticsSession | null = null;
  private static tourId: string | null = null;

  static setEndpoint(endpoint: string): void {
    this.uploadEndpoint = endpoint;
  }

  static setSessionId(sessionId: string): void {
    this.sessionId = sessionId;
  }

  /**
   * Initialize analytics with tour info and create session
   */
  static async initializeSession(tourId: string, totalSteps: number): Promise<void> {
    this.tourId = tourId;
    const visitorId = VisitorTracker.getVisitorId();

    // Create session object
    const session = SessionManager.createSession(
      tourId,
      visitorId,
      typeof window !== 'undefined' ? window.location.href : ''
    );

    this.currentSession = session;
    this.sessionId = session.session_id;

    // Persist to localStorage
    StorageService.setJSON(`onboarding_session_${tourId}`, session);

    // Save to Firestore
    await SessionManager.saveSession(tourId, session);

    console.log(`Analytics session initialized: ${session.session_id}`);
  }

  /**
   * Load existing session from localStorage or Firestore
   */
  static async loadSession(tourId: string): Promise<void> {
    this.tourId = tourId;

    // Try to load from localStorage first
    const stored = StorageService.getJSON<AnalyticsSession>(
      `onboarding_session_${tourId}`
    );

    if (stored && !SessionManager.isSessionExpired(stored)) {
      this.currentSession = stored;
      this.sessionId = stored.session_id;
      console.log(`Loaded session from localStorage: ${stored.session_id}`);
      return;
    }

    // Session expired or not found, create new one
    const tourData = document.querySelector('script[data-tour-id]');
    const totalSteps = tourData ? parseInt(tourData.getAttribute('data-total-steps') || '5', 10) : 5;
    await this.initializeSession(tourId, totalSteps);
  }

  static track(
    action: AnalyticsAction,
    tourId: string,
    stepId?: string,
    timeOnStepMs?: number
  ): void {
    if (!this.sessionId) {
      console.warn('Session ID not set. Analytics event not tracked.');
      return;
    }

    const event: AnalyticsEvent = {
      event_id: this.generateEventId(),
      tour_id: tourId,
      session_id: this.sessionId,
      action,
      timestamp: new Date().toISOString(),
      ...(stepId !== undefined ? { step_id: stepId } : {}),
      ...(timeOnStepMs !== undefined ? { time_on_step_ms: timeOnStepMs } : {}),
    };

    this.events.push(event);
    console.log('[Analytics]', event);

    // Update session metrics
    this.updateSessionMetrics(action);

    // If endpoint is configured, send immediately
    if (this.uploadEndpoint) {
      this.sendEvent(event).catch((error) => {
        console.warn('Failed to send analytics event:', error);
      });
    }

    // If Firestore is available, write analytics to session subcollection
    if (this.firestoreDb && this.sessionId) {
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

  /**
   * Update session metrics based on event type
   */
  private static updateSessionMetrics(action: AnalyticsAction): void {
    if (!this.currentSession) return;

    switch (action) {
      case 'step_viewed':
        this.currentSession.steps_viewed += 1;
        break;
      case 'step_completed':
        this.currentSession.steps_completed += 1;
        break;
      case 'tour_completed':
        this.currentSession.status = 'completed';
        break;
      case 'tour_abandoned':
        this.currentSession.status = 'abandoned';
        break;
      case 'tour_started':
        this.currentSession.status = 'in_progress';
        break;
    }

    // Persist updated session
    if (this.tourId) {
      StorageService.setJSON(`onboarding_session_${this.tourId}`, this.currentSession);
    }
  }

  /**
   * Finalize session - mark as completed/abandoned and save final metrics
   */
  static async finalizeSession(totalSteps: number): Promise<void> {
    if (!this.currentSession || !this.tourId) {
      console.warn('No active session to finalize');
      return;
    }

    // Determine final status if not already set
    let status = this.currentSession.status as 'completed' | 'abandoned' | 'in_progress' | 'skipped';
    if (status === 'in_progress') {
      status = this.currentSession.steps_completed === totalSteps ? 'completed' : 'abandoned';
    }

    // Finalize session with SessionManager
    const finalizedSession = SessionManager.finalizeSession(
      this.currentSession,
      status,
      this.currentSession.steps_viewed,
      this.currentSession.steps_completed,
      totalSteps
    );

    this.currentSession = finalizedSession;

    // Save final session state
    StorageService.setJSON(`onboarding_session_${this.tourId}`, finalizedSession);
    await SessionManager.updateSession(this.tourId, finalizedSession);

    console.log(`Session finalized: ${finalizedSession.session_id} (${status})`);
  }

  /**
   * Get current session (for debugging/testing)
   */
  static getCurrentSession(): AnalyticsSession | null {
    return this.currentSession;
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

  private static generateEventId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
