export type ZTicks = Array<ZTick>;

export interface ZTick {
    tradable: boolean;
    mode: string;
    instrument_token: number;
    last_price: number;
}

export type ZOrderTicks = Array<ZOrderTick>;

export interface ZOrderTick {
    order_id: string;
    exchange_order_id: string;
    placed_by: string;
    status: string;
    status_message: string;

    tradingsymbol: string;
    exchange: string;
    order_type: string;
    transaction_type: string;
    validity: string;
    product: string;

    average_price: number;
    price: number;
    quantity: number;
    filled_quantity: number;
    unfilled_quantity: number;
    trigger_price: number;
    user_id: string;
    order_timestamp: string;
    exchange_timestamp: string;
    checksum: string;
}
