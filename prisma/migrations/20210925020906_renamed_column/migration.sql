/*
  Warnings:

  - You are about to drop the column `last_transaction` on the `Stock` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Stock" DROP COLUMN "last_transaction",
ADD COLUMN     "last_action_transaction" "Transaction" NOT NULL DEFAULT E'INIT';
