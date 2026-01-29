# W3AG — Web3 Accessibility Guidelines

**The first open standard for making blockchain, DeFi, and crypto applications accessible to people with disabilities.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

---

## Why W3AG?

Web3 introduces unique accessibility barriers that traditional [WCAG guidelines](https://www.w3.org/WAI/standards-guidelines/wcag/) don't address:

- **42-character hex addresses** are unreadable by screen readers and impossible to verify for users with cognitive disabilities
- **Transaction signing flows** present critical security information in ways that exclude users with visual or cognitive impairments
- **Time-sensitive operations** (auctions, liquidations, MEV) discriminate against users who need more processing time
- **Seed phrase management** creates barriers for users with motor impairments or memory difficulties
- **Gas and fee estimation** interfaces assume visual parsing of complex, dynamic information

Over 1 billion people globally live with disabilities. Web3 should be for everyone.

---

## Specification Structure

W3AG follows the W3C's proven accessibility framework:

```
Principles (4)
  └── Guidelines (16)
        └── Success Criteria (50+)
              └── Techniques & Patterns
```

### Conformance Levels

| Level | Description |
|-------|-------------|
| **Level A** | Minimum accessibility. Removes the most severe barriers. |
| **Level AA** | Recommended baseline. Addresses significant barriers. |
| **Level AAA** | Enhanced accessibility. Optimal experience for all users. |

---

## The Four Principles

### 1. Perceivable
Blockchain information and UI components must be presentable in ways all users can perceive.

### 2. Operable  
Wallet connections, transaction signing, and DeFi interactions must be operable by all users.

### 3. Understandable
Transaction details, risks, and outcomes must be understandable to users with cognitive disabilities.

### 4. Robust
Web3 applications must work reliably with assistive technologies and alternative input methods.

---

## Guidelines Overview

### Principle 1: Perceivable

#### 1.1 Address Accessibility
Blockchain addresses must be presented in accessible formats.

| SC | Level | Requirement |
|----|-------|-------------|
| 1.1.1 | A | Addresses have text alternatives (ENS, labels, or truncated formats with full address available) |
| 1.1.2 | A | Address checksums are communicated non-visually |
| 1.1.3 | AA | Addresses can be announced by screen readers in digestible chunks |
| 1.1.4 | AAA | Users can set preferred address display formats |

#### 1.2 Transaction Clarity
Transaction details must be perceivable through multiple senses.

| SC | Level | Requirement |
|----|-------|-------------|
| 1.2.1 | A | Transaction type (send, swap, approve, etc.) is clearly labeled |
| 1.2.2 | A | Token amounts use readable number formats with units |
| 1.2.3 | AA | Gas estimates include text descriptions, not just visual indicators |
| 1.2.4 | AA | Transaction simulations provide text-based outcome summaries |
| 1.2.5 | AAA | Risk levels are communicated through multiple modalities (text, color, sound) |

#### 1.3 Asset Identification
Tokens and NFTs must be identifiable without relying solely on visual recognition.

| SC | Level | Requirement |
|----|-------|-------------|
| 1.3.1 | A | Tokens have accessible names, not just ticker symbols |
| 1.3.2 | A | NFT images have meaningful alt text |
| 1.3.3 | AA | Token contract addresses are verifiable through accessible means |
| 1.3.4 | AAA | Asset metadata includes structured accessibility descriptions |

#### 1.4 Visual Presentation
Color, contrast, and visual hierarchy meet accessibility standards.

| SC | Level | Requirement |
|----|-------|-------------|
| 1.4.1 | A | Positive/negative values don't rely on color alone |
| 1.4.2 | AA | Price charts have non-visual data access |
| 1.4.3 | AA | Contrast ratios meet WCAG 2.2 AA standards |
| 1.4.4 | AAA | UI supports high contrast and dark/light modes |

---

### Principle 2: Operable

#### 2.1 Wallet Connection
Wallet connection flows must be fully keyboard and switch accessible.

| SC | Level | Requirement |
|----|-------|-------------|
| 2.1.1 | A | Wallet selection is keyboard navigable |
| 2.1.2 | A | Connection modals trap focus appropriately |
| 2.1.3 | AA | QR code connections have keyboard alternatives |
| 2.1.4 | AAA | Voice-controlled wallet connection is supported |

#### 2.2 Transaction Signing
Users must be able to review and sign transactions using assistive technology.

| SC | Level | Requirement |
|----|-------|-------------|
| 2.2.1 | A | Sign/reject buttons are keyboard accessible |
| 2.2.2 | A | Transaction review content is screen reader accessible |
| 2.2.3 | AA | Users can adjust time limits for signing |
| 2.2.4 | AA | Multi-step signing processes maintain state |
| 2.2.5 | AAA | Hardware wallet flows support screen readers |

#### 2.3 Time-Sensitive Operations
DeFi operations must accommodate users who need more time.

| SC | Level | Requirement |
|----|-------|-------------|
| 2.3.1 | A | Users are warned before time-sensitive actions |
| 2.3.2 | AA | Auction/swap deadlines can be extended where possible |
| 2.3.3 | AA | Slippage warnings give adequate response time |
| 2.3.4 | AAA | Time-critical operations offer accessibility modes |

#### 2.4 Navigation
DeFi dashboards and portfolio views must be navigable.

| SC | Level | Requirement |
|----|-------|-------------|
| 2.4.1 | A | Skip links bypass repetitive token lists |
| 2.4.2 | A | Focus order follows logical transaction flow |
| 2.4.3 | AA | Portfolio sections have heading structure |
| 2.4.4 | AAA | Keyboard shortcuts don't conflict with assistive tech |

---

### Principle 3: Understandable

#### 3.1 Readable Transactions
Transaction information must be understandable to users with cognitive disabilities.

| SC | Level | Requirement |
|----|-------|-------------|
| 3.1.1 | A | Plain language descriptions accompany technical data |
| 3.1.2 | AA | Jargon terms (slippage, gas, nonce) have accessible definitions |
| 3.1.3 | AA | Transaction outcomes are stated in concrete terms |
| 3.1.4 | AAA | Complexity levels can be adjusted per user preference |

#### 3.2 Predictable Behavior
Web3 interfaces must behave predictably.

| SC | Level | Requirement |
|----|-------|-------------|
| 3.2.1 | A | Wallet connection doesn't auto-trigger transactions |
| 3.2.2 | A | Network switching requires explicit confirmation |
| 3.2.3 | AA | Token approvals clearly explain permissions granted |
| 3.2.4 | AAA | DeFi position changes are previewed before confirmation |

#### 3.3 Error Prevention & Recovery
Users must be protected from costly mistakes.

| SC | Level | Requirement |
|----|-------|-------------|
| 3.3.1 | A | Address validation prevents sends to wrong networks |
| 3.3.2 | A | Large transactions require explicit confirmation |
| 3.3.3 | AA | Simulation failures block transaction submission |
| 3.3.4 | AA | "Max" buttons warn about leaving gas reserves |
| 3.3.5 | AAA | Transaction history allows pattern-based anomaly warnings |

#### 3.4 Risk Communication
Users must understand risks before committing.

| SC | Level | Requirement |
|----|-------|-------------|
| 3.4.1 | A | Unverified contracts are clearly flagged |
| 3.4.2 | AA | Impermanent loss and liquidation risks are explained in plain language |
| 3.4.3 | AAA | Risk assessments are provided in multiple formats |

---

### Principle 4: Robust

#### 4.1 Assistive Technology Compatibility
Web3 interfaces must work with screen readers, switches, and voice control.

| SC | Level | Requirement |
|----|-------|-------------|
| 4.1.1 | A | Wallet modals use proper ARIA roles |
| 4.1.2 | A | Dynamic balance updates are announced appropriately |
| 4.1.3 | AA | Token lists use accessible table markup |
| 4.1.4 | AAA | Real-time price feeds have configurable announcement frequency |

#### 4.2 Alternative Access Methods
Users must be able to interact through multiple means.

| SC | Level | Requirement |
|----|-------|-------------|
| 4.2.1 | AA | CLI alternatives exist for critical operations |
| 4.2.2 | AA | API access doesn't require visual CAPTCHA |
| 4.2.3 | AAA | Voice-based transaction initiation is supported |

---

## Techniques & Patterns

### Address Display Patterns

```tsx
// ❌ Inaccessible
<span>0x742d35Cc6634C0532925a3b844Bc9e7595f...</span>

// ✅ Accessible
<AddressDisplay
  address="0x742d35Cc6634C0532925a3b844Bc9e7595f"
  ensName="vitalik.eth"
  ariaLabel="Address: vitalik.eth (0x742d...5f)"
  showCopyButton
  copyAnnouncement="Address copied to clipboard"
/>
```

### Transaction Confirmation Pattern

```tsx
// ✅ Accessible transaction summary
<TransactionSummary
  type="swap"
  aria-live="polite"
>
  <h2>Confirm Swap</h2>
  <p>You are swapping 1.5 ETH for approximately 2,847 USDC.</p>
  <p>Maximum slippage: 0.5% (14.23 USDC)</p>
  <p>Network fee: approximately $3.42</p>
  
  <WarningBanner level="info">
    Price may change between now and confirmation.
  </WarningBanner>
  
  <ButtonGroup>
    <Button onClick={reject} aria-label="Cancel swap">
      Cancel
    </Button>
    <Button onClick={confirm} aria-label="Confirm swap of 1.5 ETH for USDC">
      Confirm Swap
    </Button>
  </ButtonGroup>
</TransactionSummary>
```

### Time Extension Pattern

```tsx
// ✅ Accessible time-sensitive operation
<AuctionBid
  endsIn={timeRemaining}
  onTimeWarning={() => announce("Auction ending in 30 seconds")}
  extendable={true}
  onRequestExtension={handleExtension}
  extensionLabel="Need more time? Request 60-second extension"
/>
```

---

## Testing Checklist

### Level A Compliance

- [ ] All addresses have text alternatives
- [ ] Transaction types are clearly labeled  
- [ ] Token amounts are screen-reader friendly
- [ ] Wallet connection is keyboard accessible
- [ ] Sign/reject buttons are focusable
- [ ] Plain language accompanies technical data
- [ ] Address validation prevents cross-chain errors

### Level AA Compliance

- [ ] Gas estimates have text descriptions
- [ ] QR codes have keyboard alternatives
- [ ] Time limits can be adjusted
- [ ] Jargon terms have accessible definitions
- [ ] Token approvals explain permissions
- [ ] Simulation failures block submission
- [ ] Screen reader compatibility verified

### Level AAA Compliance

- [ ] Users can set preferred display formats
- [ ] Voice-controlled wallet connection works
- [ ] Hardware wallet flows are screen reader accessible
- [ ] Complexity levels are adjustable
- [ ] Risk assessments in multiple formats
- [ ] CLI alternatives for critical operations

---

## Implementation Resources

### Libraries & Tools

| Tool | Description | Link |
|------|-------------|------|
| `@w3ag/react` | React components with W3AG compliance | *Coming soon* |
| `@w3ag/audit` | Automated accessibility auditing for Web3 | *Coming soon* |
| `@w3ag/wagmi` | Accessible wagmi hooks and components | *Coming soon* |

### Framework Guides

- [React + wagmi Implementation Guide](./guides/react-wagmi.md)
- [Next.js DeFi Dashboard Guide](./guides/nextjs-defi.md)
- [Vue + ethers.js Guide](./guides/vue-ethers.md)

---

## Contributing

We welcome contributions from accessibility experts, Web3 developers, and users with disabilities.

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Priority Areas

1. **Success criteria refinement** — Help us define measurable, testable criteria
2. **Technique documentation** — Share accessible implementation patterns
3. **Testing tools** — Build automated compliance checkers
4. **Translations** — Make W3AG available in more languages
5. **User research** — Help us understand real accessibility barriers in Web3

---

## Acknowledgments

W3AG builds on the foundational work of:

- [W3C Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/standards-guidelines/wcag/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [A11y Project](https://www.a11yproject.com/)

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

<p align="center">
  <strong>Web3 should be for everyone.</strong><br>
  Started by nich and built by the open source community.
</p>
