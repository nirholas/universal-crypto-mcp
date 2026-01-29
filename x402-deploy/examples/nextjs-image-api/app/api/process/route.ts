/**
 * Image Processing API with x402 Credit System
 * 
 * Credit-based pricing:
 * - 1 credit = 1 image operation
 * - Buy credit packages with discounts
 * - Credits never expire
 */

import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

// Credit packages
const CREDIT_PACKAGES = {
  small: { credits: 100, price: '10', discount: 0 },
  medium: { credits: 1000, price: '80', discount: 20 },
  large: { credits: 10000, price: '500', discount: 50 },
};

// Mock credit verification
function verifyCredits(userId: string): { balance: number; tier: string } {
  // In production: check database or blockchain
  return { balance: 50, tier: 'small' };
}

// Mock credit deduction
function deductCredit(userId: string, amount: number = 1): boolean {
  // In production: update database or blockchain
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Get user ID from header or payment
    const userId = request.headers.get('x-user-id') || 'anonymous';
    const operation = request.headers.get('x-operation') || 'resize';
    
    // Verify credits
    const { balance } = verifyCredits(userId);
    if (balance < 1) {
      return NextResponse.json(
        {
          error: 'Insufficient credits',
          balance: 0,
          message: 'Purchase credits at /api/credits/buy',
        },
        { status: 402 } // Payment Required
      );
    }

    // Get image from request
    const formData = await request.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Process image based on operation
    let processed: Buffer;
    
    switch (operation) {
      case 'resize':
        const width = parseInt(formData.get('width') as string || '800');
        const height = parseInt(formData.get('height') as string || '600');
        processed = await sharp(buffer)
          .resize(width, height, { fit: 'cover' })
          .toBuffer();
        break;
        
      case 'thumbnail':
        processed = await sharp(buffer)
          .resize(150, 150, { fit: 'cover' })
          .toBuffer();
        break;
        
      case 'watermark':
        const text = formData.get('text') as string || 'x402';
        processed = await sharp(buffer)
          .composite([{
            input: Buffer.from(`
              <svg width="200" height="50">
                <text x="10" y="30" font-size="24" fill="white" opacity="0.5">${text}</text>
              </svg>
            `),
            gravity: 'southeast',
          }])
          .toBuffer();
        break;
        
      case 'blur':
        const sigma = parseFloat(formData.get('sigma') as string || '5');
        processed = await sharp(buffer)
          .blur(sigma)
          .toBuffer();
        break;
        
      case 'grayscale':
        processed = await sharp(buffer)
          .grayscale()
          .toBuffer();
        break;
        
      case 'rotate':
        const angle = parseInt(formData.get('angle') as string || '90');
        processed = await sharp(buffer)
          .rotate(angle)
          .toBuffer();
        break;
        
      default:
        return NextResponse.json(
          { error: 'Unknown operation' },
          { status: 400 }
        );
    }

    // Deduct credit
    deductCredit(userId, 1);

    // Return processed image
    return new NextResponse(processed, {
      status: 200,
      headers: {
        'Content-Type': 'image/jpeg',
        'X-Credits-Used': '1',
        'X-Credits-Remaining': (balance - 1).toString(),
      },
    });

  } catch (error: any) {
    console.error('Image processing error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    name: 'Image Processing API',
    version: '1.0.0',
    operations: [
      { name: 'resize', cost: '1 credit', params: ['width', 'height'] },
      { name: 'thumbnail', cost: '1 credit', params: [] },
      { name: 'watermark', cost: '1 credit', params: ['text'] },
      { name: 'blur', cost: '1 credit', params: ['sigma'] },
      { name: 'grayscale', cost: '1 credit', params: [] },
      { name: 'rotate', cost: '1 credit', params: ['angle'] },
    ],
    pricing: CREDIT_PACKAGES,
  });
}
