export interface ZDayNetPositions {
    day: ZPositions;
    net: ZPositions;
}

export type ZPositions = Array<ZPosition>;

export interface ZPosition {
    average_price: number;
    buy_m2m: number;
    buy_price: number;
    buy_quantity: number;
    buy_value: number;
    close_price: number;
    day_buy_price: number;
    day_buy_quantity: number;
    day_buy_value: number;
    day_sell_price: number;
    day_sell_quantity: number;
    day_sell_value: number;
    exchange: string;
    instrument_token: number;
    last_price: number;
    m2m: number;
    multiplier: number;
    overnight_quantity: number;
    pnl: number;
    product: string;
    quantity: number;
    realised: number;
    sell_m2m: number;
    sell_price: number;
    sell_quantity: number;
    sell_value: number;
    tradingsymbol: string;
    unrealised: number;
    value: number;
}
