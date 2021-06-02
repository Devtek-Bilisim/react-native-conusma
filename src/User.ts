import { AppService } from "./app.service";
import { MeetingModel } from "./Models/MeetingModel";

export class User {
  
    private appService:AppService ;
    constructor(_appService:AppService) {
        this.appService = _appService;
       
    }
    public async Create()
    {
        var result = await this.appService.CreateUserWithDeviceID();
        console.log(JSON.stringify(result));
    }
    public async GetMeetings()
    {
            return new Array<MeetingModel>();
    }
    public async GetProfileMeeting()
    {
            return new MeetingModel();
    }

}