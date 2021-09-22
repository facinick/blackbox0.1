import ZerodhaConfig from './private/zerodha.json';
import { Kite } from './scripts/zerodha/kite';
import { login } from './scripts/zerodha/login';
import { BaseTickerV2 } from './scripts/ticker/base_ticker_v2';
import { PriceUpdates } from './scripts/ticker/price_updates';
import { OrderUpdates } from './scripts/ticker/order_updates';
import { App } from './scripts/app';
import { InstrumentStore } from './scripts/zerodha/instrument_store';
import { Logger } from './scripts/logger/logger';

const main = async (): Promise<void> => {
    Logger.info({
        message: `starting main app`,
        className: 'main',
    });
    // create kite instance
    Kite.getInstance().init({ api_key: ZerodhaConfig.API_KEY });

    // login to kite connect api
    const logged_in = await login();

    if (!logged_in) {
        Logger.error({
            message: `something went wrong, couldn't log in. aborting!`,
            className: 'main',
        });
        process.exit();
    }

    Logger.success({
        message: `logged in!`,
        className: 'main',
    });

    // init base ticker, this will be used by price and order update publishers
    BaseTickerV2.getInstance().init({
        api_key: ZerodhaConfig.API_KEY,
        access_token: ZerodhaConfig.ACCESS_TOKEN,
    });

    // connect base ticker, needs to be done in order to proceed forward
    await BaseTickerV2.getInstance().connect();

    Logger.success({
        message: `base ticker connected!`,
        className: 'main',
    });

    // ready the price and order update publishers
    try {
        PriceUpdates.getInstance().init();
        OrderUpdates.getInstance().init();
    } catch (error) {
        Logger.error({
            message: `error initialising price/order ticker, aborting!`,
            className: 'main',
            data: error,
        });
        process.exit();
    }

    // load instruments, to know details of every instrument
    await InstrumentStore.getInstance().loadInstruments({
        from_server: false,
    });

    InstrumentStore.getInstance().loadIndicesEqDerMapping();

    Logger.info({
        message: `tickers are ready!`,
        className: 'main',
    });

    new App().initialise();
};

main();
