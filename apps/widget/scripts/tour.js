#!/usr/bin/env node

/**
 * Tour Management CLI
 * 
 * Convenience wrapper that delegates to the actual CLI implementation
 */

import { fileURLToPath } from 'url';
import path from 'path';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cliPath = path.join(__dirname, 'cli', 'tour-manager.js');
const args = process.argv.slice(2).join(' ');

try {
  execSync(`node ${cliPath} ${args}`, {
    stdio: 'inherit',
    cwd: __dirname
  });
} catch (err) {
  process.exit(err.status || 1);
}
