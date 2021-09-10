import { ZOrderTicks } from '../../types/ticker';
import { BaseTicker } from './base_ticker';
import { OrderUpdateReceiver, OrderUpdateSender } from './interface';

export class OrderUpdates implements OrderUpdateSender {
    private _latest_order_update: any;
    private order_observers: Array<OrderUpdateReceiver> = [];

    private static _instance: OrderUpdates;

    static getInstance(): OrderUpdates {
        if (!OrderUpdates._instance) {
            OrderUpdates._instance = new OrderUpdates();
        }
        return OrderUpdates._instance;
    }

    init = (): void => {
        if (!BaseTicker.getInstance().connected()) {
            throw new Error('Ticker not connected!');
        }
        BaseTicker.getInstance().onOrderUpdate(this.onOrderUpdate);
    };

    subscribe({ observer }: { observer: OrderUpdateReceiver }): void {
        if (this.order_observers.includes(observer)) {
            // already subscribed
            return;
        }

        this.order_observers.push(observer);
        console.log(`log: [order updates] an observer subscribed to order updates`);
    }

    unsubscribe({ observer }: { observer: OrderUpdateReceiver }): void {
        if (!this.order_observers.includes(observer)) {
            // observer never subscribed, ignore
            return;
        }

        const index = this.order_observers.indexOf(observer);
        this.order_observers.splice(index, 1);
        console.log(`log: [order updates] an observer unsubscribed to order updates`);
    }

    private onOrderUpdate(data: ZOrderTicks) {
        this._latest_order_update = data;
        this.notifyOrderUpdate();
    }

    public notifyOrderUpdate(): void {
        console.log(`log: [order updates] notifying observers for order updates...`);
        for (const observer of this.order_observers) {
            observer.onOrderUpdate(this, this._latest_order_update);
        }
    }
}
