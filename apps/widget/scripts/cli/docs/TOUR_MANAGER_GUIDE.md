# Tour Manager Quick Reference

Fast reference for common tour management tasks.

## Quick Commands

```bash
# List all tours
pnpm tour:list

# View specific tour
pnpm tour get tour_12345

# Create new tour
pnpm tour create tour-template.json

# Update tour
pnpm tour update tour_12345 updated.json

# Delete tour
pnpm tour delete tour_old

# Import multiple tours
pnpm tour:import firestore-test-tours.json

# View analytics
pnpm tour analytics tour_12345

# Backup all tours
pnpm tour:backup

# Deploy Firestore rules
pnpm tour:deploy-rules

# Show help
pnpm tour help
```

## Common Workflows

### Start From Scratch
```bash
# 1. Import test tours
pnpm tour:import firestore-test-tours.json

# 2. Deploy security rules
pnpm tour:deploy-rules

# 3. Verify tours loaded
pnpm tour:list
```

### Create Custom Tour
```bash
# 1. Copy template
cp tour-template.json my-custom-tour.json

# 2. Edit tour data (VS Code, vim, etc.)
code my-custom-tour.json

# 3. Create in Firebase
pnpm tour create my-custom-tour.json

# 4. Verify it worked
pnpm tour get my-custom-tour
```

### Update Existing Tour
```bash
# 1. Get current data
pnpm tour get tour_12345 > current.json

# 2. Edit data
code current.json

# 3. Update in Firebase
pnpm tour update tour_12345 current.json
```

### Safe Deletion
```bash
# 1. Backup first
pnpm tour:backup

# 2. Delete tour
pnpm tour delete tour_old

# 3. Check it's gone
pnpm tour:list
```

### Monitor Performance
```bash
# Check analytics for specific tour
pnpm tour analytics tour_12345

# Compare multiple tours
pnpm tour analytics tour_a
pnpm tour analytics tour_b
```

## Tour Template

Minimum valid tour (save as `my-tour.json`):

```json
{
  "id": "tour_my_feature",
  "name": "My Feature Tour",
  "theme_color": "#3498db",
  "owner_id": "user_demo",
  "avatar_enabled": false,
  "steps": [
    {"id": "s1", "order": 1, "target_element": "#nav", "title": "Navigation", "content": "Main menu", "position": "bottom"},
    {"id": "s2", "order": 2, "target_element": "#content", "title": "Content", "content": "Main area", "position": "right"},
    {"id": "s3", "order": 3, "target_element": "#sidebar", "title": "Sidebar", "content": "Tools here", "position": "left"},
    {"id": "s4", "order": 4, "target_element": "#settings", "title": "Settings", "content": "Configure", "position": "top"},
    {"id": "s5", "order": 5, "target_element": "#help", "title": "Help", "content": "Get support", "position": "bottom"}
  ]
}
```

## Validation Rules

- Minimum 5 steps required
- Each step needs: id, order, target_element, title, content, position
- Valid positions: top, bottom, left, right
- Tour ID should be unique and descriptive

## Testing Tours

After creating/updating:

```bash
# 1. Start dev server
pnpm dev

# 2. Open demo page
# http://localhost:5174/public/demo.html

# 3. Check browser console for:
# "Loaded tour config from Firestore: <tour-name>"
```

## Firestore Rules

Deploy after schema changes:

```bash
pnpm tour:deploy-rules
```

## Backup Strategy

Before major changes:

```bash
# Weekly backup
pnpm tour:backup

# Backups saved to: backups/tours-backup-YYYY-MM-DDTHH-MM-SS.json
```

## Troubleshooting

**No tours listed?**
- Check serviceAccountKey.json exists
- Run: `pnpm tour:import firestore-test-tours.json`

**Permission denied?**
- Deploy rules: `pnpm tour:deploy-rules`
- Check Firebase console permissions

**Can't create tour?**
- Verify 5+ steps in JSON
- Check all required fields present
- Ensure ID is unique

**Analytics not showing?**
- Widget must be embedded on page
- User must interact with tour
- Check browser console for errors

## Files

- `scripts/tour-manager.js` - CLI tool
- `tour-template.json` - Base template
- `firestore-test-tours.json` - Sample data
- `firestore.rules` - Security rules
- `backups/` - Tour backups
- `serviceAccountKey.json` - Firebase credentials (gitignored)

---

See full documentation: `scripts/README.md`
