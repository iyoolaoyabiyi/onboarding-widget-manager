/**
 * File I/O utilities for tour JSON operations
 */

import fs from 'fs';
import path from 'path';
import { error, success } from './output.js';

export function loadTourFile(filePath) {
  const fullPath = path.resolve(process.cwd(), filePath);

  if (!fs.existsSync(fullPath)) {
    error(`File not found: ${filePath}`);
    process.exit(1);
  }

  try {
    const data = fs.readFileSync(fullPath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    error(`Failed to parse JSON file: ${err.message}`);
    process.exit(1);
  }
}

export function saveTourFile(filePath, data) {
  const fullPath = path.resolve(process.cwd(), filePath);
  const dirPath = path.dirname(fullPath);

  // Create directory if it doesn't exist
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  try {
    fs.writeFileSync(fullPath, JSON.stringify(data, null, 2));
    success(`Saved to: ${path.relative(process.cwd(), fullPath)}`);
    return fullPath;
  } catch (err) {
    error(`Failed to write file: ${err.message}`);
    process.exit(1);
  }
}

export function ensureDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

export function getBackupPath() {
  const widgetDir = path.join(process.cwd());
  const backupDir = path.join(widgetDir, 'backups');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  return path.join(backupDir, `tours-backup-${timestamp}.json`);
}
