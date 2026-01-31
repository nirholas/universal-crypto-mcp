import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // Seed crypto prices
  const cryptos = ['BTC', 'ETH', 'SOL', 'MATIC', 'AVAX'];
  for (const symbol of cryptos) {
    await prisma.cryptoPrice.upsert({
      where: { symbol },
      update: {},
      create: {
        symbol,
        price: Math.random() * 50000,
        change24h: (Math.random() - 0.5) * 10,
        volume24h: Math.random() * 1000000000,
        marketCap: Math.floor(Math.random() * 1000000000000),
      },
    });
  }

  console.log('✅ Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
