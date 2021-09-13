import { OrderManager } from '../orders/order_manager';
import { PositionController } from '../positions/position_controller';

export interface IStrategy {
    position_controller: PositionController;
    order_manager: OrderManager;
}
