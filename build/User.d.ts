import { AppService } from "./app.service";
import { MeetingModel } from "./Models/MeetingModel";
export declare class User {
    private appService;
    constructor(_appService: AppService);
    Create(): Promise<void>;
    GetMeetings(): Promise<MeetingModel[]>;
    GetProfileMeeting(): Promise<MeetingModel>;
}
