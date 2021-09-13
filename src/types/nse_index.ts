//todo: make comprehensive list
export type EquityTradingSymbolNameType = 'NIFTY BANK';
// {
//     "instrument_token": "260105",
//     "exchange_token": "1016",
//     "tradingsymbol": "NIFTY BANK",
//     "name": "NIFTY BANK",
//     "last_price": 0,
//     "expiry": "",
//     "strike": 0,
//     "tick_size": 0,
//     "lot_size": 0,
//     "instrument_type": "EQ",
//     "segment": "INDICES",
//     "exchange": "NSE"
//   },

// {
//     "instrument_token": "60417",
//     "exchange_token": "236",
//     "tradingsymbol": "ASIANPAINT",
//     "name": "ASIAN PAINTS",
//     "last_price": 0,
//     "expiry": "",
//     "strike": 0,
//     "tick_size": 0.05,
//     "lot_size": 1,
//     "instrument_type": "EQ",
//     "segment": "NSE",
//     "exchange": "NSE"
//   },

// different for Indices, same as equity trading symbol name for others,
// thats why we need a new type
//todo: make comprehensive list
export type OptionsTradingSymbolNameType = 'BANKNIFTY';
export type FuturesTradingSymbolNameType = 'BANKNIFTY';
export type DerivativeTradingSymbolNameType = OptionsTradingSymbolNameType | FuturesTradingSymbolNameType;
export type TradingSymbolNameType = DerivativeTradingSymbolNameType | EquityTradingSymbolNameType;

// {
//     "instrument_token": "9375234",
//     "exchange_token": "36622",
//     "tradingsymbol": "BANKNIFTY21SEP18000PE",
//     "name": "BANKNIFTY",
//     "last_price": 0,
//     "expiry": "2021-09-30T00:00:00.000Z",
//     "strike": 18000,
//     "tick_size": 0.05,
//     "lot_size": 25,
//     "instrument_type": "PE",
//     "segment": "NFO-OPT",
//     "exchange": "NFO"
//   }

// {
//     "instrument_token": "16168450",
//     "exchange_token": "63158",
//     "tradingsymbol": "ASIANPAINT21SEP2150CE",
//     "name": "ASIANPAINT",
//     "last_price": 0,
//     "expiry": "2021-09-30T00:00:00.000Z",
//     "strike": 2150,
//     "tick_size": 0.05,
//     "lot_size": 300,
//     "instrument_type": "CE",
//     "segment": "NFO-OPT",
//     "exchange": "NFO"
//   },
