#!/usr/bin/env npx ts-node

/**
 * W3AG Audit CLI Tool
 * 
 * Scans React/TSX files for Web3 Accessibility Guidelines violations.
 * 
 * Usage:
 *   npx ts-node tools/audit/w3ag-audit.ts ./src
 *   npx w3ag-audit ./src
 * 
 * Exit codes:
 *   0 - No Level A violations
 *   1 - Level A violations found
 */

import * as fs from 'fs';
import * as path from 'path';

// =============================================================================
// Types
// =============================================================================

interface Violation {
  file: string;
  line: number;
  level: 'A' | 'AA' | 'AAA';
  criterion: string;
  criterionId: string;
  message: string;
  code: string;
  fix: string;
}

interface AuditResult {
  scannedFiles: number;
  violations: Violation[];
  levelACounts: number;
  levelAACounts: number;
  levelAAACounts: number;
}

interface Rule {
  id: string;
  criterion: string;
  level: 'A' | 'AA' | 'AAA';
  message: string;
  pattern: RegExp;
  fix: string;
  /** Optional validation function for more complex checks */
  validate?: (match: RegExpExecArray, fileContent: string, lines: string[]) => boolean;
}

// =============================================================================
// Audit Rules
// =============================================================================

const RULES: Rule[] = [
  // -------------------------------------------------------------------------
  // Level A Rules
  // -------------------------------------------------------------------------
  
  // 1.1.1 - Addresses without text alternatives
  {
    id: '1.1.1-raw-address',
    criterion: 'Address displayed without text alternative',
    level: 'A',
    message: 'Raw Ethereum address displayed without accessible formatting',
    pattern: /[{>]\s*(?:address|addr|wallet|account)\s*[}<]|{\s*`\s*0x\$\{|>\s*0x[a-fA-F0-9]{10,}/g,
    fix: 'Use <AddressDisplay address={address} /> or format with aria-label',
  },
  
  // 1.1.1 - Long hex strings without formatting
  {
    id: '1.1.1-hex-string',
    criterion: 'Long hex string without accessible formatting',
    level: 'A',
    message: 'Hex string over 20 characters displayed without chunking for screen readers',
    pattern: /["'`]0x[a-fA-F0-9]{20,}["'`]/g,
    fix: 'Break address into chunks of 4 characters with aria-label',
  },

  // 1.3.1 - Images without alt text
  {
    id: '1.3.1-img-alt',
    criterion: 'Image missing alt text',
    level: 'A',
    message: 'Image element without alt attribute',
    pattern: /<img(?![^>]*\balt\s*=)[^>]*>/gi,
    fix: 'Add alt="description" or alt="" for decorative images with aria-hidden="true"',
  },

  // 2.1.1 - Non-interactive elements with onClick
  {
    id: '2.1.1-div-onclick',
    criterion: 'Non-interactive element with click handler',
    level: 'A',
    message: 'div/span with onClick but no role="button" or tabIndex',
    pattern: /<(?:div|span)[^>]*\bonClick\b(?![^>]*\brole\s*=\s*["']button["'])(?![^>]*\btabIndex\b)[^>]*>/gi,
    fix: 'Add role="button" tabIndex={0} onKeyDown handler, or use <button>',
  },

  // 2.1.1 - onClick without keyboard handler
  {
    id: '2.1.1-keyboard',
    criterion: 'Click handler without keyboard support',
    level: 'A',
    message: 'Element has onClick but missing onKeyDown/onKeyPress/onKeyUp',
    pattern: /<(?:div|span|li|tr|td)[^>]*\bonClick\s*=(?![^>]*\bonKey(?:Down|Press|Up)\b)[^>]*>/gi,
    fix: 'Add onKeyDown={(e) => e.key === "Enter" && handler()} for keyboard access',
  },

  // 4.1.1 - Buttons without accessible names
  {
    id: '4.1.1-button-name',
    criterion: 'Button without accessible name',
    level: 'A',
    message: 'Button element with no text content, aria-label, or aria-labelledby',
    pattern: /<button[^>]*>(?:\s*<(?:svg|img|icon)[^>]*(?:\/>|>[^<]*<\/(?:svg|img|icon)>)\s*)<\/button>/gi,
    fix: 'Add aria-label="description" to buttons with only icons',
    validate: (match, content) => {
      // Check if the button has aria-label
      return !match[0].includes('aria-label');
    },
  },

  // 4.1.1 - Links without accessible names
  {
    id: '4.1.1-link-name',
    criterion: 'Link without accessible name',
    level: 'A',
    message: 'Anchor element with no text content or aria-label',
    pattern: /<a[^>]*href[^>]*>(?:\s*<(?:svg|img|icon)[^>]*(?:\/>|>[^<]*<\/(?:svg|img|icon)>)\s*)<\/a>/gi,
    fix: 'Add aria-label="description" to links with only icons',
    validate: (match) => !match[0].includes('aria-label'),
  },

  // 1.3.1 - Form inputs without labels
  {
    id: '1.3.1-input-label',
    criterion: 'Form input without associated label',
    level: 'A',
    message: 'Input element without id+label, aria-label, or aria-labelledby',
    pattern: /<input(?![^>]*\baria-label(?:ledby)?\s*=)(?![^>]*\bid\s*=)[^>]*>/gi,
    fix: 'Add aria-label="description" or associate with <label htmlFor="id">',
  },

  // 4.1.2 - Dynamic content without aria-live
  {
    id: '4.1.2-live-region',
    criterion: 'Dynamic content may need aria-live',
    level: 'A',
    message: 'State-driven content update without aria-live region',
    pattern: /\{\s*(?:isLoading|isPending|isError|error|status|message)\s*&&/g,
    fix: 'Wrap dynamic status in <div role="status" aria-live="polite">',
  },

  // 3.3.1 - Transaction without type label
  {
    id: '3.3.1-tx-type',
    criterion: 'Transaction without clear type label',
    level: 'A',
    message: 'Transaction UI should clearly label the transaction type',
    pattern: /(?:sendTransaction|writeContract|signMessage)\s*\(/g,
    fix: 'Display clear transaction type: "Send", "Swap", "Approve", etc.',
  },

  // -------------------------------------------------------------------------
  // Level AA Rules
  // -------------------------------------------------------------------------

  // 1.4.1 - Color-only indicators (profit/loss)
  {
    id: '1.4.1-color-only',
    criterion: 'Color-only value indicator',
    level: 'AA',
    message: 'Using only color (green/red) to indicate positive/negative values',
    pattern: /<[^>]*className\s*=\s*["'][^"']*(?:text-(?:green|red)-\d+|text-success|text-danger|text-error)[^"']*["'][^>]*>\s*\{[^}]*(?:change|percent|pnl|profit|loss|delta)[^}]*\}/gi,
    fix: 'Add directional indicator: ▲/▼ or +/- prefix alongside color',
  },

  // 1.4.1 - Color-only status indicators
  {
    id: '1.4.1-status-color',
    criterion: 'Color-only status indicator',
    level: 'AA',
    message: 'Status indicated by color alone without text or icon',
    pattern: /<(?:span|div)[^>]*className\s*=\s*["'][^"']*(?:bg-(?:green|red|yellow)-\d+)[^"']*["'][^>]*(?:\s*\/>|>\s*<\/)/gi,
    fix: 'Add text label or icon with aria-label for status meaning',
  },

  // 1.2.3 - Wei amounts without formatting
  {
    id: '1.2.3-wei-amount',
    criterion: 'Token amount in wei without formatting',
    level: 'AA',
    message: 'Large number (likely wei) displayed without human-readable formatting',
    pattern: /\{\s*(?:amount|value|balance|price)\s*\}|>\s*\d{16,}\s*</g,
    fix: 'Use formatEther/formatUnits to display human-readable amounts',
  },

  // 2.4.7 - Missing focus styles
  {
    id: '2.4.7-focus-visible',
    criterion: 'Missing visible focus indicator',
    level: 'AA',
    message: 'Interactive element may lack visible focus indicator',
    pattern: /<(?:button|a)[^>]*className\s*=\s*["'][^"']*(?:outline-none|focus:outline-none)(?![^"']*focus:ring)[^"']*["']/gi,
    fix: 'Add focus-visible styles: focus:ring-2 focus:ring-blue-500',
  },

  // 2.4.7 - Custom button without focus styles
  {
    id: '2.4.7-custom-focus',
    criterion: 'Custom interactive element without focus styles',
    level: 'AA',
    message: 'Element with onClick should have visible focus styles',
    pattern: /<(?:div|span)[^>]*role\s*=\s*["']button["'][^>]*(?!focus)[^>]*>/gi,
    fix: 'Add focus:outline-none focus:ring-2 focus:ring-offset-2',
  },

  // 4.1.2 - Modals without proper ARIA
  {
    id: '4.1.2-modal-aria',
    criterion: 'Modal without proper ARIA attributes',
    level: 'AA',
    message: 'Modal/dialog missing role="dialog" and aria-modal="true"',
    pattern: /(?:isOpen|isVisible|showModal|modalOpen)\s*&&\s*\(?[\s\n]*<(?:div|section)[^>]*(?!role\s*=\s*["'](?:dialog|alertdialog)["'])[^>]*>/gi,
    fix: 'Add role="dialog" aria-modal="true" aria-labelledby="title-id"',
  },

  // 3.2.2 - Auto-triggered transactions
  {
    id: '3.2.2-auto-tx',
    criterion: 'Potentially auto-triggered transaction',
    level: 'AA',
    message: 'Transaction may be triggered automatically in useEffect',
    pattern: /useEffect\s*\(\s*(?:async\s*)?\(\s*\)\s*=>\s*\{[^}]*(?:sendTransaction|writeContract|signTransaction)[^}]*\}/g,
    fix: 'Never auto-trigger transactions; require explicit user action',
  },

  // 1.4.3 - Contrast (basic check for gray text)
  {
    id: '1.4.3-contrast',
    criterion: 'Potentially low contrast text',
    level: 'AA',
    message: 'Light gray text may not meet contrast requirements',
    pattern: /className\s*=\s*["'][^"']*text-gray-[34]00[^"']*["']/g,
    fix: 'Use text-gray-500 or darker for sufficient contrast (4.5:1 ratio)',
  },

  // 3.4.1 - Unlimited approval without warning
  {
    id: '3.4.1-unlimited-approval',
    criterion: 'Unlimited token approval without warning',
    level: 'AA',
    message: 'MaxUint256 approval should include prominent warning',
    pattern: /(?:MaxUint256|maxUint256|MAX_UINT256|2\s*\*\*\s*256|type\(uint256\)\.max)/g,
    fix: 'Show clear warning about unlimited approval risks',
  },

  // -------------------------------------------------------------------------
  // Level AAA Rules (informational)
  // -------------------------------------------------------------------------

  // 3.1.1 - Technical jargon
  {
    id: '3.1.1-jargon',
    criterion: 'Technical jargon without explanation',
    level: 'AAA',
    message: 'Technical term displayed without plain language explanation',
    pattern: />\s*(?:gas limit|nonce|gwei|slippage|MEV|impermanent loss)\s*</gi,
    fix: 'Provide tooltip or inline explanation of technical terms',
  },

  // 2.2.1 - Time limit without extension
  {
    id: '2.2.1-time-limit',
    criterion: 'Time-limited action without extension option',
    level: 'AAA',
    message: 'Countdown/timeout without ability to extend',
    pattern: /(?:countdown|timeLeft|timeRemaining|expires?(?:At|In)?)\s*[<{]/gi,
    fix: 'Allow users to extend time limits or disable for accessibility',
  },
];

// =============================================================================
// File Scanning
// =============================================================================

function findFiles(dir: string, extensions: string[]): string[] {
  const files: string[] = [];
  
  function scan(currentDir: string) {
    let entries: fs.Dirent[];
    
    try {
      entries = fs.readdirSync(currentDir, { withFileTypes: true });
    } catch (err) {
      return; // Skip directories we can't read
    }
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      // Skip node_modules, .git, dist, build directories
      if (entry.isDirectory()) {
        if (['node_modules', '.git', 'dist', 'build', '.next', 'coverage'].includes(entry.name)) {
          continue;
        }
        scan(fullPath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (extensions.includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  }
  
  scan(dir);
  return files;
}

function getLineNumber(content: string, index: number): number {
  return content.substring(0, index).split('\n').length;
}

function getCodeSnippet(lines: string[], lineNumber: number): string {
  const line = lines[lineNumber - 1] || '';
  // Truncate long lines
  const maxLength = 60;
  const trimmed = line.trim();
  if (trimmed.length > maxLength) {
    return trimmed.substring(0, maxLength) + '...';
  }
  return trimmed;
}

// =============================================================================
// Audit Logic
// =============================================================================

function auditFile(filePath: string): Violation[] {
  const violations: Violation[] = [];
  
  let content: string;
  try {
    content = fs.readFileSync(filePath, 'utf-8');
  } catch (err) {
    console.error(`  Warning: Could not read ${filePath}`);
    return violations;
  }
  
  const lines = content.split('\n');
  const relativePath = path.relative(process.cwd(), filePath);
  
  for (const rule of RULES) {
    // Reset regex lastIndex for global patterns
    rule.pattern.lastIndex = 0;
    
    let match: RegExpExecArray | null;
    while ((match = rule.pattern.exec(content)) !== null) {
      // Run custom validation if provided
      if (rule.validate && !rule.validate(match, content, lines)) {
        continue;
      }
      
      const lineNumber = getLineNumber(content, match.index);
      const codeSnippet = getCodeSnippet(lines, lineNumber);
      
      violations.push({
        file: relativePath,
        line: lineNumber,
        level: rule.level,
        criterion: rule.criterion,
        criterionId: rule.id,
        message: rule.message,
        code: codeSnippet,
        fix: rule.fix,
      });
    }
  }
  
  return violations;
}

function runAudit(targetPath: string): AuditResult {
  const absolutePath = path.resolve(targetPath);
  
  if (!fs.existsSync(absolutePath)) {
    console.error(`Error: Path does not exist: ${absolutePath}`);
    process.exit(2);
  }
  
  const stats = fs.statSync(absolutePath);
  let files: string[];
  
  if (stats.isDirectory()) {
    files = findFiles(absolutePath, ['.tsx', '.jsx', '.ts', '.js']);
  } else {
    files = [absolutePath];
  }
  
  const allViolations: Violation[] = [];
  
  for (const file of files) {
    const fileViolations = auditFile(file);
    allViolations.push(...fileViolations);
  }
  
  // Sort by file, then line number
  allViolations.sort((a, b) => {
    if (a.file !== b.file) return a.file.localeCompare(b.file);
    return a.line - b.line;
  });
  
  return {
    scannedFiles: files.length,
    violations: allViolations,
    levelACounts: allViolations.filter(v => v.level === 'A').length,
    levelAACounts: allViolations.filter(v => v.level === 'AA').length,
    levelAAACounts: allViolations.filter(v => v.level === 'AAA').length,
  };
}

// =============================================================================
// Report Output
// =============================================================================

const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
  bold: '\x1b[1m',
};

function printReport(result: AuditResult, useColor: boolean = true): void {
  const c = useColor ? COLORS : {
    reset: '', red: '', yellow: '', green: '', blue: '', cyan: '', dim: '', bold: ''
  };
  
  console.log('');
  console.log(`${c.bold}W3AG Audit Report${c.reset}`);
  console.log('=================');
  console.log(`Scanned: ${result.scannedFiles} files`);
  console.log(`Violations: ${result.violations.length}`);
  console.log('');
  
  if (result.violations.length === 0) {
    console.log(`${c.green}✓ No violations found!${c.reset}`);
    console.log('');
    return;
  }
  
  // Group violations by level
  const levelAViolations = result.violations.filter(v => v.level === 'A');
  const levelAAViolations = result.violations.filter(v => v.level === 'AA');
  const levelAAAViolations = result.violations.filter(v => v.level === 'AAA');
  
  // Print Level A violations
  if (levelAViolations.length > 0) {
    console.log(`${c.red}${c.bold}LEVEL A VIOLATIONS (${levelAViolations.length})${c.reset}`);
    console.log(`${c.dim}${'─'.repeat(50)}${c.reset}`);
    
    for (const v of levelAViolations) {
      console.log(`${c.cyan}${v.file}${c.reset}:${c.yellow}${v.line}${c.reset}`);
      console.log(`  ${c.red}❌ ${v.criterionId}${c.reset} ${v.criterion}`);
      console.log(`  ${c.dim}Code: ${v.code}${c.reset}`);
      console.log(`  ${c.green}Fix: ${v.fix}${c.reset}`);
      console.log('');
    }
  }
  
  // Print Level AA violations
  if (levelAAViolations.length > 0) {
    console.log(`${c.yellow}${c.bold}LEVEL AA VIOLATIONS (${levelAAViolations.length})${c.reset}`);
    console.log(`${c.dim}${'─'.repeat(50)}${c.reset}`);
    
    for (const v of levelAAViolations) {
      console.log(`${c.cyan}${v.file}${c.reset}:${c.yellow}${v.line}${c.reset}`);
      console.log(`  ${c.yellow}⚠ ${v.criterionId}${c.reset} ${v.criterion}`);
      console.log(`  ${c.dim}Code: ${v.code}${c.reset}`);
      console.log(`  ${c.green}Fix: ${v.fix}${c.reset}`);
      console.log('');
    }
  }
  
  // Print Level AAA violations (informational)
  if (levelAAAViolations.length > 0) {
    console.log(`${c.blue}${c.bold}LEVEL AAA NOTES (${levelAAAViolations.length})${c.reset}`);
    console.log(`${c.dim}${'─'.repeat(50)}${c.reset}`);
    
    for (const v of levelAAAViolations) {
      console.log(`${c.cyan}${v.file}${c.reset}:${c.yellow}${v.line}${c.reset}`);
      console.log(`  ${c.blue}ℹ ${v.criterionId}${c.reset} ${v.criterion}`);
      console.log(`  ${c.dim}Code: ${v.code}${c.reset}`);
      console.log(`  ${c.green}Suggestion: ${v.fix}${c.reset}`);
      console.log('');
    }
  }
  
  // Summary
  console.log(`${c.dim}${'─'.repeat(50)}${c.reset}`);
  console.log(`${c.bold}Summary:${c.reset} ${result.levelACounts} Level A, ${result.levelAACounts} Level AA, ${result.levelAAACounts} Level AAA`);
  
  if (result.levelACounts > 0) {
    console.log(`${c.red}${c.bold}Conformance: Does not meet Level A${c.reset}`);
  } else if (result.levelAACounts > 0) {
    console.log(`${c.yellow}${c.bold}Conformance: Meets Level A, but not Level AA${c.reset}`);
  } else {
    console.log(`${c.green}${c.bold}Conformance: Meets Level AA${c.reset}`);
  }
  console.log('');
}

// =============================================================================
// CLI Entry Point
// =============================================================================

function printUsage(): void {
  console.log(`
${COLORS.bold}W3AG Audit Tool${COLORS.reset}
Scan React/TypeScript files for Web3 accessibility violations.

${COLORS.bold}Usage:${COLORS.reset}
  npx w3ag-audit <path>           Audit a directory or file
  npx w3ag-audit ./src            Audit the src directory
  npx w3ag-audit ./src/App.tsx    Audit a single file

${COLORS.bold}Options:${COLORS.reset}
  --no-color    Disable colored output
  --json        Output results as JSON
  --help, -h    Show this help message

${COLORS.bold}Exit Codes:${COLORS.reset}
  0    No Level A violations found
  1    Level A violations found
  2    Error (invalid path, etc.)

${COLORS.bold}Checks Performed:${COLORS.reset}
  Level A:
    • Addresses without text alternatives
    • Images without alt text
    • Buttons/links without accessible names
    • Non-interactive elements with onClick
    • Form inputs without labels
    • Missing aria-live for dynamic content

  Level AA:
    • Color-only indicators
    • Wei amounts without formatting
    • Missing focus-visible styles
    • Modals without proper ARIA
    • Auto-triggered transactions

  Level AAA (informational):
    • Technical jargon without explanation
    • Time limits without extensions

${COLORS.bold}Learn More:${COLORS.reset}
  https://github.com/nirholas/w3ag
`);
}

function main(): void {
  const args = process.argv.slice(2);
  
  // Parse flags
  const flags = {
    noColor: args.includes('--no-color'),
    json: args.includes('--json'),
    help: args.includes('--help') || args.includes('-h'),
  };
  
  // Remove flags from args
  const paths = args.filter(arg => !arg.startsWith('--') && !arg.startsWith('-'));
  
  if (flags.help || paths.length === 0) {
    printUsage();
    process.exit(0);
  }
  
  const targetPath = paths[0];
  
  console.log(`${COLORS.dim}Scanning ${targetPath}...${COLORS.reset}`);
  
  const result = runAudit(targetPath);
  
  if (flags.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    printReport(result, !flags.noColor);
  }
  
  // Exit with code 1 if Level A violations found
  if (result.levelACounts > 0) {
    process.exit(1);
  }
  
  process.exit(0);
}

// Run if executed directly
main();
