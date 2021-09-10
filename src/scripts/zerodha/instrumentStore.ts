import { EquityTradingSymbolType } from '../../types/nse_eq';
import localInstruments from '../../data/instruments.json';
import { getMonthFromIndex } from '../../utils/dateTime';
import {
    ExchangeType,
    Instrument,
    InstrumentType,
    SegmentType,
    StrikeType,
    MonthIndexType,
    StrikeDistanceType,
    TradingSymbolType,
} from '../../types/zerodha';
import { Success } from '../../utils/Logger';
import { MonthType } from '../../types/zerodha';
import { saveZerodhaInstrumentsLocal } from '../../utils/helper';
import { Kite } from './kite';

export class InstrumentStore {
    private static instance: InstrumentStore;
    private instruments: Array<Instrument> = [];

    public static getInstance = (): InstrumentStore => {
        if (!InstrumentStore.instance) {
            InstrumentStore.instance = new InstrumentStore();
        }

        return InstrumentStore.instance;
    };

    loadInstruments = async ({ from_server }: { from_server: boolean }) => {
        if (from_server) {
            return this.fetchInstrumentsFromServer();
        }

        try {
            console.log(`trying to load instruments from local...`);
            this.instruments = localInstruments as Array<Instrument>;
            //   if array is null
            //   if array is empty
            //   if array has first object empty
            if (!this.instruments || this.instruments.length === 0 || !this.instruments[0]) {
                console.log(`local instruments list have some issue...`);
                throw new Error('');
            }

            Success({
                title: 'Loaded Instruments Local',
                data: `count: ${this.instruments.length}`,
            });
        } catch (e) {
            console.log(`couldn't load local instruments... fetching from the server...`);

            return this.fetchInstrumentsFromServer();
        }
    };

    fetchInstrumentsFromServer = async () => {
        const [instruments, error] = await Kite.getInstance().getInstruments();
        if (!error && instruments) {
            this.instruments = instruments;
            saveZerodhaInstrumentsLocal(this.instruments);
            console.log(`instruments fetched`);
        } else {
            console.log(`couldn't fetch instruments from the server... :( need manual intervention`);
        }
    };

    getInstruments = ({
        exchange,
        segment,
        instrumentType,
        instrumentTradingSymbol,
        strike,
        instrumentToken,
    }: {
        exchange?: ExchangeType;
        segment?: SegmentType;
        instrumentType?: InstrumentType;
        instrumentTradingSymbol?: TradingSymbolType;
        strike?: StrikeType;
        instrumentToken?: string;
    }): Array<Instrument> => {
        return this.instruments.filter(instrument => {
            let select = true;

            if (exchange) {
                select = select && instrument.exchange == exchange;
            }

            if (segment) {
                select = select && instrument.segment == segment;
            }

            if (instrumentToken) {
                select = select && instrument.instrument_token == instrumentToken;
            }

            if (instrumentType) {
                select = select && instrument.instrument_type == instrumentType;
            }

            if (instrumentTradingSymbol) {
                select = select && instrument.tradingsymbol == instrumentTradingSymbol;
            }

            if (strike) {
                select = select && instrument.strike == strike;
            }

            return select;
        });
    };

    getUnderlyingEquity = ({ equityTradingSymbol }: { equityTradingSymbol?: EquityTradingSymbolType }): Instrument => {
        const instruments: Array<Instrument> = this.instruments.filter(instrument => {
            let select = true;

            const segment: SegmentType = 'NSE';
            const exchange: ExchangeType = 'NSE';

            if (exchange) {
                select = select && instrument.exchange === exchange;
            }

            if (segment) {
                select = select && instrument.segment === segment;
            }

            if (equityTradingSymbol) {
                select = select && instrument.tradingsymbol === equityTradingSymbol;
            }

            return select;
        });

        if (instruments.length == 1) {
            return instruments[0];
        } else {
            throw new Error("Couldn't find equity...");
        }
    };

    getOptionsChain = ({
        instrumentType,
        equityTradingSymbol,
        expiryMonth,
    }: {
        instrumentType?: InstrumentType;
        equityTradingSymbol: EquityTradingSymbolType;
        expiryMonth?: MonthType;
    }): Array<Instrument> => {
        return this.instruments.filter(instrument => {
            let select = true;

            const segment = 'NFO-OPT';
            const exchange = 'NFO';

            if (exchange) {
                select = select && instrument.exchange == exchange;
            }

            if (segment) {
                select = select && instrument.segment == segment;
            }

            if (instrumentType) {
                select = select && instrument.instrument_type == instrumentType;
            }

            if (equityTradingSymbol) {
                select = select && instrument.tradingsymbol.startsWith(equityTradingSymbol);
            }

            if (expiryMonth) {
                const monthIndex = new Date(instrument.expiry).getUTCMonth() as MonthIndexType;
                select = select && getMonthFromIndex({ index: monthIndex }) === expiryMonth;
            }

            return select;
        });
    };

    getOptionsInstrumentAtStrike = ({
        equityTradingSymbol,
        instrumentType,
        strike,
        distanceFromStrike,
        expiryMonth,
        step,
    }: {
        instrumentType: InstrumentType;
        strike: StrikeType;
        distanceFromStrike?: StrikeDistanceType;
        equityTradingSymbol: EquityTradingSymbolType;
        expiryMonth: MonthType;
        step: number;
    }): Instrument => {
        const instruments = this.instruments.filter(instrument => {
            let select = true;

            const segment = 'NFO-OPT';
            const exchange = 'NFO';

            select = select && instrument.exchange == exchange;
            select = select && instrument.segment == segment;
            select = select && instrument.instrument_type == instrumentType;
            const monthIndex = new Date(instrument.expiry).getUTCMonth() as MonthIndexType;
            select = select && getMonthFromIndex({ index: monthIndex }) === expiryMonth;
            select = select && instrument.tradingsymbol.startsWith(equityTradingSymbol);
            select = select && instrument.strike == strike + step * distanceFromStrike;

            return select;
        });

        if (instruments.length == 1) {
            return instruments[0];
        } else {
            throw new Error("Couldn't find instrument at given strike distance...");
        }
    };
}
