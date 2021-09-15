import { SegmentType } from '../../types/zerodha';
import { PriceUpdates } from '../ticker/price_updates';
import { PositionController } from '../positions/position_controller';
import { ZTicks } from '../../types/ticker';
import { PriceUpdateReceiver, PriceUpdateSender } from '../ticker/interface';
import { OrderManager } from '../orders/order_manager';
import { InstrumentStore } from '../zerodha/instrument_store';
// import { EquityTradingSymbolNameType } from '../../types/nse_index';
import { EquityTradingSymbolType } from '../../types/instrument';
// import { ZPositions } from '../../types/positions';
import { getTickByInstrumentToken } from '../../utils/helper';
import { Instrument } from '../../types/zerodha';
import { IStrategy } from './interface';
export class S2 implements PriceUpdateReceiver, IStrategy {
    UNDERLYING_EQ_SYMBOL_LIST: Array<EquityTradingSymbolType> = ['HINDUNILVR'];
    UNDERLYING_EQ_SEGMENT: SegmentType = 'NSE';

    equityInstruments: Array<Instrument> = [];

    position_controller: PositionController;
    order_manager: OrderManager;

    constructor({
        position_controller,
        order_manager,
    }: {
        position_controller: PositionController;
        order_manager: OrderManager;
    }) {
        try {
            this.order_manager = order_manager;
            this.position_controller = position_controller;

            const subscribe_to_tokens = [];

            this.UNDERLYING_EQ_SYMBOL_LIST.forEach((equityTradingSymbol: EquityTradingSymbolType) => {
                const instrument = InstrumentStore.getInstance().getEquityInstrumentFromItsSymbol({
                    equityTradingSymbol,
                    segment: this.UNDERLYING_EQ_SEGMENT,
                });

                this.equityInstruments.push(instrument);
                subscribe_to_tokens.push(instrument.tradingsymbol);
            });

            PriceUpdates.getInstance().subscribe({
                observer: this,
                ticker_ids: subscribe_to_tokens,
            });
        } catch (error) {
            console.log(`log: [strategy] fatal error, couldn't init strategy`);
            console.log(error);
            process.exit();
        }
    }

    onPriceUpdate(_subject: PriceUpdateSender, _ticks: ZTicks): void {
        // const positions: ZPositions = this.position_controller.getOpenNetPositions();

        this.equityInstruments.forEach((equityInstrument: Instrument) => {
            const tick = getTickByInstrumentToken({
                ticks: _ticks,
                instrument_token: Number(equityInstrument.instrument_token),
            });

            console.log(`log: [strategy] eq: ${equityInstrument.tradingsymbol} price: ${tick.last_price}`);
        });
    }
}
