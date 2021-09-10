import { PositionController } from './../positions/position_controller';
import { ZTicks } from '../../types/ticker';
import { PriceUpdateReceiver, PriceUpdateSender } from './../ticker/interface';
import { OrderManager } from '../orders/order_manager';
export class DecisionMaker implements PriceUpdateReceiver {
    underlying = 'BANKNIFTY';
    position_controller: PositionController;
    order_manager: OrderManager;

    constructor({
        position_controller,
        order_manager,
    }: {
        position_controller: PositionController;
        order_manager: OrderManager;
    }) {
        this.order_manager = order_manager;
        this.position_controller = position_controller;
    }

    onPriceUpdate(_subject: PriceUpdateSender, ticks: ZTicks): void {
        const positions = this.position_controller.getOpenPositions();
        const underlying_price = ticks[0];
        console.log(`log: take a decision based on ${underlying_price} and ${JSON.stringify(positions)}`);
        throw new Error('Method not implemented.');
    }
}
