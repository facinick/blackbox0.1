import { DateType, MonthNameType, EquitySegmentType, StrikeType } from './zerodha';

//Symbols eq + indices
export type Indices_EquityTradingSymbolType = 'NIFTY BANK' | 'NIFTY 50';
export type Eq_EquityTradingSymbolType = 'HINDUNILVR' | 'ASIANPAINT' | 'ICICIBANK' | 'HDFCBANK';
export type EquityTradingSymbolType = Indices_EquityTradingSymbolType | Eq_EquityTradingSymbolType;

//Names eq + indices
export type Indices_EquityNameType = Indices_EquityTradingSymbolType;
export type Eq_EquityNameType = 'HINDUSTAN UNILEVER.' | 'ASIAN PAINTS.' | 'ICICI BANK.' | 'HDFC BANK';
export type EquityNameType = Indices_EquityNameType | Eq_EquityNameType;

//Names derivative
export type Indices_DerivativeNameType = 'BANKNIFTY' | 'NIFTY';
export type Eq_DerivativeNameType = 'HINDUNILVR' | 'ASIANPAINT' | 'ICICIBANK' | 'HDFCBANK';
export type DerivativeNameType = Indices_DerivativeNameType | Eq_DerivativeNameType;

//Symbol derivative
export type FuturesTradingSymbolType = `${
    | Indices_DerivativeNameType
    | Eq_DerivativeNameType}${DateType}${MonthNameType}${'FUT'}`;
export type OptionsTradingSymbolType = `${
    | Indices_DerivativeNameType
    | Eq_DerivativeNameType}${DateType}${MonthNameType}${StrikeType}${'CE' | 'PE'}`;
export type DerivativeTradingSymbolType = FuturesTradingSymbolType | OptionsTradingSymbolType;

export type TradingSymbolType = EquityTradingSymbolType | DerivativeTradingSymbolType;
export type NameType = EquityNameType | DerivativeNameType;

interface Ul_Der_Map {
    underlying: {
        tradingSymbol: EquityTradingSymbolType;
        name: EquityNameType;
        segment: EquitySegmentType;
    };
    derivative: {
        name: DerivativeNameType;
    };
}

export type Ul_Der_Map_List = Array<Ul_Der_Map>;
