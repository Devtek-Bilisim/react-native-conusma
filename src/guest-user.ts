import { AppService } from "./app.service";

export class GuestUser {
    private appService:AppService;
    
    constructor(_appService:AppService) {
        this.appService = _appService;
    }

}