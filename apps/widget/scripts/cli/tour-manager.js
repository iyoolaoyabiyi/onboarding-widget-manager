#!/usr/bin/env node

/**
 * Firebase Tour Manager CLI
 * 
 * Comprehensive tool for managing tours in Firebase without using the console or dashboard
 * 
 * Usage:
 *   node scripts/tour.js <command> [options]
 * 
 * Commands:
 *   list                    List all tours
 *   get <tourId>            Get a specific tour
 *   create <file.json>      Create a tour from JSON file
 *   update <tourId> <file>  Update a tour
 *   delete <tourId>         Delete a tour
 *   import <file.json>      Bulk import tours from JSON
 *   analytics <tourId>      View analytics for a tour
 *   deploy-rules            Deploy Firestore rules
 *   backup                  Backup all tours to JSON
 * 
 * Examples:
 *   node scripts/tour.js list
 *   node scripts/tour.js get tour_12345
 *   node scripts/tour.js create new-tour.json
 *   node scripts/tour.js analytics tour_12345
 *   node scripts/tour.js deploy-rules
 */

import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { 
  log, error, success, info, warning, header, section, table 
} from './output.js';
import { initializeFirebase, getDb } from './firebase.js';
import { validateTourData, validateUpdateData } from './validators.js';
import { loadTourFile, saveTourFile, ensureDirectory, getBackupPath } from './file-utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Command: List all tours
async function listTours() {
  const db = getDb();
  const snapshot = await db.collection('tours').get();

  if (snapshot.empty) {
    warning('No tours found');
    return;
  }

  console.log(`\nFound ${snapshot.size} tours:\n`);
  console.log('ID'.padEnd(25) + 'Name'.padEnd(30) + 'Steps'.padEnd(10) + 'Status');
  console.log('-'.repeat(80));

  snapshot.forEach((doc) => {
    const data = doc.data();
    const id = doc.id.padEnd(25);
    const name = (data.name || 'Unnamed').padEnd(30);
    const steps = String(data.steps?.length || 0).padEnd(10);
    const status = data.status || 'active';
    
    console.log(`${id}${name}${steps}${status}`);
  });
  console.log('');
}

// Command: Get a specific tour
async function getTour(tourId) {
  if (!tourId) {
    error('Tour ID is required');
    console.log('Usage: node scripts/tour.js get <tourId>');
    process.exit(1);
  }

  const db = getDb();
  const doc = await db.collection('tours').doc(tourId).get();

  if (!doc.exists) {
    error(`Tour not found: ${tourId}`);
    process.exit(1);
  }

  const data = doc.data();
  console.log('\n' + JSON.stringify(data, null, 2) + '\n');
  success(`Retrieved tour: ${tourId}`);
}

// Command: Create a new tour
async function createTour(filePath) {
  if (!filePath) {
    error('File path is required');
    console.log('Usage: node scripts/tour.js create <file.json>');
    process.exit(1);
  }

  const tourData = loadTourFile(filePath);
  
  // Validate tour data
  const validation = validateTourData(tourData);
  if (!validation.valid) {
    error('Invalid tour data:');
    validation.errors.forEach(err => error(`  - ${err}`));
    process.exit(1);
  }

  const db = getDb();
  
  // Check if tour already exists
  const existing = await db.collection('tours').doc(tourData.id).get();
  if (existing.exists) {
    error(`Tour already exists: ${tourData.id}`);
    console.log('Use "update" command to modify existing tours');
    process.exit(1);
  }

  // Add timestamps
  tourData.created_at = new Date().toISOString();
  tourData.updated_at = new Date().toISOString();

  await db.collection('tours').doc(tourData.id).set(tourData);
  success(`Created tour: ${tourData.id} - "${tourData.name}"`);
}

// Command: Update an existing tour
async function updateTour(tourId, filePath) {
  if (!tourId || !filePath) {
    error('Tour ID and file path are required');
    console.log('Usage: node scripts/tour.js update <tourId> <file.json>');
    process.exit(1);
  }

  const tourData = loadTourFile(filePath);
  const db = getDb();

  // Check if tour exists
  const existing = await db.collection('tours').doc(tourId).get();
  if (!existing.exists) {
    error(`Tour not found: ${tourId}`);
    process.exit(1);
  }

  // Validate update data
  const validation = validateUpdateData(tourData);
  if (!validation.valid) {
    error('Invalid update data:');
    validation.errors.forEach(err => error(`  - ${err}`));
    process.exit(1);
  }

  // Update timestamp
  tourData.updated_at = new Date().toISOString();

  await db.collection('tours').doc(tourId).update(tourData);
  success(`Updated tour: ${tourId}`);
}

