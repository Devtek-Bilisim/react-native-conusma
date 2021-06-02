import { AppService } from "./app.service";
import { MeetingModel } from "./Models/meeting-model";
export declare class User {
    private appService;
    constructor(_appService: AppService);
    create(): Promise<void>;
    getMeetings(): Promise<MeetingModel[]>;
    getProfileMeeting(): Promise<MeetingModel>;
}
