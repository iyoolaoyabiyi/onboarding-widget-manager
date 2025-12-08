**Task Overview - Group task**

**You are to each build an independent version of an **embeddable onboarding/tour web application** using **Next.js**. The app allows new users to experience a **guided multi-step tour** embedded on a website. Each tour will have **a minimum of five steps**, and every step can be identified by a unique ID.**Team Formation**  

- You are required to **form groups of four(4) / three (3) or two (2) in your respective teams**.
- Each group will work under **one shared repository, theme and idea**, but each intern in the group will be responsible for **one specific component** of the full product.
- You will collaborate on design direction and flow.

**Project Structure (Individual Focus Areas)**  
Each intern will focus on one of the following core components:  

- **External Pages** - Animated marketing site & documentation. (can be two interns)
- **Dashboard** - Configuration and analytics interface. (can be two interns)
- **Embeddable Element** - The actual onboarding/tour widget script. (can be two interns)

All three parts together should reflect a complete product ecosystem - from the landing page to the admin dashboard to the final embeddable experience. 

**Authentication Requirement**  
All projects must include **authentication** implemented using **one** of the following options:  

> Firebase | Supabase | Convex | Clerk

**External Pages**  
**Focus:** The public-facing marketing and documentation pages. Your task is to create a **beautiful, animated landing experience** showcasing how the onboarding script works.  

**Core Tasks**  
- Build a **Landing Page**, **About Page**, and **Documentation Page**.
- Show how the embeddable tour script can be added to any website (installation steps and code snippets).
- Implement **smooth and professional animations** using **GSAP or Framer Motion**.
- Include an **Auth flow** using Firebase, Supabase, Convex, or Clerk (sign in/out).
- Make it **responsive** and visually polished.
- Include sample sections for “Features”, “How it Works”, and “Try the Demo”.

**Deliverables**  
- Responsive landing page with GSAP/Framer Motion animations.
- Working authentication flow.
- Documentation page showing script setup.
- Basic About page introducing the product.

**Acceptance Criteria**  
- Animations load smoothly (no layout shifts or flickering).
- Auth system works correctly (sign up, login, logout).
- Fully responsive on desktop and mobile.
- Content is clear and professional - suitable for public viewing.

**Dashboard**  
**Focus:** The backend interface for creating, editing, and tracking onboarding tours.  
**Core Tasks**  
- Create a **Tour Management Dashboard** where users can:
    - Add, edit, and delete tours.
    - Define a **minimum of 5 steps per tour**, each with its own ID and description.
    - View **analytics** such as completion rates or skipped steps.
- Implement **authentication** using Firebase, Supabase, Convex, or Clerk.
- Generate a **unique script or embed code** for each tour.
- Include basic analytics view (even mock data).
- Ensure **clean UI and navigation**.

**Deliverables**  
- Functional dashboard with CRUD operations for tours and steps.
- Auth system integrated.
- Ability to generate and view embed script/URL.
- Basic analytics view.

**Acceptance Criteria**  
- User can log in, create a tour, add/edit steps, and generate an embed script.
- Each tour must support **at least 5 steps**.
- Dashboard is responsive and user-friendly.
- Data persists correctly (Firebase/Convex/Supabase/Clerk backend).

**Embeddable Element**  
**Focus:** The actual embeddable onboarding/tour script.  
**Core Tasks**  
- Create a **standalone embeddable widget** that can be added to a host site.
- The widget should guide users through **a 5-step tour**, with:
    - Next / Back controls
    - Progress indicator
    - Skip option
    - Resume capability
- Each step must have a unique ID for tracking and navigation.
- Include optional **3D avatar animation** using **Three.js** (can be minimal).
- Add **smooth transitions and animations** (Framer Motion or CSS transitions).
- Include **analytics tracking** (e.g., step started, step completed, skipped).

**Deliverables**  
- Embeddable script that can be inserted into any test HTML page.
- Configurable setup (e.g., initialize with a small JSON config).
- Tour flow with at least 5 steps.
- Working animations and optional avatar.

**Acceptance Criteria**  
- Tour loads and functions correctly when embedded in a separate site.
- Each step transitions smoothly with animations.
- Bundle size is small and loads efficiently.
- Analytics events fire correctly for each user interaction.

**General Requirementss**  
- Use **Next.js** as the main framework for the external pages and dashboard
- Recommend using vite for the embeddable product
- Use **GitHub** for version control
    - You must create pull requests as these will be submitted and tracked.
- Host your projects on **Vercel** or **Netlify** .
- Include a **[README.md](https://readme.md/)** with setup instructions.
- All designs must be **responsive** and **accessible**.
- Stick to clean, readable UI design.

**Final Deliverables (per intern)**  
- Live deployed site.
- Public GitHub repository.
- README with setup guide and short explanation of features.
- Names of all team members
- Live presentation

**Evaluation Criteria**  
- Completion of all required features.
- Creativity in UI and animations.
- Code quality, clarity, and organization.
- Use of chosen authentication service.
- Responsiveness and accessibility.
- Presentation and documentation quality.

Deadline: Wed, 10, Dec 2025, 11:59 PM  
Submission link: [https://forms.gle/yKHZeapg4KvskniX6](https://forms.gle/yKHZeapg4KvskniX6) (edited)