import { PositionController } from './positions/position_controller';
import { OrderManager } from './orders/order_manager';
import { S2 } from './decision/s2';
import { IStrategy } from './decision/interface';
export class App {
    orderManager: OrderManager;
    positionController: PositionController;
    decisionMaker: IStrategy;

    initialise = async (): Promise<void> => {
        this.orderManager = new OrderManager();
        this.orderManager.initialise();

        this.positionController = new PositionController();
        await this.positionController.initialise();

        this.decisionMaker = new S2({
            positionController: this.positionController,
            orderManager: this.orderManager,
        });

        await this.decisionMaker.initialise();
    };
}
