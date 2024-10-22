import { KiteConnect } from 'kiteconnect';
import { ZDayNetPositions } from '../../types/positions';
import { Instrument, LTPData, PlacedOrder } from '../../types/zerodha';
import { CalcelledOrder, ExitedOrder, VarietyType, ModifiedOrder, ValidityType, OrderType } from '../../types/zerodha';
import { OptionsTradingSymbolType } from '../../types/instrument';
import { success } from '../../utils/helper';
import { ZHoldings } from '../../types/holdings';
import { ZPlaceStockOrder, ZPlaceOrder } from '../../types/orders';
class Kite {
    private static instance: Kite;
    private _kc: KiteConnect;
    private _loginUrl: string;

    public init = ({ api_key }: { api_key: string }): void => {
        this._kc = new KiteConnect({
            api_key: api_key,
        });

        this._loginUrl = this._kc.getLoginURL();
        console.log(`log: [kite] kite connect initialized! login url: ${this._loginUrl}`);
    };

    public get loginUrl(): string {
        return this._loginUrl;
    }

    public static getInstance = (): Kite => {
        if (!Kite.instance) {
            Kite.instance = new Kite();
        }

        return Kite.instance;
    };

    public useAccessToken = async ({
        access_token,
    }: {
        access_token: string;
    }): Promise<[ReturnType<typeof success>, any]> => {
        try {
            await this._kc.setAccessToken(access_token);
            console.log(`log: [kite] using access token: ${access_token}`);
            return [success({ message: 'set access token sucessfullt' }), null];
        } catch (error) {
            return [null, error];
        }
    };

    public getPositions = async (): Promise<[ZDayNetPositions, any]> => {
        try {
            const positions: ZDayNetPositions = await this._kc.getPositions();
            return [positions, null];
        } catch (error) {
            return [null, error];
        }
    };

    public getHoldings = async (): Promise<[ZHoldings, any]> => {
        try {
            const holdings: ZHoldings = await this._kc.getHoldings();
            return [holdings, null];
        } catch (error) {
            return [null, error];
        }
    };

    public generateSession = async ({
        request_token,
        api_secret,
    }: {
        request_token: string;
        api_secret: string;
    }): Promise<[{ access_token: string }, any]> => {
        try {
            const session: { access_token: string } = await this._kc.generateSession(request_token, api_secret);
            return [session, null];
        } catch (error) {
            return [null, error];
        }
    };

    public getInstruments = async (): Promise<[Array<Instrument>, any]> => {
        try {
            const instruments: Array<Instrument> = await this._kc.getInstruments();
            return [instruments, null];
        } catch (error) {
            return [null, error];
        }
    };

    public placeOrder = async ({
        variety,
        exchange,
        tradingsymbol,
        transaction_type,
        // multiplier * lot
        quantity,
        product,
        order_type,
        validity,
        disclosed_quantity,
        trigger_price,
        squareoff,
        stoploss,
        trailing_stoploss,
        // multiplier * premium
        price,
        tag,
    }: ZPlaceOrder): Promise<[PlacedOrder, any]> => {
        try {
            const placed_order: PlacedOrder = await this._kc.placeOrder(variety, {
                exchange,
                tradingsymbol,
                transaction_type,
                quantity,
                product,
                order_type,
                tag,
                price,
                ...(validity !== undefined && { validity }),
                ...(disclosed_quantity !== undefined && { disclosed_quantity }),
                ...(trigger_price !== undefined && { trigger_price }),
                ...(squareoff !== undefined && { squareoff }),
                ...(stoploss !== undefined && { stoploss }),
                ...(trailing_stoploss !== undefined && { trailing_stoploss }),
            });

            return [placed_order, null];
        } catch (error) {
            return [null, error];
        }
    };

    public placeStockOrder = async ({
        tradingsymbol,
        transaction_type,
        // multiplier * lot
        quantity = 1,
        tag,
        price,
    }: // multiplier * premium
    ZPlaceStockOrder): Promise<[PlacedOrder, any]> => {
        return this.placeOrder({
            variety: 'regular',
            exchange: 'NSE',
            tradingsymbol,
            transaction_type,
            // multiplier * lot
            quantity,
            product: 'CNC',
            order_type: 'LIMIT',
            validity: 'DAY',
            disclosed_quantity: undefined,
            trigger_price: undefined,
            squareoff: undefined,
            stoploss: undefined,
            trailing_stoploss: undefined,
            // multiplier * premium
            price,
            tag,
        });
    };

