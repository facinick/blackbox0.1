import * as fs from 'fs';
import * as path from 'path';
import { TConfig } from '../types/config';
import { EquityTradingSymbolType } from '../types/nse_eq';
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

export const generateOptionsTradingSymbol = ({
    equityName,
    strike,
    expiryDate,
    expiryMonth,
    instrumentType,
}: {
    equityName: EquityTradingSymbolType;
    strike: StrikeType;
    expiryDate: DateType;
    expiryMonth: MonthType;
    instrumentType: InstrumentType;
}): OptionsTradingSymbolType => {
    return `${equityName as string}${expiryDate}${expiryMonth}${strike}${instrumentType}`;
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
