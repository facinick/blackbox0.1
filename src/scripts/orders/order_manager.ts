import { IPlaceStockOrder } from './../../types/orders';
import { OrderUpdates } from './../ticker/order_updates';
import { OrderUpdateReceiver, OrderUpdateSender } from './../ticker/interface';
import { EventEmitter } from '../../utils/event_emitter';
import { Kite } from '../zerodha/kite';
import { ZOrderTick } from '../../types/ticker';
import { Logger } from '../logger/logger';

export class OrderManager extends EventEmitter implements OrderUpdateReceiver {
    static readonly EVENT = {
        // entire order basket
        OMStarted: 'OMstarted',
        OMCompleted: 'OMcompleted', // this
        // per order
        placed: 'placed',
        failed: 'failed',
        executed: 'executed', // this
        timedout: 'timedout', // this
    };

    // for pending orders ******************
    private MAX_RETRY_ATTEMPTS = 3; // modify only max 3 times
    private PENDING_MODIFY_INTERVAL_MS = 10000; // every 10 seconds modify order
    private PENDING_TIMEOUT_MS = 50000; // in 50 seconds cancel pending orders
    private PENDING_MAX_DEVIATION = 0.005; // modify only upto max 0.5% fro original order price
    // *************************************

    private _all_orders: Array<IPlaceStockOrder> = [];

    private _sent_orders: Map<string, IPlaceStockOrder> = new Map();
    // private _couldnt_send_orders: Map<string, IPlaceStockOrder> = new Map();

    private _open_orders: Map<string, IPlaceStockOrder> = new Map();
    private _completed_orders: Map<string, IPlaceStockOrder> = new Map();
    private _failed_orders: Map<string, IPlaceStockOrder> = new Map();

    private tag: string;

    initialise = (): void => {
        OrderUpdates.getInstance().subscribe({ observer: this });
        Logger.info({
            message: `order manager is ready`,
            className: this.constructor.name,
        });
    };

    setTag = ({ tag }: { tag: string }) => {
        this.tag = tag;
    };

    onOrderUpdate(_subject: OrderUpdateSender, order: ZOrderTick): void {
        if (order.tag !== this.tag) {
            return;
        }

        Logger.info({
            message: `received order updates`,
            className: this.constructor.name,
            data: order,
        });

        switch (order.status) {
            case 'OPEN': {
                const sentOrder = this._sent_orders.get(order.order_id);
                this._open_orders.set(order.order_id, sentOrder);
                break;
            }

            // coming from open or directly completed
            case 'COMPLETE': {
                // coming from open
                if (this._open_orders.get(order.order_id)) {
                    this._open_orders.delete(order.order_id);
                }

                const completedOrder = this._sent_orders.get(order.order_id);

                this._completed_orders.set(order.order_id, completedOrder);
                this.emit(OrderManager.EVENT.executed, completedOrder);
                break;
            }

            default: {
                if (this._open_orders.get(order.order_id)) {
                    this._open_orders.delete(order.order_id);
                }

                const failedOrder = this._sent_orders.get(order.order_id);
                this._failed_orders.set(order.order_id, failedOrder);
                this.emit(OrderManager.EVENT.failed, failedOrder);
                Logger.error({
                    message: `order update, status: ${order.status}`,
                    className: this.constructor.name,
                });
            }
        }
    }

    sendOrders = async ({ orders }: { orders: Array<IPlaceStockOrder> }): Promise<void> => {
        this._all_orders = orders;
        return this.beginOrderExecution();
    };

    beginOrderExecution = async (): Promise<void> => {
        this.emit(OrderManager.EVENT.OMStarted);
        for (let index = 0; index < this._all_orders.length; index++) {
            const order = this._all_orders[index];
            if (order._function === 'DAY_STOCK') {
                const [success, error] = await Kite.getInstance().placeStockOrder({
                    tradingsymbol: order.tradingsymbol,
                    transaction_type: order.transaction_type,
                    tag: order.tag,
                    quantity: order.quantity,
                    price: order.price,
                });

                if (error) {
                    this.emit(OrderManager.EVENT.failed);

                    Logger.error({
                        message: `couldn't place the order!`,
                        className: this.constructor.name,
                        data: error,
                    });
                } else {
                    this.emit(OrderManager.EVENT.placed);
                    Logger.success({
                        message: `order placed!`,
                        className: this.constructor.name,
                        data: success,
                    });
                    this._sent_orders.set(success.order_id, order);
                }
            }
        }
    };

    reset = (): void => {
        this._all_orders = [];
        this._sent_orders.clear();
        this._open_orders.clear();
        this._completed_orders.clear();
        this._failed_orders.clear();
    };

    // remove this **********************************
    dumy = (): void => {
        console.log(this.PENDING_TIMEOUT_MS);
        console.log(this.PENDING_MAX_DEVIATION);
        console.log(this.MAX_RETRY_ATTEMPTS);
        console.log(this.PENDING_MODIFY_INTERVAL_MS);
        console.log(this._all_orders);
        console.log(this._completed_orders);
    };
    // **********************************************
}
