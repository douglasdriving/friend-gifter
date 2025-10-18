import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create test users
  const password = await bcrypt.hash('Password123', 12);

  const emma = await prisma.user.create({
    data: {
      username: 'emma',
      email: 'emma@example.com',
      passwordHash: password,
      name: 'Emma Rodriguez',
    },
  });

  const marcus = await prisma.user.create({
    data: {
      username: 'marcus',
      email: 'marcus@example.com',
      passwordHash: password,
      name: 'Marcus Chen',
    },
  });

  const aisha = await prisma.user.create({
    data: {
      username: 'aisha',
      email: 'aisha@example.com',
      passwordHash: password,
      name: 'Aisha Patel',
    },
  });

  console.log('✅ Created users:', { emma, marcus, aisha });

  // Create friendships
  await prisma.friendship.create({
    data: {
      requesterId: emma.id,
      addresseeId: marcus.id,
      status: 'ACCEPTED',
      acceptedAt: new Date(),
    },
  });

  await prisma.friendship.create({
    data: {
      requesterId: emma.id,
      addresseeId: aisha.id,
      status: 'ACCEPTED',
      acceptedAt: new Date(),
    },
  });

  await prisma.friendship.create({
    data: {
      requesterId: marcus.id,
      addresseeId: aisha.id,
      status: 'ACCEPTED',
      acceptedAt: new Date(),
    },
  });

  console.log('✅ Created friendships');

  // Create items
  await prisma.item.create({
    data: {
      userId: emma.id,
      title: 'Bread Maker',
      description:
        'Used only twice! Works perfectly. I got an espresso machine and don\'t have counter space. Has 12 settings, comes with manual.',
      category: 'Kitchen',
      condition: 'LIKE_NEW',
      isGifted: false,
    },
  });

  await prisma.item.create({
    data: {
      userId: aisha.id,
      title: 'Programming Books (5)',
      description:
        'Clean Code, Design Patterns, Refactoring, and more. Great condition, well-maintained.',
      category: 'Books',
      condition: 'GOOD',
      isGifted: false,
    },
  });

  console.log('✅ Created items');

  // Create wishes
  await prisma.wish.create({
    data: {
      userId: marcus.id,
      title: 'Camping Tent',
      description: 'For weekend trip with friends. Any size works, prefer 4+ person capacity.',
      category: 'Outdoor',
      priority: 'HIGH',
      isFulfilled: false,
    },
  });

  await prisma.wish.create({
    data: {
      userId: aisha.id,
      title: 'Standing Desk',
      description: 'Adjustable height preferred. Working from home more often now.',
      category: 'Furniture',
      priority: 'MEDIUM',
      isFulfilled: false,
    },
  });

  console.log('✅ Created wishes');

  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
