/* eslint-disable no-unused-vars */
import ZerodhaConfig from '../../private/zerodha.json';
import { questionAsync } from '../../utils/UserInput';
import { saveZerodhaConfigLocal } from '../../utils/helper';
import { Kite } from './kite';

export const login = async (): Promise<boolean> => {
    console.log(`log: [auth] attempting to log in...`);

    if (ZerodhaConfig.ACCESS_TOKEN) {
        console.log(`log: [auth] local access_token found, validating...`);

        const is_valid = await is_access_token_valid({ access_token: ZerodhaConfig.ACCESS_TOKEN });

        if (is_valid) {
            console.log(`log: [auth] local access token '${ZerodhaConfig.ACCESS_TOKEN}' is valid!`);
            return true;
        } else {
            console.log(`log: [auth] local access token '${ZerodhaConfig.ACCESS_TOKEN}' is invalid! clearing it`);
            ZerodhaConfig.ACCESS_TOKEN = '';
            saveZerodhaConfigLocal(ZerodhaConfig);
        }
    }

    console.log(`log: [auth] local access_token not found or is invalid`);

    let is_valid = false;
    let access_token = '';
    let attempts = 0;

    while (!is_valid) {
        attempts = attempts + 1;
        console.log(`log: [auth] login attempt #${attempts}`);

        [is_valid, access_token] = await manual_enter_token();
        if (is_valid) {
            console.log(`log: [auth] entered access token '${access_token}' is valid, saving it`);
            ZerodhaConfig.ACCESS_TOKEN = access_token;
            saveZerodhaConfigLocal(ZerodhaConfig);
            return true;
        } else {
            if (attempts === 3) {
                console.log(`log: [auth] failed #${attempts} attempts!`);
                return false;
            }
            console.log(`log: [auth] entered access token '${access_token}' is invalid! asking again...`);
        }
    }

    return false;
};

export const manual_enter_token = async (): Promise<[boolean, string]> => {
    const ACCESS_TOKEN = await questionAsync({ question: 'Enter Zerodha App Access Token' });
    const is_valid = await is_access_token_valid({ access_token: ACCESS_TOKEN });
    return [is_valid, ACCESS_TOKEN];
};

export const is_access_token_valid = async ({ access_token }: { access_token: string }): Promise<boolean> => {
    await Kite.getInstance().useAccessToken({
        access_token: access_token,
    });

    const [_positions, get_position_error] = await Kite.getInstance().getPositions();
    if (get_position_error) {
        console.log(`log: [login] [error] get positions failed`);
        return false;
    }

    // Success({ title: 'Current Open Positions', data: _positions as any });

    return true;
};
