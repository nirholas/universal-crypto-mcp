# Universal Crypto MCP - Unified Website

> Production-grade Next.js 14 website for the Universal Crypto MCP ecosystem

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

Visit [http://localhost:3000](http://localhost:3000) to see the website.

## 📁 Project Structure

```
website-unified/
├── app/                      # Next.js App Router
│   ├── (marketing)/         # Marketing pages
│   ├── (docs)/              # Documentation
│   ├── (playground)/        # Interactive features
│   ├── (community)/         # Community pages
│   └── api/                 # API routes
├── components/              # React components
│   ├── ui/                  # Base UI components
│   ├── sections/            # Page sections
│   ├── navigation/          # Navigation components
│   └── interactive/         # Interactive features
├── lib/                     # Utilities and helpers
├── content/                 # MDX content
├── public/                  # Static assets
└── styles/                  # Global styles
```

## 🎯 Features

- ⚡️ **Next.js 14** with App Router and React Server Components
- 🎨 **TailwindCSS** with custom design system
- 🌐 **Edge Runtime** for global deployment
- 📱 **Progressive Web App** (PWA) ready
- 🔒 **Security headers** configured
- 🚀 **Image optimization** with AVIF/WebP
- 📊 **Analytics** tracking built-in
- 🎭 **Dark mode** default with light mode option
- ♿️ **Accessibility** WCAG 2.1 AA compliant
- 🔍 **SEO optimized** with comprehensive metadata

## 🛠️ Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Animation**: Framer Motion
- **Content**: MDX with rehype/remark
- **Icons**: Lucide React
- **Analytics**: Vercel Analytics & Speed Insights
- **State**: Zustand
- **Notifications**: Sonner

## 📦 Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm type-check` - Run TypeScript type checking
- `pnpm format` - Format code with Prettier
- `pnpm analyze` - Analyze bundle size
- `pnpm lighthouse` - Run Lighthouse CI

## 🎨 Design System

The website uses a monochrome base with accent colors:

- **Black**: `#000000` - Primary text
- **White**: `#FFFFFF` - Background (light mode)
- **Gray Scale**: 50-950 - UI elements
- **Brand Blue**: 50-700 - CTAs and highlights

### Typography

- **Sans**: Inter (primary)
- **Mono**: JetBrains Mono (code)

## 🚀 Deployment

Optimized for edge deployment on:

- **Vercel** (recommended)
- **Cloudflare Workers**
- **AWS Lambda@Edge**

### Performance Targets

- ✅ First Contentful Paint (FCP): < 1s
- ✅ Largest Contentful Paint (LCP): < 2s
- ✅ Time to Interactive (TTI): < 2s
- ✅ Cumulative Layout Shift (CLS): < 0.1
- ✅ First Input Delay (FID): < 100ms
- ✅ Bundle size: < 150KB

## 📝 Content Management

Documentation and blog content is managed via MDX files in the `content/` directory:

```
content/
├── docs/           # Technical documentation
├── blog/           # Blog posts
└── tutorials/      # Step-by-step guides
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SITE_URL=https://universal-crypto-mcp.com
NEXT_PUBLIC_API_URL=https://api.universal-crypto-mcp.com
VERCEL_REGION=auto
```

### Custom Domain

Configure in `next.config.js` and Vercel dashboard.

## 🤝 Contributing

This website is part of the Universal Crypto MCP ecosystem. See the main project [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

## 📄 License

See [LICENSE](../LICENSE) file in the root directory.

## 🔗 Links

- **Main Repository**: [github.com/nirholas/universal-crypto-mcp](https://github.com/nirholas/universal-crypto-mcp)
- **Documentation**: [docs.universal-crypto-mcp.com](https://docs.universal-crypto-mcp.com)
- **Discord**: [discord.gg/universal-crypto-mcp](https://discord.gg/universal-crypto-mcp)

---

Built with ❤️ by the Universal Crypto MCP team
