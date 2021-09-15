import { SegmentType } from '../../types/zerodha';
import { Indices_EquityTradingSymbolType, Indices_DerivativeNameType } from '../../types/instrument';
import { PriceUpdates } from '../ticker/price_updates';
import { PositionController } from '../positions/position_controller';
import { ZTicks } from '../../types/ticker';
import { PriceUpdateReceiver, PriceUpdateSender } from '../ticker/interface';
import { OrderManager } from '../orders/order_manager';
import { InstrumentStore } from '../zerodha/instrument_store';
import { ZPositions } from '../../types/positions';
import { getTickByInstrumentToken } from '../../utils/helper';
import { Instrument } from '../../types/zerodha';
import { IStrategy } from './interface';
export class S1 implements PriceUpdateReceiver, IStrategy {
    INDEX_EQ_TRADING_SYMBOL: Indices_EquityTradingSymbolType = 'NIFTY 50';
    INDEX_DERIVATIVE_NAME: Indices_DerivativeNameType = 'NIFTY';
    UNDERLYING_EQ_SEGMENT: SegmentType = 'INDICES';

    equityInstrument: Instrument;
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

            this.equityInstrument = InstrumentStore.getInstance().getEquityInstrumentFromItsSymbol({
                equityTradingSymbol: this.INDEX_EQ_TRADING_SYMBOL,
                segment: this.UNDERLYING_EQ_SEGMENT,
            });

            PriceUpdates.getInstance().subscribe({
                observer: this,
                ticker_ids: [Number(this.equityInstrument.instrument_token)],
            });
        } catch (error) {
            console.log(`log: [strategy] fatal error, couldn't init strategy`);
            console.log(error);
            process.exit();
        }
    }

    onPriceUpdate(_subject: PriceUpdateSender, _ticks: ZTicks): void {
        const positions: ZPositions = this.position_controller.getOpenNetPositions();
        const tick = getTickByInstrumentToken({
            ticks: _ticks,
            instrument_token: Number(this.equityInstrument.instrument_token),
        });
        // ----------------------
        console.log(`log: take a decision based on ${tick.last_price} and ${JSON.stringify(positions)}`);
    }
}
