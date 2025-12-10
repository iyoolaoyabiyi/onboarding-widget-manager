# Onboarding Widget Manager

Create and manage guided onboarding tours for your website with an intuitive dashboard and lightweight embeddable widget.

**Live App:** https://onboarding-widget-app.vercel.app/

## Overview

This is a complete onboarding/tour widget system with:
- **Dashboard**: Manage tours, define steps, and track analytics
- **Embeddable Widget**: Lightweight script that guides users through configurable tours
- **Analytics**: Track user interactions and tour completion rates

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Clone repository and install dependencies
git clone https://github.com/iyoolaoyabiyi/onboarding-widget-manager
cd onboarding-widget
pnpm install
```

### Running the Application

#### External Pages and Dashboard (Next.js) - http://localhost:3000

```bash
cd apps/web
pnpm dev
```

#### Widget (Vite) - http://localhost:5174

```bash
cd apps/widget
pnpm dev
```

#### Run Both Simultaneously

```bash
# Terminal 1
cd apps/web && pnpm dev

# Terminal 2
cd apps/widget && pnpm dev
```

## How It Works

### For Tour Creators

1. Sign up and log in to the dashboard
2. Create a new tour and define at least 5 steps
3. Specify target elements using CSS selectors
4. Customize colors and positioning
5. Copy the generated embed code
6. Paste the script into your website

### For End Users

1. Visit a website with the embedded tour script
2. See a guided tour highlighting key interface elements
3. Navigate through steps with Next/Back buttons
4. Skip the tour anytime or complete it

## Features

### Dashboard
- User authentication (Firebase)
- Create, edit, delete tours
- Define multi-step tours (minimum 5 steps)
- Customize theme colors and step positioning
- Generate embed code snippets
- View analytics and tour completion metrics
- Responsive design

### Embeddable Widget
- Multi-step guided tours
- Customizable theme colors
- Smooth animations and transitions
- Resume capability (remembers user progress)
- Analytics tracking
- Works on any website (React, Vue, plain HTML)
- Lightweight: 11KB gzipped, 3.62KB minified
- Responsive design for all devices

### Analytics
- Real-time event tracking
- Step completion rates
- Tour skip metrics
- Per-tour performance insights

## Web Application (Next.js)

The web application consists of two main parts: public-facing external pages and an authenticated dashboard.

### External Pages

Beautiful, animated marketing pages to showcase the product:

- **Landing Page** (`/`): Hero section, features overview, how it works, demo, and documentation preview
- **About Page** (`/about`): Company vision, mission, and value proposition
- **Documentation Page** (`/documentation`): Complete integration guide with code examples

**Key Features:**
- Smooth Framer Motion animations
- Rotating text and typewriter effects
- Responsive design for all devices
- Copy-to-clipboard code snippets
- Scroll-triggered animations
- High-performance rendering

### Dashboard

Secure, authenticated interface for managing onboarding tours:

- **Tours Management**: Create, edit, delete tours with 5+ steps
- **Step Configuration**: Define target elements using CSS selectors
- **Theme Customization**: Choose from 4 theme colors (blue, green, red, greyscale)
- **Domain Whitelist**: Restrict tours to specific domains
- **Embed Code Generation**: Automatic script snippet generation
- **Analytics Dashboard**: Real-time metrics and completion tracking
- **Integration Snippet**: Ready-to-copy embed code

**Dashboard Components:**
- Tours Panel: List and manage all tours
- Tour Editor: Create and modify tour configurations
- Analytics Section: View completion rates and metrics
- Metrics Grid: Quick overview of key statistics
- Domain Manager: Configure allowed domains
- Integration Snippet: Copy embed code

**Authentication:**
- Firebase Auth with email/password and Google OAuth
- Protected routes for dashboard pages
- Automatic session management
- User-specific tour ownership

**For detailed information about components, styling, and development workflows, see [WEB_APP_GUIDE.md](docs/WEB_APP_GUIDE.md).**

## Project Structure

```
├── apps/
│   ├── web/             # Dashboard application (Next.js + React)
│   │   ├── app/         # Pages and layouts
│   │   ├── components/  # Reusable components
│   │   ├── hooks/       # Custom React hooks
│   │   └── lib/         # Utilities and services
│   ├── widget/          # Embeddable widget (Vite + TypeScript)
│   └── docs/            # Technical documentation
└── package.json         # Workspace root configuration
```

## Integration Guide

### Embedding the Widget on Your Website

1. Create a tour in the dashboard
2. Copy the generated embed code
3. Add to your website's HTML:

```html
<script 
  src="https://onboarding-widget-app.vercel.app/ota-widget.js" 
  data-tour-id="YOUR_TOUR_ID"
