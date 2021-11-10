import { DelayTime } from "./delay-timer";
export declare class DelayTimerList {
    static timeList: Map<string, DelayTime>;
    static startTime(key: string): void;
    static endTime(key: string): void;
    static getLog(): any[];
}
