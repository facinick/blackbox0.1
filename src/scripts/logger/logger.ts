import { Level, ColorMap, COLORS } from '../../types/logger';

export class Logger {
    private readonly className: string;
    constructor() {
        //what this is this?
        this.className = this.constructor.name;
    }

    log = ({ message, data, level, trace }: { message: string; data?: any; level?: Level; trace?: boolean }) => {
        if (level === undefined) {
            level = Level.INFO;
        }

        const logline = `log: [${this.className}] [${level}] ${message}`;
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
}
