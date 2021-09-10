/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { KiteTicker } from 'kiteconnect';

// connect -  when connection is successfully established.
// ticks - when ticks are available (Arrays of `ticks` object as the first argument).
// disconnect - when socket connection is disconnected. Error is received as a first param.
// error - when socket connection is closed with error. Error is received as a first param.
// close - when socket connection is closed cleanly.
// reconnect - When reconnecting (current re-connection count and reconnect interval as arguments respectively).
// noreconnect - When re-connection fails after n number times.
// order_update - When order update (postback) is received for the connected user (Data object is received as first argument).

export class BaseTicker {
    static _instance: BaseTicker;
    private _ticker: KiteTicker;
    private _tokens: Array<number> = [];

    init = ({ api_key, access_token }: { api_key: string; access_token: string }): void => {
        this._ticker = new KiteTicker({
            api_key: api_key,
            access_token: access_token,
        });
    };

    onError(onError: (error: any) => void): void {
        this._ticker.on('error', onError);
    }

    onReconnect(onReconnect: () => void): void {
        this._ticker.on('reconnect', onReconnect);
    }

    onNoReconnect(onNoReconnect: () => void): void {
        this._ticker.on('noreconnect', onNoReconnect);
    }

    onOrderUpdate(onOrderUpdate: (update: any) => void): void {
        this._ticker.on('order_update', onOrderUpdate);
        console.log(`log: [base ticker] order ticker registered`);
    }

    onTicks(onTicks: (ticks: any) => void): void {
        this._ticker.on('ticks', onTicks);
        console.log(`log: [base ticker] price ticker registered`);
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

    subscribe(tickerId: number): void {
        const index = this._tokens.indexOf(tickerId);
        if (index !== -1) {
            this._tokens.push(tickerId);
            this._ticker.subscribe(this._tokens);
            this.setMode(this._ticker.modeFull, this._tokens);
        }
    }

    setMode(mode = this._ticker.modeFull, tokens: Array<number>) {
        this._ticker.setMode(mode, tokens);
    }

    unsubscribe(tickerId: number): void {
        this._tokens = this._tokens.filter(el => ![tickerId].includes(el));
        this._ticker.unsubscribe([tickerId]);
    }

    static getInstance(): BaseTicker {
        if (!BaseTicker._instance) {
            BaseTicker._instance = new BaseTicker();
        }
        return BaseTicker._instance;
    }
}
