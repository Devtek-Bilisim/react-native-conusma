import { AppService } from "./app.service";
import { Meeting } from "./meeting";
import { MeetingModel } from "./Models/meeting-model";
import { UserModel } from "./Models/user-model";
export declare class User {
    constructor(_appService: AppService);
    private appService;
    userInfo: UserModel;
    create(): Promise<void>;
    createMeeting(): Promise<Meeting>;
    getMeetings(): Promise<MeetingModel[]>;
    getProfileMeeting(): Promise<MeetingModel>;
    joinMeeting(meeting: MeetingModel, meetingName?: string): Promise<Meeting>;
}
