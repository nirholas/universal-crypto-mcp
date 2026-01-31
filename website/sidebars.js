// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'getting-started/installation',
        'getting-started/quick-start',
        'getting-started/configuration',
      ],
    },
    {
      type: 'category',
      label: 'Facilitator',
      items: [
        'facilitator/overview',
        'facilitator/api-reference',
        'facilitator/deployment',
        'facilitator/monitoring',
      ],
    },
    {
      type: 'category',
      label: 'Marketplace',
      items: [
        'marketplace/overview',
        'marketplace/registering-services',
        'marketplace/subscriptions',
        'marketplace/reputation',
        'marketplace/featured-listings',
      ],
    },
    {
      type: 'category',
      label: 'Payments',
      items: [
        'payments/x402-protocol',
        'payments/supported-networks',
        'payments/fee-structure',
      ],
    },
    {
      type: 'category',
      label: 'Agent Wallet',
      items: [
        'agent-wallet/overview',
        'agent-wallet/creating-wallets',
        'agent-wallet/spending-policies',
        'agent-wallet/mcp-integration',
      ],
    },
    {
      type: 'category',
      label: 'Credits',
      items: [
        'credits/overview',
        'credits/purchasing',
        'credits/auto-topup',
      ],
    },
    {
      type: 'category',
      label: 'Tutorials',
      items: [
        'tutorials/build-paid-api',
        'tutorials/integrate-marketplace',
        'tutorials/setup-agent-wallet',
      ],
    },
    {
      type: 'category',
      label: 'API Reference',
      items: [
        'api/facilitator',
        'api/marketplace',
        'api/wallets',
      ],
    },
  ],
};

export default sidebars;
