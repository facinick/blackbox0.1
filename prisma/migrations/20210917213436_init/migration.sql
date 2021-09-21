-- CreateEnum
CREATE TYPE "Transaction" AS ENUM ('BUY', 'SELL', 'INIT');

-- CreateTable
CREATE TABLE "Stock" (
    "id" SERIAL NOT NULL,
    "tradingsymbol" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "average_price" INTEGER NOT NULL DEFAULT 0,
    "last_action_price" INTEGER NOT NULL DEFAULT 0,
    "last_transaction" "Transaction" NOT NULL DEFAULT E'INIT',
    "last_action_timestamp" TIMESTAMP(3) NOT NULL,
    "pnl" INTEGER NOT NULL DEFAULT 0,
    "piggyBankId" INTEGER NOT NULL,

    CONSTRAINT "Stock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PiggyBank" (
    "id" SERIAL NOT NULL,
    "balance" INTEGER NOT NULL,

    CONSTRAINT "PiggyBank_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Stock_tradingsymbol_key" ON "Stock"("tradingsymbol");

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_piggyBankId_fkey" FOREIGN KEY ("piggyBankId") REFERENCES "PiggyBank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
