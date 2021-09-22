import { Level, ColorMap, COLORS } from '../../types/logger';

export class Logger {
    static log = ({
        message,
        data,
        level,
        trace,
        className,
    }: {
        className: string;
        message: string;
        data?: any;
        level?: Level;
        trace?: boolean;
    }) => {
        if (level === undefined) {
            level = Level.INFO;
        }

        const logline = `log: [${className}] [${level}] ${message}`;
        const color = ColorMap.get(level);

        if (level === Level.ERROR) {
            console.log();
        }

        if (trace) {
            console.trace(`${color}%s${COLORS.Reset}`, logline);
        } else {
            console.log(`${color}%s${COLORS.Reset}`, logline);
        }

        if (level === Level.ERROR) {
            console.log();
        }

        if (data !== undefined) {
            console.log(data);
        }
        if (trace) {
            console.trace();
        }
    };

    static info = ({
        message,
        data,
        trace,
        className,
    }: {
        className: string;
        message: string;
        data?: any;
        trace?: boolean;
    }) => {
        Logger.log({
            message,
            data,
            trace,
            className,
            level: Level.INFO,
        });
    };

    static error = ({
        message,
        data,
        trace,
        className,
    }: {
        className: string;
        message: string;
        data?: any;
        trace?: boolean;
    }) => {
        Logger.log({
            message,
            data,
            trace,
            className,
            level: Level.ERROR,
        });
    };

    static warn = ({
        message,
        data,
        trace,
        className,
    }: {
        className: string;
        message: string;
        data?: any;
        trace?: boolean;
    }) => {
        Logger.log({
            message,
            data,
            trace,
            className,
            level: Level.WARN,
        });
    };

    static debug = ({
        message,
        data,
        trace,
        className,
    }: {
        className: string;
        message: string;
        data?: any;
        trace?: boolean;
    }) => {
        Logger.log({
            message,
            data,
            trace,
            className,
            level: Level.DEBUG,
        });
    };

    static success = ({
        message,
        data,
        trace,
        className,
    }: {
        className: string;
        message: string;
        data?: any;
        trace?: boolean;
    }) => {
        Logger.log({
            message,
            data,
            trace,
            className,
            level: Level.SUCCESS,
        });
    };

    static data = ({ data }: { data: any }): void => {
        console.log(data);
    };
}
