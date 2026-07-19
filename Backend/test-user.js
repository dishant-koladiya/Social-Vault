const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  const user = await prisma.user.create({
    data: {
      id: 'test_user_123',
      email: 'test@example.com',
      name: 'Test User',
      image: 'https://example.com/img.png'
    }
  });
  console.log('User created:', user);
  const all = await prisma.user.findMany();
  console.log('All users:', all);
}

test().finally(() => prisma.$disconnect());