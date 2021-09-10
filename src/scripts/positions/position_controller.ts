import { IPositions } from '../../types/positions';
import { ZTicks } from '../../types/ticker';
import { ZOrderTicks } from '../../types/ticker';
import { Kite } from '../zerodha/kite';
import { PriceUpdateReceiver, OrderUpdateReceiver, PriceUpdateSender, OrderUpdateSender } from './../ticker/interface';

export class PositionController implements PriceUpdateReceiver, OrderUpdateReceiver {
    private _open_positions: IPositions = [];

    initialise = async (): Promise<void> => {
        console.log(`log: [positions] initialised positions controller`);
        await this.fetchOpenPositions();
        console.log(`log: [positions] position controller is ready`);
        // subscribe to all the positions tickers... not needed now!
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

    fetchOpenPositions = async (): Promise<void> => {
        const [_positions, error] = await Kite.getInstance().getPositions();
        if (error) {
            throw new Error(error);
        }
        this._open_positions = _positions.net;
        console.log(`log: [positions] fetched open positions, open positions are:`);
        console.log(this._open_positions);
    };

    getOpenPositions = (): IPositions => this._open_positions;
}
