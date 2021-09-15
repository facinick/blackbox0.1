import { PriceUpdates } from './../ticker/price_updates';
import { IPositionGreeks, ZDayNetPositions, ZPosition, ZPositions } from '../../types/positions';
import { ZTicks } from '../../types/ticker';
import { ZOrderTicks } from '../../types/ticker';
import { Kite } from '../zerodha/kite';
import { PriceUpdateReceiver, OrderUpdateReceiver, PriceUpdateSender, OrderUpdateSender } from './../ticker/interface';
import { comparer, getDerivativeType } from '../../utils/helper';
import FEATURES from '../../settings/features';
// import { DerivativeTradingSymbolType } from '../../types/zerodha';
// import { EquityTradingSymbolType } from '../../types/nse_index';
export class PositionController implements PriceUpdateReceiver, OrderUpdateReceiver {
    private readonly GREEKS_UPDATE_INTERVAL_MS = 10000;
    private greeksUpdaterTimer: NodeJS.Timer = null;

    private dayNetPositions: ZDayNetPositions = {
        day: [],
        net: [],
    };

    private positionAggregates: {
        pnl: number;
        delta: number;
        updatedAt: number;
    } = {
        // signed
        pnl: 0,
        // signed
        delta: 0,
        updatedAt: Date.now(),
    };

    initialise = async (): Promise<void> => {
        console.log(`log: [positions] initialised positions controller`);
        await this.fetchDayNetPositions();

        if (FEATURES.OPTIONS_GREEKS) {
            this.startPositionGreeksUpdater();
        }

        console.log(`log: [positions] position controller is ready`);
        // fetch delta values of all the positions... from external source!
    };

    updateNetSubscriptions({ dayNetPositions }: { dayNetPositions: ZDayNetPositions }): void {
        const newNetPositions = dayNetPositions.net;
        const oldNetPositions = this.dayNetPositions.net;

        const unsubscribeList: ZPositions = oldNetPositions.filter(comparer(newNetPositions));
        const subscribeList: ZPositions = newNetPositions.filter(comparer(oldNetPositions));

        // unsubscribe to closed positions tickers
        console.log(`log: [positions] initiating unsubscribe for these positions`);
        console.log(unsubscribeList);

        const unsubscribeListIds = unsubscribeList.map((position: ZPosition) => position.instrument_token);

        PriceUpdates.getInstance().unsubscribe({ observer: this, ticker_ids: unsubscribeListIds });

        // subscribe to new positions tickers
        console.log(`log: [positions] initiating subscribe for these positions`);
        console.log(subscribeList);

        const subscribeListIds = subscribeList.map((position: ZPosition) => position.instrument_token);

        PriceUpdates.getInstance().subscribe({ observer: this, ticker_ids: subscribeListIds });
    }

    // update local position prices
    onPriceUpdate(_subject: PriceUpdateSender, ticks: ZTicks): void {
        console.log(`log: [positions] price updated...`);
        console.log(ticks);
    }

    // update local positions
    onOrderUpdate(_subject: OrderUpdateSender, orders: ZOrderTicks): void {
        console.log(`log: [positions] orders updated...`);
        console.log(orders);
    }

    fetchDayNetPositions = async (): Promise<void> => {
        console.log(`log: [positions] fetching all positions from server...`);
        const [_positions, error] = await Kite.getInstance().getPositions();
        if (error) {
            throw new Error(error);
        }

        // console.log(`log: [positions] updating subscription list...`);
        // this.updateNetSubscriptions({
        //     dayNetPositions: _positions,
        // });

        // await wait_x_ms({ milliseconds: 2000 });

        console.log(`log: [positions] updating local positions list...`);
        this.dayNetPositions = _positions;
        console.log(`log: [positions] open positions are:`);
        console.table(this.dayNetPositions.net);
    };

    startPositionGreeksUpdater = (): void => {
        this.stopPositionGreeksUpdater();
        this.updateDeltaValuesInDayPositions();
        this.greeksUpdaterTimer = setInterval(() => {
            this.updateDeltaValuesInDayPositions();
        }, this.GREEKS_UPDATE_INTERVAL_MS);
    };

    stopPositionGreeksUpdater = (): void => {
        if (this.greeksUpdaterTimer) {
            clearInterval(this.greeksUpdaterTimer);
            this.greeksUpdaterTimer = null;
        }
    };

    // [UNDER CONSTRUCTION]
    // fetch underlying price once
    // fetch IV values for every position
    // use above two to calculate delta value
    updateDeltaValuesInDayPositions = async (): Promise<void> => {
        // const UL_LTP_CACHE = new Map<EquityTradingSymbolType, number>();
        // const POSITION_IV_CACHE = new Map<DerivativeTradingSymbolType, number>();

        // reset aggr delta
        this.positionAggregates.delta = 0;

        if (this.dayNetPositions?.net?.length > 0) {
            this.dayNetPositions.net = this.dayNetPositions.net.map((position: ZPosition & IPositionGreeks) => {
                //1 check if position segment type
                //2 >> if FUT, delta = position.quantity , return position
                //3 >> if OPT, goto 5
                //4 >> if EQ, return position;
                //5 get underlying
                //6 check if price exist in cache
                //7 >> if yes, pick from cache
                //8 >> if no, fetch from server
                //9 check if iv exist in cache
                //10 >> if yes, pick from cache
                //11 >> if no, fetch from server
                //12 calculate delta
                // const underlyingPrice =

                let delta = undefined;

                // futures delta
                if (getDerivativeType({ position }) === 'FUTURES') {
                    return position;
                }

                // options delta
                else if (getDerivativeType({ position }) === 'OPTIONS') {
                    delta = 0.5;
                }

                // ex: product type = 'CNC' , equity stocks etc.
                else {
                    return position;
                }

                position.delta = delta;
                this.positionAggregates.delta += delta;

                return position;
            });
            console.log(`log: [positions] positions greeks updated`);
        }
    };

    getOpenDayPositions = (): ZPositions => this.dayNetPositions.day;
    getOpenNetPositions = (): ZPositions => this.dayNetPositions.net;
}
