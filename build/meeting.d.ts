import { AppService } from "./app.service";
export declare type MediaServerConnectionReadyObserver = () => void;
export declare class Meeting {
    private observers;
    private appService;
    meetingUser: any;
    private mediaServerList;
    private mediaServerSocket;
    private mediaServerDevice;
    private mediaServerClient;
    private hasCamera;
    private hasMicrophone;
    private isScreenShare;
    constructor(appService: AppService);
    attach(observer: MediaServerConnectionReadyObserver): void;
    detach(observerToRemove: MediaServerConnectionReadyObserver): void;
    private notify;
    open(state?: boolean): Promise<void>;
    close(state: boolean): Promise<void>;
    private getMediaServer;
    private createClient;
    private createProducerTransport;
    private createProducer;
    private signal;
    enableAudioVideo(): Promise<any>;
}
