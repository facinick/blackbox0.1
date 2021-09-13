import { ZTick, ZTicks } from './../types/ticker';
import * as fs from 'fs';
import * as path from 'path';
import { TConfig } from '../types/config';
import { OptionsTradingSymbolNameType } from '../types/nse_index';
import { Instrument } from '../types/zerodha';
import { DateType, InstrumentType, MonthType, OptionsTradingSymbolType, StrikeType } from '../types/zerodha';

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

export const generateOptionsTradingSymbol = ({
    equityName,
    strike,
    expiryDate,
    expiryMonth,
    instrumentType,
}: {
    equityName: OptionsTradingSymbolNameType;
    strike: StrikeType;
    expiryDate: DateType;
    expiryMonth: MonthType;
    instrumentType: InstrumentType;
}): OptionsTradingSymbolType => {
    return `${equityName}${expiryDate}${expiryMonth}${strike}${instrumentType}`;
};

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
