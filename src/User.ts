import { AppService } from "./app.service";
import { ConusmaException } from "./Exceptions/conusma-exception";
import { MeetingModel } from "./Models/meeting-model";
import { UserModel } from "./Models/user-model";

export class User {
  

    constructor(_appService:AppService) {
        this.appService = _appService;
       
    }
    private appService:AppService ;
    public userInfo:UserModel = new UserModel();
    public async create()
    {
        var result = await this.appService.createUserWithDeviceId();
        this.userInfo = result;
        this.appService.setJwtToken(this.userInfo.Token);
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
            var meetings:Array<MeetingModel> = await this.appService.getMeetings();
             var profileMeeting:MeetingModel = <MeetingModel>meetings.find(us => us.ProfileMeeting); 
            return profileMeeting;
          } catch (error) {
            throw new ConusmaException("getProfileMeeting","Profile Meeting cannot be received.", error);
          }
    }

}