import { KiteConnect } from 'kiteconnect';
import { ZDayNetPositions } from '../../types/positions';
import { ExchangeType, Instrument, LTPData, PlacedOrder, PlaceOrder } from '../../types/zerodha';
import { CalcelledOrder, ExitedOrder, VarietyType } from '../../types/zerodha';
import { OptionsTradingSymbolType } from '../../types/instrument';
import { success } from '../../utils/helper';
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
        variety = 'regular',
        exchange = 'NFO',
        tradingsymbol,
        transaction_type,
        // multiplier * lot
        quantity,
        product = 'NRML',
        order_type = 'LIMIT',
        validity,
        disclosed_quantity,
        trigger_price,
        squareoff,
        stoploss,
        trailing_stoploss,
        // multiplier * premium
        price,
        tag = 'bot',
    }: PlaceOrder): Promise<[PlacedOrder, any]> => {
        try {
            const placed_order: PlacedOrder = await this._kc.placeOrder(variety, {
                exchange,
                tradingsymbol,
                transaction_type,
                quantity,
                product,
                order_type,
                price,
                tag,
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

    public getLTP = async ({
        exchange,
        tradingsymbol,
    }: {
        exchange: ExchangeType;
        tradingsymbol: string;
    }): Promise<[LTPData, any]> => {
        try {
            const ltp = await this._kc.getQuote([`${exchange}:${tradingsymbol}`]);
            return [ltp[`${exchange}:${tradingsymbol}`], null];
        } catch (error) {
            return [null, error];
        }
    };

    public getEquityLTP = async ({ tradingsymbol }: { tradingsymbol: string }): Promise<[LTPData, any]> => {
        try {
            const ltp = await this._kc.getQuote([`${'NSE'}:${tradingsymbol}`]);
            return [ltp[`${'NSE'}:${tradingsymbol}`], null];
        } catch (error) {
            return [null, error];
        }
    };

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
