import type { AnalyticsSession, AnalyticsSessionStatus } from '../types/types';
import { getFirestoreClient } from '../services/firebaseClient';
import { doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';

/**
 * Manages tour session lifecycle and aggregation
 * Handles session creation, updates, and completion tracking
 */
export class SessionManager {
  private static readonly SESSION_PREFIX = 'session_';
  private static readonly SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

  /**
   * Create a new analytics session
   */
  static createSession(
    tourId: string,
    visitorId: string,
    url: string
  ): AnalyticsSession {
    const now = new Date().toISOString();
    const sessionId = this.generateSessionId();

    const session: AnalyticsSession = {
      session_id: sessionId,
      tour_id: tourId,
      started_at: now,
      url,
      domain: new URL(url).hostname,
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      viewport_width: typeof window !== 'undefined' ? window.innerWidth : 0,
      viewport_height: typeof window !== 'undefined' ? window.innerHeight : 0,
      status: 'in_progress',
      steps_viewed: 0,
      steps_completed: 0,
      completion_rate: 0,
      visitor_id: visitorId,
      referrer: typeof document !== 'undefined' ? document.referrer : undefined,
    };

    return session;
  }

  /**
   * Save session to Firestore
   */
  static async saveSession(tourId: string, session: AnalyticsSession): Promise<void> {
    const db = getFirestoreClient();
    if (!db) {
      console.warn('Firestore not available. Session not saved.');
      return;
    }

    try {
      const sessionRef = doc(db, 'tours', tourId, 'sessions', session.session_id);
      await setDoc(sessionRef, {
        ...session,
        created_at: session.started_at,
        updated_at: new Date().toISOString(),
      });
      console.log(`Session ${session.session_id} saved to Firestore`);
    } catch (error) {
      console.warn('Failed to save session to Firestore:', error);
    }
  }

  /**
   * Load session from Firestore
   */
  static async loadSession(tourId: string, sessionId: string): Promise<AnalyticsSession | null> {
    const db = getFirestoreClient();
    if (!db) {
      console.warn('Firestore not available. Session not loaded.');
      return null;
    }

    try {
      const sessionRef = doc(db, 'tours', tourId, 'sessions', sessionId);
      const snap = await getDoc(sessionRef);
      if (snap.exists()) {
        return snap.data() as AnalyticsSession;
      }
      return null;
    } catch (error) {
      console.warn('Failed to load session from Firestore:', error);
      return null;
    }
  }

  /**
   * Update session status and metrics
   */
  static async updateSession(
    tourId: string,
    session: AnalyticsSession
  ): Promise<void> {
    const db = getFirestoreClient();
    if (!db) {
      console.warn('Firestore not available. Session not updated.');
      return;
    }

    try {
      const sessionRef = doc(db, 'tours', tourId, 'sessions', session.session_id);
      
      const updateData = {
        status: session.status,
        steps_viewed: session.steps_viewed,
        steps_completed: session.steps_completed,
        completion_rate: session.completion_rate,
        ended_at: session.ended_at,
        duration_ms: session.duration_ms,
        updated_at: new Date().toISOString(),
      };

      await updateDoc(sessionRef, updateData);
      console.log(`Session ${session.session_id} updated in Firestore`);
    } catch (error) {
      console.warn('Failed to update session in Firestore:', error);
    }
  }

  /**
   * Mark session as completed and calculate final metrics
   */
  static finalizeSession(
    session: AnalyticsSession,
    status: AnalyticsSessionStatus,
    stepsViewed: number,
    stepsCompleted: number,
    totalSteps: number
  ): AnalyticsSession {
    const now = new Date().toISOString();
    const startTime = new Date(session.started_at).getTime();
    const endTime = new Date(now).getTime();
    const durationMs = endTime - startTime;

    return {
      ...session,
      status,
      ended_at: now,
      duration_ms: durationMs,
      steps_viewed: stepsViewed,
      steps_completed: stepsCompleted,
      completion_rate: totalSteps > 0 ? (stepsCompleted / totalSteps) * 100 : 0,
    };
  }

  /**
   * Check if session is expired (inactive for > 30 minutes)
   */
  static isSessionExpired(session: AnalyticsSession): boolean {
    const lastActivity = new Date(session.started_at).getTime();
    const now = new Date().getTime();
    return now - lastActivity > this.SESSION_TIMEOUT_MS;
  }

  /**
   * Generate unique session ID
   */
  private static generateSessionId(): string {
    return `${this.SESSION_PREFIX}${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}
