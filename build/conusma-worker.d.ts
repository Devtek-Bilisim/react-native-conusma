/// <reference types="node" />
import { AppService } from "./app.service";
import { MeetingUserModel } from "./Models/meeting-user-model";
import { EventEmitter } from 'events';
export declare class ConusmaWorker {
    constructor(_appService: AppService, _meetingUser: MeetingUserModel);
    meetingWorkerEvent: EventEmitter;
    private saveEventData;
    private meetingUser;
    private appService;
    private iAmHereInterval;
    private meetingChangeEventInterval;
    private controlMeetingEvent;
    private iAmHere;
    start(): void;
    terminate(): void;
}
