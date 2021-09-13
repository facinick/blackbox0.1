import { FuturesTradingSymbolNameType, OptionsTradingSymbolNameType } from './../types/nse_index';
import { InstrumentStore } from './../scripts/zerodha/instrumentStore';
import { DerivativeTradingSymbolType, YearType, MonthIndexType, DateType } from './../types/zerodha';
import { ZTick, ZTicks } from './../types/ticker';
import * as fs from 'fs';
import * as path from 'path';
import { TConfig } from '../types/config';
import { DerivativeType, Instrument } from '../types/zerodha';
import { InstrumentType, MonthNameType, StrikeType } from '../types/zerodha';
import { getMonthFromIndex } from './dateTime';
import { ZPosition } from '../types/positions';

export const success = ({ message }: { message: string }): { message: string } => {
    return { message };
};

export const saveZerodhaConfigLocal = async (config: TConfig) => {
    await fs.writeFileSync(path.resolve(__dirname, '../private/zerodha.json'), JSON.stringify(config, null, 2));
};

export const saveZerodhaInstrumentsLocal = async (instruments: Array<Instrument>) => {
    await fs.writeFileSync(path.resolve(__dirname, '../data/instruments.json'), JSON.stringify(instruments, null, 2));
};

export function comparer<Type>(otherArray: Array<Type>): (current: Type & { instrument_token: number }) => boolean {
    return function (current) {
        return (
            otherArray.filter(function (other: Type & { instrument_token: number }) {
                return other.instrument_token == current.instrument_token;
            }).length == 0
        );
    };
}

export const getDaysToExpiry = ({ expiryString }: { expiryString: string }): number => {
    try {
        const expiry = new Date(expiryString);
        const today = new Date();

        let days: number = expiry.getTime() - today.getTime();
        if (days < 0) {
            days = 0;
        }

        return Math.ceil(days / (1000 * 60 * 60 * 24));
    } catch (error) {
        console.log(
            `log: [error] [getDaysToExpiry] something bad happened trying to get expiry days for ${expiryString}, using -1`,
        );
        console.log(error);
        return 0;
    }
};

// no equity data for now
export const getDerivativeDataFromTradingsymbol = ({
    tradingSymbol,
    data,
}: {
    tradingSymbol: DerivativeTradingSymbolType;
    data: {
        symbolName?: boolean;
        expiry?: boolean;
        strike?: boolean;
        instrument?: boolean;
        lotSize?: boolean;
        tickSize?: boolean;
        instrumentToken?: boolean;
    };
}): Partial<{
    symbolName: FuturesTradingSymbolNameType | OptionsTradingSymbolNameType;
    expiry: {
        day: DateType;
        month: MonthNameType;
        year: YearType;
        string: string;
    };
    strike: StrikeType;
    instrument: InstrumentType;
    lotSize: number;
    tickSize: number;
    instrumentToken: string;
}> => {
    // console.log(`request for ${tradingSymbol}`);

    const instrumentStore = InstrumentStore.getInstance();
    // NIFTY21SEPFUT
    if (tradingSymbol.endsWith('FUT')) {
        // {
        //     "instrument_token": "10217218",
        //     "exchange_token": "39911",
        //     "tradingsymbol": "NIFTY2191617750CE",
        //     "name": "NIFTY",
        //     "last_price": 0,
        //     "expiry": "2021-09-16T00:00:00.000Z",
        //     "strike": 17750,
        //     "tick_size": 0.05,
        //     "lot_size": 50,
        //     "instrument_type": "CE",
        //     "segment": "NFO-OPT",
        //     "exchange": "NFO"
        //   },
        const result = instrumentStore.getLocalInstrumentsWithFilter({
            exchange: 'NFO',
            segment: 'NFO-FUT',
            tradingSymbol: tradingSymbol,
        });

        if (result?.[0]) {
            const future = result?.[0];
            const date = new Date(future.expiry);
            return {
                ...(data.symbolName && {
                    symbolName: future.name as FuturesTradingSymbolNameType | OptionsTradingSymbolNameType,
                }),
                ...(data.expiry && {
                    expiry: {
                        day: date.getDate() as DateType,
                        month: getMonthFromIndex({ index: date.getMonth() as MonthIndexType }),
                        year: date.getFullYear() as YearType,
                        string: future.expiry,
                    },
                }),
                ...(data.lotSize && { lotSize: future.lot_size }),
                ...(data.tickSize && { lotSize: future.tick_size }),
                ...(data.instrument && { instrument: 'FUT' }),
                ...(data.instrumentToken && { instrumentToken: future.instrument_token }),
            };
        } else {
            return null;
        }
    }

    // NIFTY2191617750CE
    else if (tradingSymbol.endsWith('CE')) {
        const result = instrumentStore.getLocalInstrumentsWithFilter({
            exchange: 'NFO',
            segment: 'NFO-OPT',
            tradingSymbol: tradingSymbol,
        });

        if (result?.[0]) {
            const future = result?.[0];
            const date = new Date(future.expiry);
            return {
                ...(data.symbolName && {
                    symbolName: future.name as FuturesTradingSymbolNameType | OptionsTradingSymbolNameType,
                }),
                ...(data.expiry && {
                    expiry: {
                        day: date.getDate() as DateType,
                        month: getMonthFromIndex({ index: date.getMonth() as MonthIndexType }),
                        year: date.getFullYear() as YearType,
                        string: future.expiry,
                    },
                }),
                ...(data.strike && { strike: future.strike }),
                ...(data.lotSize && { lotSize: future.lot_size }),
                ...(data.tickSize && { lotSize: future.tick_size }),
                ...(data.instrument && { instrument: 'CE' }),
                ...(data.instrumentToken && { instrumentToken: future.instrument_token }),
            };
        } else {
            return null;
        }
    }
    // NIFTY2191617750CE
    else if (tradingSymbol.endsWith('PE')) {
        const result = instrumentStore.getLocalInstrumentsWithFilter({
            exchange: 'NFO',
            segment: 'NFO-OPT',
            tradingSymbol: tradingSymbol,
        });

        if (result?.[0]) {
            const future = result?.[0];
            const date = new Date(future.expiry);
            return {
                ...(data.symbolName && {
                    symbolName: future.name as FuturesTradingSymbolNameType | OptionsTradingSymbolNameType,
                }),
                ...(data.expiry && {
                    expiry: {
                        day: date.getDate() as DateType,
                        month: getMonthFromIndex({ index: date.getMonth() as MonthIndexType }),
                        year: date.getFullYear() as YearType,
                        string: future.expiry,
                    },
                }),
                ...(data.strike && { strike: future.strike }),
                ...(data.lotSize && { lotSize: future.lot_size }),
                ...(data.tickSize && { lotSize: future.tick_size }),
                ...(data.instrument && { instrument: 'PE' }),
                ...(data.instrumentToken && { instrumentToken: future.instrument_token }),
            };
        } else {
            return null;
        }
    } else {
        return null;
    }
};

