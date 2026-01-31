# Terminal Demo Animations

## Demo 1: MCP Server (Blockchain Tools)
```
$ claude "Check my ETH balance on Base"
🔍 Querying Base blockchain...
✓ Balance: 2.4587 ETH ($4,234.56)
💡 Tip: You can swap on Uniswap for 0.01% fees
```

**Timing:**
- Input: 800ms
- Query message: +600ms
- Balance result: +400ms
- Tip: +800ms
**Total: ~2.6s**

---

## Demo 2: x402 Protocol (AI Payments)
```
$ curl https://api.weather.com/premium
402 Payment Required
Price: $0.001 USDC on Base
$ claude "Pay and get weather data"
✓ Payment sent: 0x7f3a...
✓ Data received: 72°F, Sunny
```

**Timing:**
- Curl command: 800ms
- 402 response: +400ms
- Price info: +600ms
- Claude command: +800ms
- Payment tx: +400ms
- Data received: +600ms
**Total: ~3.6s**

---

## Demo 3: x402-deploy (API Monetization)
```
$ x402-deploy deploy
🚀 Deploying to Railway...
💰 Creating payment wallet...
🔍 Registering on x402scan...
✓ Live at https://my-api.up.railway.app
✓ Earning $0.01 per request
```

**Timing:**
- Deploy command: 800ms
- Railway deployment: +600ms
- Wallet creation: +600ms
- x402scan registration: +600ms
- Live URL: +400ms
- Earnings message: +800ms
**Total: ~3.8s**

---

## Animation Cycle

```
Hero Message 1 (5s) → Demo 1 animation (2.6s) → Hold (2.4s)
                    ↓
Hero Message 2 (5s) → Demo 2 animation (3.6s) → Hold (1.4s)
                    ↓
Hero Message 3 (5s) → Demo 3 animation (3.8s) → Hold (1.2s)
                    ↓
                Loop back to Message 1
```

**Total cycle time: 15 seconds (3 × 5s)**

---

## Line Types & Colors

| Type | Color | Use Case |
|------|-------|----------|
| `input` | Green `$` + Gray text | User commands |
| `output` | Gray | System messages, progress |
| `success` | Green `✓` | Completed actions, results |
| `error` | Red | Error messages (not used in hero) |

---

## Icon Animations

Each message change triggers:
1. **Exit animation**: Scale 0, Rotate 180°, Opacity 0
2. **Enter animation**: Scale 1, Rotate 0°, Opacity 1
3. **Duration**: 500ms with spring easing

Icons used:
- **Sparkles** (Message 1): MCP Server tools
- **Zap** (Message 2): x402 Protocol payments
- **Globe** (Message 3): x402-deploy worldwide deployment

---

## Responsiveness

### Desktop (lg: 1024px+)
- 2-column grid: Text left, Terminal right
- Terminal: 400px min-height
- Full animation experience

### Tablet (md: 768px - 1024px)
- Stacked layout: Text above, Terminal below
- Terminal: 360px height
- Reduced animation delays (20% faster)

### Mobile (< 768px)
- Single column, full width
- Terminal: 320px height
- Faster animations (30% faster)
- Simplified terminal output (fewer lines)

---

## Accessibility

### Keyboard Navigation
- **Tab**: Focus progress dots
- **Enter/Space**: Select message
- **Arrow Left/Right**: Navigate messages
- **Escape**: Pause auto-rotation

### Screen Readers
- Each progress dot has `aria-label="Go to slide X"`
- Terminal has `role="log"` and `aria-live="polite"`
- Icon transitions announced as "Showing X feature"

### Motion Sensitivity
```css
@media (prefers-reduced-motion: reduce) {
  /* Instant transitions */
  .hero * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Performance Optimizations

1. **Animation throttling**: Max 60fps
2. **GPU acceleration**: `transform` and `opacity` only
3. **Intersection Observer**: Pause when off-screen
4. **Lazy animation**: Terminal lines render on-demand
5. **Memory management**: Clear timers on unmount

---

## Future Enhancements (Optional)

- [ ] Voice-over narration for terminal commands
- [ ] Copy-to-clipboard for terminal commands
- [ ] Playback speed controls
- [ ] Fullscreen terminal mode
- [ ] Interactive terminal (users can type)
- [ ] Code syntax highlighting in terminal
- [ ] Terminal recording/playback
- [ ] A/B test different demo scripts

