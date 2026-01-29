# W3AG Testing Checklist

A comprehensive checklist for testing Web3 application accessibility against W3AG guidelines.

---

## Quick Test (5 minutes)

Run through these basic checks first:

- [ ] Tab through the entire page - can you reach all interactive elements?
- [ ] Is there a visible focus indicator on every focusable element?
- [ ] Can you connect a wallet using only keyboard?
- [ ] Are transaction amounts readable (not in wei)?
- [ ] Do addresses have ENS names or truncated formats?

---

## Level A Compliance Checklist

### Perceivable

#### 1.1 Address Accessibility
- [ ] All addresses have text alternatives (ENS, labels, or truncation)
- [ ] Full address is available on hover/focus for verification
- [ ] Address checksum status is communicated non-visually
- [ ] Screen reader announces addresses in digestible format

#### 1.2 Transaction Clarity
- [ ] Every transaction has a human-readable type label
- [ ] Token amounts displayed in human-readable format (not wei)
- [ ] Token amounts include symbol/name

#### 1.3 Asset Identification
- [ ] Tokens show full name, not just ticker symbol
- [ ] NFT images have meaningful alt text
- [ ] Token contract addresses are accessible

#### 1.4 Visual Presentation
- [ ] Profit/loss indicators don't rely on color alone
- [ ] Status indicators use icons or text, not just color

### Operable

#### 2.1 Wallet Connection
- [ ] Wallet modal opens with keyboard
- [ ] Can tab through wallet options
- [ ] Can select wallet with Enter/Space
- [ ] Modal closes with Escape
- [ ] Focus trapped within modal
- [ ] Focus returns to trigger on close

#### 2.2 Transaction Signing
- [ ] Sign/Reject buttons are keyboard accessible
- [ ] Transaction details are screen reader accessible
- [ ] Buttons have visible focus indicators

#### 2.3 Time-Sensitive Operations
- [ ] Users warned before time-sensitive actions
- [ ] Countdowns are accessible (not just visual)

#### 2.4 Navigation
- [ ] Skip links available for long pages
- [ ] Tab order matches visual order
- [ ] No positive tabindex values used

### Understandable

#### 3.1 Readable Transactions
- [ ] Plain language descriptions accompany technical data
- [ ] Function names have human-readable explanations

#### 3.2 Predictable Behavior
- [ ] Wallet connect NEVER auto-triggers transactions
- [ ] Network switch requires explicit confirmation

#### 3.3 Error Prevention
- [ ] Address validation for correct network
- [ ] Invalid address error messages are clear
- [ ] Error messages accessible to screen readers

#### 3.4 Risk Communication
- [ ] Unverified contracts clearly flagged
- [ ] Warnings require acknowledgment

### Robust

#### 4.1 Assistive Technology
- [ ] Modals have `role="dialog"` and `aria-modal="true"`
- [ ] Dropdowns have proper `aria-expanded` states
- [ ] Dynamic content uses `aria-live` regions
- [ ] Transaction status changes announced

---

## Level AA Compliance Checklist

### Perceivable

#### 1.2 Transaction Clarity (Extended)
- [ ] Gas estimates include fiat currency values
- [ ] Gas fee text descriptions provided (not just visual bars)
- [ ] Transaction simulations have text summaries

#### 1.3 Asset Identification (Extended)
- [ ] Token verification status accessible
- [ ] Contract address can be copied

#### 1.4 Visual Presentation (Extended)
- [ ] Charts have data tables or text summaries
- [ ] All text meets 4.5:1 contrast ratio
- [ ] Interactive elements meet 3:1 contrast ratio

### Operable

#### 2.1 Wallet Connection (Extended)
- [ ] QR codes have copy-link alternative
- [ ] Connection URI can be copied to clipboard

#### 2.2 Transaction Signing (Extended)
- [ ] Time limits for signing can be extended
- [ ] Multi-step transactions maintain state
- [ ] Progress indicators for multi-step flows

#### 2.3 Time-Sensitive (Extended)
- [ ] Deadline extensions available where possible
- [ ] Slippage warnings have adequate response time
- [ ] Quote expiry warned in advance

#### 2.4 Navigation (Extended)
- [ ] Proper heading hierarchy (h1→h2→h3)
- [ ] Portfolio sections have clear headings

### Understandable

#### 3.1 Readable Transactions (Extended)
- [ ] Jargon terms have accessible definitions
- [ ] Tooltips/popovers for technical terms
- [ ] Transaction outcomes state concrete amounts

#### 3.2 Predictable Behavior (Extended)
- [ ] Token approvals explain permissions granted
- [ ] Approval amounts clearly stated
- [ ] Unlimited approvals have warnings

#### 3.3 Error Prevention (Extended)
- [ ] Large transactions require confirmation
- [ ] Simulation failures block submission
- [ ] "Max" button warns about gas reserves

#### 3.4 Risk Communication (Extended)
- [ ] Impermanent loss explained in plain language
- [ ] Liquidation risks explained clearly
- [ ] Concrete examples provided for risks

### Robust

#### 4.1 Assistive Technology (Extended)
- [ ] Token lists use proper table markup
- [ ] Tables have proper headers with scope
- [ ] Sort state announced for sortable columns

#### 4.2 Alternative Access
- [ ] Non-visual CAPTCHA alternative available
- [ ] Wallet signature can replace CAPTCHA

---

## Level AAA Compliance Checklist

### Perceivable

#### 1.1 Address Accessibility (Extended)
- [ ] Users can set preferred address display format

