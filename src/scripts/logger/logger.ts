import { Level, ColorMap, COLORS } from '../../types/logger';
import notifier from 'node-notifier';
export class Logger {
    private constructor() {
        // do nothing, just marked private
    }

    static log = ({
        message,
        data,
        notify,
        level,
        trace,
        className,
    }: {
        className: string;
        message: string;
        notify?: boolean;
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
            Logger.data({ data });
        }

        if (notify) {
            Logger.notify({
                title: `Blackbox Notification`,
                message,
            });
        }
    };

    static data = ({ data }: { data: any }): void => {
        console.log(data);
    };

    static notify = ({ title, message }: { title: string; message: string }): void => {
        notifier.notify({
            title,
            message,
            sound: true,
        });
    };

    static info = ({
        message,
        notify,
        data,
        trace,
        className,
    }: {
        className: string;
        message: string;
        notify?: boolean;
        data?: any;
        trace?: boolean;
    }) => {
        Logger.log({
            message,
            notify,
            data,
            trace,
            className,
            level: Level.INFO,
        });
    };

    static error = ({
        message,
        notify,
        data,
        trace,
        className,
    }: {
        className: string;
        message: string;
        notify?: boolean;
        data?: any;
        trace?: boolean;
    }) => {
        Logger.log({
            message,
            notify,
            data,
            trace,
            className,
            level: Level.ERROR,
        });
    };

    static warn = ({
        message,
        notify,
        data,
        trace,
        className,
    }: {
        className: string;
        message: string;
        notify?: boolean;
        data?: any;
        trace?: boolean;
    }) => {
        Logger.log({
            message,
            notify,
            data,
            trace,
            className,
            level: Level.WARN,
        });
    };

    static debug = ({
        message,
        notify,
        data,
        trace,
        className,
    }: {
        className: string;
        message: string;
        notify?: boolean;
        data?: any;
        trace?: boolean;
    }) => {
        Logger.log({
            message,
            notify,
            data,
            trace,
            className,
            level: Level.DEBUG,
        });
    };

    static success = ({
        message,
        notify,
        data,
        trace,
        className,
    }: {
        className: string;
        message: string;
        notify?: boolean;
        data?: any;
        trace?: boolean;
    }) => {
        Logger.log({
            message,
            notify,
            data,
            trace,
            className,
            level: Level.SUCCESS,
        });
    };
}
