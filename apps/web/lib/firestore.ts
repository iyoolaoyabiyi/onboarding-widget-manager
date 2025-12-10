import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Types (define locally to avoid circular imports)
interface TourStep {
  id: string;
  tour_id?: string;
  order: number;
  target_element: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  title: string;
  content: string;
  image_url?: string;
  video_url?: string;
  cta_text?: string;
  cta_url?: string;
  created_at?: string;
  updated_at?: string;
}

interface TourConfig {
  id: string;
  name: string;
  description?: string;
  theme: 'greyscale' | 'blue' | 'green' | 'red';
  allowed_domains: string[];
  owner_id: string;
  status: 'draft' | 'active' | 'paused' | 'archived';
  avatar_enabled: boolean;
  min_steps: number;
  total_views: number;
  total_completions: number;
  completion_rate: number;
  steps: TourStep[];
  created_at: string;
  updated_at: string;
  last_viewed_at?: string;
}

export class FirestoreService {
  private static db = getFirestore();

  /**
   * Get current user ID
   */
  static getCurrentUserId(): string | null {
    const auth = getAuth();
    return auth.currentUser?.uid ?? null;
  }

  /**
   * Create a new tour
   */
  static async createTour(tour: TourConfig): Promise<void> {
    const userId = this.getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');

    const tourRef = doc(this.db, 'tours', tour.id);
    const now = new Date().toISOString();

    await setDoc(tourRef, {
      ...tour,
      owner_id: userId,
      created_at: now,
      updated_at: now,
    });
  }

  /**
   * Get a single tour by ID
   */
  static async getTour(tourId: string): Promise<TourConfig | null> {
    const tourRef = doc(this.db, 'tours', tourId);
    const snap = await getDoc(tourRef);

    if (!snap.exists()) {
      return null;
    }

    return snap.data() as TourConfig;
  }

  /**
   * Get all tours for current user
   */
  static async getUserTours(userId?: string): Promise<TourConfig[]> {
    const resolvedUserId = userId ?? this.getCurrentUserId();
    if (!resolvedUserId) return [];

    const toursRef = collection(this.db, 'tours');
    const q = query(toursRef, where('owner_id', '==', resolvedUserId));
    const snap = await getDocs(q);

    return snap.docs.map((doc) => doc.data() as TourConfig);
  }

  /**
   * Get all tours (fallback when ownership data is missing)
   * Note: Reads are already allowed by rules; caller controls visibility.
   */
  static async getAllTours(): Promise<TourConfig[]> {
    const toursRef = collection(this.db, 'tours');
    const snap = await getDocs(toursRef);
    return snap.docs.map((doc) => doc.data() as TourConfig);
  }

  /**
   * Update a tour
   */
  static async updateTour(tourId: string, updates: Partial<TourConfig>): Promise<void> {
    const tourRef = doc(this.db, 'tours', tourId);
    await updateDoc(tourRef, {
      ...updates,
      updated_at: new Date().toISOString(),
    });
  }

  /**
   * Delete a tour
   */
  static async deleteTour(tourId: string): Promise<void> {
    const tourRef = doc(this.db, 'tours', tourId);
    await deleteDoc(tourRef);
  }

  /**
   * Add a step to a tour (embedded in tour document)
   */
  static async addStep(tourId: string, step: TourStep): Promise<void> {
    const tour = await this.getTour(tourId);
    if (!tour) throw new Error('Tour not found');

    const steps = tour.steps || [];
    steps.push(step);

    await this.updateTour(tourId, { steps });
  }

  /**
   * Remove a step from a tour
   */
  static async removeStep(tourId: string, stepId: string): Promise<void> {
    const tour = await this.getTour(tourId);
    if (!tour) throw new Error('Tour not found');

    const steps = tour.steps?.filter((s) => s.id !== stepId) || [];
    await this.updateTour(tourId, { steps });
  }

  /**
   * Get analytics for a tour
   */
  static async getAnalytics(
    tourId: string
  ): Promise<{ views: number; completions: number; completionRate: number }> {
    const tour = await this.getTour(tourId);
    if (!tour)
      return { views: 0, completions: 0, completionRate: 0 };

    return {
      views: tour.total_views || 0,
      completions: tour.total_completions || 0,
      completionRate: tour.completion_rate || 0,
    };
  }
}
