import { PriceUpdates } from './../ticker/price_updates';
import { IPositionGreeks, ZDayNetPositions, ZPosition, ZPositions } from '../../types/positions';
import { ZTicks } from '../../types/ticker';
import { ZOrderTicks } from '../../types/ticker';
import { Kite } from '../zerodha/kite';
import { PriceUpdateReceiver, OrderUpdateReceiver, PriceUpdateSender, OrderUpdateSender } from './../ticker/interface';
import { comparer } from '../../utils/helper';

export class PositionController implements PriceUpdateReceiver, OrderUpdateReceiver {
    private readonly GREEKS_UPDATE_INTERVAL_MS = 10000;
    private greeksUpdaterTimer: NodeJS.Timer = null;

    private dayNetPositions: ZDayNetPositions = {
        day: [],
        net: [],
    };

    initialise = async (): Promise<void> => {
        console.log(`log: [positions] initialised positions controller`);
        await this.fetchDayNetPositions();
        this.startPositionGreeksUpdater();
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
        console.log(this.dayNetPositions);
    };

    startPositionGreeksUpdater = (): void => {
        this.stopPositionGreeksUpdater();
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

    updateDeltaValuesInDayPositions = () => {
        if (this.dayNetPositions?.net?.length > 0) {
            this.dayNetPositions.net = this.dayNetPositions.net.map((position: ZPosition & IPositionGreeks) => {
                position.delta = 8;
                position.iv = 0.18;
                return position;
            });
            console.log(`log: [positions] positions greeks updated`);
        }
    };

    getOpenDayPositions = (): ZPositions => this.dayNetPositions.day;
    getOpenNetPositions = (): ZPositions => this.dayNetPositions.net;
}
