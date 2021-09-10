import { EquityTradingSymbolType } from './nse_eq';

export interface Positions {
    net: [];
    day: [];
}

// for tick updates via websocket
export interface Tick {
    tradable: boolean;
    mode: string;
    instrument_token: number;
    last_price: number;
}

// for order updates via websocket
export interface Order {
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

export type InstrumentType = 'CE' | 'PE' | 'FUT' | 'EQ';

export type SegmentType =
    | 'BCD-OPT'
    | 'BCD-FUT'
    | 'BCD'
    | 'BSE'
    | 'INDICES'
    | 'CDS-OPT'
    | 'CDS-FUT'
    | 'MCX-FUT'
    | 'MCX-OPT'
    // need this
    | 'NFO-OPT'
    | 'NFO-FUT'
    // need this
    | 'NSE';

export type StrikeDistanceType = -4 | -3 | -2 | -1 | 0 | 1 | 2 | -3 | 4;

export type ExchangeType =
    | 'BCD'
    | 'BSE'
    | 'MCX'
    // need this
    | 'NSE'
    | 'CDS'
    // need this
    | 'NFO';

export type MonthType = 'JAN' | 'FEB' | 'MAR' | 'APR' | 'MAY' | 'JUN' | 'JUL' | 'AUG' | 'SEP' | 'OCT' | 'NOV' | 'DEC';

export type MonthIndexType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export type DateType =
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 13
    | 14
    | 15
    | 16
    | 17
    | 18
    | 19
    | 20
    | 21
    | 22
    | 23
    | 24
    | 25
    | 26
    | 27
    | 28
    | 29
    | 30
    | 31;

export type OptionsTradingSymbolType = `${string}${DateType}${MonthType}${StrikeType}${InstrumentType}`;

export type TradingSymbolType = EquityTradingSymbolType | OptionsTradingSymbolType;

export type StrikeType = number;

export type TransactionType = 'BUY' | 'SELL';

export type VarietyType = 'bo' | 'co' | 'amo' | 'regular';

export type ProductType = 'NRML' | 'MIS' | 'CNC';

export type OrderType = 'NRML' | 'SL' | 'SL-M' | 'MARKET' | 'LIMIT';

export type ValidityType = 'DAY' | 'IOC';

export type OrderIDType = string;
export interface Instrument {
    instrument_token: string;
    exchange_token: string;
    tradingsymbol: TradingSymbolType;
    name: string;
    last_price: number;
    expiry: string;
    strike: StrikeType;
    tick_size: number;
    lot_size: number;
    instrument_type: InstrumentType;
    segment: SegmentType;
    exchange: ExchangeType;
}

export interface PlaceOrder {
    variety: VarietyType;
    exchange: ExchangeType;
    tradingsymbol: TradingSymbolType;
    transaction_type: TransactionType;
    quantity: number;
    product: ProductType;
    order_type: OrderType;
    validity?: ValidityType;
    disclosed_quantity?: number;
    trigger_price?: number;
    squareoff?: number;
    stoploss?: number;
    trailing_stoploss?: number;
    price?: number;
    tag: string;
}

export interface PlacedOrder {
    order_id: OrderIDType;
}

export interface CalcelledOrder {
    order_id: OrderIDType;
}

export interface ExitedOrder {
    order_id: OrderIDType;
}
export interface LTPData {
    instrument_token: number;
    timestamp: string;
    last_trade_time: string;
    last_price: number;
    last_quantity: number;
    buy_quantity: number;
    sell_quantity: number;
    volume: number;
    average_price: number;
    oi: number;
    oi_day_high: number;
    oi_day_low: number;
    net_change: number;
    lower_circuit_limit: number;
    upper_circuit_limit: number;
    ohlc: Ohlc;
    depth: Depth;
}

export type Ohlc = {
    open: number;
    high: number;
    low: number;
    close: number;
};

export type Depth = {
    buy: Array<{
        price: number;
        quantity: number;
        orders: number;
    }>;
    sell: Array<{
        price: number;
        quantity: number;
        orders: number;
    }>;
};
