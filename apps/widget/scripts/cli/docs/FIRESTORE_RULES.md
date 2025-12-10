# Deploying Firestore Rules

After updating `firestore.rules`, deploy them to Firebase:

```bash
# Deploy Firestore rules
firebase deploy --only firestore:rules
```

## Current Rules Summary

### Tours Collection
- **Read**: Public (widget can fetch tour configs)
- **Write**: Disabled (only dashboard should create/edit tours)

### Sessions Subcollection (`tours/{tourId}/sessions/{sessionId}`)
- **Read**: Public
- **Create**: Public (widget creates new sessions)
- **Update**: Public (widget updates session status)

### Events Subcollection (`tours/{tourId}/sessions/{sessionId}/events/{eventId}`)
- **Read**: Public
- **Create**: Public (widget tracks analytics)

### Legacy Analytics Collection
- **Read**: Public
- **Create**: Public (backward compatibility)

## Security Considerations

**For Production:**
1. Add authentication checks if tours should be private
2. Validate session ownership if needed
3. Rate limit writes to prevent abuse
4. Add field validation rules

Example with auth:
```javascript
match /tours/{tourId}/sessions/{sessionId} {
  allow read: if true;
  allow create: if request.auth != null; // Require auth
  allow update: if request.auth.uid == resource.data.user_id; // Own sessions only
}
```

## Testing Rules Locally

```bash
# Start Firestore emulator
firebase emulators:start --only firestore

# Widget should connect to: localhost:8080
```