#### 1.2 Transaction Clarity (Extended)
- [ ] Risk levels communicated via multiple modalities

#### 1.3 Asset Identification (Extended)
- [ ] Structured accessibility metadata available

#### 1.4 Visual Presentation (Extended)
- [ ] High contrast mode supported
- [ ] Dark/light mode with system preference detection

### Operable

#### 2.1 Wallet Connection (Extended)
- [ ] Voice-controlled wallet connection works

#### 2.2 Transaction Signing (Extended)
- [ ] Hardware wallet flows have screen reader guidance

#### 2.3 Time-Sensitive (Extended)
- [ ] Accessibility mode with extended time limits
- [ ] Auto-refresh for quotes available

#### 2.4 Navigation (Extended)
- [ ] Custom keyboard shortcuts don't conflict with AT
- [ ] Shortcuts can be customized or disabled

### Understandable

#### 3.1 Readable Transactions (Extended)
- [ ] Complexity levels adjustable (simple/advanced)
- [ ] User preference persists across sessions

#### 3.2 Predictable Behavior (Extended)
- [ ] Position changes show before/after preview

#### 3.3 Error Prevention (Extended)
- [ ] Pattern-based anomaly detection
- [ ] Unusual transaction warnings

#### 3.4 Risk Communication (Extended)
- [ ] Risk assessments in multiple formats
- [ ] Audio risk announcements available

### Robust

#### 4.1 Assistive Technology (Extended)
- [ ] Price feed announcement frequency configurable
- [ ] Manual announce button for prices

#### 4.2 Alternative Access (Extended)
- [ ] CLI alternative for critical operations
- [ ] Voice transaction initiation supported

---

## Screen Reader Testing

### NVDA (Windows)
- [ ] Navigate page with arrow keys
- [ ] Use H key to jump between headings
- [ ] Use Tab to navigate interactive elements
- [ ] Verify live regions announce changes
- [ ] Test virtual cursor mode

### VoiceOver (macOS)
- [ ] Use VO+Right/Left to navigate
- [ ] Use VO+Command+H for headings
- [ ] Verify rotor shows correct elements
- [ ] Test form controls with VO+Space

### VoiceOver (iOS)
- [ ] Swipe to navigate elements
- [ ] Double-tap to activate
- [ ] Test with screen curtain on
- [ ] Verify all buttons are labeled

### TalkBack (Android)
- [ ] Swipe to navigate
- [ ] Double-tap to activate
- [ ] Test reading controls
- [ ] Verify focus order

---

## Keyboard Testing

| Action | Expected Keys |
|--------|---------------|
| Navigate forward | Tab |
| Navigate backward | Shift+Tab |
| Activate button | Enter or Space |
| Close modal | Escape |
| Navigate list | Arrow Up/Down |
| Select option | Enter |
| Open dropdown | Enter, Space, or Arrow Down |

### Keyboard Test Scenarios

1. **Wallet Connection Flow**
   - [ ] Tab to Connect button
   - [ ] Press Enter to open modal
   - [ ] Navigate wallets with arrows
   - [ ] Select with Enter
   - [ ] Verify focus management

2. **Swap Flow**
   - [ ] Tab through all inputs
   - [ ] Open token selector with keyboard
   - [ ] Search and select token
   - [ ] Enter amount
   - [ ] Review and confirm

3. **Send Flow**
   - [ ] Enter address with keyboard
   - [ ] Tab to amount input
   - [ ] Use Max button
   - [ ] Navigate confirmation dialog
   - [ ] Confirm or reject

---

## Automated Testing Tools

### Browser Extensions
- [ ] axe DevTools - Run full page audit
- [ ] WAVE - Check errors and alerts
- [ ] Lighthouse - Accessibility score

### Code-Level Testing
```bash
# Install dependencies
npm install --save-dev jest-axe @testing-library/react

# Example test
import { axe } from 'jest-axe';

test('wallet modal has no violations', async () => {
  const { container } = render(<WalletModal isOpen />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### CI/CD Integration
```yaml
# .github/workflows/accessibility.yml
name: Accessibility Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run test:a11y
```

---

## Common Issues & Fixes

### Issue: Missing button labels
```tsx
// ❌ Bad
<button><Icon /></button>

// ✅ Good
<button aria-label="Close modal"><Icon aria-hidden="true" /></button>
```

### Issue: Color-only indicators
```tsx
// ❌ Bad
<span className={profit > 0 ? 'green' : 'red'}>{profit}%</span>

// ✅ Good
<span className={profit > 0 ? 'green' : 'red'}>
  {profit > 0 ? '▲' : '▼'} {profit}%
</span>
```

### Issue: Missing live regions
```tsx
// ❌ Bad - status changes not announced
<span>{status}</span>

// ✅ Good
<span role="status" aria-live="polite">{status}</span>
```

### Issue: Focus not trapped in modal
```tsx
// Use a focus trap library or implement manually
import { FocusTrap } from 'focus-trap-react';

<FocusTrap>
  <Modal />
</FocusTrap>
```

---

## Reporting Template

```markdown
## Accessibility Audit Report

**Application:** [Name]
**Date:** [Date]
**Tester:** [Name]
**Tools Used:** [List]

### Summary
- Level A: X/Y criteria pass
- Level AA: X/Y criteria pass
- Level AAA: X/Y criteria pass

### Critical Issues
1. [Description] - [Location] - [Impact]

### Major Issues
1. [Description] - [Location] - [Impact]

### Minor Issues
1. [Description] - [Location] - [Impact]

### Recommendations
1. [Recommendation]
```
