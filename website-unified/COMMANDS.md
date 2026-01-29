# 🚀 Quick Command Reference

## Essential Commands

### Development
```bash
cd /workspaces/universal-crypto-mcp/website-unified

# First time setup (REQUIRED)
pnpm install

# Start dev server (with Turbopack)
pnpm dev
# → http://localhost:3000

# Build for production
pnpm build

# Start production server
pnpm start
```

### Code Quality
```bash
# Run linter
pnpm lint

# Fix linting issues
pnpm lint --fix

# Type checking
pnpm type-check

# Format code with Prettier
pnpm format
```

### Performance & Analysis
```bash
# Analyze bundle size
pnpm analyze
# Creates static/report.html

# Run Lighthouse CI
pnpm lighthouse
```

## Project Structure

```
website-unified/
├── 📄 Configuration (10 files)
│   ├── next.config.js
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── ...
│
├── 📱 App (Next.js 14)
│   ├── layout.tsx (Root)
│   ├── page.tsx (Home)
│   ├── globals.css
│   └── (marketing)/
│       ├── mcp-server/
│       ├── x402-protocol/
│       └── x402-deploy/
│
├── 🧩 Components
│   ├── ui/
│   ├── sections/
│   ├── navigation/
│   └── interactive/
│
├── 🛠️ Lib
│   └── utils/
│       ├── cn.ts
│       └── analytics.ts
│
└── 📝 Content (MDX)
    ├── docs/
    ├── blog/
    └── tutorials/
```

## Key URLs (After `pnpm dev`)

- Homepage: http://localhost:3000
- MCP Server: http://localhost:3000/mcp-server
- x402 Protocol: http://localhost:3000/x402-protocol
- x402-deploy: http://localhost:3000/x402-deploy

## Common Tasks

### Add a New Page
```bash
# Create in appropriate route group
touch app/(marketing)/new-page/page.tsx
```

### Add a Component
```bash
# UI component
touch components/ui/new-component.tsx

# Section component
touch components/sections/new-section.tsx
```

### Add Content
```bash
# Documentation
touch content/docs/new-doc.mdx

# Blog post
touch content/blog/new-post.mdx
```

## Utilities

### className Merger
```typescript
import { cn } from '@/lib/utils/cn'

className={cn('base', condition && 'conditional')}
```

### Analytics
```typescript
import { trackEvent } from '@/lib/utils/analytics'

trackEvent({ name: 'event_name', properties: {...} })
```

## Environment Variables

Create `.env.local`:
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Troubleshooting

### Port in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
pnpm dev -- -p 3001
```

### Cache issues
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
pnpm install
```

### Type errors
```bash
# Regenerate types
pnpm type-check
```

---

📖 **Full docs**: See [README.md](README.md)  
📊 **Status**: See [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md)  
🎯 **Quick ref**: See [AGENT_1_REFERENCE.md](AGENT_1_REFERENCE.md)
