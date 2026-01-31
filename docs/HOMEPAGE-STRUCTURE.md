# Homepage Visual Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                      NAVIGATION BAR (sticky)                     │
│  Logo    [MCP Server] [x402 Protocol] [Deploy] [Docs] [GitHub] │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│                      🌟 HERO SECTION (vh)                        │
│                                                                  │
│  ┌────────────────────────┐    ┌────────────────────────┐      │
│  │  [Icon Animation]      │    │  ╔══════════════════╗  │      │
│  │                        │    │  ║  Terminal Demo   ║  │      │
│  │  "Blockchain tools     │    │  ║  ● ● ●          ║  │      │
│  │   for AI agents"       │    │  ║──────────────────║  │      │
│  │                        │    │  ║ $ claude "..."   ║  │      │
│  │  Subtitle text here... │    │  ║ 🔍 Querying...   ║  │      │
│  │                        │    │  ║ ✓ Balance: ...   ║  │      │
│  │  [Get Started →]       │    │  ║                  ║  │      │
│  │  [Try Playground]      │    │  ╚══════════════════╝  │      │
│  │                        │    │                        │      │
│  │  ●━━○○ (Progress)      │    │                        │      │
│  └────────────────────────┘    └────────────────────────┘      │
│                                                                  │
│  Background: Grid pattern + animated gradient blurs             │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      📊 STATS SECTION                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  380+      20+      <5m      100%       0       <100ms  │   │
│  │  Tools    Chains   Deploy    Revenue   Fees    Latency  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                      Gray background with border                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    🚀 PRODUCTS SECTION                           │
│                                                                  │
│         "Three products. One ecosystem."                         │
│    Everything you need to build, deploy, and monetize...        │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                      │
│  │  [🖥️]    │  │  [⚡]     │  │  [🚀]     │                      │
│  │          │  │          │  │          │                      │
│  │ MCP      │  │ x402     │  │ x402-    │                      │
│  │ Server   │  │ Protocol │  │ deploy   │                      │
│  │          │  │          │  │          │                      │
│  │ Tagline  │  │ Tagline  │  │ Tagline  │                      │
│  │          │  │          │  │          │                      │
│  │ Long     │  │ Long     │  │ Long     │                      │
│  │ descrip  │  │ descrip  │  │ descrip  │
│  │ -tion    │  │ -tion    │  │ -tion    │                      │
│  │          │  │          │  │          │                      │
│  │ ✓ Feature│  │ ✓ Feature│  │ ✓ Feature│                      │
│  │ ✓ Feature│  │ ✓ Feature│  │ ✓ Feature│                      │
│  │ ✓ Feature│  │ ✓ Feature│  │ ✓ Feature│                      │
│  │ ✓ Feature│  │ ✓ Feature│  │ ✓ Feature│                      │
│  │          │  │          │  │          │                      │
│  │ [Learn→] │  │ [Learn→] │  │ [Learn→] │                      │
│  └──────────┘  └──────────┘  └──────────┘                      │
│                                                                  │
│              Cards have hover scale animation                    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                  ⭐ FEATURES SECTION (Agent 4)                   │
│                                                                  │
│                    [PLACEHOLDER]                                 │
│              Gray background, awaiting content                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                  💼 USE CASES SECTION (Agent 4)                  │
│                                                                  │
│                    [PLACEHOLDER]                                 │
│              White background, awaiting content                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                  📈 COMPARISON SECTION (Agent 5)                 │
│                                                                  │
│                    [PLACEHOLDER]                                 │
│              Gray background, awaiting content                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                 💬 TESTIMONIALS SECTION (Agent 5)                │
│                                                                  │
│                    [PLACEHOLDER]                                 │
│              White background, awaiting content                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                  🎯 CALL TO ACTION (Agent 5)                     │
│                                                                  │
│                    [PLACEHOLDER]                                 │
│              Black background, white text                        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                  📧 NEWSLETTER SECTION (Agent 5)                 │
│                                                                  │
│                    [PLACEHOLDER]                                 │
│              White background, awaiting content                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                           FOOTER                                 │
│  Product Links  |  Resources  |  Company  |  Social Links       │
└─────────────────────────────────────────────────────────────────┘
```

---

## Spacing & Rhythm

### Section Padding
- Hero: `min-h-screen` (100vh)
- Stats: `py-24` (96px vertical)
- Products: `py-32` (128px vertical)
- Other sections: `py-32` (128px vertical)

### Container Widths
- Max width: `max-w-7xl` (1280px)
- Padding: `px-6` (24px horizontal)

### Color Alternation
1. **Hero**: White bg + grid pattern
2. **Stats**: Gray-50 bg + borders
3. **Products**: White bg
4. **Features**: Gray-50 bg
5. **Use Cases**: White bg
6. **Comparison**: Gray-50 bg
7. **Testimonials**: White bg
8. **CTA**: Black bg
9. **Newsletter**: White bg

This creates a clear visual rhythm down the page.

---

## Responsive Breakpoints

### Mobile (<640px)
```
┌──────────┐
│  Hero    │
│  Stacked │
│          │
│  Text    │
│          │
│  Terminal│
└──────────┘
```
- Single column
- Reduced padding
- Smaller text sizes
- 2-column stats grid
- 1-column product cards

### Tablet (640px - 1024px)
```
┌─────────────────┐
│  Hero           │
│  Text    Term   │
│  50%     50%    │
└─────────────────┘
```
- 2-column layouts
- 3-column stats
- Moderate spacing

### Desktop (>1024px)
```
┌──────────────────────┐
│  Hero                │
│  Text    Terminal    │
│  40%     60%         │
└──────────────────────┘
```
- Full layout as designed
- 6-column stats
- 3-column products
- Max spacing

---

## Animation Sequence

### On Page Load
1. **0ms**: Hero icon appears (scale + rotate)
2. **100ms**: Title fades in
3. **200ms**: Subtitle fades in
4. **300ms**: CTA buttons appear
5. **400ms**: Terminal demo starts
6. **800ms**: Progress dots appear

### On Scroll
1. **Stats enter viewport**: Numbers count up with stagger
2. **Products enter viewport**: Cards fade up sequentially
3. **Each section**: Triggers entrance animations

### Interactive
- **Click progress dot**: Switch message instantly
- **Hover card**: Scale up 2%
- **Hover button**: Background darkens
- **Message rotation**: Automatic every 5s

---

## Z-Index Layers

```
Layer 50: Navigation (sticky)
Layer 10: Hero gradient blurs
Layer 1:  Hero grid pattern
Layer 0:  Base content
Layer -1: Background colors
```

---

## Typography Hierarchy

### Hero
- Icon: 32px (w-8 h-8)
- Title: `text-display-lg` (4rem / 64px)
- Subtitle: `text-xl` (1.25rem / 20px)
- Buttons: `text-lg` (1.125rem / 18px)

### Stats
- Numbers: `text-5xl` (3rem / 48px)
- Labels: `text-sm` (0.875rem / 14px)

### Products
- Section title: `text-display-md` (3rem / 48px)
- Section subtitle: `text-xl` (1.25rem / 20px)
- Card title: `text-2xl` (1.5rem / 24px)
- Card tagline: `text-base` (1rem / 16px)
- Features: `text-sm` (0.875rem / 14px)

---

## Interaction States

### Buttons
```
Default:  bg-black text-white
Hover:    bg-gray-800 (darker)
Focus:    ring-2 ring-black ring-offset-2
Active:   scale-95 (brief press effect)
Disabled: opacity-50 pointer-events-none
```

### Cards
```
Default:  border-gray-200 shadow-sm
Hover:    shadow-md scale-102
Focus:    ring-2 ring-brand-500
Active:   scale-100 (cancels hover)
```

### Progress Dots
```
Inactive: w-2 bg-gray-300
Active:   w-8 bg-black (smooth expand)
Hover:    bg-gray-400 (inactive only)
Focus:    ring-2 ring-black
```

---

## Performance Budget

### Initial Load
- Hero HTML: < 10KB
- Hero JS: < 50KB
- Hero CSS: < 20KB
- Hero Images: 0KB (SVG icons only)
- **Total**: < 80KB

### Runtime
- Hero animations: 60fps consistent
- Terminal updates: < 5ms per line
- Message rotation: < 2ms overhead
- Memory usage: < 5MB

### Metrics
- LCP: < 2.0s (hero visible)
- FID: < 50ms (button responsive)
- CLS: 0 (no layout shifts)
- TTI: < 3.0s (fully interactive)

---

## Accessibility Checklist

- ✅ Semantic HTML5 elements
- ✅ Proper heading hierarchy (h1 → h2 → h3)
- ✅ ARIA labels on interactive elements
- ✅ Keyboard navigation support
- ✅ Focus visible indicators
- ✅ Color contrast ratio > 4.5:1
- ✅ Alt text on images (if any added)
- ✅ Skip to content link (in nav)
- ✅ Reduced motion support
- ✅ Screen reader announcements

---

## Testing Checklist

### Visual
- ✅ Hero rotates correctly (5s interval)
- ✅ Terminal animations play smoothly
- ✅ Stats count up on scroll
- ✅ Product cards hover effect works
- ✅ Responsive at all breakpoints
- ✅ Dark mode compatible (if enabled)

### Functional
- ✅ All links navigate correctly
- ✅ Progress dots switch messages
- ✅ Buttons have proper focus states
- ✅ Terminal resets on message change
- ✅ Animations pause when off-screen

### Performance
- ✅ No console errors
- ✅ No layout shifts (CLS = 0)
- ✅ Smooth 60fps animations
- ✅ Quick initial render (< 2s LCP)
- ✅ Small bundle size (< 150KB)

### Accessibility
- ✅ Keyboard navigation works
- ✅ Screen reader announces changes
- ✅ Focus indicators visible
- ✅ Color contrast sufficient
- ✅ Reduced motion respected

