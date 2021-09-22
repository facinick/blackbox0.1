import { TradingSymbolType } from './instrument';
import { VarietyType, ExchangeType, TransactionType, ProductType, OrderType, ValidityType } from './zerodha';

export interface ZPlaceOrder {
    variety: VarietyType;
    exchange: ExchangeType;
    tradingsymbol: TradingSymbolType;
    transaction_type: TransactionType;
    quantity: number;
    product: ProductType;
    order_type: OrderType;
    validity?: ValidityType;
    disclosed_quantity?: number;
    trigger_price?: number;
    squareoff?: number;
    stoploss?: number;
    trailing_stoploss?: number;
    price: number;
    tag: string;
}

export type ZPlaceOrders = Array<ZPlaceOrder>;

export type ZPlaceStockOrder = Pick<ZPlaceOrder, 'tradingsymbol' | 'transaction_type' | 'quantity' | 'tag' | 'price'>;
interface OrderFunctionType {
    _function: 'DAY_STOCK';
}

export type IPlaceStockOrder = ZPlaceStockOrder & OrderFunctionType;
