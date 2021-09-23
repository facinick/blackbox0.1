import { SegmentType, ExchangeType, ProductType } from '../../types/zerodha';
import { PriceUpdates } from '../ticker/price_updates';
import { PositionController } from '../positions/position_controller';
import { ZTicks } from '../../types/ticker';
import { PriceUpdateSender } from '../ticker/interface';
import { OrderManager } from '../orders/order_manager';
import { InstrumentStore } from '../zerodha/instrument_store';
import { Eq_EquityTradingSymbolType } from '../../types/instrument';
import { getTickByInstrumentToken } from '../../utils/helper';
import { Instrument } from '../../types/zerodha';
import { IStrategy } from './interface';
import { Stock } from '@prisma/client';
import { DB } from '../../db/prisma';
import { throttle } from 'throttle-typescript';
import { IPlaceStockOrder } from '../../types/orders';
import { Logger } from '../logger/logger';
import { deltaPercentage, average } from '../../utils/numbers';
export class S2 implements IStrategy {
    private readonly ORDER_CHECK_INTERVAL_MS = 60000;

    equityInstruments: Array<Instrument> = [];

    positionController: PositionController;
    orderManager: OrderManager;

    positions_filter = {
        tag: 'piggy',
        filter: {
            product: <ProductType>'CNC',
            exchange: <ExchangeType>'NSE',
        },
    };

    stocks: Array<Stock> = [];

    throttledCheckForOrders: any;

    constructor({
        positionController,
        orderManager,
    }: {
        positionController: PositionController;
        orderManager: OrderManager;
    }) {
        this.orderManager = orderManager;
        this.orderManager.setTag({ tag: this.positions_filter.tag });
        this.positionController = positionController;

        this.throttledCheckForOrders = throttle(this.checkForOrders, this.ORDER_CHECK_INTERVAL_MS);

        // add order manager listeners
        // this.orderManager.on(OrderManager.EVENT.OMInit, this.onOrderExecutionInit);
        // this.orderManager.on(OrderManager.EVENT.OMStarted, this.onOrderExecutionStarted);
        // this.orderManager.on(OrderManager.EVENT.OMPlaced, this.onOrderExecutionPlaced);
        this.orderManager.on(OrderManager.EVENT.OMCompleted, this.onOrderExecutionCompleted);
        // order manager order status listener
        this.orderManager.on(OrderManager.EVENT.executed, (completedorder: IPlaceStockOrder) => {
            this.onOrderExecuted(completedorder);
        });
    }

    initialise = async (): Promise<void> => {
        try {
            await this.loadStocksFromDB();
            this.subscribeStocksLoadedFromDB();
            this.resume();
        } catch (error) {
            Logger.error({
                message: `fatal error, couldn't init strategy`,
                className: this.constructor.name,
                data: error,
            });
            process.exit();
        }
    };

    onOrderExecutionCompleted = () => {
        Logger.info({
            message: `order execution completed`,
            className: this.constructor.name,
        });
        this.resume();
    };

    onOrderExecuted = async (completedOrder: IPlaceStockOrder) => {
        const data = this.stocks.find(stock => stock.tradingsymbol === completedOrder.tradingsymbol);

        await DB.getInstance().updateStockWithSymbol({
            tradingSymbol: <Eq_EquityTradingSymbolType>completedOrder.tradingsymbol,
            data: {
                last_transaction: completedOrder.transaction_type,
                last_action_price: completedOrder.price,
                quantity: data.quantity + completedOrder.quantity,
                average_price:
                    (data.average_price * data.quantity + completedOrder.price) /
                    (data.quantity + completedOrder.quantity),
                balance: data.balance - completedOrder.price,
            },
        });

        Logger.info({
            message: `database updated!`,
            className: this.constructor.name,
        });
        await this.loadStocksFromDB();
        this.resume();
    };

    loadStocksFromDB = async (): Promise<void> => {
        this.stocks = await DB.getInstance().getStocks();
        Logger.info({
            message: `database loaded!`,
            className: this.constructor.name,
        });
        return;
    };

