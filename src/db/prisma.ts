import { PrismaClient, Stock } from '@prisma/client';
import { Eq_EquityTradingSymbolType } from '../types/instrument';
export class DB {
    private static _instance: DB;
    private _prisma: PrismaClient;

    static getInstance(): DB {
        if (!DB._instance) {
            DB._instance = new DB();
            DB._instance._prisma = new PrismaClient();
        }
        return DB._instance;
    }

    getPiggybankBalance = async () => {
        await this._prisma.piggyBank.findMany()?.[0]?.balance;
    };

    updatePiggybankBalance = async ({ balance }: { balance: number }) => {
        await this._prisma.piggyBank.update({
            where: {
                id: 1,
            },
            data: {
                balance,
            },
        });
    };

    getStocks = async (): Promise<Array<Stock>> => {
        const stocks: Array<Stock> = await this._prisma.stock.findMany();
        return stocks;
    };

    getStockWithSymbol = async ({
        tradingSymbol,
    }: {
        tradingSymbol: Eq_EquityTradingSymbolType;
    }): Promise<Stock | null> => {
        const stock: Stock = await this._prisma.stock.findUnique({
            where: {
                tradingsymbol: tradingSymbol,
            },
        });
        return stock;
    };

    updateStockWithSymbol = async ({
        tradingSymbol,
        data,
    }: {
        tradingSymbol: Eq_EquityTradingSymbolType;
        data: Partial<Stock>;
    }): Promise<Stock> => {
        const stock: Stock = await this._prisma.stock.update({
            where: {
                tradingsymbol: tradingSymbol,
            },
            data: data,
        });
        return stock;
    };
}
