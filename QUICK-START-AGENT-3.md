# 🚀 Quick Start - Agent 3 Homepage

## View Your New Homepage

```bash
cd /workspaces/universal-crypto-mcp/website-unified
pnpm install
pnpm dev
```

Visit: **http://localhost:3000**

---

## What You'll See

### 1. Hero Section (Top)
- **3 rotating messages** changing every 5 seconds:
  - "Blockchain tools for AI agents" 
  - "AI agents can now pay for services"
  - "Monetize any API in 5 minutes"
- **Animated terminal** showing live demos
- **Progress dots** at bottom (click to switch manually)
- **2 CTA buttons**: "Get Started" and "Try Playground"

### 2. Stats Section
- **6 impressive numbers**: 380+ tools, 20+ chains, <5m deploy, etc.
- **Animates when you scroll** to it

### 3. Products Section  
- **3 product cards**: MCP Server, x402 Protocol, x402-deploy
- **Hover over cards** to see scale effect
- **Click buttons** to navigate to product pages

### 4. Placeholder Sections
- Features, Use Cases, Comparison, Testimonials, CTA, Newsletter
- These show "Coming soon in Agent 4/5"

---

## Key Features to Test

### ✅ Hero Rotation
1. Wait 5 seconds - message should auto-rotate
2. Click any progress dot - switches immediately
3. Watch terminal animation - different for each message

### ✅ Stats Animation
1. Scroll down to stats section
2. Numbers should fade in with stagger effect
3. Only happens once (won't repeat on scroll back up)

### ✅ Product Cards
1. Hover over any card - slight scale up
2. Click "Learn More" buttons - navigates to product pages
3. Check mobile view - cards stack vertically

### ✅ Responsive Design
1. Resize browser window
2. Open DevTools (F12) → Toggle Device Toolbar
3. Test: Mobile (375px), Tablet (768px), Desktop (1280px)

### ✅ Keyboard Navigation
1. Press Tab key repeatedly
2. Should highlight: progress dots → CTA buttons → product buttons
3. Press Enter on focused element to activate

---

## File Structure

```
website-unified/
├── app/
│   └── page.tsx                 # ⭐ Main homepage
│
├── components/
│   ├── sections/
│   │   ├── hero.tsx            # 🎯 Hero with rotating messages
│   │   ├── stats.tsx           # 📊 Animated statistics
│   │   ├── products.tsx        # 📦 Product cards
│   │   └── [6 more placeholders]
│   │
│   └── ui/
│       ├── button.tsx          # 🔘 Reusable button
│       ├── card.tsx            # 🃏 Card components
│       └── terminal.tsx        # 💻 Animated terminal
│
└── lib/
    └── utils.ts                # 🛠️ Utility functions
```

---

## Quick Customization

### Change Hero Message
**File**: `components/sections/hero.tsx`

```typescript
const messages = [
  {
    title: 'Your new title\non two lines',
    subtitle: 'Your new subtitle here',
    icon: Sparkles, // or any Lucide icon
  },
]
```

### Change Stats
**File**: `components/sections/stats.tsx`

```typescript
const stats = [
  { value: '999', label: 'Your Metric', suffix: '+' },
]
```

### Change Products
**File**: `components/sections/products.tsx`

```typescript
const products = [
  {
    name: 'Your Product',
    tagline: 'Short description',
    // ... more config
  },
]
```

---

## Troubleshooting

### Issue: Page is blank
**Solution**: 
```bash
pnpm install
# Wait for installation to complete
pnpm dev
```

### Issue: TypeScript errors
**Solution**: Normal if dependencies not installed. Run `pnpm install`.

### Issue: Hero doesn't rotate
**Solution**: Check browser console for errors. Clear browser cache.

### Issue: Animations stuttering
**Solution**: Close other browser tabs. Check CPU usage.

### Issue: Styles look wrong
**Solution**: 
```bash
pnpm clean
pnpm dev
```

---

## Documentation Files

All in project root:

1. **AGENT-3-SUMMARY.md** - What was built
2. **AGENT-3-IMPLEMENTATION.md** - How to customize
3. **AGENT-3-CHECKLIST.md** - Completion checklist
4. **TERMINAL-DEMOS-SPEC.md** - Animation details
5. **HOMEPAGE-STRUCTURE.md** - Visual structure

---

## Next Steps

### To Deploy
```bash
pnpm build
pnpm start
# or deploy to Vercel/Netlify
```

### To Continue Building
1. Implement Agent 4 tasks (Features + Use Cases sections)
2. Implement Agent 5 tasks (Comparison + Testimonials + CTA + Newsletter)
3. Add content to placeholder sections
4. Customize colors/fonts/spacing

### To Test Production Build
```bash
pnpm build
pnpm start
# Visit http://localhost:3000
```

---

## 📱 Mobile Testing

```bash
# Use ngrok for mobile testing
npx ngrok http 3000
# Visit the ngrok URL on your phone
```

---

## 🎨 Color Scheme

- **Primary**: Black (#000000)
- **Secondary**: Gray scale (50-950)
- **Accent**: Brand blue (#0EA5E9)
- **Success**: Green (#10B981)
- **Backgrounds**: White + Gray-50 alternating

---

## 🔗 Key Links

Once running:
- Homepage: http://localhost:3000
- MCP Server: http://localhost:3000/mcp-server
- x402 Protocol: http://localhost:3000/x402-protocol
- x402-deploy: http://localhost:3000/x402-deploy
- Docs: http://localhost:3000/docs
- Playground: http://localhost:3000/playground

---

## ⚡ Performance

Expected metrics:
- **Load time**: < 2 seconds
- **FPS**: Smooth 60fps animations
- **Bundle**: ~150KB (acceptable)
- **No layout shifts**: CLS = 0

---

## 🎉 You're All Set!

The homepage is ready to view and customize. Enjoy exploring the rotating hero, animated stats, and product showcases!

**Questions?** Check the implementation docs or inspect the component code.

---

**Built with ❤️ by Agent 3**
