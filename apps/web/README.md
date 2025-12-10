# Dashboard Application

The admin dashboard for managing onboarding tours and viewing analytics.

## Overview

This is a Next.js application that provides:
- User authentication with Firebase
- Tour creation and management
- Step definition interface
- Analytics and performance tracking
- Embed code generation

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended)

### Installation

```bash
# From workspace root
pnpm install

# Or from this directory
cd apps/web
pnpm install
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
pnpm build
pnpm start
```

## Features

### Tour Management
- Create, edit, and delete tours
- Define multi-step tours with minimum 5 steps
- Specify target elements using CSS selectors
- Customize tour colors and step positioning
- Save and publish tours

### Code Generation
- Automatically generate unique tour IDs
- Provide embed script snippets for easy integration
- Display setup instructions

### Analytics
- View tour analytics and metrics
- Track completion rates
- Monitor user engagement
- See per-step performance

## Project Structure

```
app/
  (auth)/           # Authentication pages
    sign-in/
    sign-up/
  dashboard/        # Main dashboard page
  about/            # About page
  documentation/    # Documentation page
  layout.tsx        # Root layout
  page.tsx          # Home page
components/
  dashboard/        # Dashboard components
  auth/             # Auth components
  landing-page/     # Landing page components
hooks/
  useAuth.ts        # Authentication hook
lib/
  firebase.ts       # Firebase configuration
  firestore.ts      # Firestore helpers
public/             # Static assets
```

## Environment Variables

Create a `.env` file in the `apps/web` directory with:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_WIDGET_URL=https://onboarding-widget-app.vercel.app/ota-widget.js
```

## Available Scripts

```bash
# Development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint

# Format code
pnpm format
```

## Technologies Used

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: CSS Modules, CSS-in-JS
- **Authentication**: Firebase Authentication
- **Database**: Firestore
- **Deployment**: Vercel

## Deployment

The dashboard is automatically deployed to Vercel when changes are pushed to the main branch.

Live URL: https://onboarding-widget-app.vercel.app/

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## Support

For technical details and development guides, see the main README.md and documentation in the `/docs` folder.
