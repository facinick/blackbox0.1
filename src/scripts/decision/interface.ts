import { ZPosition } from '../../types/positions';
import { OrderManager } from '../orders/order_manager';
import { PositionController } from '../positions/position_controller';
import { PriceUpdateReceiver } from '../ticker/interface';

export interface IPositionFilter {
    tag: string;
    filter: Partial<
        Pick<ZPosition, 'exchange' | 'instrument_token' | 'pnl' | 'product' | 'quantity' | 'tradingsymbol' | 'value'>
    >;
}

export interface IStrategy extends PriceUpdateReceiver {
    position_controller: PositionController;
    order_manager: OrderManager;
    positions_filter: IPositionFilter;
}
