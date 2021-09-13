import ZerodhaConfig from './private/zerodha.json';
import { Kite } from './scripts/zerodha/kite';
import { login } from './scripts/zerodha/login';
import { BaseTickerV2 } from './scripts/ticker/base_ticker_v2';
import { PriceUpdates } from './scripts/ticker/price_updates';
import { OrderUpdates } from './scripts/ticker/order_updates';
import { App } from './scripts/App';
import { InstrumentStore } from './scripts/zerodha/instrumentStore';

const main = async (): Promise<void> => {
    console.log(`log: [info] starting main app`);
    // create kite instance
    Kite.getInstance().init({ api_key: ZerodhaConfig.API_KEY });

    // login to kite connect api
    const logged_in = await login();

    if (!logged_in) {
        console.log(`log: [error] something went wrong, couldn't log in. aborting!`);
        process.exit();
    }

    console.log(`log: [auth] logged in!`);

    // init base ticker, this will be used by price and order update publishers
    BaseTickerV2.getInstance().init({
        api_key: ZerodhaConfig.API_KEY,
        access_token: ZerodhaConfig.ACCESS_TOKEN,
    });

    // connect base ticker, needs to be done in order to proceed forward
    await BaseTickerV2.getInstance().connect();
    console.log(`log: [kite] base ticker connected!`);

    // ready the price and order update publishers
    try {
        PriceUpdates.getInstance().init();
        OrderUpdates.getInstance().init();
    } catch (error) {
        console.log(`log: [ticker] error initialising price/order ticker, aborting!`);
        console.log(error);
        process.exit();
    }

    // load instruments, to know details of every instrument
    await InstrumentStore.getInstance().loadInstruments({
        from_server: false,
    });

    console.log(`log: [kite] tickers are ready!`);

    new App().initialise();
};

main();
