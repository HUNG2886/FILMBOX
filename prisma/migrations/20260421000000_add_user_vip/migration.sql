-- Add VIP subscription timestamp and shift default role for new users to "user".
ALTER TABLE "User" ADD COLUMN "vipUntil" TIMESTAMP(3);
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'user';
