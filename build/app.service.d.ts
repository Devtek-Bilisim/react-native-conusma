export declare class AppService {
    private appId;
    private apiUrl;
    private token;
    private deviceId;
    constructor(appId: string, parameters: {
        apiUrl: string;
        deviceId: string;
    });
    setJwtToken(token: string): void;
    getJwtToken(): string;
    createUserWithDeviceID(): Promise<any>;
    getMediaServer(meetingUserId: string): Promise<any>;
}
