-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- AlterTable: Add role column to User table
ALTER TABLE "User" ADD COLUMN "role" "UserRole" NOT NULL DEFAULT 'USER';

-- Set admin users based on ADMIN_EMAILS env var (update manually if needed)
-- Example: UPDATE "User" SET "role" = 'ADMIN' WHERE "email" IN ('admin@example.com');
