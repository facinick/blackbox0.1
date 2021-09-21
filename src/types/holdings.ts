import { Eq_EquityTradingSymbolType } from './instrument';
import { ExchangeType, ProductType } from './zerodha';

export type ZHoldings = Array<ZHolding>;

export interface ZHolding {
    authorised_date: string;
    authorised_quantity: number;
    average_price: number;
    close_price: number;
    collateral_quantity: number;
    collateral_type: string;
    day_change: number;
    day_change_percentage: number;
    discrepancy: boolean;
    exchange: ExchangeType;
    instrument_token: string;
    isin: string;
    last_price: number;
    opening_quantity: number;
    pnl: number;
    price: number;
    product: ProductType;
    quantity: number;
    realised_quantity: number;
    t1_quantity: number;
    tradingsymbol: Eq_EquityTradingSymbolType;
    used_quantity: number;
}

// [{"authorised_date": "2021-09-17 00:00:00",
//   "authorised_quantity": 0,
//   "average_price": 3308.05,
//   "close_price": 3342.1,
//   "collateral_quantity": 0,
//   "collateral_type": "",
//   "day_change": -39.04999999999973,
//   "day_change_percentage": -1.1684270368929632,
//   "discrepancy": false,
//   "exchange": "NSE",
//   "instrument_token": 60417,
//   "isin": "INE021A01026",
//   "last_price": 3303.05,
//   "opening_quantity": 1,
//   "pnl": -5,
//   "price": 0,
//   "product": "CNC",
//   "quantity": 1,
//   "realised_quantity": 1,
//   "t1_quantity": 0,
//   "tradingsymbol": "ASIANPAINT",
//   "used_quantity": 0},
//  {"authorised_date": "2021-09-17 00:00:00",
//   "authorised_quantity": 0,
//   "average_price": 1542,
//   "close_price": 1559.95,
//   "collateral_quantity": 0,
//   "collateral_type": "",
//   "day_change": 22.200000000000045,
//   "day_change_percentage": 1.4231225359787203,
//   "discrepancy": false,
//   "exchange": "NSE",
//   "instrument_token": 341249,
//   "isin": "INE040A01034",
//   "last_price": 1582.15,
//   "opening_quantity": 3,
//   "pnl": 120.45000000000027,
//   "price": 0,
//   "product": "CNC",
//   "quantity": 0,
//   "realised_quantity": 0,
//   "t1_quantity": 3,
//   "tradingsymbol": "HDFCBANK",
//   "used_quantity": 0},
//  {"authorised_date": "2021-09-17 00:00:00",
//   "authorised_quantity": 0,
//   "average_price": 718.95,
//   "close_price": 727.2,
//   "collateral_quantity": 0,
//   "collateral_type": "",
//   "day_change": -7.050000000000068,
//   "day_change_percentage": -0.9694719471947287,
//   "discrepancy": false,
//   "exchange": "NSE",
//   "instrument_token": 1270529,
//   "isin": "INE090A01021",
//   "last_price": 720.15,
//   "opening_quantity": 3,
//   "pnl": 3.5999999999997954,
//   "price": 0,
//   "product": "CNC",
//   "quantity": 3,
//   "realised_quantity": 3,
//   "t1_quantity": 0,
//   "tradingsymbol": "ICICIBANK",
//   "used_quantity": 0}]