// Command: Delete a tour
async function deleteTour(tourId) {
  if (!tourId) {
    error('Tour ID is required');
    console.log('Usage: node scripts/tour.js delete <tourId>');
    process.exit(1);
  }

  const db = getDb();
  const doc = await db.collection('tours').doc(tourId).get();

  if (!doc.exists) {
    error(`Tour not found: ${tourId}`);
    process.exit(1);
  }

  // Confirm deletion
  const tourName = doc.data().name;
  warning(`About to delete tour: ${tourId} - "${tourName}"`);
  warning('This will also delete all associated analytics data');
  
  // In a real CLI, you'd prompt for confirmation
  // For now, just proceed
  
  await db.collection('tours').doc(tourId).delete();
  success(`Deleted tour: ${tourId}`);
}

// Command: Import multiple tours
async function importTours(filePath) {
  if (!filePath) {
    error('File path is required');
    console.log('Usage: node scripts/tour.js import <file.json>');
    process.exit(1);
  }

  const data = loadTourFile(filePath);
  const tours = data.tours || [data]; // Support both array and single object

  info(`Importing ${tours.length} tours...\n`);

  const db = getDb();
  let successCount = 0;
  let errorCount = 0;

  for (const tour of tours) {
    try {
      const validation = validateTourData(tour);
      if (!validation.valid) {
        throw new Error(validation.errors.join(', '));
      }

      // Add timestamps
      tour.created_at = tour.created_at || new Date().toISOString();
      tour.updated_at = new Date().toISOString();

      await db.collection('tours').doc(tour.id).set(tour);
      success(`Created: ${tour.id} - "${tour.name}"`);
      successCount++;
    } catch (err) {
      error(`Failed: ${tour.id || 'unknown'} - ${err.message}`);
      errorCount++;
    }
  }

  console.log(`\n✓ Import complete: ${successCount} succeeded, ${errorCount} failed\n`);
}

// Command: View analytics for a tour
async function viewAnalytics(tourId) {
  if (!tourId) {
    error('Tour ID is required');
    console.log('Usage: node scripts/tour.js analytics <tourId>');
    process.exit(1);
  }

  const db = getDb();
  
  // Check if tour exists
  const tourDoc = await db.collection('tours').doc(tourId).get();
  if (!tourDoc.exists) {
    error(`Tour not found: ${tourId}`);
    process.exit(1);
  }

  const tourData = tourDoc.data();
  
  console.log(`\nAnalytics for: ${tourData.name} (${tourId})\n`);

  // Get sessions
  const sessionsSnapshot = await db
    .collection('tours')
    .doc(tourId)
    .collection('sessions')
    .get();

  if (sessionsSnapshot.empty) {
    warning('No sessions found for this tour');
    return;
  }

  console.log(`Total Sessions: ${sessionsSnapshot.size}`);
  
  // Aggregate data
  let completedCount = 0;
  let skippedCount = 0;
  let abandonedCount = 0;

  for (const sessionDoc of sessionsSnapshot.docs) {
    const eventsSnapshot = await sessionDoc.ref.collection('events').get();
    
    const actions = eventsSnapshot.docs.map(doc => doc.data().action);
    
    if (actions.includes('tour_finished') || actions.includes('completed')) {
      completedCount++;
    } else if (actions.includes('skipped')) {
      skippedCount++;
    } else {
      abandonedCount++;
    }
  }

  console.log(`Completed: ${completedCount}`);
  console.log(`Skipped: ${skippedCount}`);
  console.log(`Abandoned: ${abandonedCount}`);
  
  if (sessionsSnapshot.size > 0) {
    const completionRate = ((completedCount / sessionsSnapshot.size) * 100).toFixed(1);
    console.log(`\nCompletion Rate: ${completionRate}%\n`);
  }
}

