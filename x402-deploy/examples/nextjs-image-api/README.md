# Image Processing API with x402 Credits

Next.js image processing API with credit-based cryptocurrency payments.

## 💳 Credit System

Buy credits once, use forever. No expiration!

| Package | Credits | Price | Per Credit | Discount |
|---------|---------|-------|------------|----------|
| **Small** | 100 | $10 USDC | $0.10 | 0% |
| **Medium** | 1,000 | $80 USDC | $0.08 | 20% |
| **Large** | 10,000 | $500 USDC | $0.05 | 50% |

All payments in **USDC on Base network** (eip155:8453).

## 🔧 Operations (1 Credit Each)

- ✂️ **Resize** - Custom dimensions
- 🖼️ **Thumbnail** - 150x150 preview
- 🏷️ **Watermark** - Text overlay
- 🌫️ **Blur** - Gaussian blur effect
- ⚫ **Grayscale** - Remove colors
- 🔄 **Rotate** - Any angle

## 🚀 Quick Start

### 1. Install

```bash
npm install
```

### 2. Configure

```bash
export X402_WALLET=0xYourWalletAddress
```

### 3. Run

```bash
npm run dev
```

Visit http://localhost:3000

### 4. Deploy

```bash
npx x402-deploy deploy vercel
```

## 📡 API Usage

### 1. Buy Credits

```bash
curl -X POST "http://localhost:3000/api/credits" \
  -H "Content-Type: application/json" \
  -d '{
    "package": "medium",
    "payment_hash": "0xtransactionhash"
  }'
```

Response:
```json
{
  "success": true,
  "user_id": "user_0x123456...",
  "credits_purchased": 1000,
  "amount_paid": "$80 USDC",
  "discount": "20%",
  "instructions": "Include 'X-User-Id: user_xxx' header in requests"
}
```

### 2. Process Images

#### Resize Image

```bash
curl -X POST "http://localhost:3000/api/process" \
  -H "X-User-Id: user_xxx" \
  -H "X-Operation: resize" \
  -F "image=@photo.jpg" \
  -F "width=800" \
  -F "height=600" \
  --output resized.jpg
```

#### Create Thumbnail

```bash
curl -X POST "http://localhost:3000/api/process" \
  -H "X-User-Id: user_xxx" \
  -H "X-Operation: thumbnail" \
  -F "image=@photo.jpg" \
  --output thumb.jpg
```

#### Add Watermark

```bash
curl -X POST "http://localhost:3000/api/process" \
  -H "X-User-Id: user_xxx" \
  -H "X-Operation: watermark" \
  -F "image=@photo.jpg" \
  -F "text=© 2026 MyBrand" \
  --output watermarked.jpg
```

#### Apply Blur

```bash
curl -X POST "http://localhost:3000/api/process" \
  -H "X-User-Id: user_xxx" \
  -H "X-Operation: blur" \
  -F "image=@photo.jpg" \
  -F "sigma=10" \
  --output blurred.jpg
```

#### Convert to Grayscale

```bash
curl -X POST "http://localhost:3000/api/process" \
  -H "X-User-Id: user_xxx" \
  -H "X-Operation: grayscale" \
  -F "image=@photo.jpg" \
  --output grayscale.jpg
```

#### Rotate Image

```bash
curl -X POST "http://localhost:3000/api/process" \
  -H "X-User-Id: user_xxx" \
  -H "X-Operation: rotate" \
  -F "image=@photo.jpg" \
  -F "angle=90" \
  --output rotated.jpg
```

### 3. Check Credit Balance

```bash
curl "http://localhost:3000/api/credits" \
  -H "X-User-Id: user_xxx"
```

Response:
```json
{
  "user_id": "user_xxx",
  "balance": 847,
  "packages": { ... }
}
```

## 💰 Purchasing Credits

### 1. View Packages

```bash
curl "http://localhost:3000/api/credits"
```

### 2. Send USDC Payment

Send USDC on Base network to wallet address.

### 3. Submit Payment

```bash
curl -X POST "http://localhost:3000/api/credits" \
  -H "Content-Type: application/json" \
  -d '{
    "package": "large",
    "payment_hash": "0xyourtxhash"
  }'
```

### 4. Save Your User ID

Keep the `user_id` to access your credits.

## 🧪 Testing

### Test Locally

```bash
# No credits required for GET endpoints
curl "http://localhost:3000/api/process"

# Mock credit balance for testing
X402_TEST_MODE=true npm run dev
```

### Bulk Processing

```bash
for image in *.jpg; do
  curl -X POST "http://localhost:3000/api/process" \
    -H "X-User-Id: user_xxx" \
    -H "X-Operation: thumbnail" \
    -F "image=@$image" \
    --output "thumb_$image"
done
```

## 📊 Analytics

```bash
npx x402-deploy dashboard
```

View:
- Total credits sold
- Revenue by package
- Most popular operations
- Active users

## 🔧 Advanced Configuration

### Custom Operations

Add new operations in `app/api/process/route.ts`:

```typescript
case 'sepia':
  processed = await sharp(buffer)
    .tint({ r: 112, g: 66, b: 20 })
    .toBuffer();
  break;
```

### Dynamic Pricing

Charge more credits for complex operations:

```typescript
const creditCosts = {
  resize: 1,
  thumbnail: 1,
  watermark: 2,
  blur: 1,
  ai_upscale: 10, // Premium operation
};
```

### Credit Expiration

Add expiration logic:

```typescript
const expiresAt = new Date(Date.now() + 365 * 86400000); // 1 year
```

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Sharp Image Processing](https://sharp.pixelplumbing.com)
- [x402 Protocol](https://x402.dev)
- [Parent Project](../../README.md)
