/**
 * Firebase initialization and client utilities
 */

import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { error, info } from './output.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let cachedDb = null;

export async function initializeFirebase() {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  const widgetDir = path.join(__dirname, '../..');
  const serviceAccountPath = path.join(widgetDir, 'serviceAccountKey.json');

  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccountData = fs.readFileSync(serviceAccountPath, 'utf-8');
    const serviceAccount = JSON.parse(serviceAccountData);
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.project_id,
    });
    info('Connected to Firebase');
    return admin.app();
  } else {
    error('Service account key not found');
    console.log('\nTo set up:');
    console.log('1. Go to Firebase Console > Project Settings > Service Accounts');
    console.log('2. Generate a new private key');
    console.log(`3. Save as: ${path.relative(process.cwd(), serviceAccountPath)}\n`);
    process.exit(1);
  }
}

export function getFirestore() {
  if (!cachedDb && admin.apps.length > 0) {
    cachedDb = admin.firestore();
  }
  return cachedDb;
}

export function getDb() {
  return getFirestore();
}
