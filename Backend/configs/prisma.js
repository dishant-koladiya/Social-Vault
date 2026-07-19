import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === "development") {
	global.prisma = prisma;
}

prisma
	.$connect()
	.then(() => console.log("✅ Database connected successfully"))
	.catch((err) => console.error("❌ Database connection failed:", err.message));

export default prisma;