    public modifyPriceStockOrder = async ({
        order_id,
        price,
    }: {
        order_id: string;
        price: number;
    }): Promise<[ModifiedOrder, any]> => {
        return this.modifyOrder({
            variety: 'regular',
            order_id,
            price,
        });
    };

    public cancelOrder = async ({
        variety = 'regular',
        order_id,
        parent_order_id,
    }: {
        variety: VarietyType;
        order_id: string;
        parent_order_id?: string;
    }): Promise<[CalcelledOrder, any]> => {
        try {
            const cancelled_order: CalcelledOrder = await this._kc.cancelOrder(variety, order_id, {
                parent_order_id,
            });

            return [cancelled_order, null];
        } catch (error) {
            return [null, error];
        }
    };

    public modifyOrder = async ({
        variety,
        order_id,
        parent_order_id,
        quantity,
        price,
        order_type,
        validity,
        disclosed_quantity,
        trigger_price,
    }: {
        variety: VarietyType;
        order_id: string;
        parent_order_id?: string;
        quantity?: number;
        price?: number;
        order_type?: OrderType;
        validity?: ValidityType;
        disclosed_quantity?: number;
        trigger_price?: number;
    }): Promise<[ModifiedOrder, any]> => {
        try {
            const modified_order: ModifiedOrder = await this._kc.modifyOrder(variety, order_id, {
                ...(parent_order_id !== undefined && { parent_order_id }),
                ...(quantity !== undefined && { quantity }),
                ...(price !== undefined && { price }),
                ...(validity !== undefined && { validity }),
                ...(order_type !== undefined && { order_type }),
                ...(disclosed_quantity !== undefined && { disclosed_quantity }),
                ...(trigger_price !== undefined && { trigger_price }),
            });

            return [modified_order, null];
        } catch (error) {
            return [null, error];
        }
    };

    public exitOrder = async ({
        variety = 'regular',
        order_id,
        parent_order_id,
    }: {
        variety: VarietyType;
        order_id: string;
        parent_order_id?: string;
    }): Promise<[ExitedOrder, any]> => {
        try {
            const exited_order: ExitedOrder = await this._kc.exitOrder(variety, order_id, {
                parent_order_id,
            });

            return [exited_order, null];
        } catch (error) {
            return [null, error];
        }
    };

    // TODO: fix types
    public getOrders = async (): Promise<[any, any]> => {
        try {
            const orders: any = await this._kc.getOrders();
            return [orders, null];
        } catch (error) {
            return [null, error];
        }
    };

    // public getLTP = async ({
    //     exchange,
    //     tradingsymbol,
    // }: {
    //     exchange: ExchangeType;
    //     tradingsymbol: TradingSymbolType;
    // }): Promise<[LTPData, any]> => {
    //     try {
    //         const ltp = await this._kc.getQuote([`${exchange}:${tradingsymbol}`]);
    //         return [ltp[`${exchange}:${tradingsymbol}`], null];
    //     } catch (error) {
    //         return [null, error];
    //     }
    // };

    // public getStockLTP = async ({
    //     tradingsymbol,
    // }: {
    //     tradingsymbol: TradingSymbolType;
    // }): Promise<[LTPData, any]> => {
    //     return this.getLTP({
    //         exchange: 'NSE',
    //         tradingsymbol
    //     })
    // };

    public getOptionsLTP = async ({
        tradingsymbol,
    }: {
        tradingsymbol: OptionsTradingSymbolType;
    }): Promise<[LTPData, any]> => {
        try {
            const ltp = await this._kc.getQuote([`${'NFO'}:${tradingsymbol}`]);
            return [ltp[`${'NFO'}:${tradingsymbol}`], null];
        } catch (error) {
            return [null, error];
        }
    };
}

export { Kite };
