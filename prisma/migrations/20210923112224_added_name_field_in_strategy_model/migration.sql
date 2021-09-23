-- AlterTable
ALTER TABLE "PiggyBank" ADD COLUMN     "name" TEXT NOT NULL DEFAULT E'piggy',
ALTER COLUMN "balance" SET DEFAULT 0;
