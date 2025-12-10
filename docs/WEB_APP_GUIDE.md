# Web Application Guide

The web application (Next.js) consists of two main parts: External Pages (marketing/public) and Dashboard (authenticated user interface).

## External Pages

### Overview

The external pages are public-facing marketing pages built with Next.js and Framer Motion animations. They showcase the product's capabilities and guide users to sign up or explore features.

### Landing Page (`/`)

The main landing page at the root path serves as the entry point for new visitors.

**Components:**
- **Hero Section**: Eye-catching introduction with:
  - Rotating phrase animations ("Build Interactive", "Build Beautiful", "Build Engaging", "Build Seamless")
  - Typewriter effect code snippet showing tour initialization
  - Animated background with floating elements and gradient blobs
  - Call-to-action buttons for authentication or demo

- **Features Section**: Scrollable features showcase with:
  - 6 key product features with icons
  - Progress indicator synchronized with scroll
  - Responsive layout (mobile and desktop)
  - Feature descriptions: No-Code Integration, Customizable Steps, Lightweight & Fast, Theme Customization, Interactive Elements, Analytics Ready

- **How It Works Section**: Step-by-step workflow explaining:
  - Tour creation process for creators
  - End-user onboarding experience
  - Integration steps
  - Analytics and optimization cycle

- **Try Demo Section**: Interactive demo showcase
  - Embedded widget demonstration
  - Live preview of tours in action
  - Call-to-action to get started

- **Documentation Preview Section**: Quick reference
  - Installation code snippets
  - Integration examples
  - Copy-to-clipboard functionality
  - Links to full documentation

**Key Technologies:**
- Framer Motion for animations
- Next.js App Router
- TypeScript
- Tailwind CSS for styling

### About Page (`/about`)

Information about the product mission and vision.

**Content:**
- Company vision and mission statement
- Why product onboarding matters
- Key benefits and value proposition
- Team/company information
- Contact and social links

**Features:**
- Animated cards and sections
- Icon illustrations for visual appeal
- Responsive grid layout
- Smooth scroll animations

### Documentation Page (`/documentation`)

Comprehensive user documentation for integrating and using the widget.

**Sections:**
1. **Introduction**: Quick overview and key concepts
2. **Installation**: How to add the widget to a website
3. **Configuration**: Detailed setup options and customization
4. **API Reference**: Complete API documentation with code examples
5. **Examples**: Real-world implementation examples
6. **Troubleshooting**: Common issues and solutions
7. **FAQ**: Frequently asked questions

**Code Examples Included:**
- Basic script tag installation
- Initialization with minimal configuration
- Full configuration options
- Step definition properties
- Event handling and callbacks

**Features:**
- Sticky sidebar navigation
- Code syntax highlighting
- Copy-to-clipboard for code blocks
- Search functionality for quick navigation
- Mobile-responsive design

## Dashboard

### Overview

The dashboard is the authenticated user interface where tour creators manage their onboarding tours and view analytics. Access is protected by Firebase Authentication.

### Authentication (`/sign-up`, `/sign-in`)

**Sign Up Page (`/sign-up`):**
- Email/password registration
- Google OAuth integration
- Form validation
- Error handling
- Link to sign-in for existing users

**Sign In Page (`/sign-in`):**
- Email/password login
- Google OAuth integration
- Password recovery option
- Link to registration for new users

**Features:**
- Secure Firebase Authentication
- Protected routes with ProtectedRoute component
- Automatic redirect to dashboard on successful auth
- Session management

### Main Dashboard (`/dashboard`)

The central hub where users manage all their tours.

**Core Components:**

1. **Tours Panel** (ToursPanelNew.tsx):
   - List of all user-created tours
   - Tour cards showing:
     - Tour name and description
     - Status (draft, active, paused, archived)
     - Step count
     - Completion rate
     - Last updated date
   - Create new tour button
   - Edit/delete tour actions
   - Search and filter tours
   - Responsive grid layout

