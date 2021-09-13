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

export interface IPositionGreeks {
    delta: number;
}

// [
//     {
//       "tradingsymbol": "NIFTY2191617500CE",
//       "exchange": "NFO",
//       "instrument_token": 9671682,
//       "product": "NRML",
//       "quantity": -200,
//       "overnight_quantity": -200,
//       "multiplier": 1,
//       "average_price": 39.475,
//       "close_price": 42.85,
//       "last_price": 23.35,
//       "value": 7895,
//       "pnl": 3225,
//       "m2m": 3900,
//       "unrealised": 3225,
//       "realised": 0,
//       "buy_quantity": 0,
//       "buy_price": 0,
//       "buy_value": 0,
//       "buy_m2m": 0,
//       "sell_quantity": 200,
//       "sell_price": 39.475,
//       "sell_value": 7895,
//       "sell_m2m": 8570,
//       "day_buy_quantity": 0,
//       "day_buy_price": 0,
//       "day_buy_value": 0,
//       "day_sell_quantity": 0,
//       "day_sell_price": 0,
//       "day_sell_value": 0
//     },
//     {
//       "tradingsymbol": "NIFTY2191617550CE",
//       "exchange": "NFO",
//       "instrument_token": 9672706,
//       "product": "NRML",
//       "quantity": -250,
//       "overnight_quantity": -250,
//       "multiplier": 1,
//       "average_price": 28.7,
//       "close_price": 29.1,
//       "last_price": 14.9,
//       "value": 7175,
//       "pnl": 3450,
//       "m2m": 3550,
//       "unrealised": 3450,
//       "realised": 0,
//       "buy_quantity": 0,
//       "buy_price": 0,
//       "buy_value": 0,
//       "buy_m2m": 0,
//       "sell_quantity": 250,
//       "sell_price": 28.7,
//       "sell_value": 7175,
//       "sell_m2m": 7275,
//       "day_buy_quantity": 0,
//       "day_buy_price": 0,
//       "day_buy_value": 0,
//       "day_sell_quantity": 0,
//       "day_sell_price": 0,
//       "day_sell_value": 0
//     },
//     {
//       "tradingsymbol": "NIFTY2191617600CE",
//       "exchange": "NFO",
//       "instrument_token": 9673218,
//       "product": "NRML",
//       "quantity": -300,
//       "overnight_quantity": -300,
//       "multiplier": 1,
//       "average_price": 20.6,
//       "close_price": 20.2,
//       "last_price": 9.65,
//       "value": 6180,
//       "pnl": 3285,
//       "m2m": 3165,
//       "unrealised": 3285,
//       "realised": 0,
//       "buy_quantity": 0,
//       "buy_price": 0,
//       "buy_value": 0,
//       "buy_m2m": 0,
//       "sell_quantity": 300,
//       "sell_price": 20.6,
//       "sell_value": 6180,
//       "sell_m2m": 6060,
//       "day_buy_quantity": 0,
//       "day_buy_price": 0,
//       "day_buy_value": 0,
//       "day_sell_quantity": 0,
//       "day_sell_price": 0,
//       "day_sell_value": 0
//     },
//     {
//       "tradingsymbol": "NIFTY2191617650CE",
//       "exchange": "NFO",
//       "instrument_token": 9673730,
//       "product": "NRML",
//       "quantity": -350,
//       "overnight_quantity": -350,
//       "multiplier": 1,
//       "average_price": 15.2,
//       "close_price": 13.05,
//       "last_price": 6.3,
//       "value": 5320,
//       "pnl": 3115,
//       "m2m": 2362.5,
//       "unrealised": 3115,
//       "realised": 0,
//       "buy_quantity": 0,
//       "buy_price": 0,
//       "buy_value": 0,
//       "buy_m2m": 0,
//       "sell_quantity": 350,
//       "sell_price": 15.2,
//       "sell_value": 5320,
//       "sell_m2m": 4567.5,
//       "day_buy_quantity": 0,
//       "day_buy_price": 0,
//       "day_buy_value": 0,
//       "day_sell_quantity": 0,
//       "day_sell_price": 0,
//       "day_sell_value": 0
//     },
//     {
//       "tradingsymbol": "NIFTY2191617700CE",
//       "exchange": "NFO",
//       "instrument_token": 10216706,
//       "product": "NRML",
//       "quantity": -400,
//       "overnight_quantity": -400,
//       "multiplier": 1,
//       "average_price": 11.7,
//       "close_price": 8.9,
//       "last_price": 4.4,
//       "value": 4680,
//       "pnl": 2920,
//       "m2m": 1799.9999999999998,
//       "unrealised": 2920,
//       "realised": 0,
//       "buy_quantity": 0,
//       "buy_price": 0,
//       "buy_value": 0,
//       "buy_m2m": 0,
//       "sell_quantity": 400,
//       "sell_price": 11.7,
//       "sell_value": 4680,
//       "sell_m2m": 3560,
//       "day_buy_quantity": 0,
//       "day_buy_price": 0,
//       "day_buy_value": 0,
//       "day_sell_quantity": 0,
//       "day_sell_price": 0,
//       "day_sell_value": 0
//     },
//     {
//       "tradingsymbol": "NIFTY2191617750CE",
//       "exchange": "NFO",
//       "instrument_token": 10217218,
//       "product": "NRML",
//       "quantity": 1250,
//       "overnight_quantity": 1250,
//       "multiplier": 1,
//       "average_price": 7.146,
//       "close_price": 6.3,
//       "last_price": 3.4,
//       "value": -8932.5,
//       "pnl": -4682.5,
//       "m2m": -3625,
//       "unrealised": -4682.5,
//       "realised": 0,
//       "buy_quantity": 1250,
//       "buy_price": 7.146,
//       "buy_value": 8932.5,
//       "buy_m2m": 7875,
//       "sell_quantity": 0,
//       "sell_price": 0,
//       "sell_value": 0,
//       "sell_m2m": 0,
//       "day_buy_quantity": 0,
//       "day_buy_price": 0,
//       "day_buy_value": 0,
//       "day_sell_quantity": 0,
//       "day_sell_price": 0,
//       "day_sell_value": 0
//     },
//     {
//       "tradingsymbol": "NIFTY21SEPFUT",
//       "exchange": "NFO",
//       "instrument_token": 12477442,
//       "product": "NRML",
//       "quantity": 0,
//       "overnight_quantity": 150,
//       "multiplier": 1,
//       "average_price": 0,
//       "close_price": 17364.3,
//       "last_price": 17324.8,
//       "value": -13332.5,
//       "pnl": -13332.5,
//       "m2m": -3635,
//       "unrealised": -13332.5,
//       "realised": 0,
//       "buy_quantity": 150,
//       "buy_price": 17428.95,
//       "buy_value": 2614342.5,
//       "buy_m2m": 2604645,
//       "sell_quantity": 150,
//       "sell_price": 17340.066666666666,
//       "sell_value": 2601010,
//       "sell_m2m": 2601010,
//       "day_buy_quantity": 0,
//       "day_buy_price": 0,
//       "day_buy_value": 0,
//       "day_sell_quantity": 150,
//       "day_sell_price": 17340.066666666666,
//       "day_sell_value": 2601010
//     }
//   ]