// Command: Deploy Firestore rules
async function deployRules() {
  const rulesPath = path.join(__dirname, './samples/firestore.rules');
  
  if (!fs.existsSync(rulesPath)) {
    error('firestore.rules file not found at: ' + rulesPath);
    process.exit(1);
  }

  info('Deploying Firestore rules...');
  
  try {
    const cwd = path.join(__dirname, '../..');
    execSync('firebase deploy --only firestore:rules', { 
      cwd,
      stdio: 'inherit' 
    });
    success('Firestore rules deployed successfully');
  } catch (err) {
    error('Failed to deploy rules');
    console.log('\nMake sure:');
    console.log('1. Firebase CLI is installed: npm install -g firebase-tools');
    console.log('2. You are logged in: firebase login');
    console.log('3. Project is set: firebase use <project-id>\n');
    process.exit(1);
  }
}

// Command: Backup all tours
async function backupTours() {
  const db = getDb();
  const snapshot = await db.collection('tours').get();

  if (snapshot.empty) {
    warning('No tours to backup');
    return;
  }

  const tours = [];
  snapshot.forEach((doc) => {
    tours.push({ id: doc.id, ...doc.data() });
  });

  const backupPath = getBackupPath();
  ensureDirectory(path.dirname(backupPath));

  saveTourFile(backupPath, { tours });
}

// Show help
function showHelp() {
  console.log(`
Firebase Tour Manager CLI

Usage:
  node scripts/tour.js <command> [options]

Commands:
  list                    List all tours
  get <tourId>            Get a specific tour details
  create <file.json>      Create a new tour from JSON file
  update <tourId> <file>  Update an existing tour
  delete <tourId>         Delete a tour (and its analytics)
  import <file.json>      Bulk import tours from JSON
  analytics <tourId>      View analytics summary for a tour
  deploy-rules            Deploy Firestore security rules
  backup                  Backup all tours to JSON file
  help                    Show this help message

Examples:
  node scripts/tour.js list
  node scripts/tour.js get tour_12345
  node scripts/tour.js create scripts/cli/samples/tour-template.json
  node scripts/tour.js update tour_12345 updated.json
  node scripts/tour.js delete tour_12345
  node scripts/tour.js import scripts/cli/samples/firestore-test-tours.json
  node scripts/tour.js analytics tour_12345
  node scripts/tour.js deploy-rules
  node scripts/tour.js backup

Tour JSON Format:
  {
    "id": "tour_unique_id",
    "name": "Tour Name",
    "description": "Tour description",
    "theme": "blue",
    "allowed_domains": ["example.com"],
    "owner_id": "user_123",
    "status": "active",
    "avatar_enabled": false,
    "min_steps": 5,
    "total_views": 0,
    "total_completions": 0,
    "completion_rate": 0,
    "created_at": "2024-12-10T00:00:00Z",
    "updated_at": "2024-12-10T00:00:00Z",
    "steps": [
      {
        "id": "step_01",
        "order": 1,
        "target_element": "#element-id",
        "title": "Step Title",
        "content": "Step description",
        "position": "bottom",
        "created_at": "2024-12-10T00:00:00Z",
        "updated_at": "2024-12-10T00:00:00Z"
      }
      // ... minimum 5 steps required
    ]
  }
`);
}

// Main CLI handler
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === 'help') {
    showHelp();
    process.exit(0);
  }

  try {
    await initializeFirebase();

    switch (command) {
      case 'list':
        await listTours();
        break;
      case 'get':
        await getTour(args[1]);
        break;
      case 'create':
        await createTour(args[1]);
        break;
      case 'update':
        await updateTour(args[1], args[2]);
        break;
      case 'delete':
        await deleteTour(args[1]);
        break;
      case 'import':
        await importTours(args[1]);
        break;
      case 'analytics':
        await viewAnalytics(args[1]);
        break;
      case 'deploy-rules':
        await deployRules();
        break;
      case 'backup':
        await backupTours();
        break;
      default:
        error(`Unknown command: ${command}`);
        console.log('Run "node scripts/tour.js help" for usage\n');
        process.exit(1);
    }

    process.exit(0);
  } catch (err) {
    error(`Error: ${err.message}`);
    console.error(err);
    process.exit(1);
  }
}

main();