2. **Tour Editor** (TourEditorNew.tsx):
   - Create and edit tour configurations
   - Fields:
     - Tour name
     - Description
     - Theme selection (blue, green, red, greyscale)
     - Domain whitelist
     - Avatar toggle
   - Step management:
     - Add/remove steps (minimum 5 required)
     - Reorder steps
     - Edit step details:
       - Target element (CSS selector)
       - Title
       - Content/description
       - Position (top, bottom, left, right, center)
       - Optional: Image URL, video URL, CTA

3. **Integration Snippet** (IntegrationSnippet.tsx):
   - Display generated embed code
   - Copy-to-clipboard functionality
   - Widget URL display
   - Installation instructions

4. **Analytics Section** (AnalyticsSection.tsx):
   - Real-time analytics dashboard
   - Metrics displayed:
     - Total tour views
     - Total completions
     - Completion rate (percentage)
     - Per-step completion data
   - Charts and visualizations
   - Data filtered by selected tour

5. **Metrics Grid** (MetricsGrid.tsx):
   - Card-based display of key metrics
   - KPIs for quick overview
   - Responsive grid layout

6. **Domain Manager** (DomainManager.tsx):
   - Manage allowed domains for each tour
   - Add/remove domain entries
   - Domain validation
   - Security controls

7. **Dashboard Header** (DashboardHeader.tsx):
   - User profile section
   - Navigation
   - Logout button
   - Quick stats summary

8. **Onboarding Empty State** (OnboardingEmpty.tsx):
   - Displayed when user has no tours
   - Call-to-action to create first tour
   - Helpful instructions
   - Visual guidance

### Data Management

**Firestore Integration:**
- Tours collection: Stores tour configurations
- Subcollections:
  - `steps`: Individual steps for each tour
  - `sessions`: User session tracking
  - `analytics`: Event tracking and analytics data

**Data Flow:**
1. User creates/edits tour in dashboard
2. Data saved to Firestore
3. Widget fetches tour data on page load
4. Widget fires analytics events
5. Analytics visible in dashboard

### Protected Routes

The dashboard uses ProtectedRoute component to ensure only authenticated users can access:
- `/dashboard` - Main dashboard
- `/dashboard/create` - Tour creation
- `/dashboard/edit/[id]` - Tour editing

### Responsive Design

All dashboard components are responsive:
- Mobile: Single column, collapsible panels
- Tablet: Two column layout
- Desktop: Full multi-column layout with sidebars

## Layout Structure

### Navigation

**Navbar Component:**
- Logo/home link
- Navigation links:
  - Home
  - About
  - Documentation
- Authentication buttons:
  - Sign Up (if not logged in)
  - Sign In (if not logged in)
  - Dashboard link (if logged in)
  - Logout (if logged in)
- Responsive mobile menu
- Smooth animations

### Footer

**Footer Component:**
- Product links
- Documentation links
- Social media links
- Copyright information
- Newsletter signup

## Styling and Animations

**CSS Framework:**
- Tailwind CSS for utility classes
- CSS Modules for component-specific styling
- Global styles in `globals.css`

**Animations:**
- Framer Motion for complex animations
- Smooth transitions and variants
- Scroll-triggered animations
- Staggered animations for lists

**Color Scheme:**
- Dark theme (black and gray backgrounds)
- Blue accent colors
- Gradient effects for visual interest
- High contrast for readability

**Responsive Breakpoints:**
- Mobile: 320px+
- Tablet: 768px+
- Desktop: 1024px+
- Large screens: 1280px+

## Performance Optimizations

- Image optimization with Next.js Image component
- Code splitting and lazy loading
- CSS-in-JS for efficient styling
- Font optimization with next/font
- Responsive image loading
- Minimal bundle size

## Accessibility

- Semantic HTML elements
- ARIA labels where appropriate
- Keyboard navigation support
- High contrast ratios
- Screen reader friendly
- Focus indicators visible
- Form validation feedback

