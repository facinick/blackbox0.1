import { ZDayNetPositions, ZPositions } from '../../types/positions';
import { ZTicks } from '../../types/ticker';
import { ZOrderTicks } from '../../types/ticker';
import { Kite } from '../zerodha/kite';
import { PriceUpdateReceiver, OrderUpdateReceiver, PriceUpdateSender, OrderUpdateSender } from './../ticker/interface';

export class PositionController implements PriceUpdateReceiver, OrderUpdateReceiver {
    private dayNetPositions: ZDayNetPositions = {
        day: [],
        net: [],
    };

    initialise = async (): Promise<void> => {
        console.log(`log: [positions] initialised positions controller`);
        await this.fetchDayNetPositions();
        console.log(`log: [positions] position controller is ready`);
        // subscribe to all the positions tickers... not needed now!
        // fetch delta values of all the positions... from external source!
    };

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
        const [_positions, error] = await Kite.getInstance().getPositions();
        if (error) {
            throw new Error(error);
        }
        this.dayNetPositions = _positions;
        console.log(`log: [positions] fetched open positions, open positions are:`);
        console.log(this.dayNetPositions);
    };

    getOpenDayPositions = (): ZPositions => this.dayNetPositions.day;
    getOpenNetPositions = (): ZPositions => this.dayNetPositions.net;
}
