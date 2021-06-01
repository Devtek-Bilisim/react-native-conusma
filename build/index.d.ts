export default class Conusma {
    private appService;
    meetingUser: any;
    private mediaServerList;
    private mediaServerSocket;
    private mediaServerDevice;
    constructor(appId: string, parameters: {
        apiUrl: string;
    });
    open(): Promise<void>;
    close(state: boolean): Promise<void>;
    private getMediaServer;
    private createClient;
    private createProducerTransport;
    private signal;
    enableAudioVideo(): Promise<any>;
}
