import type { TourConfig } from './types';
import { DEFAULT_TOUR_CONFIG } from './constants';
import { getFirestoreClient } from './firebaseClient';
import { doc, getDoc } from 'firebase/firestore';

export class ConfigLoader {
  static async loadTourConfig(tourId: string): Promise<TourConfig> {
    // 1) Try Firestore if configured
    try {
      const db = getFirestoreClient();
      if (db && tourId) {
        try {
          const docRef = doc(db, 'tours', tourId);
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            const data = snap.data() as TourConfig;
            console.log(`Loaded tour config from Firestore: ${data.name || data.id}`);
            return data;
          } else {
            console.warn(`No tour found in Firestore for id: ${tourId}`);
          }
        } catch (error) {
          console.warn('Failed to fetch tour from Firestore:', error);
        }
      }
    } catch (err) {
      console.warn('Firestore attempt failed:', err);
    }

    // 2) Fall back to default configuration
    console.warn(`Using default tour config. Could not load tour: ${tourId}`);
    return DEFAULT_TOUR_CONFIG;
  }

  static getTourIdFromScript(): string | null {
    // Support generic embed snippet: <script src=".../widget.js" data-tour-id="tour_888"></script>
    const scriptTag = document.querySelector('script[data-tour-id]');
    if (scriptTag) {
      return scriptTag.getAttribute('data-tour-id');
    }
    return null;
  }

  static validateConfig(config: TourConfig): boolean {
    if (!config.steps || config.steps.length === 0) {
      console.error('Tour configuration is missing steps.');
      return false;
    }

    if (config.steps.length < 5) {
      console.error(`Tour has ${config.steps.length} steps. Minimum required is 5.`);
      return false;
    }

    return true;
  }
}
