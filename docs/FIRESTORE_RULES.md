# Firestore Security Rules

## Overview

The Firestore security rules enforce data protection and user ownership across the application.

## Rules Summary

### Tours Collection (`/tours/{tourId}`)

| Operation | Requires Auth | Conditions | Purpose |
|-----------|---------------|-----------|---------|
| **Read** | No | None | Widget loads tours publicly |
| **Create** | Yes | `owner_id == uid` + valid schema | Users create their own tours |
| **Update** | Yes | `owner_id == uid` + schema validation | Only owners can modify tours |
| **Delete** | Yes | `owner_id == uid` | Only owners can delete tours |

**Schema Validation (Create/Update):**
- `id` and `name` must exist
- `owner_id` must match authenticated user
- `theme` must be one of: `greyscale`, `blue`, `green`, `red`
- `status` must be one of: `draft`, `active`, `paused`, `archived`
- `allowed_domains` must be a non-empty list
- `steps` must be a list with at least 5 items

### Steps Subcollection (`/tours/{tourId}/steps/{stepId}`)

| Operation | Requires Auth | Conditions | Purpose |
|-----------|---------------|-----------|---------|
| **Read** | No | None | Widget displays steps |
| **Create/Update/Delete** | Yes | Parent tour `owner_id == uid` | Only owners can modify steps |

### Sessions Subcollection (`/tours/{tourId}/sessions/{sessionId}`)

| Operation | Requires Auth | Conditions | Purpose |
|-----------|---------------|-----------|---------|
| **Read** | No | None | Widget tracks sessions |
| **Create/Update** | No | None | Widget sends analytics |
| **Events** | No | Schema validation | Detailed event tracking |

### Analytics Collection (`/analytics/{sessionId}`)

| Operation | Requires Auth | Conditions | Purpose |
|-----------|---------------|-----------|---------|
| **Create** | No | Schema validation | Widget tracks tours |
| **Read** | No | None | Dashboard views analytics |
| **Update** | No | None | Session completion |

**Analytics Schema:**
- `session_id` (string)
- `tour_id` (string)
- `started_at` (timestamp)
- `domain` (string)
- `user_agent` (string)
- `status` (one of: `in_progress`, `completed`, `skipped`, `abandoned`)

### Users Collection (`/users/{userId}`)

| Operation | Requires Auth | Conditions | Purpose |
|-----------|---------------|-----------|---------|
| **Read** | Yes | `uid == userId` | User reads own profile |
| **Write** | Yes | `uid == userId` | User updates own profile |

## Security Model

### User Ownership

Every tour has an `owner_id` field that stores the Firebase Auth user ID. The rules enforce:

```plaintext
allow operation: if request.auth.uid == resource.data.owner_id
```

This prevents users from modifying or deleting other users' tours.

### Public Read Access

Tours and analytics are readable without authentication:
- Widget can fetch any tour by ID
- No sensitive data exposed (auth tokens, email, etc.)
- Each tour controls its own `allowed_domains`

### Schema Validation

Firestore rules validate data structure before write:
- Required fields enforced
- Enum values validated
- Data types checked
- Array lengths verified

## Deployment

### Deploy Rules to Firebase

```bash
cd apps/widget
firebase login
firebase deploy --only firestore:rules
```

### Testing Rules Locally

```bash
# Start Firestore emulator
firebase emulators:start

# Run tests
npm run test:firestore-rules
```

## Common Violations

| Issue | Error | Solution |
|-------|-------|----------|
| Not authenticated | Permission denied | User must sign in |
| Wrong owner | Permission denied | Can't modify other users' tours |
| Invalid theme | Permission denied | Use greyscale, blue, green, or red |
| Less than 5 steps | Permission denied | Tours require minimum 5 steps |
| Empty domains list | Permission denied | At least 1 allowed domain required |

## Migration from Old Rules

If upgrading from previous version:

1. **Backup:** Export Firestore data
   ```bash
   firebase firestore:delete --project [PROJECT_ID] --recursive
   ```

2. **Deploy:** Upload new rules
   ```bash
   firebase deploy --only firestore:rules
   ```

3. **Migrate:** Run data migration script (if owner_id missing)
   ```bash
   node scripts/migrate-owner-ids.js
   ```

## Performance Considerations

### Indexes

Firestore auto-creates indexes for:
- `owner_id` (user queries)
- `created_at` (sorting by date)

Composite indexes created for:
- `owner_id + created_at` (list tours by user, sorted)
- `tour_id + owner_id` (verify ownership)

### Rate Limiting

- **Per-document:** Firestore has built-in rate limiting
- **Per-user:** No explicit limit, but monitor for abuse

## Future Enhancements

### Planned Improvements

- [ ] Add `read_only` role for analytics viewers
- [ ] Add `team` collection for shared tours
- [ ] Add `api_keys` for server-side access
- [ ] Add activity audit logs
- [ ] Add backup/restore features

### Advanced Rules

```firestore
// Example: Team access (future)
allow write: if request.auth.uid == resource.data.owner_id
  || request.auth.uid in resource.data.team_members
```

## Support

For rule issues, check:
1. Firestore console → Rules → Test
2. Browser console for auth errors
3. Firebase security rules emulator

