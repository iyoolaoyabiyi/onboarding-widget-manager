# My Onboarding App

Monorepo for a guided onboarding product with:
- `apps/web`: Next.js app (marketing + dashboard)
- `apps/widget`: Vite React widget (embeddable tour script)

## Prerequisites
- Node.js 18+ (`nvm install 20 && nvm use 20`)
- npm (workspaces enabled)

## Getting Started
```bash
npm install             # installs workspaces
npm run dev:web         # start Next.js
npm run dev:widget      # start Vite widget
```

## Production Builds
```bash
npm run build           # builds both apps
```

## Linting
```bash
npm run lint            # lints both apps
```

## Notes
- Follow `docs/task.md` for feature requirements (marketing, dashboard, embeddable widget, authentication).
- Each app keeps its own scripts; workspace helpers proxy to them.