## Environment Variables

Required environment variables in `.env` file:

```env
# Firebase configuration
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Widget configuration
NEXT_PUBLIC_WIDGET_URL=https://onboarding-widget-app.vercel.app/ota-widget.js
```

## File Structure

```
apps/web/
├── app/
│   ├── (auth)/                 # Auth routes
│   │   ├── sign-in/
│   │   │   └── page.tsx
│   │   └── sign-up/
│   │       └── page.tsx
│   ├── about/
│   │   └── page.tsx
│   ├── documentation/
│   │   └── page.tsx
│   ├── dashboard/
│   │   ├── page.tsx            # Main dashboard
│   │   └── create/
│   │       └── page.tsx
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page
│   ├── globals.css             # Global styles
│   └── page.module.css         # Landing page styles
├── components/
│   ├── Footer.tsx
│   ├── Navbar.tsx
│   ├── auth/
│   │   ├── ProtectedRoute.tsx  # Route protection
│   │   └── PublicRoute.tsx     # Public route wrapper
│   ├── dashboard/
│   │   ├── AnalyticsSection.tsx
│   │   ├── CreateTourModal.tsx
│   │   ├── DashboardHeader.tsx
│   │   ├── DomainManager.tsx
│   │   ├── IntegrationSnippet.tsx
│   │   ├── MetricsGrid.tsx
│   │   ├── OnboardingEmpty.tsx
│   │   ├── TourEditor.tsx
│   │   ├── TourEditorNew.tsx
│   │   ├── ToursPanel.tsx
│   │   ├── ToursPanelNew.tsx
│   │   └── types.ts
│   └── landing-page/
│       ├── DocumentationPreview.tsx
│       ├── Features.tsx
│       ├── Hero.tsx
│       ├── HowItWorks.tsx
│       └── TryDemo.tsx
├── hooks/
│   └── useAuth.ts              # Authentication hook
├── lib/
│   ├── firebase.ts             # Firebase config
│   └── firestore.ts            # Firestore service
├── public/                      # Static assets
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

## Development Workflow

1. **Local Development:**
   ```bash
   cd apps/web
   pnpm install
   pnpm dev
   ```
   Access at http://localhost:3000

2. **Building:**
   ```bash
   pnpm build
   ```

3. **Production:**
   ```bash
   pnpm start
   ```

4. **Linting:**
   ```bash
   pnpm lint
   ```

## Deployment

The web app is deployed on Vercel with automatic deployments on Git push to main branch.

- **Production**: https://onboarding-widget-app.vercel.app/
- **Environment**: Vercel with Next.js optimization

## Common Tasks

### Add a New Page

1. Create directory under `app/`
2. Add `page.tsx` file
3. Export default component
4. Next.js will automatically route it

### Add a New Dashboard Component

1. Create component file in `components/dashboard/`
2. Define TypeScript interfaces
3. Import and use in dashboard page
4. Ensure responsive design

### Update Styles

1. Tailwind CSS: Use utility classes in JSX
2. CSS Modules: Create `.module.css` file
3. Global: Edit `app/globals.css`
4. Rebuild to see changes

### Modify Navigation

1. Edit `components/Navbar.tsx`
2. Update links array
3. Ensure responsive menu works
4. Test on mobile devices

## Troubleshooting

### Authentication Issues
- Verify Firebase credentials in `.env`
- Check browser console for errors
- Clear cookies and local storage
- Ensure Firebase project is active

### Dashboard Not Loading Tours
- Check Firestore rules allow read access
- Verify user is authenticated
- Check browser network tab
- Look for console errors

### Styling Not Applied
- Clear Next.js cache: `rm -rf .next`
- Rebuild: `pnpm build`
- Check Tailwind config
- Verify CSS imports

### Animations Not Smooth
- Check browser performance
- Reduce animation complexity
- Use CSS transforms instead of layout changes
- Test on different devices

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Firebase Docs](https://firebase.google.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
