import { User } from './User';
export default class Conusma {
    private appService;
    constructor(appId: string, parameters: {
        apiUrl: string;
    });
    CreateUser(): Promise<User>;
    CreateGuestUser(): Promise<void>;
}
