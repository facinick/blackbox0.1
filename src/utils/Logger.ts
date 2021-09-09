/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import colors from 'colors';

colors.enable();
colors.setTheme({
    silly: 'rainbow',
    info: 'blue',
    warn: 'yellow',
    debug: 'grey',
    error: 'red',
    success: 'green',
});

export const Info = ({ title, data }: { title: string; data: string | Record<string, unknown> }): void => {
    console.log();
    console.log(colors.debug(`********   ${title}   ********`));
    console.log(colors.debug(data));
    console.log();
};

export const Error = ({ title, data }: { title: string; data: string | Record<string, unknown> } | []): void => {
    console.log();
    console.log(colors.error(`********   ${title}   ********`));
    console.log(colors.error(data));
    console.log();
};

export const Debug = ({ title, data }: { title: string; data: string | Record<string, unknown> }): void => {
    console.log();
    console.log(colors.debug(`********   ${title}   ********`));
    console.log(colors.debug(data));
    console.log();
};

export const Success = ({ title, data }: { title: string; data: string | Record<string, unknown> }): void => {
    console.log();
    console.log(colors.success(`********   ${title}   ********`));
    console.log(colors.success(data));
    console.log();
};

export const Rainbow = ({ title, data }: { title: string; data: string | Record<string, unknown> }): void => {
    console.log();
    console.log(colors.rainbow(`********   ${title}   ********`));
    console.log(colors.rainbow(data));
    console.log();
};

export const Warning = ({ title, data }: { title: string; data: string | Record<string, unknown> }): void => {
    console.log();
    console.log(colors.warn(`********   ${title}   ********`));
    console.log(colors.warn(data));
    console.log();
};
