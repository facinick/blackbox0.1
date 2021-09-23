/*
  Warnings:

  - You are about to drop the column `piggyBankId` on the `Stock` table. All the data in the column will be lost.
  - You are about to drop the `PiggyBank` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Stock" DROP CONSTRAINT "Stock_piggyBankId_fkey";

-- AlterTable
ALTER TABLE "Stock" DROP COLUMN "piggyBankId",
ADD COLUMN     "strategyId" INTEGER NOT NULL DEFAULT 1;

-- DropTable
DROP TABLE "PiggyBank";

-- CreateTable
CREATE TABLE "Strategy" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "Strategy_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Strategy_name_key" ON "Strategy"("name");

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_strategyId_fkey" FOREIGN KEY ("strategyId") REFERENCES "Strategy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
