# Embeddable Onboarding Widget

A lightweight, embeddable widget that displays guided onboarding tours on any website.

## Overview

This Vite-based widget creates a UMD bundle that can be embedded on any website (React, Vue, plain HTML) to display interactive onboarding tours. The widget:
- Guides users through multi-step tours
- Highlights target elements on the page
- Tracks user interactions
- Remembers tour progress
- Works without external dependencies

## Prerequisites

- Node.js 18+ (recommended: Node.js 20)
- pnpm with workspace support enabled

## Quick Start

### Installation

From the workspace root:

```bash
pnpm install
```

### Development

Start the development server:

```bash
# From workspace root
pnpm run dev:widget

# Or from widget directory
cd apps/widget
pnpm dev
```

The widget will be available at `http://localhost:5174`.

### Production Build

```bash
# From workspace root
pnpm run build

# Or from widget directory
cd apps/widget
pnpm build
```

Output files:
- `dist/ota-widget.js` - UMD bundle (11KB gzipped)
- `dist/ota-widget.umd.js` - Alternative UMD format

## Usage

### Basic Embedding

Add this script tag to any HTML page:

```html
<script 
  src="https://onboarding-widget-app.vercel.app/ota-widget.js" 
  data-tour-id="YOUR_TOUR_ID"
></script>
```

### Manual Initialization

```javascript
window.OnboardingTour.init({
  id: 'my-tour',
  name: 'Welcome Tour',
  theme: 'blue',
  steps: [
    {
      id: 'step_1',
      order: 1,
      target_element: '#button-id',
      title: 'Get Started',
      content: 'Click here to begin',
      position: 'bottom'
    }
    // ... add at least 5 steps
  ]
});
```

### Public API

```javascript
// Initialize tour
window.OnboardingTour.init(config);

// Navigation
window.OnboardingTour.next();       // Go to next step
window.OnboardingTour.back();       // Go to previous step
window.OnboardingTour.skip();       // Skip entire tour
window.OnboardingTour.stop();       // Stop and cleanup
```

## Features

- Multi-step guided tours (minimum 5 steps)
- Customizable theme colors (blue, green, red, greyscale)
- Smooth animations and transitions
- Resume capability (remembers user progress)
- Analytics event tracking
- Responsive design (desktop and mobile)
- Element highlighting with overlay
- Positioning options (top, bottom, left, right, center)

## Project Structure

```
src/
  index.ts                # Entry point and public API
  types/                  # TypeScript type definitions
  core/
    tourManager.ts        # Tour orchestration
    tourRenderer.ts       # Step rendering and navigation
  config/
    configLoader.ts       # Tour configuration loading
    constants.ts          # Default constants
    domainValidator.ts    # Domain validation
  services/
    firebaseClient.ts     # Firebase integration
  themes/
    themeManager.ts       # Theme management
  analytics/
    analytics.ts          # Event tracking
  ui/                     # UI components
  utils/                  # Utility functions
public/
  demo.html               # Demo page
  embed-demo.html         # Embed example
dist/                     # Built output (generated)
```

## Configuration

Tour configuration format:

```typescript
interface TourConfig {
  id: string;                    // Unique tour ID
  name: string;                  // Display name
  theme: 'blue' | 'green' | 'red' | 'greyscale';  // Color theme
  steps: TourStep[];            // Array of at least 5 steps
  allowed_domains?: string[];    // Whitelist domains
  avatar_enabled?: boolean;      // Show avatar
}

interface TourStep {
  id: string;                    // Unique step ID
  order: number;                 // Step order (1-indexed)
  target_element: string;        // CSS selector
  title: string;                 // Step title
  content: string;               // Step description
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  image_url?: string;            // Optional image
  video_url?: string;            // Optional video
}
```

## Development

### Scripts

```bash
# Start dev server
pnpm dev

# Build for production
pnpm build

# Run linter
pnpm lint

# Check types
npx tsc --noEmit
```

### Testing

1. Start the development server: `pnpm dev`
2. Open http://localhost:5174/public/demo.html
3. Click "Start Tour" to test the widget
4. Test navigation buttons and animations
5. Open DevTools console to see analytics events

### Testing in External HTML

Create a test HTML file:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Widget Test</title>
</head>
<body>
  <div id="test-element">Test Element</div>
  
  <script src="http://localhost:5174/dist/ota-widget.js"></script>
  <script>
    window.OnboardingTour.init({
      id: 'test',
      steps: [{
        id: 'step_1',
        order: 1,
        target_element: '#test-element',
        title: 'Test',
        content: 'Test content',
        position: 'bottom'
      }]
    });
  </script>
</body>
</html>
```

## Performance

- Bundle Size: 11KB uncompressed, 3.62KB gzipped
- Load Time: <200ms typical
- Animation Performance: 60fps smooth transitions
- Memory Usage: <2MB typical

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Building and Deployment

### Local Development Build

```bash
pnpm build
ls -lh dist/
```

### Deploy to Production

1. Build the widget: `pnpm build`
2. Upload dist files to CDN or hosting service
3. Update widget URL in dashboard environment variables
4. Test on live deployment

### Environment Configuration

The widget automatically detects the tour ID from:
1. Script attribute: `data-tour-id`
2. Manual initialization via `window.OnboardingTour.init()`

## Troubleshooting

### Widget doesn't load
- Verify script URL is correct
- Check browser console for errors
- Ensure CORS headers allow your domain
- Check network tab for 404 errors

### Elements not highlighting
- Verify CSS selectors exist: `document.querySelector('#selector')`
- Check z-index conflicts
- Ensure elements are visible

### Analytics not tracking
- Check DevTools Console for "Analytics Event" logs
- Verify Firestore configuration
- Check localStorage: `localStorage.getItem('analytics')`

### Styles not applying
- Look for `onboarding-tour-styles` in document head
- Verify theme color is valid hex
- Check for CSS conflicts

## TypeScript

All code is fully typed. Run type checking:

```bash
npx tsc --noEmit
```

## Technologies Used

- **Build Tool**: Vite
- **Language**: TypeScript
- **Framework**: Vanilla TypeScript (no dependencies)
- **Animations**: CSS and JavaScript
- **Format**: UMD (Universal Module Definition)

## Linting

```bash
pnpm lint
```

## Documentation

For detailed development guides and technical specifications, see:
- Main README.md
- `/docs/WIDGET_DEVELOPMENT.md`
- `/docs/onboarding-widget-technical.md`

## Support

For issues or questions, refer to the main README.md or technical documentation in the `/docs` folder.

| Script | Description |
|--------|-------------|
| `pnpm install` | Install dependencies |
| `pnpm run dev` | Start development server |
| `pnpm run build` | Build for production |
| `pnpm run lint` | Run ESLint |
| `pnpm run preview` | Preview production build locally |

