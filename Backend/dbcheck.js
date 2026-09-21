import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
(async () => {
  try {
    const u = await p.user.findUnique({
      where: { email: 'test_nobody@example.com' },
    });
    console.log('USER FIND RESULT:', JSON.stringify(u));
    const pr = await p.passwordReset.findFirst({ orderBy: { createdAt: 'desc' } });
    console.log('LATEST PASSWORD RESET:', JSON.stringify(pr));
    const count = await p.user.count();
    console.log('USER COUNT:', count);
  } catch (e) {
    console.log('DB ERROR:', e.message);
    process.exit(1);
  } finally {
    await p.$disconnect();
  }
})();