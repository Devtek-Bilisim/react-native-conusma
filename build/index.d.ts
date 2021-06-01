export default class Conusma {
    private appId;
    private apiUrl;
    meetingUser: any;
    constructor(appId: string, parameters: {
        apiUrl: string;
    });
    open(): Promise<void>;
    private getMediaServer;
    private createClient;
    enableAudioVideo(): Promise<any>;
}
