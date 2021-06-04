import { AppService } from "./app.service";
import { ConusmaException } from "./Exceptions/conusma-exception";
import { GuestUserModel } from "./Models/guset-user-model";
import { MeetingModel } from "./Models/meeting-model";
import { MeetingUserModel } from "./Models/meeting-user-model";

export class GuestUser {
    private appService:AppService;
    
    constructor(_appService:AppService) {
        this.appService = _appService;
    }
    public userInfo:GuestUserModel = new GuestUserModel();
    public async create()
    {
        var result = await this.appService.createPublicUser();
        this.userInfo = result;
        this.appService.setJwtToken(this.userInfo.Token);
    }
    public async joinMeetingByInviteCode(inviteCode:string,meetingName:string='Guest')
    {
        try {
            var resultcode = await this.appService.controlInviteCode(inviteCode);
            var meeting:MeetingModel = resultcode;
            var result = await this.appService.joinMeeting(meeting.MeetingId,meeting.Password,meetingName);
            var meetingUser:MeetingUserModel = result;
            return meetingUser;
          } catch (error) {
            throw new ConusmaException("joinMeeting","failed to join the meeting", error);
          }
    }
    public async joinMeeting(meetingId:string,meetingPassword:string,meetingName:string='Guest')
    {
        try {
            var resultcode = await this.appService.isMeetingValid(meetingId,meetingPassword);
            var meeting:MeetingModel = resultcode;
            var result = await this.appService.joinMeeting(meeting.MeetingId,meeting.Password,meetingName);
            var meetingUser:MeetingUserModel = result;
            return meetingUser;
          } catch (error) {
            throw new ConusmaException("joinMeeting","failed to join the meeting", error);
          }
    }

}