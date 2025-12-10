import {
  collection,
  doc,
  setDoc,
  getDocs,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';

interface TourStep {
  id?: string;
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

/**
 * Migration service for moving steps from embedded to subcollection
 * Handles tours with many steps (> 10) or when need for per-step analytics
 * Progressive migration - doesn't require schema change, works with current structure
 */
export class StepMigrationService {
  private static db = getFirestore();

  /**
   * Check if a tour should be migrated (has many steps)
   */
  static shouldMigrate(stepCount: number): boolean {
    return stepCount > 10;
  }

  /**
   * Migrate steps from embedded in tour document to subcollection
   * Returns true if successful, false otherwise
   */
  static async migrateStepsToSubcollection(tourId: string, steps: TourStep[]): Promise<boolean> {
    if (steps.length === 0) {
      console.warn('No steps to migrate');
      return false;
    }

    try {
      const batch = writeBatch(this.db);

      // Write each step to subcollection
      steps.forEach((step) => {
        const stepId = step.id || `${tourId}_step_${step.order}`;
        const stepRef = doc(this.db, 'tours', tourId, 'steps', stepId);

        batch.set(stepRef, {
          ...step,
          tour_id: tourId,
          migrated_at: new Date().toISOString(),
        });
      });

      // Update tour document to indicate steps have been migrated
      const tourRef = doc(this.db, 'tours', tourId);
      batch.update(tourRef, {
        steps_in_subcollection: true,
        steps_migrated_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      await batch.commit();
      console.log(`Successfully migrated ${steps.length} steps for tour ${tourId}`);
      return true;
    } catch (error) {
      console.error('Failed to migrate steps:', error);
      return false;
    }
  }

  /**
   * Load steps from subcollection (if available) or fallback to embedded
   */
  static async loadSteps(tourId: string, embeddedSteps?: TourStep[]): Promise<TourStep[]> {
    try {
      const stepsRef = collection(this.db, 'tours', tourId, 'steps');
      const snap = await getDocs(stepsRef);

      if (snap.size > 0) {
        // Steps are in subcollection
        const steps = snap.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as TourStep[];

        // Sort by order
        return steps.sort((a, b) => a.order - b.order);
      }
    } catch (error) {
      console.warn('Failed to load steps from subcollection:', error);
    }

    // Fallback to embedded steps
    if (embeddedSteps && embeddedSteps.length > 0) {
      return embeddedSteps.sort((a, b) => a.order - b.order);
    }

    return [];
  }

  /**
   * Add a new step to the correct location (subcollection or embedded)
   * Called when user adds a step after migration
   */
  static async addStep(tourId: string, step: TourStep, inSubcollection: boolean): Promise<void> {
    if (inSubcollection) {
      // Add to subcollection
      const stepId = step.id || `${tourId}_step_${step.order}`;
      const stepRef = doc(this.db, 'tours', tourId, 'steps', stepId);
      await setDoc(stepRef, {
        ...step,
        tour_id: tourId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    } else {
      // Will be handled by parent component (embedded in tour doc)
      console.warn('Embedded step updates should be handled by TourEditor');
    }
  }

  /**
   * Update a step in the correct location
   */
  static async updateStep(
    tourId: string,
    step: TourStep,
    inSubcollection: boolean
  ): Promise<void> {
    if (inSubcollection) {
      // Update in subcollection
      const stepId = step.id || `${tourId}_step_${step.order}`;
      const stepRef = doc(this.db, 'tours', tourId, 'steps', stepId);
      await updateDoc(stepRef, {
        ...step,
        updated_at: new Date().toISOString(),
      });
    } else {
      // Will be handled by parent component (embedded in tour doc)
      console.warn('Embedded step updates should be handled by TourEditor');
    }
  }

  /**
   * Batch migrate multiple tours
   */
  static async batchMigrateTours(tours: Array<{ id: string; steps: TourStep[] }>): Promise<{
    successful: number;
    failed: number;
  }> {
    let successful = 0;
    let failed = 0;

    for (const tour of tours) {
      if (this.shouldMigrate(tour.steps.length)) {
        const result = await this.migrateStepsToSubcollection(tour.id, tour.steps);
        if (result) {
          successful++;
        } else {
          failed++;
        }
      }
    }

    console.log(`Migration complete: ${successful} successful, ${failed} failed`);
    return { successful, failed };
  }

  /**
   * Check if a tour has been migrated
   */
  static async isTourMigrated(tourId: string): Promise<boolean> {
    try {
      const stepsRef = collection(this.db, 'tours', tourId, 'steps');
      const snap = await getDocs(stepsRef);
      return snap.size > 0;
    } catch {
      return false;
    }
  }

  /**
   * Count steps in subcollection
   */
  static async countStepsInSubcollection(tourId: string): Promise<number> {
    try {
      const stepsRef = collection(this.db, 'tours', tourId, 'steps');
      const snap = await getDocs(stepsRef);
      return snap.size;
    } catch {
      return 0;
    }
  }

  /**
   * Get memory usage estimate for steps
   * Useful for determining if migration is needed
   */
  static estimateDocumentSize(steps: TourStep[]): number {
    // Rough estimate: 1 step ~= 500 bytes
    // Firestore document max = 1MB
    // Recommend migration at 10 steps (~5KB)
    return steps.length * 500;
  }

  /**
   * Generate migration report
   */
  static async generateMigrationReport(tourIds: string[]): Promise<{
    toursNeedingMigration: string[];
    toursSizeEstimate: Map<string, number>;
    totalSize: number;
  }> {
    const toursNeedingMigration: string[] = [];
    const toursSizeEstimate = new Map<string, number>();
    let totalSize = 0;

    for (const tourId of tourIds) {
      const stepCount = await this.countStepsInSubcollection(tourId);
      if (stepCount > 10) {
        toursNeedingMigration.push(tourId);
      }
      const size = stepCount * 500;
      toursSizeEstimate.set(tourId, size);
      totalSize += size;
    }

    return {
      toursNeedingMigration,
      toursSizeEstimate,
      totalSize,
    };
  }
}
