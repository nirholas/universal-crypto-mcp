# Component Library Quick Reference

## 🚀 Quick Start

```tsx
// Import components
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Terminal } from '@/components/ui/terminal'
import { CodeBlock } from '@/components/ui/code-block'
import { Navbar } from '@/components/navigation/navbar'

// Or use barrel import
import { Button, Card } from '@/components/ui'
import { Navbar } from '@/components/navigation'
```

## 📘 Component Cheat Sheet

### Button
```tsx
<Button variant="primary" size="md">Click me</Button>
<Button variant="secondary" size="lg">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
<Button asChild><Link href="/">As Link</Link></Button>
```

### Card
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content here</CardContent>
</Card>
```

### Terminal
```tsx
<Terminal
  lines={[
    { type: 'input', content: 'npm install', delay: 100 },
    { type: 'output', content: 'Installing...', delay: 500 },
    { type: 'success', content: '✓ Done!', delay: 800 },
    { type: 'error', content: '✗ Error', delay: 400 }
  ]}
/>
```

### CodeBlock
```tsx
<CodeBlock
  code="const hello = 'world'"
  language="typescript"
  filename="example.ts"
/>
```

### Navbar
```tsx
<Navbar />
```

## 🎨 Styling Patterns

### Override with className
```tsx
<Button className="w-full mt-4">Full Width</Button>
<Card className="border-blue-500">Custom Border</Card>
```

### Using cn utility
```tsx
import { cn } from '@/lib/utils/cn'

<div className={cn('base-class', condition && 'conditional-class')}>
```

## 🎯 Common Patterns

### CTA Section
```tsx
<Card>
  <CardHeader>
    <CardTitle>Get Started</CardTitle>
    <CardDescription>Start building today</CardDescription>
  </CardHeader>
  <CardContent>
    <Button variant="primary" size="lg" className="w-full">
      Sign Up Free
    </Button>
  </CardContent>
</Card>
```

### Feature Grid
```tsx
<div className="grid md:grid-cols-3 gap-6">
  <Card>
    <CardHeader>
      <CardTitle>Feature 1</CardTitle>
      <CardDescription>Description</CardDescription>
    </CardHeader>
  </Card>
  {/* More cards... */}
</div>
```

### Interactive Demo
```tsx
<div className="space-y-8">
  <Terminal lines={demoLines} />
  <CodeBlock code={demoCode} language="typescript" />
  <div className="flex gap-4">
    <Button>Try it</Button>
    <Button variant="secondary">Learn More</Button>
  </div>
</div>
```

## ⚡ Performance Tips

1. **Import only what you need:**
   ```tsx
   import { Button } from '@/components/ui/button' // ✅ Good
   import * as UI from '@/components/ui' // ❌ Avoid
   ```

2. **Use asChild for links:**
   ```tsx
   <Button asChild><Link href="/docs">Docs</Link></Button>
   ```

3. **Memoize heavy components:**
   ```tsx
   const MemoizedTerminal = React.memo(Terminal)
   ```

## ♿ Accessibility Checklist

- ✅ Use semantic HTML elements
- ✅ Add aria-label to icon-only buttons
- ✅ Ensure keyboard navigation works
- ✅ Test with screen readers
- ✅ Maintain color contrast ratios

## 🐛 Common Issues

### Issue: Button not working as Link
**Solution:** Use `asChild` prop
```tsx
<Button asChild><Link href="/">Home</Link></Button>
```

### Issue: Card not showing hover effect
**Solution:** Ensure parent has pointer-events
```tsx
<div className="pointer-events-auto">
  <Card>...</Card>
</div>
```

### Issue: Terminal animation not running
**Solution:** Provide delay values
```tsx
lines={[{ type: 'input', content: 'test', delay: 500 }]}
```

## 📱 Responsive Design

### Mobile-First Approach
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <Card>Mobile: 1 col, Tablet: 2 cols, Desktop: 3 cols</Card>
</div>
```

### Hide/Show on Different Screens
```tsx
<div className="hidden lg:block">Desktop only</div>
<div className="lg:hidden">Mobile/Tablet only</div>
```

## 🎨 Customization

### Custom Button Variant
Edit `components/ui/button.tsx`:
```tsx
const buttonVariants = cva('...', {
  variants: {
    variant: {
      // ... existing variants
      custom: 'bg-blue-500 text-white hover:bg-blue-600',
    },
  },
})
```

### Custom Colors
Edit `tailwind.config.ts`:
```tsx
colors: {
  brand: {
    primary: '#your-color',
  },
}
```

## 📊 Component Props Reference

| Component | Required Props | Optional Props |
|-----------|---------------|----------------|
| Button | children | variant, size, asChild, className |
| Card | children | className |
| Terminal | lines | className |
| CodeBlock | code, language | filename, className |
| Navbar | - | - |

## 🔗 Useful Links

- Demo: `/components-demo`
- Full Docs: `components/README.md`
- Summary: `AGENT-2-SUMMARY.md`

---

**Quick Help:** For detailed documentation, see `components/README.md`
