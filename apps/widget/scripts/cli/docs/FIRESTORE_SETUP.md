# Firestore Test Tours Setup

This guide explains how to manually create test tour documents in Firestore to test the widget.

## File: `firestore-test-tours.json`

The file `firestore-test-tours.json` contains sample tour configurations that match your widget's updated `TourConfig` schema.

### Tour Schema (Updated)

Each tour document has the following structure:

```typescript
{
  id: string;                              // Unique identifier
  name: string;                            // Display name
  description?: string;                    // Optional description
  owner_id: string;                        // Owner/creator ID
  allowed_domains: string[];               // Whitelisted domains for security
  theme: 'greyscale' | 'blue' | 'green' | 'red';  // Named theme
  status: 'draft' | 'active' | 'paused' | 'archived';
  avatar_enabled: boolean;
  min_steps: number;                       // Minimum steps required
  total_views: number;                     // Statistics
  total_completions: number;
  completion_rate: number;
  created_at: string;                      // ISO timestamp
  updated_at: string;
  last_viewed_at?: string;
  steps: TourStep[];                       // At least min_steps required
}
```

### Available Test Tours

1. **tour_12345** — "New User Onboarding" (blue theme)
2. **tour_feature_intro** — "Feature Introduction Tour" (green theme)
3. **tour_custom_template** — "Custom Template Tour" (red theme)

## How to Create a Tour in Firestore

### Option 1: Firebase Console (Easiest)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Firestore Database**
4. Click **Create Document** in the `tours` collection
5. Set the **Document ID** to match the tour's `id` field (e.g., `tour_12345`)
6. Copy one of the tour objects from `firestore-test-tours.json` and paste the fields
7. **Important**: Verify these fields are set:
   - [Verified] `theme`: Must be one of: `greyscale`, `blue`, `green`, `red`
   - [Verified] `status`: Must be one of: `draft`, `active`, `paused`, `archived`
   - [Verified] `allowed_domains`: Array with at least one domain
   - [Verified] `min_steps`: Number (default: 5)
   - [Verified] `steps`: Array with at least `min_steps` items
8. Click **Save**

### Option 2: Firebase CLI (Advanced)

```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Set your project
firebase use your-project-id

# Deploy Firestore rules (includes schema validation)
firebase deploy --only firestore:rules
```

### Option 3: Using the Tour CLI Manager

```bash
# Create a tour from template
node scripts/tour.js create scripts/cli/samples/tour-template.json

# Bulk import test tours
node scripts/tour.js import scripts/cli/samples/firestore-test-tours.json

# List all tours
node scripts/tour.js list

# Get specific tour details
node scripts/tour.js get tour_12345
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
  "description": "Custom tour for my product",
  "owner_id": "your_user_id",
  "allowed_domains": ["yourdomain.com", "app.yourdomain.com"],
  "theme": "blue",
  "status": "active",
  "avatar_enabled": false,
  "min_steps": 5,
  "total_views": 0,
  "total_completions": 0,
  "completion_rate": 0,
  "created_at": "2024-12-10T14:00:00Z",
  "updated_at": "2024-12-10T14:00:00Z",
  "steps": [
    {
      "id": "step_1",
      "order": 1,
      "target_element": "#element-id",
      "title": "Step Title",
      "content": "Step description.",
      "position": "bottom",
      "created_at": "2024-12-10T14:00:00Z",
      "updated_at": "2024-12-10T14:00:00Z"
    }
    // ... more steps (minimum 5 required, use min_steps value)
  ]
}
  ]
}
```

Then create it in Firestore using one of the methods above.

## Schema Reference

```typescript
interface TourConfig {
  id: string;                           // Unique tour ID (used as document ID in Firestore)
  name: string;                         // Display name
  description?: string;                 // (Optional) Tour description
  theme: 'greyscale' | 'blue' | 'green' | 'red';  // Named theme
  allowed_domains: string[];            // Domain whitelist for security
  owner_id: string;                     // Creator's user ID
  status: 'draft' | 'active' | 'paused' | 'archived';  // Tour status
  avatar_enabled: boolean;              // Show optional avatar
  min_steps: number;                    // Minimum steps required
  total_views: number;                  // Total views (denormalized)
  total_completions: number;            // Total completions (denormalized)
  completion_rate: number;              // Completion rate % (denormalized)
  steps: TourStep[];                    // Array of tour steps (minimum 5)
  created_at: string;                   // ISO timestamp
  updated_at: string;                   // ISO timestamp
  last_viewed_at?: string;              // (Optional) Last view timestamp
}

interface TourStep {
  id: string;                           // Unique step ID
  order: number;                        // Step order (1-based)
  target_element: string;               // CSS selector (e.g., "#my-button")
  title: string;                        // Step title
  content: string;                      // Step description
  position: "top" | "bottom" | "left" | "right" | "center";  // Tooltip position
  image_url?: string;                   // (Optional) Step image URL
  video_url?: string;                   // (Optional) Step video URL
  cta_text?: string;                    // (Optional) Call-to-action text
  cta_url?: string;                     // (Optional) Call-to-action URL
  created_at?: string;                  // (Optional) ISO timestamp
  updated_at?: string;                  // (Optional) ISO timestamp
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

**Warning:** These rules are permissive for development. Tighten them for production!

## Verification

After creating a tour in Firestore:

1. Open the browser console
2. Visit the demo page with the correct `data-tour-id`
3. Look for: `"Loaded tour config from Firestore: My Tour Name"`
4. Check `Firestore > analytics` collection for `"started"`, `"completed"`, `"skipped"` events
