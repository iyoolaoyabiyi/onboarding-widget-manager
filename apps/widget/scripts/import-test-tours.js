#!/usr/bin/env node

/**
 * Import test tours from firestore-test-tours.json into Firestore
 *
 * Usage:
 *   node scripts/import-test-tours.js
 *
 * Prerequisites:
 *   1. Firebase CLI installed and logged in
 *   2. Firebase project set: `firebase use onboarding-tour-app`
 *   3. Service account key (or use Firebase emulator)
 */

import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try to initialize with service account key
async function initializeFirebase() {
  const serviceAccountPath = path.join(__dirname, '../serviceAccountKey.json');

  if (fs.existsSync(serviceAccountPath)) {
    const { default: serviceAccount } = await import(
      `file://${serviceAccountPath}`,
      { assert: { type: 'json' } }
    );
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.project_id,
    });
    console.log('✓ Initialized Firebase with service account key');
  } else {
    // Try to use default credentials (e.g., from Firebase CLI or environment)
    try {
      admin.initializeApp({
        projectId: 'onboarding-tour-app',
      });
      console.log('✓ Initialized Firebase with default credentials');
    } catch (error) {
      console.error('✗ Failed to initialize Firebase');
      console.error('');
      console.error('Please create a service account key:');
      console.error('1. Go to Firebase Console > Project Settings > Service Accounts');
      console.error('2. Generate a new private key');
      console.error('3. Save it as: apps/widget/serviceAccountKey.json');
      console.error('');
      console.error('Or set up Firebase CLI:');
      console.error('   firebase login');
      console.error('   firebase use onboarding-tour-app');
      process.exit(1);
    }
  }
}

async function importTours() {
  try {
    await initializeFirebase();

    const db = admin.firestore();
    const testToursPath = path.join(__dirname, '../firestore-test-tours.json');

    if (!fs.existsSync(testToursPath)) {
      throw new Error(`Test tours file not found: ${testToursPath}`);
    }

    const testToursData = fs.readFileSync(testToursPath, 'utf-8');
    const { tours } = JSON.parse(testToursData);

    if (!Array.isArray(tours) || tours.length === 0) {
      throw new Error('No tours found in firestore-test-tours.json');
    }

    console.log(`\n📝 Importing ${tours.length} test tours to Firestore...\n`);

    let successCount = 0;
    let errorCount = 0;

    for (const tour of tours) {
      try {
        if (!tour.id) {
          throw new Error('Tour missing required field: id');
        }

        await db.collection('tours').doc(tour.id).set(tour);
        console.log(`✓ Created tour: ${tour.id} — "${tour.name}"`);
        successCount++;
      } catch (error) {
        console.error(`✗ Failed to create tour ${tour.id}:`, error.message);
        errorCount++;
      }
    }

    console.log(`\n✓ Import complete!`);
    console.log(`  Success: ${successCount}/${tours.length}`);
    if (errorCount > 0) {
      console.log(`  Errors: ${errorCount}/${tours.length}`);
    }

    console.log(`\nNext steps:`);
    console.log(`  1. Start the widget dev server:`);
    console.log(`     cd apps/widget && pnpm dev`);
    console.log(`  2. Visit http://localhost:5173/public/embed-demo.html`);
    console.log(`  3. Check the browser console for: "Loaded tour config from Firestore"`);
    console.log(`\n`);

    process.exit(errorCount > 0 ? 1 : 0);
  } catch (error) {
    console.error('✗ Import failed:', error.message);
    process.exit(1);
  }
}

importTours();
