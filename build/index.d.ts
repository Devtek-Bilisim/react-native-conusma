import { User } from './user';
export default class Conusma {
    private appService;
    constructor(appId: string, parameters: {
        apiUrl: string;
    });
    createUser(): Promise<User>;
    createGuestUser(): Promise<void>;
}
