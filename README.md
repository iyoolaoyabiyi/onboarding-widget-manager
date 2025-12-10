# Onboarding Widget - Complete Project Guide

This is a onboarding/tour widget system with a dashboard for onboarding tours management.

## Project Structure

```
├── apps/
│   ├── widget/          # Embeddable widget (Vite + TypeScript)
│   └── web/             # Dashboard (Next.js + React)
└── docs/                # Technical documentation
```

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Install Dependencies

```bash
# From root directory
pnpm install
```

### Widget App (Vite)

```bash
# Navigate to widget directory
cd apps/widget

# Development server (runs on http://localhost:5174)
npm run dev

# Build for production
npm run build

# Build output: dist/onboarding-tour.umd.js (11KB gzipped)
```

### Dashboard App (Next.js)

```bash
# Navigate to dashboard directory
cd apps/web

# Development server (runs on http://localhost:3000)
npm run dev

# Build for production
npm run build
```

## Widget Features

### Core Capabilities

- ✨ **Multi-step Tours**: Create tours with 5+ steps
- 🎨 **Customizable**: Theme colors and positioning options
- ⚡ **Lightweight**: Only 11KB gzipped
- 📊 **Analytics**: Track user interactions
- 🔄 **Resumable**: Remember user progress
- 📱 **Responsive**: Works on all devices
- 🚀 **Fast**: Smooth animations and transitions

### Technical Details

- **Bundle Size**: 11KB (gzipped: 3.62KB)
- **Framework**: Vanilla TypeScript (no dependencies)
- **Format**: UMD (Universal Module Definition)
- **Compatibility**: Works on any website (React, Vue, plain HTML)

### Widget Architecture

```
src/
├── index.ts              # Main entry point, public API
├── tourManager.ts        # Orchestrates tour flow
├── tourRenderer.ts       # Renders steps and handles navigation
├── tooltip.ts            # Tooltip positioning and content
├── configLoader.ts       # Loads tour configuration
├── styleManager.ts       # Injects CSS styles
├── analytics.ts          # Tracks user events
├── constants.ts          # Constants and defaults
└── types.ts              # TypeScript type definitions
```

## Dashboard Features

### Tours Management
- Create, edit, and delete tours
- Define steps with custom target elements
- Customize colors and positioning
- Generate embed codes

### Analytics
- Real-time event tracking
- Step completion rates
- Tour skip metrics
- Per-tour analytics

### Storage
- LocalStorage-based persistence (temporary)
- Ready for backend integration

## Integration Guide

### Embedding the Widget

1. **Get the embed code from the dashboard**:
   - Create or select a tour
   - Copy the embed script code

2. **Add to your website**:
   ```html
   <script src="https://your-domain.com/onboarding-tour.umd.js" data-tour-id="tour_12345"></script>
   ```

3. **Manual initialization** (optional):
   ```javascript
   // If not using data-tour-id
   window.OnboardingTour.init({
     id: 'tour_custom',
     name: 'My Tour',
     theme: 'blue',
     steps: [
       {
         id: 'step_1',
         order: 1,
         target_element: '#button-id',
         title: 'Step 1',
         content: 'This is step 1',
         position: 'bottom'
       }
       // ... more steps
     ]
   });
   ```

### Public API

```javascript
// Initialize tour
window.OnboardingTour.init(config)

// Navigation
window.OnboardingTour.next()       // Go to next step
window.OnboardingTour.back()       // Go to previous step
window.OnboardingTour.skip()       // Skip entire tour
window.OnboardingTour.stop()       // Stop and cleanup
```

## Tour Configuration Format

```typescript
interface TourConfig {
  id: string;                          // Unique tour ID
  name: string;                        // Display name
  description?: string;                // Tour description
  theme: 'blue' | 'green' | 'red' | 'greyscale';  // Named theme
  allowed_domains: string[];           // Domain whitelist
  owner_id: string;                    // User ID
  status: 'draft' | 'active' | 'paused' | 'archived';
  avatar_enabled: boolean;             // Show avatar
  min_steps: number;                   // Minimum steps
  total_views: number;                 // View count
  total_completions: number;           // Completion count
  completion_rate: number;             // Completion %
  steps: TourStep[];                   // Array of at least 5 steps
  created_at: string;                  // ISO timestamp
  updated_at: string;                  // ISO timestamp
  last_viewed_at?: string;             // Last view timestamp
}

interface TourStep {
  id: string;                          // Unique step ID (e.g., 'step_01')
  order: number;                       // Step order (1-indexed)
  target_element: string;              // CSS selector (e.g., '#button', '.class')
  title: string;                       // Step title
  content: string;                     // Step description
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  image_url?: string;                  // Optional image
  video_url?: string;                  // Optional video
  cta_text?: string;                   // Call-to-action text
  cta_url?: string;                    // Call-to-action URL
  created_at?: string;                 // ISO timestamp
  updated_at?: string;                 // ISO timestamp
}
```

## Analytics Events

The widget tracks the following events:

