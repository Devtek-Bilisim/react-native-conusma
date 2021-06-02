import { AppService } from "./app.service";

export class GusetUser {
    private appService:AppService ;
    constructor(_appService:AppService) {
        this.appService = _appService;
    }

}