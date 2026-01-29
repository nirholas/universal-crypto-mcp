# W3AG Audit Tool

A command-line tool to scan React/TypeScript files for **Web3 Accessibility Guidelines** violations.

## Quick Start

```bash
# Run directly with npx and ts-node
npx ts-node tools/audit/w3ag-audit.ts ./src

# Or install globally
npm install -g w3ag-audit
w3ag-audit ./src
```

## Installation

### As a Development Dependency

```bash
npm install --save-dev w3ag-audit
```

Add to your `package.json` scripts:

```json
{
  "scripts": {
    "audit:a11y": "w3ag-audit ./src",
    "audit:a11y:ci": "w3ag-audit ./src --no-color"
  }
}
```

### Standalone

```bash
cd tools/audit
npm install
npm link  # Makes w3ag-audit available globally
```

## Usage

```bash
# Audit a directory
w3ag-audit ./src

# Audit a single file
w3ag-audit ./src/components/WalletModal.tsx

# Output as JSON (for CI integration)
w3ag-audit ./src --json

# Disable colors (for CI logs)
w3ag-audit ./src --no-color

# Show help
w3ag-audit --help
```

## Exit Codes

| Code | Meaning |
|------|---------|
| `0` | No Level A violations found |
| `1` | Level A violations found (fails CI) |
| `2` | Error (invalid path, permission denied, etc.) |

## Checks Performed

### Level A (Critical)

These are the minimum accessibility requirements. **Fail CI if found.**

| Rule ID | Criterion | What It Checks |
|---------|-----------|----------------|
| `1.1.1-raw-address` | Address text alternative | Raw 0x addresses without formatting |
| `1.1.1-hex-string` | Hex string formatting | Long hex strings (>20 chars) without chunking |
| `1.3.1-img-alt` | Image alt text | `<img>` without `alt` attribute |
| `1.3.1-input-label` | Input labels | `<input>` without label association |
| `2.1.1-div-onclick` | Interactive elements | `<div onClick>` without `role="button"` |
| `2.1.1-keyboard` | Keyboard support | `onClick` without `onKeyDown` |
| `4.1.1-button-name` | Button names | Icon-only buttons without `aria-label` |
| `4.1.1-link-name` | Link names | Icon-only links without `aria-label` |
| `4.1.2-live-region` | Live regions | Dynamic status without `aria-live` |

### Level AA (Recommended)

These improve the experience significantly. **Warn but don't fail CI.**

| Rule ID | Criterion | What It Checks |
|---------|-----------|----------------|
| `1.4.1-color-only` | Color-only values | Green/red for profit/loss without ▲/▼ |
| `1.4.1-status-color` | Color-only status | Status dots without text labels |
| `1.2.3-wei-amount` | Wei formatting | Large numbers without `formatEther` |
| `2.4.7-focus-visible` | Focus styles | `outline-none` without `focus:ring` |
| `4.1.2-modal-aria` | Modal ARIA | Modals without `role="dialog"` |
| `3.2.2-auto-tx` | Auto transactions | `sendTransaction` in `useEffect` |
| `3.4.1-unlimited-approval` | Approval warning | `MaxUint256` without warning UI |

### Level AAA (Informational)

Nice-to-haves for optimal accessibility. **Noted but never fails.**

| Rule ID | Criterion | What It Checks |
|---------|-----------|----------------|
| `3.1.1-jargon` | Technical jargon | Terms like "gwei", "slippage" without explanation |
| `2.2.1-time-limit` | Time limits | Countdowns without extension option |

## Example Output

```
W3AG Audit Report
=================
Scanned: 47 files
Violations: 12

LEVEL A VIOLATIONS (8)
──────────────────────────────────────────────────
src/components/Send.tsx:45
  ❌ 1.1.1-raw-address Address displayed without text alternative
  Code: <span>{address}</span>
  Fix: Use <AddressDisplay address={address} /> or format with aria-label

src/components/WalletButton.tsx:23
  ❌ 4.1.1-button-name Button without accessible name
  Code: <button onClick={connect}><WalletIcon /></button>
  Fix: Add aria-label="description" to buttons with only icons

LEVEL AA VIOLATIONS (4)
──────────────────────────────────────────────────
src/components/TokenList.tsx:67
  ⚠ 1.4.1-color-only Color-only value indicator
  Code: <span className="text-green-500">{change}%</span>
  Fix: Add directional indicator: ▲/▼ or +/- prefix alongside color

──────────────────────────────────────────────────
Summary: 8 Level A, 4 Level AA, 0 Level AAA
Conformance: Does not meet Level A
```

## CI Integration

### GitHub Actions

```yaml
name: Accessibility Audit

on: [push, pull_request]

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run W3AG Audit
        run: npx w3ag-audit ./src --no-color
```

### Pre-commit Hook

```bash
# .husky/pre-commit
npx w3ag-audit ./src --no-color
```

## JSON Output

For programmatic use, the `--json` flag outputs structured data:

```json
{
  "scannedFiles": 47,
  "violations": [
    {
      "file": "src/components/Send.tsx",
      "line": 45,
      "level": "A",
      "criterion": "Address displayed without text alternative",
      "criterionId": "1.1.1-raw-address",
      "message": "Raw Ethereum address displayed without accessible formatting",
      "code": "<span>{address}</span>",
      "fix": "Use <AddressDisplay address={address} /> or format with aria-label"
    }
  ],
  "levelACounts": 8,
  "levelAACounts": 4,
  "levelAAACounts": 0
}
```

## Limitations

This is a regex-based static analyzer. It cannot:

- Understand React component composition (props passed to child components)
- Evaluate runtime behavior or conditional rendering paths
- Check actual color contrast ratios
- Verify that `aria-label` values are meaningful
- Detect issues in dynamically generated JSX

For complete accessibility testing:

1. **Use this tool** for automated first-pass checks
2. **Test with screen readers** (NVDA, JAWS, VoiceOver)
3. **Keyboard test** entire user flows
4. **Use axe-core** for DOM-based analysis at runtime

## Adding Custom Rules

Edit `w3ag-audit.ts` and add to the `RULES` array:

```typescript
{
  id: 'custom-1',
  criterion: 'My custom check',
  level: 'AA',
  message: 'Description of the issue',
  pattern: /regex-pattern-here/g,
  fix: 'How to fix this issue',
}
```

## Related

- [W3AG Specification](https://github.com/nirholas/w3ag)
- [WCAG 2.2 Guidelines](https://www.w3.org/TR/WCAG22/)
- [axe-core](https://github.com/dequelabs/axe-core) - Runtime DOM accessibility testing
- [eslint-plugin-jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y) - ESLint a11y rules

## License

MIT
