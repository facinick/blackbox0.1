import { IPlaceStockOrder } from './../../types/orders';
import { OrderUpdates } from './../ticker/order_updates';
import { ZOrderTicks } from '../../types/ticker';
import { OrderUpdateReceiver, OrderUpdateSender } from './../ticker/interface';
import { EventEmitter } from '../../utils/event_emitter';
import { Kite } from '../zerodha/kite';

export class OrderManager extends EventEmitter implements OrderUpdateReceiver {
    static readonly EVENT = {
        started: 'started',
        placed: 'placed',
        completed: 'completed',
        init: 'init',
    };

    private PENDING_TIMEOUT_MS = 30000;

    private _all_orders: Array<IPlaceStockOrder> = [];
    private _pending_orders: Array<IPlaceStockOrder> = [];
    private _execued_orders: Array<IPlaceStockOrder> = [];
    private _failed_orders: Array<IPlaceStockOrder> = [];

    initialise = (): void => {
        OrderUpdates.getInstance().subscribe({ observer: this });
        console.log(`log: [order] order manager is ready`);
        this.emit(OrderManager.EVENT.init);
    };

    onOrderUpdate(_subject: OrderUpdateSender, orders: ZOrderTicks): void {
        console.log(`log: [order] received order updates:`);
        console.log(orders);
    }

    sendOrders = async ({ orders }: { orders: Array<IPlaceStockOrder> }): Promise<void> => {
        this._all_orders = orders;
        this._pending_orders = orders;
        return this.beginOrderExecution();
    };

    beginOrderExecution = async (): Promise<void> => {
        this.emit(OrderManager.EVENT.started);

        console.log(`log: [order] begin order execution`);
        for (let index = 0; index < this._pending_orders.length; index++) {
            const order = this._pending_orders[index];
            console.log(order);
            if (order._function === 'DAY_STOCK') {
                console.log(`log: [order manager] sending order`);
                console.log(order);

                try {
                    await Kite.getInstance().placeStockOrder({
                        tradingsymbol: order.tradingsymbol,
                        transaction_type: order.transaction_type,
                        tag: order.tag,
                        quantity: order.quantity,
                    });

                    console.log(`log: [success] [order manager] order placed!`);
                    this._pending_orders.push(order);
                } catch (error) {
                    console.log(`log: [error] [order manager] couldn't place the order!`);
                    this._failed_orders.push(order);
                }
            }
        }

        this.emit(OrderManager.EVENT.placed);
    };

    reset = (): void => {
        this._all_orders = [];
        this._pending_orders = [];
        this._execued_orders = [];
        this._failed_orders = [];
    };

    dumy = () => {
        console.log(this.PENDING_TIMEOUT_MS);
        console.log(this._all_orders);
        console.log(this._execued_orders);
    };
}