// export const generateOptionsTradingSymbol = ({
//     equityName,
//     strike,
//     expiryDate,
//     expiryMonth,
//     instrumentType,
// }: {
//     equityName: OptionsTradingSymbolNameType;
//     strike: StrikeType;
//     expiryDate: DateType;
//     expiryMonth: MonthNameType;
//     instrumentType: InstrumentType;
// }): OptionsTradingSymbolType => {
//     return `${equityName}${expiryDate}${expiryMonth}${strike}${instrumentType}`;
// };

export const getATMStrike = ({ price, step }: { price: number; step: number }): StrikeType =>
    Math.ceil(price / step) * step;

export const isAWithinRangeOfB = ({
    a,
    b,
    inclusive = true,
    radius,
}: {
    a: number;
    b: number;
    inclusive: boolean;
    radius: number;
}): boolean => {
    const leftLimit = b - radius;
    const rightLimit = b + radius;

    if (a >= leftLimit && a <= rightLimit && inclusive) {
        return true;
    }

    if (a > leftLimit && a < rightLimit && !inclusive) {
        return true;
    }

    return false;
};

export const getTickByInstrumentToken = ({
    instrument_token,
    ticks,
}: {
    instrument_token: number;
    ticks: ZTicks;
}): ZTick => {
    const tick = ticks.filter(tick => tick.instrument_token === instrument_token);
    return tick[0];
};

export function arrayUnique<Type>(array: Array<Type>): Array<Type> {
    const a = array.concat();

    for (let i = 0; i < a.length; ++i) {
        for (let j = i + 1; j < a.length; ++j) {
            if (a[i] === a[j]) a.splice(j--, 1);
        }
    }

    return a;
}

export function mergeArraysUnique<Type>({ array1, array2 }: { array1: Array<Type>; array2: Array<Type> }): Array<Type> {
    const a = array1.concat();

    for (let i = 0; i < a.length; ++i) {
        for (let j = i + 1; j < a.length; ++j) {
            if (a[i] === a[j]) a.splice(j--, 1);
        }
    }

    const b = array2.concat();

    for (let i = 0; i < b.length; ++i) {
        for (let j = i + 1; j < b.length; ++j) {
            if (b[i] === b[j]) b.splice(j--, 1);
        }
    }

    return a.concat(b);
}

export const getDerivativeType = ({ position }: { position: ZPosition }): DerivativeType => {
    if (position.tradingsymbol.endsWith('CE') || position.tradingsymbol.endsWith('PE')) {
        return 'OPTIONS';
    } else if (position.tradingsymbol.endsWith('FUT')) {
        return 'FUTURES';
    } else {
        throw new Error('Not an option instrument');
    }
};
