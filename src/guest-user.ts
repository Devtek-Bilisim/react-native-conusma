import { AppService } from "./app.service";
import { GuestUserModel } from "./Models/guset-user-model";

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

}