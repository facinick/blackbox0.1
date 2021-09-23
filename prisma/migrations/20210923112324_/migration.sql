/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `PiggyBank` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
CREATE SEQUENCE "piggybank_id_seq";
ALTER TABLE "PiggyBank" ALTER COLUMN "id" SET DEFAULT nextval('piggybank_id_seq');
ALTER SEQUENCE "piggybank_id_seq" OWNED BY "PiggyBank"."id";

-- CreateIndex
CREATE UNIQUE INDEX "PiggyBank_name_key" ON "PiggyBank"("name");
