import { PriceUpdates } from './../ticker/price_updates';
import { IPositionGreeks, ZDayNetPositions, ZPosition, ZPositions } from '../../types/positions';
import { ZTicks } from '../../types/ticker';
import { ZOrderTick } from '../../types/ticker';
import { Kite } from '../zerodha/kite';
import { PriceUpdateReceiver, OrderUpdateReceiver, PriceUpdateSender, OrderUpdateSender } from './../ticker/interface';
import { comparer, getDerivativeType } from '../../utils/helper';
import FEATURES from '../../settings/features';
import { IPositionFilter } from '../decision/interface';
import { ZHoldings } from '../../types/holdings';
import { Logger } from '../logger/logger';
// import { DerivativeTradingSymbolType } from '../../types/zerodha';
// import { EquityTradingSymbolType } from '../../types/nse_index';
export class PositionController implements PriceUpdateReceiver, OrderUpdateReceiver {
    private readonly GREEKS_UPDATE_INTERVAL_MS = 10000;
    private greeksUpdaterTimer: NodeJS.Timer = null;

    private dayNetPositions: ZDayNetPositions = {
        day: [],
        net: [],
    };

    private holdings: ZHoldings = [];

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
        Logger.info({
            message: `initialised positions controller`,
            className: this.constructor.name,
        });
        await this.fetchDayNetPositionsAndHoldings();

        if (FEATURES.OPTIONS_GREEKS) {
            this.startPositionGreeksUpdater();
        }

        Logger.info({
            message: `position controller is ready`,
            className: this.constructor.name,
        });
        // fetch delta values of all the positions... from external source!
    };

    updateNetSubscriptions({ dayNetPositions }: { dayNetPositions: ZDayNetPositions }): void {
        const newNetPositions = dayNetPositions.net;
        const oldNetPositions = this.dayNetPositions.net;

        const unsubscribeList: ZPositions = oldNetPositions.filter(comparer(newNetPositions));
        const subscribeList: ZPositions = newNetPositions.filter(comparer(oldNetPositions));

        // unsubscribe to closed positions tickers
        Logger.warn({
            message: `initiating unsubscribe for these positions`,
            className: this.constructor.name,
            data: unsubscribeList,
        });

        const unsubscribeListIds = unsubscribeList.map((position: ZPosition) => position.instrument_token);

        PriceUpdates.getInstance().unsubscribe({ observer: this, ticker_ids: unsubscribeListIds });

        // subscribe to new positions tickers
        Logger.warn({
            message: `initiating subscribe for these positions`,
            className: this.constructor.name,
            data: subscribeList,
        });

        const subscribeListIds = subscribeList.map((position: ZPosition) => position.instrument_token);

        PriceUpdates.getInstance().subscribe({ observer: this, ticker_ids: subscribeListIds });
    }

    // update local position prices
    onPriceUpdate(_subject: PriceUpdateSender, _ticks: ZTicks): void {
        // do nothing for now
    }

    // update local positions
    // update db? which db? what?
    onOrderUpdate(_subject: OrderUpdateSender, _order: ZOrderTick): void {
        // do nothing for now
    }

    fetchDayNetPositionsAndHoldings = async (): Promise<void> => {
        Logger.info({
            message: `fetching all positions from server...`,
            className: this.constructor.name,
        });
        const [_positions, get_positions_error] = await Kite.getInstance().getPositions();
        if (get_positions_error) {
            throw new Error(get_positions_error);
        }

        Logger.info({
            message: `fetching all holdings from server...`,
            className: this.constructor.name,
        });
        const [_holdingss, get_holdings_errorr] = await Kite.getInstance().getHoldings();
        if (get_holdings_errorr) {
            throw new Error(get_holdings_errorr);
        }

        // console.log(`log: [positions] updating subscription list...`);
        // this.updateNetSubscriptions({
        //     dayNetPositions: _positions,
        // });

        // await wait_x_ms({ milliseconds: 2000 });

        this.dayNetPositions = _positions;
        // console.log(`log: [positions] open positions are:`);
        // console.log(this.dayNetPositions.net);
        Logger.info({
            message: `updating local positions list...`,
            className: this.constructor.name,
        });

        this.holdings = _holdingss;
        // console.log(`log: [positions] holdingss are:`);
        // console.log(this.holdings);
        Logger.info({
            message: `updating local holdings list...`,
            className: this.constructor.name,
        });
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
            Logger.info({
                message: `positions greeks updated`,
                className: this.constructor.name,
            });
        }
    };

    filterNetOpenPositions = ({ filter }: { filter: IPositionFilter }): ZPositions => {
        const results = this.dayNetPositions.net.filter(position => {
            let accept = true;
            Object.keys(filter.filter).every(filter_key => {
                if (position[filter_key] !== filter.filter[filter_key]) {
                    accept = false;
                    return false;
                } else {
                    return true;
                }
            });
            return accept;
        });

        return results;
    };

    getOpenNetPositions = ({ filter }: { filter: IPositionFilter }): ZPositions =>
        this.filterNetOpenPositions({ filter });
    getHoldings = (): ZHoldings => this.holdings;
}
