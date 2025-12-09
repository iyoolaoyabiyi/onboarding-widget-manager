## Tours

```json
{
  "id": "tour_12345",
  "owner_id": "user_888", // Links to Auth Provider
  "name": "New User Onboarding",
  "base_url": "https://client-website.com", // Where this tour is allowed to run
  "theme_color": "#0070f3",
  "steps": [
    {
      "id": "step_01",
      "order": 1,
      "target_element": "#signup-btn", // ID of element to highlight
      "title": "Start Here",
      "content": "Click here to create your account.",
      "position": "bottom" // tooltip position
    },
    {
      "id": "step_02",
      "order": 2,
      "target_element": ".dashboard-header",
      "title": "Your Dashboard",
      "content": "This is where you see your stats.",
      "position": "left"
    }
    // ... minimum 5 steps
  ],
  "created_at": "2025-12-08T10:00:00Z"
}
```

## Analytics

```json
{
  "id": "event_999",
  "tour_id": "tour_12345",
  "step_id": "step_01",
  "action": "completed", // or "skipped", "started"
  "timestamp": "2025-12-09T14:20:00Z"
}
```

## **Functional Requirements**

- **FR-01 (Auth):** Users must be able to sign up, log in, and log out using Firebase Auth.
- **FR-02 (Tour Creation):** Logged-in users can create a tour entity containing at least 5 steps.
- **FR-03 (Script Gen):** The system must generate a unique JavaScript snippet containing the specific `tour_id`.
- **FR-04 (Embedding):** The external widget must fetch tour data using the `tour_id` from the script tag.
- **FR-05 (Highlighting):** The widget must identify HTML elements by ID on the host page and overlay a tooltip/highlight.
- **FR-06 (Persistence):** Tour progress (current step) must be saved; if a user reloads, they can resume.
- **FR-07 (Analytics):** Every "Next", "Back", or "Skip" click must trigger a Firestore write to the `analytics` collection.

## **Non-Functional Requirements**

- **NFR-01 (Performance):** The embeddable script bundle size should be minimized (target <50kb) using Vite.
- **NFR-02 (Animation):** UI transitions must use GSAP or Framer Motion without layout thrashing (applies to the embeddable widget and marketing surfaces).
- **NFR-03 (Compatibility):** The widget must work when embedded on a plain HTML page or a React app.

## **User Flows & User Stories**

### **Flow A: The Tour Creator (Dashboard Team)**

**User Story:** _As a Product Manager, I want to build a walkthrough for my app so new users don't get lost._
1. **Login:** User lands on `/login`, authenticates via Firebase.
2. **Dashboard:** Sees empty state. Clicks "Create New Tour".
3. **Editor:**
    - Enters Tour Name.
    - **Step 1:** Types Target ID (`#nav-home`), Title, and Description.
    - **Step 2-5:** Repeats for subsequent steps.
4. **Save:** Clicks "Save". Database updates.
5. **Deploy:** User clicks "Get Code". System displays: `<script src="https://our-app.vercel.app/ota-widget.js" data-tour-id="tour_123"></script>`

### **Flow B: The End User (Embed Team)**

**User Story:** _As a visitor, I want to be guided through the interface so I can learn the features quickly._
1. **Load:** User visits `client-website.com`.
2. **Init:** The script loads, reads `data-tour-id`, and fetches the JSON schema from your DB.
3. **Overlay:** A Three.js avatar appears (bottom right) saying "Hi! Ready for a tour?".
4. **Step 1:** The script finds the element `#nav-home`, darkens the rest of the screen, and highlights the button.
5. **Interaction:** User clicks "Next".
6. **Transition:** Smooth animation moves the highlight to the next element.
7. **Completion:** Final modal appears: "You're all set!"


