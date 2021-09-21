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

export class S2 implements IStrategy {
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
        this.positionController = positionController;

        // add order manager listeners
        this.orderManager.on(OrderManager.EVENT.started, this.onOrderExecutionStarted);
        this.orderManager.on(OrderManager.EVENT.completed, this.onOrderExecutionCompleted);
    }

    onOrderExecutionStarted = () => {
        this.pause();
    };

    onOrderExecutionCompleted = () => {
        this.resume();
    };

    initialise = async (): Promise<void> => {
        try {
            // load stocks from database
            this.stocks = await DB.getInstance().getStocks();

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
        } catch (error) {
            console.log(`log: [strategy] fatal error, couldn't init strategy`);
            console.log(error);
            process.exit();
        }
    };

    updateStocksFromDB = async () => {
        this.stocks = await DB.getInstance().getStocks();
    };

    updateStocksToDB = async () => {
        this.stocks = await DB.getInstance().getStocks();
    };

    onPriceUpdate(_subject: PriceUpdateSender, _ticks: ZTicks): void {
        if (!this.throttledCheckForOrders) {
            this.throttledCheckForOrders = throttle(this.checkForOrders, 5000);
        }
        if (global.pause === false) {
            this.throttledCheckForOrders(_subject, _ticks);
        }
    }

    checkForOrders(_subject: PriceUpdateSender, _ticks: ZTicks): void {
        const orders: Array<IPlaceStockOrder> = [];

        console.log(`checking order conditions...`);

        this.equityInstruments.forEach((equityInstrument: Instrument) => {
            // get data of tradingsymbol from db
            const data = this.stocks.find(stock => stock.tradingsymbol === equityInstrument.tradingsymbol);
            // get price of tradingsymbol from db
            const tick = getTickByInstrumentToken({
                ticks: _ticks,
                instrument_token: Number(equityInstrument.instrument_token),
            });

            console.log(`old: ${tick.last_price} => new: ${data.last_action_price}`);

            //decision making is done here
            if (tick.last_price < data.last_action_price * 0.99) {
                console.log(`price dooped 1%, buy...`);
                orders.push({
                    tradingsymbol: equityInstrument.tradingsymbol,
                    transaction_type: 'BUY',
                    quantity: 1,
                    tag: this.positions_filter.tag,
                    _function: 'DAY_STOCK',
                });
            } else if (tick.last_price > data.last_action_price * 1.01) {
                console.log(`price jumped 1%, sell...`);
                orders.push({
                    tradingsymbol: equityInstrument.tradingsymbol,
                    transaction_type: 'SELL',
                    quantity: 1,
                    tag: this.positions_filter.tag,
                    _function: 'DAY_STOCK',
                });
            }
        });

        if (orders) {
            this.orderManager.sendOrders({ orders });
        }
    }

    pause = (): void => {
        console.log(`log: [strategy] pausing strategy...`);
        global.pause = true;
    };

    resume = (): void => {
        console.log(`log: [strategy] resuming strategy...`);
        global.pause = false;
    };
}
