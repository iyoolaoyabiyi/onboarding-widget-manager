# Firestore Test Tours Setup

This guide explains how to manually create test tour documents in Firestore to test the widget.

## File: `firestore-test-tours.json`

The file `firestore-test-tours.json` contains sample tour configurations that match your widget's `TourConfig` schema.

### Available Test Tours

1. **tour_12345** — "New User Onboarding" (blue theme, #3498db)
2. **tour_feature_intro** — "Feature Introduction Tour" (green theme, #27ae60)
3. **tour_custom_template** — "Custom Template Tour" (red theme, #e74c3c)

## How to Create a Tour in Firestore

### Option 1: Firebase Console (Easiest)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **onboarding-tour-app**
3. Navigate to **Firestore Database**
4. Click **Create Document** in the `tours` collection
5. Set the **Document ID** to match the tour's `id` field (e.g., `tour_12345`)
6. Copy one of the tour objects from `firestore-test-tours.json` and paste the fields into the form
7. Click **Save**

### Option 2: Firebase CLI (Advanced)

```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Set your project
firebase use onboarding-tour-app

# Import data (if using a bulk import script)
# See option 3 below
```

### Option 3: Programmatic (Node.js Script)

Create a file `scripts/import-test-tours.js`:

```javascript
const admin = require('firebase-admin');
const serviceAccount = require('./path/to/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'onboarding-tour-app',
});

const db = admin.firestore();
const testTours = require('../firestore-test-tours.json');

async function importTours() {
  for (const tour of testTours.tours) {
    await db.collection('tours').doc(tour.id).set(tour);
    console.log(`Created tour: ${tour.id}`);
  }
  console.log('All test tours imported!');
  process.exit(0);
}

importTours().catch(error => {
  console.error('Error importing tours:', error);
  process.exit(1);
});
```

Run with:
```bash
node scripts/import-test-tours.js
```

## Testing the Widget

### With the Demo

1. Start the widget dev server:
   ```bash
   cd apps/widget
   pnpm dev
   ```

2. Visit `http://localhost:5173/public/embed-demo.html`
   - The widget will try to fetch `tours/tour_12345` from Firestore
   - If it exists, the tour will load from the database
   - If not, it falls back to `DEFAULT_TOUR_CONFIG`

3. Check the browser console for logs:
   - `"Loaded tour config from Firestore: ..."` — Success!
   - `"No tour found in Firestore for id: ..."` — Tour ID not in database
   - Analytics events are logged and sent to Firestore `analytics` collection

### With Different Tour IDs

Edit `public/embed-demo.html` to use a different tour ID:

```html
<!-- Change data-tour-id to match a tour you created in Firestore -->
<script src="/onboarding-tour.umd.js" data-tour-id="tour_feature_intro"></script>
```

## Adding Custom Tours

Edit `firestore-test-tours.json` to add your own tour:

```json
{
  "id": "tour_my_custom",
  "name": "My Custom Tour",
  "theme_color": "#YOUR_HEX_COLOR",
  "owner_id": "your_user_id",
  "base_url": "https://yourapp.com",
  "created_at": "2024-12-09T14:00:00Z",
  "steps": [
    {
      "id": "step_1",
      "order": 1,
      "target_element": "#element-id",
      "title": "Step Title",
      "content": "Step description.",
      "position": "bottom"
    }
    // ... more steps (minimum 5 required)
  ]
}
```

Then create it in Firestore using one of the methods above.

## Schema Reference

```typescript
interface TourConfig {
  id: string;                           // Unique tour ID (used as document ID in Firestore)
  name: string;                         // Display name
  theme_color: string;                  // Hex color for highlights
  steps: TourStep[];                    // Array of tour steps (minimum 5)
  owner_id?: string;                    // (Optional) Creator's user ID
  base_url?: string;                    // (Optional) Where this tour will be deployed
  created_at?: string;                  // (Optional) ISO timestamp
}

interface TourStep {
  id: string;                           // Unique step ID
  order: number;                        // Step order (1-based)
  target_element: string;               // CSS selector (e.g., "#my-button")
  title: string;                        // Step title
  content: string;                      // Step description
  position: "top" | "bottom" | "left" | "right";  // Tooltip position
}
```

## Firestore Rules for Testing

Ensure your Firestore security rules allow reads/writes for testing:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read from tours collection (for the widget)
    match /tours/{document=**} {
      allow read: if true;
    }

    // Allow write to analytics collection (for tracking)
    match /analytics/{document=**} {
      allow create: if true;
      allow read: if true;
    }
  }
}
```

**⚠️ Warning:** These rules are permissive for development. Tighten them for production!

## Verification

After creating a tour in Firestore:

1. Open the browser console
2. Visit the demo page with the correct `data-tour-id`
3. Look for: `"Loaded tour config from Firestore: My Tour Name"`
4. Check `Firestore > analytics` collection for `"started"`, `"completed"`, `"skipped"` events
