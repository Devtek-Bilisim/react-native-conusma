import { AppService } from "./app.service";
import { GuestUserModel } from "./Models/guest-user-model";
import { Meeting } from "./meeting";
export declare class GuestUser {
    private appService;
    constructor(_appService: AppService);
    userInfo: GuestUserModel;
    create(): Promise<void>;
    joinMeetingByInviteCode(inviteCode: string, meetingName?: string): Promise<Meeting>;
    joinMeeting(meetingId: string, meetingPassword: string, meetingName?: string): Promise<Meeting>;
}
