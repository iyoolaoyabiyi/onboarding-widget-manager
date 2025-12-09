r# Onboarding Widget

A Vite-based React widget that creates an embeddable guided tour script for web applications.

## Prerequisites

- Node.js 18+ (recommended: Node.js 20)
- pnpm with workspace support enabled

## Setup

### 1. Install Dependencies

From the root of the monorepo:

```bash
pnpm install
```

This installs all dependencies for both the widget and other workspace apps.

### 2. Development

Start the development server:

```bash
pnpm run dev:widget
```

Or from the widget directory:

```bash
cd apps/widget
pnpm run dev
```

The widget will be available at `http://localhost:5173` (default Vite port).

### 3. Build

Build the widget for production:

```bash
pnpm run build
```

Or from the widget directory:

```bash
cd apps/widget
pnpm run build
```

This generates:
- UMD bundle at `dist/onboarding-tour.umd.js`
- Output directory: `dist/`

### 4. Linting

Check code quality:

```bash
pnpm run lint
```

Or from the widget directory:

```bash
cd apps/widget
pnpm run lint
```

## Project Structure

- `src/main.ts` - Entry point for the library
- `src/` - React components and logic
- `public/` - Static assets
  - `embed-demo.html` - Demo HTML for testing widget embedding
  - `mock-tour.json` - Sample tour configuration
- `dist/` - Built output (generated)

## Usage

The widget is built as a UMD module that can be embedded in any web application:

```html
<script src="path/to/onboarding-tour.umd.js"></script>
<script>
  const tour = new OnboardingTour({
    // configuration
  });
</script>
```

## Testing

For test, visit `/embed-demo` route

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm install` | Install dependencies |
| `pnpm run dev` | Start development server |
| `pnpm run build` | Build for production |
| `pnpm run lint` | Run ESLint |
| `pnpm run preview` | Preview production build locally |

