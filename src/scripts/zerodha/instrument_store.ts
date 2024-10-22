import localInstruments from '../../data/instruments.json';
import {
    NameType,
    DerivativeNameType,
    DerivativeTradingSymbolType,
    EquityTradingSymbolType,
    TradingSymbolType,
    Ul_Der_Map_List,
} from '../../types/instrument';
import { ul_der_map_list } from '../../data/eq_derivative_map';
import { getMonthFromIndex } from '../../utils/date_time';
import {
    ExchangeType,
    Instrument,
    InstrumentType,
    SegmentType,
    StrikeType,
    MonthIndexType,
    StrikeDistanceType,
} from '../../types/zerodha';
// import { Success } from '../../utils/Logger';
import { MonthNameType } from '../../types/zerodha';
import { saveZerodhaInstrumentsLocal } from '../../utils/helper';
import { Kite } from './kite';

export class InstrumentStore {
    private static instance: InstrumentStore;
    private instruments: Array<Instrument> = [];
    private indices_eq_der_map: Ul_Der_Map_List = [];

    public static getInstance = (): InstrumentStore => {
        if (!InstrumentStore.instance) {
            InstrumentStore.instance = new InstrumentStore();
        }

        return InstrumentStore.instance;
    };

    // we need this to link index to it's derivative in instruments.json
    loadIndicesEqDerMapping = (): void => {
        try {
            this.indices_eq_der_map = ul_der_map_list;
            //   if array is null
            //   if array is empty
            //   if array has first object empty
            if (!this.indices_eq_der_map || this.indices_eq_der_map.length === 0 || !this.indices_eq_der_map[0]) {
                console.log(`local load local index eq der map data have some issue...`);
                throw new Error('');
            }
        } catch (e) {
            console.log(`couldn't load local index eq der map data!`);
        }
    };

    // getDerivativeInstrumentFromIndexEquitySymbol = ({
    //     tradingSymbol,
    // }: {
    //     tradingSymbol: EquityTradingSymbolType;
    // }): Instrument => {
    //     const mapping = this.indices_eq_der_map.filter((mapping: IndicesEqDerivativeMap) => {
    //         return mapping.underlying.tradingSymbol === tradingSymbol;
    //     })?.[0];

    //     if (mapping) {
    //         const instrument = getLocalDerivativeInstrumentsWithFilter({
    //             name: mapping.derivative.name,
    //         });

    //         mapping.derivative.name;
    //     } else {
    //         throw new Error(
    //             `log: [error] [instrument store] no index eq-der mapping found for requested trading symbol: ${tradingSymbol}`,
    //         );
    //     }
    // };

    loadInstruments = async ({ from_server }: { from_server: boolean }) => {
        if (from_server) {
            return this.fetchInstrumentsFromServer();
        }

        try {
            console.log(`log: [instrument store] trying to instruments from local file`);
            this.instruments = localInstruments as Array<Instrument>;
            //   if array is null
            //   if array is empty
            //   if array has first object empty
            if (!this.instruments || this.instruments.length === 0 || !this.instruments[0]) {
                console.log(`local instruments list have some issue...`);
                throw new Error('');
            }

            // Success({
            //     title: 'Loaded Instruments Local',
            //     data: `count: ${this.instruments.length}`,
            // });
            console.log(`log: [instrument store] loaded local instruments`);
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

    getLocalInstrumentsWithFilter = ({
        exchange,
        segment,
        instrumentType,
        tradingSymbol,
        name,
        strike,
        instrumentToken,
    }: {
        exchange?: ExchangeType;
        segment?: SegmentType;
        instrumentType?: InstrumentType;
        tradingSymbol?: TradingSymbolType;
        name?: NameType;
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

            if (tradingSymbol) {
                select = select && instrument.tradingsymbol == tradingSymbol;
            }

            if (name) {
                select = select && instrument.name == name;
            }

            if (strike) {
                select = select && instrument.strike == strike;
            }

            return select;
        });
    };

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

    getEquityInstrumentFromItsSymbol = ({
        equityTradingSymbol,
        segment,
    }: {
        equityTradingSymbol: EquityTradingSymbolType;
        segment: SegmentType;
    }): Instrument => {
        const instruments: Array<Instrument> = this.instruments.filter(instrument => {
            let select = true;

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

            // console.log(instrument.tradingsymbol);

            return select;
        });

        if (instruments.length == 1) {
            return instruments[0];
        } else {
            throw new Error("Couldn't find equity...");
        }
    };

    getLocalDerivativeInstrumentsWithFilter = ({
        instrumentType,
        derivativeTradingSymbol,
        name,
        strike,
        instrumentToken,
    }: {
        instrumentType?: InstrumentType;
        derivativeTradingSymbol?: DerivativeTradingSymbolType;
        name?: DerivativeNameType;
        strike?: StrikeType;
        instrumentToken?: string;
    }): Array<Instrument> => {
        return this.instruments.filter(instrument => {
            let select = true;

            select = select && instrument.exchange == 'NFO';

            select = select && (instrument.segment == 'NFO-FUT' || instrument.segment == 'NFO-OPT');

            if (instrumentToken) {
                select = select && instrument.instrument_token == instrumentToken;
            }

            if (instrumentType) {
                select = select && instrument.instrument_type == instrumentType;
            }

            if (derivativeTradingSymbol) {
                select = select && instrument.tradingsymbol == derivativeTradingSymbol;
            }

            if (name) {
                select = select && instrument.name == name;
            }

            if (strike) {
                select = select && instrument.strike == strike;
            }

            return select;
        });
    };

    // getOptionsChain = ({
    //     instrumentType,
    //     equityTradingSymbol,
    //     expiryMonth,
    // }: {
    //     instrumentType?: InstrumentType;
    //     equityTradingSymbol: EquityTradingSymbolType;
    //     expiryMonth?: MonthNameType;
    // }): Array<Instrument> => {
    //     return this.instruments.filter(instrument => {
    //         let select = true;

    //         const segment = 'NFO-OPT';
    //         const exchange = 'NFO';

    //         if (exchange) {
    //             select = select && instrument.exchange == exchange;
    //         }

    //         if (segment) {
    //             select = select && instrument.segment == segment;
    //         }

    //         if (instrumentType) {
    //             select = select && instrument.instrument_type == instrumentType;
    //         }

    //         if (equityTradingSymbol) {
    //             select = select && instrument.tradingsymbol.startsWith(equityTradingSymbol);
    //         }

    //         if (expiryMonth) {
    //             const monthIndex = new Date(instrument.expiry).getUTCMonth() as MonthIndexType;
    //             select = select && getMonthFromIndex({ index: monthIndex }) === expiryMonth;
    //         }

    //         return select;
    //     });
    // };

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
        expiryMonth: MonthNameType;
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
