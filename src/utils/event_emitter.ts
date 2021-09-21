/* eslint-disable no-unused-vars */
import { EventEmitter as eventEmitter3 } from 'eventEmitter3';

class EventEmitter {
    private readonly eventEmitter = new eventEmitter3();
    public on: (event: string, fn: (...args: any[]) => void, context?: any) => void;
    public off: (event: string, fn: (...args: any[]) => void, context?: any, once?: boolean) => void;

    constructor() {
        this.on = this.addListener;
        this.off = this.removeListener;
    }

    public addListener(event: string, fn: (...args: any[]) => void, context?: any): void {
        this.eventEmitter.addListener(event, fn, context);
    }

    public once(event: string, fn: (...args: any[]) => void, context?: any): void {
        this.eventEmitter.once(event, fn, context);
    }

    public emit(event: string, data?: any): void {
        this.eventEmitter.emit(event, data);
    }

    public eventNames(): Array<string | symbol> {
        return this.eventEmitter.eventNames();
    }

    public listenerCount(event: string): number {
        return this.eventEmitter.listenerCount(event);
    }

    public listeners(event: string): Array<(...args: any[]) => void> {
        return this.eventEmitter.listeners(event);
    }

    public removeListener(event: string, fn: (...args: any[]) => void, context?: any, once?: boolean): void {
        this.eventEmitter.removeListener(event, fn, context, once);
    }

    public removeAllListeners(event?: string): void {
        this.eventEmitter.removeAllListeners(event);
    }
}
export { EventEmitter };
