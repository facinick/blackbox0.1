// ***********************************************************************************
// ********************************** PRICE UPDATES **********************************
// ***********************************************************************************

import { TradingSymbolType } from './instrument';
import { OrderStatusType, VarietyType, ExchangeType, TransactionType, ValidityType, ProductType } from './zerodha';

export type ZTicks = Array<ZTick>;
export interface ZTick {
    instrument_token: number;
    mode: string;
    volume: number;
    last_price: number;
    average_price: number;
    last_quantity: number;
    buy_quantity: number;
    sell_quantity: number;
    change: number;
    last_trade_time: Date;
    timestamp: Date;
    oi: number;
    oi_day_low: number;
    oi_day_high: number;
    ohlc: Ohlc;
    tradable: boolean;
    depth: Depth;
}

export interface Depth {
    sell: Buy[];
    buy: Buy[];
}

export interface Buy {
    price: number;
    orders: number;
    quantity: number;
}

export interface Ohlc {
    high: number;
    close: number;
    open: number;
    low: number;
}
// ***********************************************************************************
// ********************************** ORDER UPDATES **********************************
// ***********************************************************************************

export interface ZOrderTick {
    account_id: string; // 'WY4269
    unfilled_quantity: number;
    checksum: string;
    placed_by: string; // 'WY4269
    order_id: string; //'210922201988662'
    exchange_order_id: string;
    parent_order_id: string | null;
    status: OrderStatusType;
    status_message: string | null;
    status_message_raw: string | null;
    order_timestamp: string; // '2021-09-22 12:05:32',
    exchange_update_timestamp: string; // '2021-09-22 12:05:32',
    exchange_timestamp: string; // '2021-09-22 12:05:32',
    variety: VarietyType;
    exchange: ExchangeType;
    tradingsymbol: TradingSymbolType;
    instrument_token: number;
    order_type: OrderStatusType;
    transaction_type: TransactionType;
    validity: ValidityType;
    product: ProductType;
    quantity: number;
    disclosed_quantity: number;
    price: number;
    trigger_price: number;
    average_price: number;
    filled_quantity: number;
    pending_quantity: number;
    cancelled_quantity: number;
    market_protection: number;
    meta: Record<any, any>;
    tag: string; // 'piggy'
    tags: Array<string>; //['piggy']
    guid: string; //'24487Xxw3PxjgZW7dP'
}
