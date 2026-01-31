// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Universal Crypto MCP',
  tagline: 'The largest MCP server for crypto tools - 150+ tools for DeFi, NFTs, payments, and more',
  favicon: 'img/favicon.ico',

  url: 'https://docs.nirholas.com',
  baseUrl: '/',

  organizationName: 'nirholas',
  projectName: 'universal-crypto-mcp',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          editUrl: 'https://github.com/nirholas/universal-crypto-mcp/tree/main/website/',
        },
        blog: {
          showReadingTime: true,
          editUrl: 'https://github.com/nirholas/universal-crypto-mcp/tree/main/website/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/social-card.png',
      navbar: {
        title: 'Universal Crypto MCP',
        logo: {
          alt: 'Universal Crypto MCP Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Docs',
          },
          {to: '/blog', label: 'Blog', position: 'left'},
          {
            href: 'https://github.com/nirholas/universal-crypto-mcp',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Introduction',
                to: '/docs/intro',
              },
              {
                label: 'Getting Started',
                to: '/docs/getting-started/installation',
              },
              {
                label: 'API Reference',
                to: '/docs/api/facilitator',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'GitHub Discussions',
                href: 'https://github.com/nirholas/universal-crypto-mcp/discussions',
              },
              {
                label: 'Discord',
                href: 'https://discord.gg/universal-crypto-mcp',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/universal_mcp',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/nirholas/universal-crypto-mcp',
              },
              {
                label: 'npm',
                href: 'https://www.npmjs.com/package/@nirholas/universal-crypto-mcp',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} nirholas. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['solidity', 'json', 'bash'],
      },
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
    }),
};

export default config;
