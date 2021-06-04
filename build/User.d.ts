import { AppService } from "./app.service";
import { MeetingModel } from "./Models/meeting-model";
import { UserModel } from "./Models/user-model";
export declare class User {
    constructor(_appService: AppService);
    private appService;
    userInfo: UserModel;
    create(): Promise<void>;
    getMeetings(): Promise<MeetingModel[]>;
    getProfileMeeting(): Promise<MeetingModel>;
}
