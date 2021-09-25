/*
  Warnings:

  - You are about to drop the column `last_quanity` on the `Stock` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Stock" DROP COLUMN "last_quanity",
ADD COLUMN     "last_action_quanity" INTEGER NOT NULL DEFAULT 0;
