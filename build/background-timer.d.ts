/// <reference types="node" />
import EventEmitter from 'events';
export declare class backgroundTimer {
    tickEventEmitter: EventEmitter;
    start(interval: number): void;
    timerId: any;
    timeoutActive: boolean;
    terminate(): void;
}
