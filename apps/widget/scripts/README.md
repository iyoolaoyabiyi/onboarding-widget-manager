# scripts/

## import-test-tours.js

Import test tours from `firestore-test-tours.json` into Firestore.

### Setup

1. **Get a service account key:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select **onboarding-tour-app** project
   - Click **Project Settings** (gear icon)
   - Go to **Service Accounts** tab
   - Click **Generate New Private Key**
   - Save the downloaded JSON as `serviceAccountKey.json` in `apps/widget/`

2. **Or use Firebase CLI:**
   ```bash
   firebase login
   firebase use onboarding-tour-app
   ```

### Usage

```bash
# From apps/widget directory
node scripts/import-test-tours.js
```

The script will:
- ✓ Read tours from `firestore-test-tours.json`
- ✓ Create documents in the `tours` Firestore collection
- ✓ Report success/failure for each tour
- ✓ Print next steps for testing

### Example Output

```
Importing 3 test tours to Firestore...

✓ Created tour: tour_12345 — "New User Onboarding"
✓ Created tour: tour_feature_intro — "Feature Introduction Tour"
✓ Created tour: tour_custom_template — "Custom Template Tour"

✓ Import complete!
  Success: 3/3

Next steps:
  1. Start the widget dev server:
     cd apps/widget && pnpm dev
  2. Visit http://localhost:5173/public/embed-demo.html
  3. Check the browser console for: "Loaded tour config from Firestore"
```

### Troubleshooting

- **"serviceAccountKey.json not found"**: Download from Firebase Console > Project Settings > Service Accounts
- **"Failed to initialize Firebase"**: Ensure you've logged in with `firebase login` and set the project with `firebase use onboarding-tour-app`
- **"No tours found"**: Check that `firestore-test-tours.json` is in the correct location
