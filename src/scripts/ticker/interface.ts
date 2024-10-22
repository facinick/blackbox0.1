import { ZTicks, ZOrderTick } from '../../types/ticker';
export interface PriceUpdateSender {
    // Attach an observer to the subject.
    subscribe({ observer, ticker_ids }: { observer: PriceUpdateReceiver; ticker_ids: Array<number> }): void;
    unsubscribe({ observer, ticker_ids }: { observer: PriceUpdateReceiver; ticker_ids: Array<number> }): void;
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
    onOrderUpdate(subject: OrderUpdateSender, order: ZOrderTick): void;
}
