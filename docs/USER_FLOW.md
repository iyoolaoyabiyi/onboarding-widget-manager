# **User Flow**

## **Phase 1: Discovery & Acquisition (Squad A)**

**Target User:** A product manager or developer evaluating onboarding/tour tools.

1. **Landing Page Visit**
   *User arrives at `onboard-team.vercel.app`.*

   * They see a polished marketing page with smooth GSAP/Framer Motion animations.
   * A “Start Tour” button launches **your own embedded widget**, demonstrating the product immediately.
   * CTA: **Get Started for Free**.

2. **Authentication**

   * Clicking the CTA redirects the user to `/sign-up`.
   * They register via email/password or Google (Firebase Auth).
   * Successful authentication redirects them to the **Dashboard**.

---

## **Phase 2: Tour Creation (Squad B)**

**Target User:** The Creator (logged-in user who builds tours).

3. **Dashboard Onboarding**

   * User lands on an empty state with a clear **+ Create New Tour** action.

4. **Tour Editor**
   The user configures a new tour:

   * **Name:** e.g., “My App Onboarding”.
   * **Base URL:** `https://myapp.com` (origin where the tour will run).
   * **Theme Color:** e.g., Brand Blue `#0070F3`.

   **Step Definition:**

   * Step 1

     * Target: `#nav-logo`
     * Text: “Welcome to the app!”
     * Position: Bottom
   * Step 2

     * Target: `#settings-btn`
     * Text: “Configure your profile here.”
     * Position: Left

   *(Creator repeats until minimum five steps are defined.)*

   * User clicks **Save Tour**.
   * System writes data to Firestore `tours` collection.

5. **Integration Handoff**

   * User clicks **Get Embed Code**.

    * The system produces a script snippet:

       ```html
       <script src="https://your-app.vercel.app/ota-widget.js" data-tour-id="tour_888"></script>
       ```

   * User pastes this into their application’s HTML.

---

## **Phase 3: End-User Experience (Squad C)**

**Target User:** Visitors interacting with the embedded tour.

6. **Initialization**

   * Visitor loads `https://myapp.com`.
   * The script tag loads the Vite-bundled widget (~50kb).
   * The widget reads the `data-tour-id`, fetches tour data from Firestore, and prepares the runtime.

7. **Tour Start**

   * A subtle overlay appears with a welcome prompt: “Take a quick tour?”
   * The widget highlights `#nav-logo` with proper z-index, masking, and positioning.

8. **Interaction**

   * On **Next**, the highlight animates to the next target element
   * Each step sends analytics events to Firestore (`analytics` collection), for example:

     ```json
     { "tour_id": "tour_888", "step": 1, "action": "completed" }
     ```

9. **Completion**

   * Final step triggers a completion modal.
   * Widget cleans up injected nodes, styles, and event listeners.

---

## **Phase 4: Review & Optimization (Squad B)**

**Target User:** The Creator returning to the dashboard.

10. **Analytics Review**

* User logs in and opens the Analytics tab.
* They see metrics such as:

  * Total Views: 1,200
  * Completion Rate: 65 percent
  * Highest Drop-off: Step 3
* This delivers the baseline analytics required for MVP.

