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

    updatePiggybankBalance = async ({ balance }: { balance: number }) => {
        await this._prisma.strategy.update({
            where: {
                name: 'piggy',
            },
            data: {
                balance,
            },
        });
    };

    // todo: take stocks from piggy strategy only
    getStocks = async (): Promise<Array<Stock>> => {
        const stocks: Array<Stock> = await this._prisma.stock.findMany();
        return stocks;
    };

    // todo: take stocks from piggy strategy only
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

    // todo: take stocks from piggy strategy only
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
