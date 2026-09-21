import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const prisma = new PrismaClient();

async function main() {
  const adminEmails = process.env.ADMIN_EMAILS
    ? process.env.ADMIN_EMAILS.split(",").map((e) => e.trim().toLowerCase())
    : [];

  if (adminEmails.length === 0) {
    console.log("No ADMIN_EMAILS set in .env — skipping admin role assignment.");
    return;
  }

  const result = await prisma.user.updateMany({
    where: { email: { in: adminEmails } },
    data: { role: "ADMIN" },
  });

  console.log(`Updated ${result.count} user(s) to ADMIN role.`);
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
