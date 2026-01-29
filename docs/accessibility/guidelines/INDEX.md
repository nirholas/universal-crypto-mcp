# W3AG Guidelines Index

Quick reference to all W3AG guidelines organized by principle.

---

## Principle 1: Perceivable

Blockchain information and UI components must be presentable in ways all users can perceive.

| Guideline | Description | Docs |
|-----------|-------------|------|
| **1.1 Address Accessibility** | Blockchain addresses presented in accessible formats | [View →](./perceivable/1.1-address-accessibility.md) |
| **1.2 Transaction Clarity** | Transaction details perceivable through multiple senses | [View →](./perceivable/1.2-transaction-clarity.md) |
| **1.3 Asset Identification** | Tokens/NFTs identifiable without visual recognition | [View →](./perceivable/1.3-asset-identification.md) |
| **1.4 Visual Presentation** | Color, contrast, and visual hierarchy standards | [View →](./perceivable/1.4-visual-presentation.md) |

### Key Success Criteria

- **1.1.1** (A): Addresses have text alternatives
- **1.2.1** (A): Transaction types clearly labeled
- **1.2.3** (AA): Gas estimates include text descriptions
- **1.4.1** (A): Color not sole indicator for values

---

## Principle 2: Operable

Wallet connections, transaction signing, and DeFi interactions must be operable by all users.

| Guideline | Description | Docs |
|-----------|-------------|------|
| **2.1 Wallet Connection** | Fully keyboard and switch accessible | [View →](./operable/2.1-wallet-connection.md) |
| **2.2 Transaction Signing** | Review and sign with assistive technology | [View →](./operable/2.2-transaction-signing.md) |
| **2.3 Time-Sensitive Operations** | Accommodate users who need more time | [View →](./operable/2.3-time-sensitive-operations.md) |
| **2.4 Navigation** | Dashboards and portfolios are navigable | [View →](./operable/2.4-navigation.md) |

### Key Success Criteria

- **2.1.1** (A): Wallet selection keyboard navigable
- **2.1.2** (A): Modal focus trapped appropriately
- **2.2.1** (A): Sign/reject buttons keyboard accessible
- **2.3.1** (A): Users warned before time-sensitive actions

---

## Principle 3: Understandable

Transaction details, risks, and outcomes must be understandable to users with cognitive disabilities.

| Guideline | Description | Docs |
|-----------|-------------|------|
| **3.1 Readable Transactions** | Information understandable to all | [View →](./understandable/3.1-readable-transactions.md) |
| **3.2 Predictable Behavior** | Interfaces behave predictably | [View →](./understandable/3.2-predictable-behavior.md) |
| **3.3 Error Prevention** | Protection from costly mistakes | [View →](./understandable/3.3-error-prevention.md) |
| **3.4 Risk Communication** | Users understand risks before committing | [View →](./understandable/3.4-risk-communication.md) |

### Key Success Criteria

- **3.1.1** (A): Plain language with technical data
- **3.2.1** (A): No auto-triggered transactions
- **3.3.1** (A): Address validation prevents cross-chain errors
- **3.4.1** (A): Unverified contracts flagged

---

## Principle 4: Robust

Web3 applications must work reliably with assistive technologies and alternative input methods.

| Guideline | Description | Docs |
|-----------|-------------|------|
| **4.1 AT Compatibility** | Works with screen readers, switches, voice | [View →](./robust/4.1-assistive-technology.md) |
| **4.2 Alternative Access** | Multiple interaction methods available | [View →](./robust/4.2-alternative-access.md) |

### Key Success Criteria

- **4.1.1** (A): Proper ARIA roles for custom controls
- **4.1.2** (A): Dynamic content announced appropriately
- **4.2.1** (AA): CLI alternatives for critical operations
- **4.2.2** (AA): Non-visual CAPTCHA alternatives

---

## Conformance Levels

| Level | Description | Target Audience |
|-------|-------------|-----------------|
| **Level A** | Minimum accessibility. Removes most severe barriers. | All applications |
| **Level AA** | Recommended baseline. Addresses significant barriers. | Production apps |
| **Level AAA** | Enhanced accessibility. Optimal experience. | Accessibility-focused apps |

---

## Quick Reference by Task

### Wallet Connection
- [2.1 Wallet Connection](./operable/2.1-wallet-connection.md)
- [4.1.1 ARIA Roles](./robust/4.1-assistive-technology.md#411-proper-aria-roles-level-a)

### Sending Transactions
- [1.1 Address Accessibility](./perceivable/1.1-address-accessibility.md)
- [2.2 Transaction Signing](./operable/2.2-transaction-signing.md)
- [3.3 Error Prevention](./understandable/3.3-error-prevention.md)

### Swapping Tokens
- [1.2 Transaction Clarity](./perceivable/1.2-transaction-clarity.md)
- [2.3 Time-Sensitive Operations](./operable/2.3-time-sensitive-operations.md)
- [3.1 Readable Transactions](./understandable/3.1-readable-transactions.md)

### DeFi Positions
- [1.3 Asset Identification](./perceivable/1.3-asset-identification.md)
- [3.4 Risk Communication](./understandable/3.4-risk-communication.md)
- [4.1.3 Accessible Tables](./robust/4.1-assistive-technology.md#413-accessible-table-markup-level-aa)

### Portfolio/Dashboard
- [1.4 Visual Presentation](./perceivable/1.4-visual-presentation.md)
- [2.4 Navigation](./operable/2.4-navigation.md)

---

## Related Resources

- [Components Library](../components/)
- [React + wagmi Guide](../guides/react-wagmi.md)
- [Testing Checklist](../TESTING_CHECKLIST.md)
- [Quick Start Guide](../QUICK_START.md)
