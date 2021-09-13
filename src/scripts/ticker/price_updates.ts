import { ZTicks } from '../../types/ticker';
import { BaseTickerV2 } from './base_ticker_v2';
import { PriceUpdateReceiver, PriceUpdateSender } from './interface';
import difference from 'lodash.difference';
import union from 'lodash.union';
import intersection from 'lodash.intersection';
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
        if (!BaseTickerV2.getInstance().connected()) {
            throw new Error('Ticker not connected!');
        }
        BaseTickerV2.getInstance().onTicks(this.onPriceUpdate);
    };

    subscribe = ({ observer, ticker_ids }: { observer: PriceUpdateReceiver; ticker_ids: Array<number> }): void => {
        const current_subscriptions = this.price_observers_map.get(observer) || [];
        const possible_new_subscriptions = difference(ticker_ids, current_subscriptions);

        this.price_observers_map.set(observer, union(ticker_ids, current_subscriptions));

        const new_subscriptions = [];

        possible_new_subscriptions.forEach(id => {
            const n_subscribers = this.observers_count_map.get(id);
            if (n_subscribers !== undefined) {
                this.observers_count_map.set(id, n_subscribers + 1);
                console.log(`log: [price updates] subscription added for: `);
                console.log(id);
            } else {
                this.observers_count_map.set(id, 1);
                new_subscriptions.push(id);
                console.log(`log: [price updates] subscription added for: `);
                console.log(id);
            }
        });

        if (new_subscriptions.length > 0) {
            console.log(`log: [price updates] requesting server to subscribe the following new tickers: `);
            console.log(new_subscriptions);
            BaseTickerV2.getInstance().subscribe(new_subscriptions);
        }
    };

    unsubscribe = ({ observer, ticker_ids }: { observer: PriceUpdateReceiver; ticker_ids: Array<number> }): void => {
        const current_subscriptions = this.price_observers_map.get(observer) || [];
        const possible_new_unsubscriptions = intersection(ticker_ids, current_subscriptions);

        const new_current_subscriptions = difference(current_subscriptions, ticker_ids);
        if (new_current_subscriptions.length === 0) {
            this.price_observers_map.delete(observer);
        } else {
            this.price_observers_map.set(observer, new_current_subscriptions);
        }

        const new_unsubscriptions = [];

        possible_new_unsubscriptions.forEach(id => {
            const n_subscribers = this.observers_count_map.get(id);
            if (n_subscribers === 1) {
                this.observers_count_map.delete(id);
                new_unsubscriptions.push(id);
                console.log(`log: [price updates] subscription removed for: `);
                console.log(id);
            } else {
                if (this.observers_count_map === undefined) {
                    // do nothing...
                } else {
                    this.observers_count_map.set(id, n_subscribers - 1);
                    console.log(`log: [price updates] subscription removed for: `);
                    console.log(id);
                }
            }
        });

        if (new_unsubscriptions.length > 0) {
            console.log(`log: [price updates] requesting server to unsubscribe the following new tickers: `);
            console.log(new_unsubscriptions);
            BaseTickerV2.getInstance().unsubscribe(new_unsubscriptions);
        }
    };

    private onPriceUpdate = (data: ZTicks): void => {
        this._latest_price_update = data;
        this.notifyPriceUpdate();
    };

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
