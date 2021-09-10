import { ZTicks, ZOrderTicks } from '../../types/ticker';
export interface PriceUpdateSender {
    // Attach an observer to the subject.
    subscribe({ observer, ticker_id }: { observer: PriceUpdateReceiver; ticker_id: number }): void;
    unsubscribe({ observer, ticker_id }: { observer: PriceUpdateReceiver; ticker_id: number }): void;
    // Notify all observers about an event.
    notifyPriceUpdate(): void;
}

export interface PriceUpdateReceiver {
    // Receive update from subject.
    onPriceUpdate(subject: PriceUpdateSender, ticks: ZTicks): void;
}

export interface OrderUpdateSender {
    // Attach an observer to the subject.
    subscribe({ observer }: { observer: OrderUpdateReceiver }): void;
    unsubscribe({ observer }: { observer: OrderUpdateReceiver }): void;
    // Notify all observers about an event.
    notifyOrderUpdate(): void;
}

export interface OrderUpdateReceiver {
    // Receive update from sender.
    onOrderUpdate(subject: OrderUpdateSender, orders: ZOrderTicks): void;
}
