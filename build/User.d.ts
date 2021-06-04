import { AppService } from "./app.service";
import { MeetingModel } from "./Models/meeting-model";
import { MeetingUserModel } from "./Models/meeting-user-model";
import { UserModel } from "./Models/user-model";
export declare class User {
    constructor(_appService: AppService);
    private appService;
    userInfo: UserModel;
    create(): Promise<void>;
    getMeetings(): Promise<MeetingModel[]>;
    getProfileMeeting(): Promise<MeetingModel>;
    joinMeeting(meeting: MeetingModel, meetingName?: string): Promise<MeetingUserModel>;
}
