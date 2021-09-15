import { TradingSymbolType } from './instrument';

export type DerivativeType = 'FUTURES' | 'OPTIONS';

export type InstrumentType = 'CE' | 'PE' | 'FUT' | 'EQ';

export type DerivativeSegmentType = 'NFO-OPT' | 'NFO-FUT';
export type Eq_EquitySegmentType = 'NSE';
export type Index_EquitySegmentType = 'INDICES';
export type EquitySegmentType = Eq_EquitySegmentType | Index_EquitySegmentType;
export type SegmentType =
    | 'BCD-OPT'
    | 'BCD-FUT'
    | 'BCD'
    | 'BSE'
    | 'CDS-OPT'
    | 'CDS-FUT'
    | 'MCX-FUT'
    | 'MCX-OPT'
    | DerivativeSegmentType
    | Eq_EquitySegmentType
    | Index_EquitySegmentType;

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

export type MonthNameType =
    | 'JAN'
    | 'FEB'
    | 'MAR'
    | 'APR'
    | 'MAY'
    | 'JUN'
    | 'JUL'
    | 'AUG'
    | 'SEP'
    | 'OCT'
    | 'NOV'
    | 'DEC';

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

export type YearType = 2021 | 2022;

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

// ***************************************************************
// ************************* ZERODHA API *************************
// ***************************************************************

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
