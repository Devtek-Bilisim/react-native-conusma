import { AppService } from "./app.service";
import { GuestUserModel } from "./Models/guset-user-model";
export declare class GuestUser {
    private appService;
    constructor(_appService: AppService);
    userInfo: GuestUserModel;
    create(): Promise<void>;
}
