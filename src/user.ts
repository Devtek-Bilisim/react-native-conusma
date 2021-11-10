import { AppService } from "./app.service";
import { ConusmaException } from "./Exceptions/conusma-exception";
import { Meeting } from "./meeting";
import { MeetingModel } from "./Models/meeting-model";
import { MeetingUserModel } from "./Models/meeting-user-model";
import { UserModel } from "./Models/user-model";
import { DelayTimerList } from "./Timer/delay-timer-list";

export class User {
    constructor(_appService:AppService) {
        this.appService = _appService;
       
    }
    private appService:AppService ;
    public userInfo:UserModel = new UserModel();
    public async create()
    {
      DelayTimerList.startTime("User create");
        var result = await this.appService.createUserWithDeviceId();
        this.userInfo = result;
        this.appService.setJwtToken(this.userInfo.Token);
        DelayTimerList.endTime("User create");

    }
    public async createMeeting()
    {
      try {
        var meeting:Meeting = await this.appService.createMeeting();
        return meeting;
      } catch (error) {
        throw new ConusmaException("createMeeting","Meeting cannot be created.", error);
      }
       
    }
    public async getMeetings()
    {
        try {
            var meetings:Array<MeetingModel> = await this.appService.getMeetings();
            return meetings;
          } catch (error) {
            throw new ConusmaException("getMeetings","Meeting list cannot be received.", error);
          }
    }
    public async getProfileMeeting()
    {
        try {
          DelayTimerList.startTime("User getProfileMeeting");
            var meetings:Array<MeetingModel> = await this.appService.getMeetings();
             var profileMeeting:MeetingModel = <MeetingModel>meetings.find(us => us.ProfileMeeting); 
             DelayTimerList.endTime("User getProfileMeeting");
            return profileMeeting;
          } catch (error) {
            throw new ConusmaException("getProfileMeeting", "Profile Meeting cannot be received.", error);
          }
    }
    public async joinMeeting(meeting:MeetingModel,meetingName:string='User')
    {
        try {
          DelayTimerList.startTime("User joinMeeting");
            var result = await this.appService.joinMeeting(meeting.MeetingId,meeting.Password,meetingName);
            var meetingUser:MeetingUserModel = result;
            var activeMeeting = new Meeting(meetingUser, this.appService);
            DelayTimerList.endTime("User joinMeeting");
            return activeMeeting;
          } catch (error) {
            throw new ConusmaException("joinMeeting", "Failed to join the meeting", error);
          }
    }

}