```typescript
interface AnalyticsEvent {
  tour_id: string;         // Which tour
  step_id?: string;        // Which step (optional)
  action: 'started' | 'completed' | 'skipped' | 'tour_finished';
  timestamp: string;       // ISO timestamp
}
```

### Setting Up Analytics Backend

```typescript
// In widget initialization
import { Analytics } from './analytics';

Analytics.setEndpoint('https://your-api.com/analytics');
```

## Development Workflow

### 1. Create/Edit Tours
- Open dashboard at http://localhost:3000
- Create a new tour with at least 5 steps
- Define target elements by CSS selector

### 2. Test Widget
- Open widget demo at http://localhost:5174
- Start the tour
- Test navigation, animations, and responsiveness

### 3. Check Analytics
- View analytics in dashboard
- Verify events are being tracked correctly

### 4. Deploy
- Build widget: `npm run build` (in apps/widget)
- Build dashboard: `npm run build` (in apps/web)
- Deploy to Vercel or similar

## File Structure Details

### Widget Configuration

Located in `public/mock-tour.json` during development:

```json
{
  "id": "tour_demo_001",
  "name": "Welcome Tour",
  "description": "Welcome users to the product",
  "theme": "blue",
  "allowed_domains": ["example.com"],
  "owner_id": "user_123",
  "status": "active",
  "avatar_enabled": false,
  "min_steps": 5,
  "total_views": 0,
  "total_completions": 0,
  "completion_rate": 0,
  "created_at": "2024-12-10T00:00:00Z",
  "updated_at": "2024-12-10T00:00:00Z",
  "steps": [
    {
      "id": "step_01",
      "order": 1,
      "target_element": "#signup-btn",
      "title": "Welcome!",
      "content": "This is the first step.",
      "position": "bottom"
    }
    // ... 4+ more steps
  ]
}
```

## TypeScript Support

All code is fully typed with TypeScript. Key types:

- `TourConfig` - Tour configuration
- `TourStep` - Individual step definition
- `TooltipPosition` - Positioning enum
- `AnalyticsEvent` - Analytics event structure
- `AnalyticsAction` - Action type union

## Performance Metrics

- **Bundle Size**: 11KB uncompressed, 3.62KB gzipped
- **Load Time**: <200ms typical
- **Animation Performance**: 60fps smooth transitions
- **Memory Usage**: <2MB typical

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Testing the Widget

### Manual Testing Steps

1. **Start the dev server**:
   ```bash
   cd apps/widget && npm run dev
   ```

2. **Open demo page**:
   ```
   http://localhost:5174/public/demo.html
   ```

3. **Test scenarios**:
   - Click "Start Tour" button
   - Navigate through all steps
   - Test "Back" button
   - Test "Skip Tour" button
   - Reload page and verify resume works
   - Test on mobile device

4. **Check console** for analytics logs

## Production Deployment

### Widget Deployment

1. Build the widget:
   ```bash
   cd apps/widget && npm run build
   ```

2. Upload to CDN:
   ```
   dist/onboarding-tour.umd.js → https://cdn.example.com/onboarding-tour.umd.js
   dist/mock-tour.json → https://api.example.com/tours
   ```

3. Update embed script in dashboard

### Dashboard Deployment

1. Build Next.js app:
   ```bash
   cd apps/web && npm run build
   ```

2. Deploy to Vercel or Netlify

## Configuration for Production

### Environment Variables (Dashboard)

```env
NEXT_PUBLIC_API_URL=https://your-api.com
NEXT_PUBLIC_WIDGET_URL=https://cdn.example.com/onboarding-tour.umd.js
```

### Widget Analytics Endpoint

Update in your backend integration:

```javascript
Analytics.setEndpoint('https://your-api.com/analytics');
```

## Troubleshooting

### Widget doesn't load
- Check if script URL is correct
- Verify CORS headers allow your domain
- Check browser console for errors

### Tour steps don't highlight
- Verify CSS selectors exist on the page
- Check z-index conflicts with other overlays
- Ensure elements are not hidden

### Analytics not tracking
- Verify endpoint URL is correct
- Check network tab for failed requests
- Enable console logs for debugging

### Styles don't apply
- Check if CSS is injected (look for `onboarding-tour-styles`)
- Verify theme color is valid hex

## Next Steps for Team B

The dashboard is temporary and designed for testing. Team B should:

1. Build a permanent dashboard with:
   - User authentication
   - Database backend
   - Analytics dashboard
   - Team collaboration features

2. Implement API endpoints for:
   - Tour CRUD operations
   - Analytics persistence
   - User management

3. Replace localStorage with proper backend

4. Add advanced features:
   - Tour versioning
   - A/B testing
   - User segmentation
   - Advanced analytics

## License

MIT License

## Support

For issues or questions, please refer to the technical documentation in `/docs/onboarding-widget-technical.md`

## Linting
```bash
pnpm run lint           # lints both apps
```

## Notes
- Follow `docs/task.md` for feature requirements (marketing, dashboard, embeddable widget, authentication).
- Each app keeps its own scripts; workspace helpers proxy to them.