    subscribeStocksLoadedFromDB = (): void => {
        // collect instrument ids of all the stocks
        const subscribe_to_tokens: Array<number> = [];
        this.stocks.forEach((stock: Stock) => {
            const instrument = InstrumentStore.getInstance().getEquityInstrumentFromItsSymbol({
                equityTradingSymbol: <Eq_EquityTradingSymbolType>stock.tradingsymbol,
                segment: <SegmentType>'NSE',
            });

            this.equityInstruments.push(instrument);
            subscribe_to_tokens.push(Number(instrument.instrument_token));
        });

        // subscribe for their price updates
        PriceUpdates.getInstance().subscribe({
            observer: this,
            ticker_ids: subscribe_to_tokens,
        });
    };

    updateStocksFromDB = async () => {
        this.stocks = await DB.getInstance().getStocks();
    };

    updateStocksToDB = async () => {
        this.stocks = await DB.getInstance().getStocks();
    };

    onPriceUpdate(_subject: PriceUpdateSender, _ticks: ZTicks): void {
        if (global.pause === false) {
            this.throttledCheckForOrders(_subject, _ticks);
        }
    }

    checkForOrders(_subject: PriceUpdateSender, _ticks: ZTicks): void {
        const orders: Array<IPlaceStockOrder> = [];

        Logger.info({
            message: `checking order conditions...`,
            className: this.constructor.name,
        });

        this.equityInstruments.forEach((equityInstrument: Instrument) => {
            // get data of tradingsymbol from db
            const data = this.stocks.find(stock => stock.tradingsymbol === equityInstrument.tradingsymbol);
            // get price of current tradingsymbol from list of prices
            const tick = getTickByInstrumentToken({
                ticks: _ticks,
                instrument_token: Number(equityInstrument.instrument_token),
            });

            if (!tick || !data) {
                // Logger.warn({
                //     message: `error while checking condition, tick or its data is not defined`,
                //     className: this.constructor.name,
                // });
                return;
            }

            const buyPrice = tick.depth?.buy?.[0]?.price;
            const sellPrice = tick.depth?.sell?.[0]?.price;
            let avgPrice;

            if (buyPrice && sellPrice) {
                avgPrice = average([buyPrice, sellPrice]);
            }

            const change = deltaPercentage({
                from: data.last_action_price,
                to: tick.last_price,
            });

            const canBuy = data.balance >= tick.last_price;
            const canSell = data.quantity >= 1;

            Logger.debug({
                message: `${equityInstrument.tradingsymbol}: ${change}        (${tick.last_price}:${avgPrice})`,
                className: this.constructor.name,
            });

            // check balance too
            if (change <= -3 && canBuy) {
                Logger.info({
                    message: `price dooped 3%, buy...`,
                    className: this.constructor.name,
                    notify: true,
                });
                orders.push({
                    tradingsymbol: equityInstrument.tradingsymbol,
                    transaction_type: 'BUY',
                    quantity: 1,
                    tag: this.positions_filter.tag,
                    price: tick.last_price,
                    _function: 'DAY_STOCK',
                });
            } else if (change >= 3 && canSell) {
                Logger.info({
                    message: `price jumped 3%, sell...`,
                    className: this.constructor.name,
                    notify: true,
                });
                orders.push({
                    tradingsymbol: equityInstrument.tradingsymbol,
                    transaction_type: 'SELL',
                    quantity: 1,
                    tag: this.positions_filter.tag,
                    price: tick.last_price,
                    _function: 'DAY_STOCK',
                });
            }
        });

        if (orders.length > 0) {
            this.pause();
            this.orderManager.sendOrders({ orders });
        }
    }

    pause = (): void => {
        Logger.warn({
            message: `pausing strategy...`,
            className: this.constructor.name,
        });
        global.pause = true;
    };

    resume = (): void => {
        Logger.warn({
            message: `resuming strategy....`,
            className: this.constructor.name,
        });
        global.pause = false;
    };
}
