/* eslint-disable @typescript-eslint/no-explicit-any */
import { ZTicks } from '../../types/ticker';
import { BaseTicker } from './base_ticker';
import { PriceUpdateReceiver, PriceUpdateSender } from './interface';

export class PriceUpdates implements PriceUpdateSender {
    private _latest_price_update: ZTicks = [];

    // used for virtual subscription
    private price_observers_map: Map<PriceUpdateReceiver, Array<number>> = new Map<
        PriceUpdateReceiver,
        Array<number>
    >();

    // used for subscribing first observer for a ticker id and ubsubscribing last observer for a ticker id
    // undefined, 1, 2, 3, ....., n
    private observers_count_map: Map<number, number> = new Map<number, number>();

    private static _instance: PriceUpdates;

    static getInstance(): PriceUpdates {
        if (!PriceUpdates._instance) {
            PriceUpdates._instance = new PriceUpdates();
        }
        return PriceUpdates._instance;
    }

    init = (): void => {
        if (!BaseTicker.getInstance().connected()) {
            throw new Error('Ticker not connected!');
        }
        BaseTicker.getInstance().onTicks(this.onPriceUpdate);
    };

    subscribe({ observer, ticker_id }: { observer: PriceUpdateReceiver; ticker_id: number }): void {
        let subscriptions_list = this.price_observers_map.get(observer);
        if (subscriptions_list === undefined) {
            // subscribing for the first time
            subscriptions_list = [ticker_id];
        } else if (subscriptions_list.includes(ticker_id)) {
            // existing subscriber, existing ticker, ignore
            return;
        } else {
            // existing subscriber, new ticker
            subscriptions_list.push(ticker_id);
        }

        // safety
        subscriptions_list = Array.from(new Set(subscriptions_list));
        this.price_observers_map.set(observer, subscriptions_list);

        // one observer was added
        const subscribers_count = this.observers_count_map.get(ticker_id);

        if (subscribers_count === undefined) {
            // new ticker
            console.log(`log: [price updates] subscribing to new ticker: ${ticker_id}`);
            this.observers_count_map.set(ticker_id, 1);
            BaseTicker.getInstance().subscribe(ticker_id);
        } else {
            // existing ticker
            // 1, 2, 3, 4, .... n => 2, 3, 4, 5, ... n+1
            this.observers_count_map.set(ticker_id, subscribers_count + 1);
        }

        console.log(`log: [price updates] an observer subscribed to ticker: ${ticker_id}`);
    }

    unsubscribe({ observer, ticker_id }: { observer: PriceUpdateReceiver; ticker_id: number }): void {
        let subscriptions_list = this.price_observers_map.get(observer);
        if (subscriptions_list === undefined) {
            // unsubscribing for the first time, ignore
            return;
        } else if (subscriptions_list.includes(ticker_id)) {
            // existing subscriber, existing ticker, remove
            const index = subscriptions_list.indexOf(ticker_id);
            subscriptions_list.splice(index, 1);
        } else {
            // existing subscriber, new ticker, ignore
            return;
        }

        if (subscriptions_list.length === 0) {
            this.price_observers_map.delete(observer);
        } else {
            subscriptions_list = Array.from(new Set(subscriptions_list));
            this.price_observers_map.set(observer, subscriptions_list);
        }

        // one observer was removed

        const subscribers_count = this.observers_count_map.get(ticker_id);

        if (subscribers_count === undefined) {
            // new ticker
        } else {
            // 1, 2, 3, 4, .... n => undefined, 1, 2, 3, ... n-1
            if (subscribers_count === 1) {
                console.log(`log: [price updates] un subscribing to ticker: ${ticker_id}`);
                BaseTicker.getInstance().unsubscribe(ticker_id);
                this.observers_count_map.delete(ticker_id);
            } else {
                this.observers_count_map.set(ticker_id, subscribers_count - 1);
            }
        }
        console.log(`log: [price updates] an observer unsibscribed to ticker: ${ticker_id}`);
    }

    private onPriceUpdate(data) {
        this._latest_price_update = data;
        this.notifyPriceUpdate();
    }

    public notifyPriceUpdate(): void {
        this.price_observers_map.forEach((ticker_ids: number[], receiver: PriceUpdateReceiver) => {
            const ticks: ZTicks = [];

            this._latest_price_update.forEach(tick => {
                if (ticker_ids.includes(Number(tick.instrument_token))) {
                    ticks.push(tick);
                }
            });

            receiver.onPriceUpdate(this, ticks);
        });
    }
}
