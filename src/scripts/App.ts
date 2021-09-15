import { PositionController } from './positions/position_controller';
import { OrderManager } from './orders/order_manager';
import { S1 } from './decision/s1';
import { IStrategy } from './decision/interface';
export class App {
    order_manager: OrderManager;
    position_controller: PositionController;
    decision_maker: IStrategy;

    initialise = async (): Promise<void> => {
        this.order_manager = new OrderManager();
        this.order_manager.initialise();

        this.position_controller = new PositionController();
        await this.position_controller.initialise();

        this.decision_maker = new S1({
            position_controller: this.position_controller,
            order_manager: this.order_manager,
        });
    };
}
