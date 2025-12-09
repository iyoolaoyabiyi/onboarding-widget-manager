# Development Guide

## Local Development Setup

### Prerequisites

```bash
# Install Node.js 18+
node --version  # should be v18.0.0 or higher

# Install pnpm
npm install -g pnpm
pnpm --version  # should be 8+
```

### Initial Setup

```bash
# Clone the repository
git clone <repo-url>
cd onboarding-widget

# Install dependencies for all workspaces
pnpm install

# Install dependencies for specific app
cd apps/widget && npm install
cd ../web && npm install
```

## Running Development Servers

### Widget Development

```bash
cd apps/widget

# Start Vite dev server (http://localhost:5174)
npm run dev

# In another terminal, view the demo page:
# Open http://localhost:5174/public/demo.html
```

### Dashboard Development

```bash
cd apps/web

# Start Next.js dev server (http://localhost:3000)
npm run dev

# Open http://localhost:3000 in browser
```

### Running Both Servers

```bash
# Terminal 1: Widget
cd apps/widget && npm run dev

# Terminal 2: Dashboard
cd apps/web && npm run dev
```

## Building

### Build Widget Only

```bash
cd apps/widget
npm run build

# Output: dist/onboarding-tour.umd.js
# Size check
ls -lh dist/onboarding-tour.umd.js
```

### Build Dashboard Only

```bash
cd apps/web
npm run build

# Output: .next/ directory
```

### Build All

```bash
cd app  # root
pnpm run build
```

## Testing

### Widget Testing

1. **Build the widget**:
   ```bash
   cd apps/widget && npm run build
   ```

2. **Test in demo page**:
   - Open http://localhost:5174/public/demo.html
   - Click "Start Tour"
   - Test all navigation buttons
   - Open DevTools console to see analytics events

3. **Test in embed demo**:
   - Open http://localhost:5174/public/demo.html
   - Check that widget loads and works

4. **Test in external HTML**:
   ```html
   <!DOCTYPE html>
   <html>
   <body>
     <div id="test-element">Test Element</div>
     
     <script src="http://localhost:5174/dist/onboarding-tour.umd.js" data-tour-id="tour_demo_001"></script>
     
     <script>
       // Or manually init
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

### Dashboard Testing

1. **Open dashboard**:
   ```
   http://localhost:3000
   ```

2. **Test tour creation**:
   - Click "+ New Tour"
   - Fill in all fields
   - Click "Save Tour"
   - Verify tour appears in list

3. **Test tour editing**:
   - Click "✏️ Edit" on a tour
   - Modify fields
   - Click "Save Tour"
   - Verify changes are saved

4. **Test analytics**:
   - Switch to "📊 Analytics" tab
   - Start a tour on the widget
   - Navigate through steps
   - Verify events appear in analytics table

## Code Structure

### Widget (`apps/widget/src/`)

```
types.ts              # Core TypeScript interfaces
constants.ts          # Default configs and constants
styleManager.ts       # CSS injection and management
tooltip.ts           # Tooltip positioning and rendering
configLoader.ts      # Tour configuration fetching
analytics.ts         # Event tracking
tourRenderer.ts      # Step rendering and state
tourManager.ts       # Main orchestrator
index.ts             # Entry point and public API
```

### Dashboard (`apps/web/app/`)

```
page.tsx             # Main dashboard component
page.module.css      # Dashboard styles
layout.tsx           # Root layout
globals.css          # Global styles
```

## Debugging

### Enable Debug Logging

The widget logs to browser console by default. In DevTools:

```javascript
// Check if tour is active
console.log(window.OnboardingTour);

// Manually trigger events
window.OnboardingTour.next();
window.OnboardingTour.back();

// Check local storage (dashboard data)
localStorage.getItem('tours');
localStorage.getItem('analytics');
```

### Common Issues

#### Widget not loading
- Check script URL in HTML
- Verify CORS headers (if loading from different domain)
- Check DevTools Network tab for 404s

#### Elements not highlighting
- Verify CSS selectors exist: `document.querySelector('#selector')`
- Check z-index conflicts
- Ensure elements are visible

#### Analytics not tracking
- Check DevTools Console for "Analytics Event Fired" logs
- Verify endpoint is configured (if using backend)
- Check localStorage: `localStorage.getItem('analytics')`

#### Styles not applying
- Check for `onboarding-tour-styles` in document head
- Verify theme color is valid hex
- Check for CSS conflicts with host page

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/widget-improvements

# Make changes and commit
git add .
git commit -m "feat: improve widget animations"

# Push to remote
git push origin feature/widget-improvements

# Create pull request on GitHub
```

## TypeScript

### Type Checking

```bash
cd apps/widget
npm run build  # Also runs tsc -b

# Or just check types
npx tsc --noEmit
```

### Adding Types

- Add interfaces to `src/types.ts`
- Use `import type { }` for type-only imports
- Export public types from `src/index.ts`

## Performance Profiling

### Widget Bundle Size

```bash
cd apps/widget

# Build and check
npm run build
ls -lh dist/

# Analyze dependencies
npx webpack-bundle-analyzer dist/onboarding-tour.umd.js
```

### Runtime Performance

Use Chrome DevTools:
1. Open Performance tab
2. Record while running tour
3. Look for long tasks and bottlenecks

## Styling

### Widget Styles

Styles are injected via `styleManager.ts`. To update:

1. Edit `STYLE_ID` constant in `constants.ts` if needed
2. Update CSS in `styleManager.ts#generateStyles()`
3. Rebuild: `npm run build`

### Dashboard Styles

Edit `apps/web/app/page.module.css` for dashboard styling.

## API Integration (Future)

### Replace Mock Data

In `configLoader.ts`:

```typescript
// Replace this:
const response = await fetch('/mock-tour.json');

// With your API:
const response = await fetch(`https://api.example.com/tours/${tourId}`);
```

### Send Analytics

In `analytics.ts`, update `sendEvent()` to post to your backend:

```typescript
// Configure endpoint
Analytics.setEndpoint('https://api.example.com/analytics');
```

## Deployment

### Staging

```bash
# Build everything
pnpm run build

# Deploy widget to staging CDN
# Deploy dashboard to staging host
```

### Production

```bash
# Tag release
git tag v1.0.0
git push origin v1.0.0

# Build
pnpm run build

# Deploy to production
# - Upload widget to CDN
# - Deploy dashboard to hosting
# - Update documentation
```

## Troubleshooting

### pnpm install fails
```bash
# Clear cache
pnpm store prune

# Reinstall
pnpm install
```

### Port already in use
```bash
# Widget port 5173/5174
lsof -i :5173
kill -9 <PID>

# Dashboard port 3000
lsof -i :3000
kill -9 <PID>
```

### TypeScript errors
```bash
# Clean and rebuild
cd apps/widget
rm -rf dist/ node_modules/.vite
npm run build
```

## Resources

- [Vite Docs](https://vitejs.dev/)
- [Next.js Docs](https://nextjs.org/docs)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [pnpm Docs](https://pnpm.io/)

## Support

For issues or questions, check the main README.md or refer to technical documentation.
