-- CreateEnum
CREATE TYPE "Transaction" AS ENUM ('BUY', 'SELL');

-- CreateTable
CREATE TABLE "PositionData" (
    "id" SERIAL NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "average_price" INTEGER NOT NULL DEFAULT 0,
    "last_action_price" INTEGER NOT NULL,
    "last_transaction" "Transaction" NOT NULL,
    "last_action_timestamp" TIMESTAMP(3) NOT NULL,
    "last_20_days_prices" INTEGER[],
    "last_20_days_high" INTEGER NOT NULL,
    "last_20_days_low" INTEGER NOT NULL,
    "position_id" INTEGER NOT NULL,

    CONSTRAINT "PositionData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Position" (
    "id" SERIAL NOT NULL,
    "instrument_token" INTEGER NOT NULL,
    "tradingsymbol" TEXT NOT NULL,
    "strategy_id" INTEGER NOT NULL,

    CONSTRAINT "Position_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Strategy" (
    "id" SERIAL NOT NULL,
    "balance" INTEGER NOT NULL,

    CONSTRAINT "Strategy_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PositionData_position_id_unique" ON "PositionData"("position_id");

-- AddForeignKey
ALTER TABLE "PositionData" ADD CONSTRAINT "PositionData_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "Position"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Position" ADD CONSTRAINT "Position_strategy_id_fkey" FOREIGN KEY ("strategy_id") REFERENCES "Strategy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
