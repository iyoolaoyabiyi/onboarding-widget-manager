import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import type { AnalyticsSession, AnalyticsEvent, DropOffItem } from '@/components/dashboard/types';

interface AnalyticsMetrics {
  totalViews: number;
  totalCompletions: number;
  completionRate: number;
  averageDuration: number;
  dropOffByStep: DropOffItem[];
  recentSessions: AnalyticsSession[];
  visitorCount: number;
}

interface DropOffCalculation {
  [step: number]: {
    viewed: number;
    completed: number;
  };
}

/**
 * Analytics query service for dashboard
 * Handles complex analytics queries and aggregations
 */
export class AnalyticsQueryService {
  private static db = getFirestore();

  /**
   * Get analytics metrics for a specific tour
   */
  static async getTourMetrics(tourId: string, daysBack: number = 7): Promise<AnalyticsMetrics> {
    try {
      const sessions = await this.getSessionsBetweenDates(tourId, daysBack);
      const events = await this.getEventsBetweenDates(tourId, daysBack);

      const metrics: AnalyticsMetrics = {
        totalViews: sessions.length,
        totalCompletions: sessions.filter((s) => s.status === 'completed').length,
        completionRate: 0,
        averageDuration: 0,
        dropOffByStep: [],
        recentSessions: sessions.slice(0, 10),
        visitorCount: new Set(sessions.map((s) => s.visitor_id)).size,
      };

      // Calculate completion rate
      if (sessions.length > 0) {
        metrics.completionRate = (metrics.totalCompletions / sessions.length) * 100;
      }

      // Calculate average duration
      const validDurations = sessions.filter((s) => s.duration_ms).map((s) => s.duration_ms || 0);
      if (validDurations.length > 0) {
        metrics.averageDuration = validDurations.reduce((a, b) => a + b) / validDurations.length;
      }

      // Calculate drop-off by step
      metrics.dropOffByStep = this.calculateDropOffByStep(sessions, events);

      return metrics;
    } catch (error) {
      console.error('Failed to get tour metrics:', error);
      return {
        totalViews: 0,
        totalCompletions: 0,
        completionRate: 0,
        averageDuration: 0,
        dropOffByStep: [],
        recentSessions: [],
        visitorCount: 0,
      };
    }
  }

  /**
   * Get sessions for a tour within date range
   */
  private static async getSessionsBetweenDates(
    tourId: string,
    daysBack: number
  ): Promise<AnalyticsSession[]> {
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - daysBack);

    const sessionsRef = collection(this.db, 'tours', tourId, 'sessions');
    const q = query(
      sessionsRef,
      where('started_at', '>=', dateThreshold.toISOString()),
      orderBy('started_at', 'desc')
    );

    const snap = await getDocs(q);
    return snap.docs.map((doc) => ({
      ...doc.data(),
      session_id: doc.id,
    })) as AnalyticsSession[];
  }

  /**
   * Get events for a tour within date range
   */
  private static async getEventsBetweenDates(
    tourId: string,
    daysBack: number
  ): Promise<AnalyticsEvent[]> {
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - daysBack);

    const sessionsRef = collection(this.db, 'tours', tourId, 'sessions');
    const sessionsSnap = await getDocs(
      query(
        sessionsRef,
        where('started_at', '>=', dateThreshold.toISOString())
      )
    );

    const allEvents: AnalyticsEvent[] = [];

    for (const sessionDoc of sessionsSnap.docs) {
      const eventsRef = collection(sessionDoc.ref, 'events');
      const eventsSnap = await getDocs(eventsRef);
      allEvents.push(
        ...eventsSnap.docs.map((doc) => ({
          event_id: doc.id,
          ...doc.data(),
        })) as AnalyticsEvent[]
      );
    }

    return allEvents;
  }

  /**
   * Calculate drop-off by step
   */
  private static calculateDropOffByStep(
    sessions: AnalyticsSession[],
    events: AnalyticsEvent[]
  ): DropOffItem[] {
    if (sessions.length === 0) return [];

    const dropOff: DropOffCalculation = {};

    // Track which steps were viewed/completed in each session
    sessions.forEach(() => {
      const sessionEvents = events.filter((e) => e.action === 'step_viewed' || e.action === 'step_completed');

      sessionEvents.forEach((event) => {
        if (!event.step_id) return;

        const stepNum = parseInt(event.step_id.split('_').pop() || '0', 10);
        if (!dropOff[stepNum]) {
          dropOff[stepNum] = { viewed: 0, completed: 0 };
        }

        if (event.action === 'step_viewed') {
          dropOff[stepNum].viewed += 1;
        } else if (event.action === 'step_completed') {
          dropOff[stepNum].completed += 1;
        }
      });
    });

    // Calculate drop-off percentage for each step
    const result: DropOffItem[] = [];
    let previousViewed = sessions.length;

    Object.keys(dropOff)
      .map(Number)
      .sort((a, b) => a - b)
      .forEach((step) => {
        const viewed = dropOff[step].viewed;
        const dropOffPercent = previousViewed > 0 ? ((previousViewed - viewed) / previousViewed) * 100 : 0;

        result.push({
          step,
          percent: Math.round(dropOffPercent),
        });

        previousViewed = viewed;
      });

    return result;
  }

  /**
   * Get recent events across all tours for a user
   */
  static async getRecentEvents(tourId: string, limit_count: number = 20): Promise<AnalyticsEvent[]> {
    try {
      const sessionsRef = collection(this.db, 'tours', tourId, 'sessions');
      const sessionsSnap = await getDocs(sessionsRef);

      const allEvents: AnalyticsEvent[] = [];

      for (const sessionDoc of sessionsSnap.docs.slice(0, 5)) {
        const eventsRef = collection(sessionDoc.ref, 'events');
        const eventsSnap = await getDocs(query(eventsRef, orderBy('timestamp', 'desc'), limit(5)));
        allEvents.push(
          ...eventsSnap.docs.map((doc) => ({
            event_id: doc.id,
            ...doc.data(),
          })) as AnalyticsEvent[]
        );
      }

      // Sort by timestamp and return top N
      return allEvents
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, limit_count);
    } catch (error) {
      console.error('Failed to get recent events:', error);
      return [];
    }
  }

  /**
   * Get sessions for a specific visitor
   */
  static async getVisitorSessions(tourId: string, visitorId: string): Promise<AnalyticsSession[]> {
    try {
      const sessionsRef = collection(this.db, 'tours', tourId, 'sessions');
      const q = query(
        sessionsRef,
        where('visitor_id', '==', visitorId),
        orderBy('started_at', 'desc')
      );

      const snap = await getDocs(q);
      return snap.docs.map((doc) => ({
        ...doc.data(),
        session_id: doc.id,
      })) as AnalyticsSession[];
    } catch (error) {
      console.error('Failed to get visitor sessions:', error);
      return [];
    }
  }

  /**
   * Get sessions by status
   */
  static async getSessionsByStatus(
    tourId: string,
    status: 'completed' | 'abandoned' | 'skipped' | 'in_progress'
  ): Promise<AnalyticsSession[]> {
    try {
      const sessionsRef = collection(this.db, 'tours', tourId, 'sessions');
      const q = query(
        sessionsRef,
        where('status', '==', status),
        orderBy('started_at', 'desc')
      );

      const snap = await getDocs(q);
      return snap.docs.map((doc) => ({
        ...doc.data(),
        session_id: doc.id,
      })) as AnalyticsSession[];
    } catch (error) {
      console.error(`Failed to get ${status} sessions:`, error);
      return [];
    }
  }
}
