import { NextResponse } from 'next/server';

const PACKAGES = [
  {
    id: 'starter',
    name: 'Starter',
    credits: 100,
    price: 10,
    currency: 'USD',
  },
  {
    id: 'pro',
    name: 'Pro',
    credits: 500,
    price: 45,
    currency: 'USD',
    bonus: 50,
    popular: true,
  },
  {
    id: 'business',
    name: 'Business',
    credits: 1000,
    price: 80,
    currency: 'USD',
    bonus: 150,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    credits: 5000,
    price: 350,
    currency: 'USD',
    bonus: 1000,
  },
];

export async function GET() {
  return NextResponse.json(PACKAGES);
}
