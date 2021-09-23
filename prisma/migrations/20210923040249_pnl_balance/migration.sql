/*
  Warnings:

  - You are about to drop the column `pnl` on the `Stock` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Stock" DROP COLUMN "pnl",
ADD COLUMN     "balance" DOUBLE PRECISION NOT NULL DEFAULT 0;
