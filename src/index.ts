import ZerodhaConfig from './private/zerodha.json';
import { Kite } from './scripts/zerodha/kite';
import { login } from './scripts/zerodha/login';
import { BaseTicker } from './scripts/ticker/base_ticker';
import { PriceUpdates } from './scripts/ticker/price_updates';
import { OrderUpdates } from './scripts/ticker/order_updates';
import { App } from './scripts/App';

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
    BaseTicker.getInstance().init({
        api_key: ZerodhaConfig.API_KEY,
        access_token: ZerodhaConfig.ACCESS_TOKEN,
    });

    // connect base ticker, needs to be done in order to proceed forward
    await BaseTicker.getInstance().connect();
    console.log(`log: [kite] base ticker connected!`);

    // ready the price and order update publishers
    try {
        PriceUpdates.getInstance().init();
        OrderUpdates.getInstance().init();
    } catch (error) {
        console.log(`log: [ticker] error initialising price/order ticker, aborting!`);
        process.exit();
    }

    console.log(`log: [kite] tickers are ready!`);

    new App().initialise();
};

main();
