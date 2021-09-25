/*
  Warnings:

  - You are about to drop the column `balance` on the `Strategy` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Stock" ADD COLUMN     "last_action_reason" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "last_quanity" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
CREATE SEQUENCE "strategy_id_seq";
ALTER TABLE "Strategy" DROP COLUMN "balance",
ALTER COLUMN "id" SET DEFAULT nextval('strategy_id_seq');
ALTER SEQUENCE "strategy_id_seq" OWNED BY "Strategy"."id";
