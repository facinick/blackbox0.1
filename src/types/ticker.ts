// ***********************************************************************************
// ********************************** PRICE UPDATES **********************************
// ***********************************************************************************

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

export type ZOrderTicks = Array<ZOrderTick>;

export interface ZOrderTick {
    order_id: string;
    exchange_order_id: string;
    placed_by: string;
    status: string;
    status_message: string;
    tradingsymbol: string;
    exchange: string;
    order_type: string;
    transaction_type: string;
    validity: string;
    product: string;
    average_price: number;
    price: number;
    quantity: number;
    filled_quantity: number;
    unfilled_quantity: number;
    trigger_price: number;
    user_id: string;
    order_timestamp: string;
    exchange_timestamp: string;
    checksum: string;
}
