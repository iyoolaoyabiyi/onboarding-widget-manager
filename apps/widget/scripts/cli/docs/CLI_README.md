# Widget Scripts

Utility scripts for managing tours in Firebase Firestore.

## Setup

1. **Install Dependencies**
   ```bash
   cd apps/widget
   pnpm install
   ```

2. **Configure Firebase**
   
   Download your service account key:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project
   - Project Settings > Service Accounts
   - Generate New Private Key
   - Save as `apps/widget/serviceAccountKey.json`

   **Important:** This file is gitignored and should never be committed.

3. **Install Firebase CLI** (for deploying rules)
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase use <your-project-id>
   ```

---

## Tour Manager CLI

Comprehensive command-line tool for managing tours without using Firebase Console or the dashboard.

### Commands

#### List All Tours
```bash
node scripts/tour.js list
```
Displays a table of all tours with ID, name, step count, and status.

#### Get Specific Tour
```bash
node scripts/tour.js get <tourId>
```
Retrieves and displays the complete tour configuration in JSON format.

Example:
```bash
node scripts/tour.js get tour_12345
```

#### Create New Tour
```bash
node scripts/tour.js create <file.json>
```
Creates a new tour from a JSON file. The tour must have at least 5 steps.

Example:
```bash
node scripts/tour.js create scripts/cli/samples/tour-template.json
```

#### Update Existing Tour
```bash
node scripts/tour.js update <tourId> <file.json>
```
Updates an existing tour with new data from JSON file.

Example:
```bash
node scripts/tour.js update tour_12345 updated-tour.json
```

#### Delete Tour
```bash
node scripts/tour.js delete <tourId>
```
Deletes a tour and all associated analytics data.

Example:
```bash
node scripts/tour.js delete tour_old
```

#### Bulk Import Tours
```bash
node scripts/tour.js import <file.json>
```
Import multiple tours from a JSON file containing a `tours` array.

Example:
```bash
node scripts/tour.js import scripts/cli/samples/firestore-test-tours.json
```

#### View Analytics
```bash
node scripts/tour.js analytics <tourId>
```
View analytics summary for a specific tour including:
- Total sessions
- Completion rate
- Skipped/abandoned counts

Example:
```bash
node scripts/tour.js analytics tour_12345
```

#### Deploy Firestore Rules
```bash
node scripts/tour.js deploy-rules
```
Deploys the `firestore.rules` file to your Firebase project.

Requires Firebase CLI to be installed and configured.

#### Backup Tours
```bash
node scripts/tour.js backup
```
Creates a timestamped backup of all tours in `backups/` directory.

#### Help
```bash
node scripts/tour.js help
```
Display full usage information.

---

## Tour JSON Format

### Basic Structure
```json
{
  "id": "tour_unique_id",
  "name": "Tour Name",
  "description": "Optional description",
  "owner_id": "user_123",
  "allowed_domains": ["localhost", "example.com"],
  "theme": "blue",
  "avatar_enabled": false,
  "status": "active",
  "steps": [
    {
      "id": "step_01",
      "order": 1,
      "target_element": "#element-selector",
      "title": "Step Title",
      "content": "Step description text",
      "position": "bottom"
    }
  ]
}
```

### Required Fields
- `id` (string): Unique tour identifier
- `name` (string): Display name for the tour
- `steps` (array): Array of step objects (minimum 5 required)

### Optional Fields
- `description` (string): Tour description
- `owner_id` (string): User ID of tour creator
- `allowed_domains` (array): Whitelist of allowed domains
- `theme` (string): Theme name (`blue`, `green`, `red`, `greyscale`)
- `avatar_enabled` (boolean): Enable 3D avatar assistant
- `status` (string): Tour status (`draft`, `active`, `paused`, `archived`)

### Step Object
Each step requires:
- `id` (string): Unique step identifier
- `order` (number): Step sequence number (1, 2, 3...)
- `target_element` (string): CSS selector for element to highlight
- `title` (string): Step title
- `content` (string): Step description text
- `position` (string): Tooltip position (`top`, `bottom`, `left`, `right`)

---

## Legacy Scripts

### Import Test Tours (Old Script)
```bash
node scripts/import-test-tours.js
```

This is the legacy import script. Use `tour-manager.js import` instead for more features and better error handling.

---

## Firestore Security Rules

The `firestore.rules` file defines security rules for the database:

### Current Rules
- **Tours**: Read by anyone, write by authenticated users only
- **Steps**: Read by anyone, write by authenticated users
- **Analytics**: Read/write by widget for tracking
- **Users**: Read/write by owner only

### Deploying Rules
```bash
# Using tour-manager CLI
node scripts/tour.js deploy-rules

# Or using Firebase CLI directly
firebase deploy --only firestore:rules
```

### Rule Structure
```
tours/{tourId}
  ├── read: public (widget needs to load configs)
  ├── write: authenticated users only (dashboard)
  └── steps/{stepId}
      ├── read: public
      └── write: authenticated users
  
analytics/{sessionId}
  ├── read: public
  ├── write: public (widget tracking)
  └── events/{eventId}
      ├── read: public
      └── write: public
```

---

## Examples

### Creating a New Tour
1. Copy `scripts/cli/samples/tour-template.json` to `my-tour.json`
2. Edit with your tour data
3. Run: `node scripts/tour.js create my-tour.json`

### Updating Theme
1. Get existing tour: `node scripts/tour.js get tour_12345 > temp.json`
2. Edit `temp.json`, change theme to `green`
3. Update: `node scripts/tour.js update tour_12345 temp.json`

### Backing Up Before Changes
```bash
# Backup all tours
node scripts/tour.js backup

# Make changes
node scripts/tour.js update tour_12345 new-data.json

# If something goes wrong, restore from backup
node scripts/tour.js import backups/tours-backup-2025-12-10T12-30-00.json
```

---

## Troubleshooting

### "Service account key not found"
Download your Firebase service account key and save it as `serviceAccountKey.json` in the widget directory.

### "Firebase CLI not found"
Install globally: `npm install -g firebase-tools`

### "Tour must have at least 5 steps"
The widget requires a minimum of 5 steps per tour. Add more steps to your JSON file.

### "Permission denied"
Check your Firestore rules are deployed correctly:
```bash
node scripts/tour.js deploy-rules
```

---

## Tips

1. **Always backup before bulk operations**: Use `backup` command before importing/deleting multiple tours
2. **Use descriptive IDs**: Prefix tour IDs with `tour_` for consistency
3. **Test locally first**: Use the widget dev server to test tours before deploying
4. **Version control tour configs**: Keep tour JSON files in git (not serviceAccountKey.json!)
5. **Monitor analytics**: Regularly check analytics to see which tours are performing well

---

## Files

- `tour-manager.js` - Main CLI tool (recommended)
- `import-test-tours.js` - Legacy bulk import script
- `../scripts/cli/samples/tour-template.json` - Example tour structure
- `../scripts/cli/samples/firestore-test-tours.json` - Sample tours for testing
- `../firestore.rules` - Security rules
- `../backups/` - Tour backups directory (auto-created)

---

For more information, see the [Widget Documentation](../../docs/WIDGET_MVP_ANALYSIS.md).
