# W3AG Quick Start Guide

Get your Web3 application W3AG-compliant in 30 minutes.

---

## Step 1: Audit Your Current State (5 min)

Run these quick checks:

```bash
# Install axe browser extension and run on your site
# Or use the CLI:
npx @axe-core/cli https://your-app.com
```

Check the [Testing Checklist](./TESTING_CHECKLIST.md) Quick Test section.

---

## Step 2: Fix Critical Issues First (10 min)

### Add Skip Links

```tsx
// Add at the top of your main layout
<nav className="skip-links">
  <a href="#main-content">Skip to main content</a>
  <a href="#wallet-actions">Skip to wallet actions</a>
</nav>

// Add CSS
.skip-links a {
  position: absolute;
  left: -10000px;
}
.skip-links a:focus {
  left: 10px;
  top: 10px;
  z-index: 1000;
  background: white;
  padding: 8px 16px;
}
```

### Fix Wallet Modal Focus

```tsx
// Ensure your wallet modal has:
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
>
  <h2 id="modal-title">Connect Wallet</h2>
  {/* content */}
</div>
```

### Add Live Regions for Status

```tsx
// Add near your status displays:
<div role="status" aria-live="polite">
  {transactionStatus}
</div>
```

---

## Step 3: Address Display (5 min)

Replace raw addresses with accessible format:

```tsx
// Before
<span>{address}</span>

// After
function AddressDisplay({ address, ensName }) {
  const truncated = `${address.slice(0, 6)}...${address.slice(-4)}`;
  const srLabel = ensName 
    ? `${ensName}, address ${address}` 
    : address;
  
  return (
    <span aria-label={srLabel}>
      {ensName || truncated}
    </span>
  );
}
```

---

## Step 4: Transaction Forms (5 min)

Ensure forms are accessible:

```tsx
<form>
  {/* Always use labels */}
  <label htmlFor="amount">Amount (ETH)</label>
  <input 
    id="amount"
    type="text"
    inputMode="decimal"
    aria-describedby="amount-help"
  />
  <p id="amount-help">Enter amount to send</p>
  
  {/* Accessible error messages */}
  {error && (
    <p role="alert" className="error">
      {error}
    </p>
  )}
  
  {/* Clear button labels */}
  <button type="submit">
    Send {amount} ETH
  </button>
</form>
```

---

## Step 5: Color Independence (5 min)

Add non-color indicators:

```tsx
// Before - color only
<span className={change > 0 ? 'green' : 'red'}>
  {change}%
</span>

// After - color + symbol
<span className={change > 0 ? 'green' : 'red'}>
  {change > 0 ? '▲ +' : '▼ '}{change}%
</span>
```

---

## Essential CSS

Add these utility classes:

```css
/* Screen reader only content */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Focus indicators */
:focus-visible {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}
```

---

## Next Steps

1. **Read the full spec**: [README.md](./README.md)
2. **Use our components**: [components/](./components/)
3. **Follow the React + wagmi guide**: [guides/react-wagmi.md](./guides/react-wagmi.md)
4. **Run full testing**: [TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md)

---

## Common Mistakes to Avoid

| ❌ Don't | ✅ Do |
|----------|-------|
| `<div onClick>` | `<button onClick>` |
| Icon-only buttons | Buttons with `aria-label` |
| `tabindex="5"` | Reorder DOM instead |
| Color-only status | Color + icon + text |
| Auto-playing content | User-controlled playback |
| Time limits without warning | Warn + extend options |

---

## Getting Help

- Open an issue: [github.com/nirholas/w3ag/issues](https://github.com/nirholas/w3ag/issues)
- Join discussions: [github.com/nirholas/w3ag/discussions](https://github.com/nirholas/w3ag/discussions)
