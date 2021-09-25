import { PrismaClient, Stock } from '@prisma/client';
import { IStrategy } from '../scripts/decision/interface';
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

    getStocks = async ({ strategy }: { strategy: IStrategy }): Promise<Array<Stock>> => {
        const _strategy: {
            stocks: Stock[];
        } = await this._prisma.strategy.findUnique({
            where: {
                name: strategy.constructor.name,
            },
            select: {
                stocks: true,
            },
        });

        return _strategy.stocks;
    };

    // todo: take stocks from piggy strategy only
    updateStockWithSymbol = async ({
        strategy,
        tradingSymbol,
        data,
    }: {
        strategy: IStrategy;
        tradingSymbol: Eq_EquityTradingSymbolType;
        data: Partial<Stock>;
    }): Promise<void> => {
        await this._prisma.strategy.update({
            where: {
                name: strategy.constructor.name,
            },
            data: {
                stocks: {
                    update: {
                        where: {
                            tradingsymbol: tradingSymbol,
                        },
                        data: data,
                    },
                },
            },
        });

        return;
    };

    // todo: take stocks from piggy strategy only
    // getStockWithSymbol = async ({
    //     strategy,
    //     tradingSymbol,
    // }: {
    //     strategy: IStrategy;
    //     tradingSymbol: Eq_EquityTradingSymbolType;
    // }): Promise<Stock | null> => {
    //     const stock: Stock = await this._prisma.stock.findUnique({
    //         where: {
    //             tradingsymbol: tradingSymbol,
    //         },
    //     });
    //     return stock;
    // };
}
