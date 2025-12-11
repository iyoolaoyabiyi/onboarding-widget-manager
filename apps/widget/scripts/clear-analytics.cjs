#!/usr/bin/env node

/**
 * Clear all analytics data from Firebase Firestore
 * 
 * This script will:
 * 1. Delete all sessions and events from all tours
 * 2. Reset analytics counters (total_views, total_completions, completion_rate) to 0
 * 
 * Usage:
 *   node scripts/clear-analytics.js
 *   # or
 *   npm run clear-analytics
 */

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Initialize Firebase Admin SDK
// Make sure GOOGLE_APPLICATION_CREDENTIALS is set or serviceAccountKey.json exists
try {
  initializeApp({
    credential: cert(require('../serviceAccountKey.json'))
  });
} catch (error) {
  console.error('Failed to initialize Firebase Admin SDK');
  console.error('Make sure serviceAccountKey.json exists in apps/widget/');
  console.error('Error:', error.message);
  process.exit(1);
}

const db = getFirestore();

async function clearAllAnalytics() {
  console.log('Starting analytics cleanup...\n');
  
  let totalSessionsDeleted = 0;
  let totalEventsDeleted = 0;
  let totalToursProcessed = 0;
  
  try {
    // Get all tours
    const toursSnapshot = await db.collection('tours').get();
    
    console.log(`Found ${toursSnapshot.size} tours\n`);
    
    for (const tourDoc of toursSnapshot.docs) {
      const tourId = tourDoc.id;
      const tourData = tourDoc.data();
      console.log(`Processing tour: ${tourId} (${tourData.name || 'Unnamed'})`);
      
      // Get all sessions for this tour
      const sessionsSnapshot = await db
        .collection('tours')
        .doc(tourId)
        .collection('sessions')
        .get();
      
      console.log(`   Found ${sessionsSnapshot.size} sessions`);
      
      for (const sessionDoc of sessionsSnapshot.docs) {
        const sessionId = sessionDoc.id;
        
        // Delete all events in this session
        const eventsSnapshot = await db
          .collection('tours')
          .doc(tourId)
          .collection('sessions')
          .doc(sessionId)
          .collection('events')
          .get();
        
        // Batch delete events
        const eventDeletePromises = eventsSnapshot.docs.map(eventDoc => 
          eventDoc.ref.delete()
        );
        await Promise.all(eventDeletePromises);
        totalEventsDeleted += eventsSnapshot.size;
        
        // Delete the session
        await sessionDoc.ref.delete();
        totalSessionsDeleted++;
      }
      
      // Reset analytics counters on the tour document
      await tourDoc.ref.update({
        total_views: 0,
        total_completions: 0,
        completion_rate: 0,
        updated_at: new Date().toISOString(),
      });
      
      totalToursProcessed++;
      console.log(`   Cleared analytics (${sessionsSnapshot.size} sessions, ${totalEventsDeleted} events)`);
      console.log('');
    }
    
    console.log('Analytics cleanup complete!\n');
    console.log('Summary:');
    console.log(`   - Tours processed: ${totalToursProcessed}`);
    console.log(`   - Sessions deleted: ${totalSessionsDeleted}`);
    console.log(`   - Events deleted: ${totalEventsDeleted}`);
    console.log('');
    
  } catch (error) {
    console.error('Error clearing analytics:', error);
    throw error;
  }
}

// Run the cleanup
clearAllAnalytics()
  .then(() => {
    console.log('Done! You can now start fresh with clean analytics.\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\nFailed:', error.message);
    process.exit(1);
  });
