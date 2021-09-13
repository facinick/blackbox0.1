import { SegmentType } from '../../types/zerodha';
import { OptionsTradingSymbolNameType } from '../../types/nse_index';
import { PriceUpdates } from '../ticker/price_updates';
import { PositionController } from '../positions/position_controller';
import { ZTicks } from '../../types/ticker';
import { PriceUpdateReceiver, PriceUpdateSender } from '../ticker/interface';
import { OrderManager } from '../orders/order_manager';
import { InstrumentStore } from '../zerodha/instrumentStore';
import { EquityTradingSymbolType } from '../../types/nse_index';
import { ZPositions } from '../../types/positions';
import { getTickByInstrumentToken } from '../../utils/helper';
import { Instrument } from '../../types/zerodha';
import { IStrategy } from './interface';
export class S1 implements PriceUpdateReceiver, IStrategy {
    UNDERLYING_EQ_SYMBOL: EquityTradingSymbolType = 'NIFTY BANK';
    UNDERLYING_FNO_SYMBOL: OptionsTradingSymbolNameType = 'BANKNIFTY';
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
        this.order_manager = order_manager;
        this.position_controller = position_controller;

        this.equityInstrument = InstrumentStore.getInstance().getUnderlyingEquity({
            equityTradingSymbol: this.UNDERLYING_EQ_SYMBOL,
            segment: this.UNDERLYING_EQ_SEGMENT,
        });

        PriceUpdates.getInstance().subscribe({
            observer: this,
            ticker_ids: [Number(this.equityInstrument.instrument_token)],
        });
    }

    onPriceUpdate(_subject: PriceUpdateSender, ticks: ZTicks): void {
        const positions: ZPositions = this.position_controller.getOpenNetPositions();
        const tick = getTickByInstrumentToken({
            ticks,
            instrument_token: Number(this.equityInstrument.instrument_token),
        });

        console.log(`log: take a decision based on ${tick.last_price} and ${JSON.stringify(positions)}`);
    }
}
