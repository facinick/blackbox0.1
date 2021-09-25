/*
  Warnings:

  - You are about to drop the column `last_action_quanity` on the `Stock` table. All the data in the column will be lost.
  - You are about to drop the column `last_transaction` on the `Stock` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Stock"
RENAME COLUMN "last_action_quanity" TO "last_action_quantity"
-- RENAME COLUMN "last_transaction" TO "last_action_transaction"
