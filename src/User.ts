import { AppService } from "./app.service";
import { MeetingModel } from "./Models/meeting-model";

export class User {
  
    private appService:AppService ;
    constructor(_appService:AppService) {
        this.appService = _appService;
       
    }
    public async create()
    {
        try {
            var result = await this.appService.createUserWithDeviceId();
            console.log(JSON.stringify(result));
        } catch (error) {
            throw error;
        }
    }
    public async getMeetings()
    {
            return new Array<MeetingModel>();
    }
    public async getProfileMeeting()
    {
            return new MeetingModel();
    }

}