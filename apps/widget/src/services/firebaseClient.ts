import { initializeApp, getApps } from 'firebase/app';
import type { FirebaseApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';

function readEnv(key: string): string | undefined {
  return (import.meta.env && (import.meta.env[key] as string)) || undefined;
}

let cachedDb: Firestore | null = null;

export function getFirestoreClient(): Firestore | null {
  if (cachedDb) return cachedDb;

  try {
    const apiKey = readEnv('VITE_FIREBASE_API_KEY');
    const authDomain = readEnv('VITE_FIREBASE_AUTH_DOMAIN');
    const projectId = readEnv('VITE_FIREBASE_PROJECT_ID');
    const storageBucket = readEnv('VITE_FIREBASE_STORAGE_BUCKET');
    const messagingSenderId = readEnv('VITE_FIREBASE_MESSAGING_SENDER_ID');
    const appId = readEnv('VITE_FIREBASE_APP_ID');

    if (!projectId || !apiKey) {
      // No Firebase config present
      return null;
    }

    const firebaseConfig = {
      apiKey,
      authDomain,
      projectId,
      storageBucket,
      messagingSenderId,
      appId,
    };

    const apps = getApps();
    const app: FirebaseApp = apps && apps.length > 0 ? apps[0] : initializeApp(firebaseConfig);

    cachedDb = getFirestore(app);
    return cachedDb;
  } catch (error) {
    // Do not throw, caller should gracefully fallback to default config
    console.warn('Firebase initialization failed:', error);
    return null;
  }
}
