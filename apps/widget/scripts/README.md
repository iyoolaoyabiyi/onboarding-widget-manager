# Widget CLI Management

This directory contains the Tour Manager CLI and all related documentation, samples, and utilities.

## Directory Structure

```
scripts/
├── tour.js                 # Main entry point (wrapper)
├── cli/
│   ├── tour-manager.js     # CLI implementation
│   ├── output.js           # Terminal formatting utilities
│   ├── firebase.js         # Firebase initialization
│   ├── validators.js       # Tour data validation
│   ├── file-utils.js       # File I/O operations
│   ├── docs/               # CLI documentation
│   │   ├── CLI_README.md           # Comprehensive CLI guide
│   │   ├── FIRESTORE_SETUP.md      # Firebase setup instructions
│   │   ├── FIRESTORE_RULES.md      # Security rules documentation
│   │   └── TOUR_MANAGER_GUIDE.md   # Quick reference guide
│   └── samples/            # Sample files and templates
│       ├── tour-template.json      # Tour creation template
│       ├── firestore-test-tours.json # Sample test tours
│       └── firestore.rules         # Firestore security rules
└── README.md               # This file
```

## Quick Start

### List all tours
```bash
node scripts/tour.js list
```

### Create a new tour
```bash
node scripts/tour.js create scripts/cli/samples/tour-template.json
```

### View analytics for a tour
```bash
node scripts/tour.js analytics tour_12345
```

### Backup all tours
```bash
node scripts/tour.js backup
```

## Documentation

Full documentation is available in `scripts/cli/docs/`:

- **[CLI_README.md](./cli/docs/CLI_README.md)** - Comprehensive guide with all commands
- **[FIRESTORE_SETUP.md](./cli/docs/FIRESTORE_SETUP.md)** - Firebase configuration
- **[FIRESTORE_RULES.md](./cli/docs/FIRESTORE_RULES.md)** - Security rules reference
- **[TOUR_MANAGER_GUIDE.md](./cli/docs/TOUR_MANAGER_GUIDE.md)** - Quick reference

## Sample Files

Example files are in `scripts/cli/samples/`:

- **tour-template.json** - Template for creating new tours
- **firestore-test-tours.json** - Sample tours for testing
- **firestore.rules** - Firestore security rules to deploy

## Commands Overview

| Command | Purpose |
|---------|---------|
| `list` | List all tours |
| `get <tourId>` | Get tour details |
| `create <file>` | Create new tour |
| `update <tourId> <file>` | Update tour |
| `delete <tourId>` | Delete tour |
| `import <file>` | Bulk import tours |
| `analytics <tourId>` | View tour analytics |
| `backup` | Backup all tours |
| `deploy-rules` | Deploy Firestore rules |
| `help` | Show help |

## Module Architecture

The CLI is built with separated utility modules for better maintainability:

- **output.js** - Terminal formatting (colors, tables, logging)
- **firebase.js** - Firebase Admin SDK initialization
- **validators.js** - Tour data validation with detailed error messages
- **file-utils.js** - File I/O with backup and restore support

## Setup

1. Ensure Firebase service account key is configured (see [FIRESTORE_SETUP.md](./cli/docs/FIRESTORE_SETUP.md))
2. Install dependencies: `pnpm install`
3. Run: `node scripts/tour.js help`

## Environment Variables

Required for Firebase Admin SDK:
- `FIREBASE_PROJECT_ID`
- `FIREBASE_PRIVATE_KEY`
- `FIREBASE_CLIENT_EMAIL`

Or place `serviceAccountKey.json` in `apps/widget/` directory.

## Troubleshooting

See [FIRESTORE_SETUP.md](./cli/docs/FIRESTORE_SETUP.md) for common issues and solutions.
