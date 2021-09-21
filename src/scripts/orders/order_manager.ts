import { IPlaceStockOrder } from './../../types/orders';
import { OrderUpdates } from './../ticker/order_updates';
import { ZOrderTicks } from '../../types/ticker';
import { OrderUpdateReceiver, OrderUpdateSender } from './../ticker/interface';

export class OrderManager implements OrderUpdateReceiver {
    // private _all_orders: IOrders = [];
    // private _pending_orders: IOrders = [];
    // private _execued_orders: IOrders = [];
    // private _failed_orders: IOrders = [];

    // private _executing = false;

    initialise = (): void => {
        OrderUpdates.getInstance().subscribe({ observer: this });
        console.log(`log: [order] order manager is ready`);
    };

    onOrderUpdate(_subject: OrderUpdateSender, orders: ZOrderTicks): void {
        console.log(`log: [order] received order updates:`);
        console.log(orders);
    }

    sendOrders = async ({ orders }: { orders: Array<IPlaceStockOrder> }): Promise<void> => {
        console.log(`log: [order] send orders:`);
        console.log(orders);
    };

    reset = (): void => {
        // this._all_orders = [];
        // this._pending_orders = [];
        // this._execued_orders = [];
        // this._failed_orders = [];
    };
}