></script>
```

### For Next.js Projects

If you're integrating into a Next.js application (like your dashboard), use the Next.js Script component:

```jsx
// app/layout.tsx
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Script
          src="https://onboarding-widget-app.vercel.app/ota-widget.js"
          strategy="lazyOnInteractive"
          data-tour-id="YOUR_TOUR_ID"
        />
      </body>
    </html>
  );
}
```

**For complete Next.js integration guide with advanced patterns, see [NEXTJS_INTEGRATION_GUIDE.md](docs/NEXTJS_INTEGRATION_GUIDE.md).**

### Manual Initialization (Optional)

```javascript
window.OnboardingTour.init({
  id: 'my-tour',
  name: 'Welcome Tour',
  theme: 'blue',
  steps: [
    {
      id: 'step_1',
      order: 1,
      target_element: '#my-button',
      title: 'Get Started',
      content: 'Click here to begin',
      position: 'bottom'
    }
    // ... add at least 5 steps
  ]
});
```

## Technical Documentation

Detailed technical documentation is available in the `/docs` folder:

- **[NEXTJS_INTEGRATION_GUIDE.md](docs/NEXTJS_INTEGRATION_GUIDE.md)** - Complete guide on integrating this widget into your Next.js projects with code examples and best practices
- **[WEB_APP_GUIDE.md](docs/WEB_APP_GUIDE.md)** - Complete guide to external pages and dashboard, including component descriptions and development workflows
- **[WIDGET_DEVELOPMENT.md](docs/WIDGET_DEVELOPMENT.md)** - Complete development guide, setup instructions, and troubleshooting for the embeddable widget
- **[onboarding-widget-technical.md](docs/onboarding-widget-technical.md)** - Technical requirements, data schemas, and API specifications
- **[USER_FLOW.md](docs/USER_FLOW.md)** - User flows and use cases for creators and end users
- **[FIRESTORE_RULES.md](docs/FIRESTORE_RULES.md)** - Security rules and data protection implementation

## Building for Production

### Build Widget

```bash
cd apps/widget
pnpm build
# Output: dist/ota-widget.js (11KB gzipped)
```

### Build Dashboard

```bash
cd apps/web
pnpm build
# Output: .next/ directory
```

### Build All

```bash
pnpm run build
```

## Deployment

The application is deployed on Vercel:
- **Dashboard**: https://onboarding-widget-app.vercel.app/
- **Widget Script**: https://onboarding-widget-app.vercel.app/ota-widget.js

## Technology Stack

- **Frontend**: Next.js, React, TypeScript
- **Widget**: Vite, Vanilla TypeScript
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **Styling**: CSS-in-JS, GSAP animations
- **Deployment**: Vercel

## Development Workflow

```bash
# Install dependencies
pnpm install

# Start development servers
pnpm dev

# Run linting
pnpm run lint

# Format code
pnpm run format

# Build for production
pnpm run build
```

## Support & Issues

For questions, bugs, or feature requests:
1. Check the documentation in `/docs` folder
2. Review existing GitHub issues
3. Create a new issue with detailed information
