import { KiteTicker } from 'kiteconnect';
import { Logger } from '../logger/logger';

// connect -  when connection is successfully established.
// ticks - when ticks are available (Arrays of `ticks` object as the first argument).
// disconnect - when socket connection is disconnected. Error is received as a first param.
// error - when socket connection is closed with error. Error is received as a first param.
// close - when socket connection is closed cleanly.
// reconnect - When reconnecting (current re-connection count and reconnect interval as arguments respectively).
// noreconnect - When re-connection fails after n number times.
// order_update - When order update (postback) is received for the connected user (Data object is received as first argument).

export class BaseTickerV2 {
    static _instance: BaseTickerV2;
    private _ticker: KiteTicker;

    init = ({ api_key, access_token }: { api_key: string; access_token: string }): void => {
        this._ticker = new KiteTicker({
            api_key: api_key,
            access_token: access_token,
        });
    };

    onError(_onError: (error: any) => void): void {
        this._ticker.on('error', error => {
            Logger.error({
                message: `error`,
                className: this.constructor.name,
                data: error,
            });
            _onError(error);
        });
    }

    onReconnect(onReconnect: () => void): void {
        this._ticker.on('reconnect', onReconnect);
    }

    onNoReconnect(onNoReconnect: () => void): void {
        this._ticker.on('noreconnect', onNoReconnect);
    }

    onOrderUpdate(onOrderUpdate: (update: any) => void): void {
        this._ticker.on('order_update', onOrderUpdate);
        Logger.info({
            message: `order ticker registered`,
            className: this.constructor.name,
        });
    }

    onTicks(onTicks: (ticks: any) => void): void {
        this._ticker.on('ticks', onTicks);
        Logger.info({
            message: `price ticker registered`,
            className: this.constructor.name,
        });
    }

    autoReconnect(enable: boolean, max_retry = 50, max_delay = 50) {
        this._ticker.autoReconnect(enable, max_retry, max_delay);
    }

    connected(): boolean {
        return this._ticker.connected();
    }

    disconnect(onDisconnect?: () => void): Promise<void> {
        return new Promise(resolve => {
            this._ticker.on('disconnect', () => {
                onDisconnect?.();
                resolve();
            });
            this._ticker.disconnect();
        });
    }

    connect(onConnect?: () => void): Promise<void> {
        return new Promise(resolve => {
            this._ticker.on('connect', () => {
                onConnect?.();
                resolve();
            });
            this._ticker.connect();
        });
    }

    subscribe(tickerIds: Array<number>): void {
        this._ticker.subscribe(tickerIds);
        this.setMode(this._ticker.modeFull, tickerIds);
    }

    setMode(mode = this._ticker.modeFull, tokens: Array<number>) {
        this._ticker.setMode(mode, tokens);
    }

    unsubscribe(tickerIds: Array<number>): void {
        this._ticker.unsubscribe(tickerIds);
    }

    static getInstance(): BaseTickerV2 {
        if (!BaseTickerV2._instance) {
            BaseTickerV2._instance = new BaseTickerV2();
        }
        return BaseTickerV2._instance;
    }
}
