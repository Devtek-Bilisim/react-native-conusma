export declare class AppService {
    private appId;
    private apiUrl;
    private token;
    constructor(appId: string, parameters: {
        apiUrl: string;
    });
    setJwtToken(token: string): void;
    getJwtToken(): string;
    getMediaServer(meetingUserId: string): Promise<any>;
}
