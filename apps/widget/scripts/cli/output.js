/**
 * Terminal output utilities with colors and formatting
 */

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

export function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

export function error(message) {
  log(`✗ ${message}`, 'red');
}

export function success(message) {
  log(`✓ ${message}`, 'green');
}

export function info(message) {
  log(`ℹ ${message}`, 'cyan');
}

export function warning(message) {
  log(`⚠ ${message}`, 'yellow');
}

export function header(message) {
  console.log('');
  log(`${'='.repeat(60)}`, 'blue');
  log(`  ${message}`, 'blue');
  log(`${'='.repeat(60)}`, 'blue');
  console.log('');
}

export function section(message) {
  console.log('');
  log(`${message}`, 'cyan');
  log(`${'─'.repeat(message.length)}`, 'gray');
}

export function table(headers, rows) {
  const colWidths = headers.map((h, i) => 
    Math.max(h.length, Math.max(...rows.map(r => String(r[i] || '').length)))
  );
  
  // Print headers
  const headerRow = headers.map((h, i) => h.padEnd(colWidths[i])).join('  ');
  log(headerRow, 'cyan');
  log('─'.repeat(headerRow.length), 'gray');
  
  // Print rows
  rows.forEach(row => {
    const cells = row.map((cell, i) => String(cell || '').padEnd(colWidths[i]));
    console.log(cells.join('  '));
  });
  console.log('');
}

export function code(content, language = '') {
  console.log('');
  console.log(`${colors.gray}${content}${colors.reset}`);
  console.log('');
}
