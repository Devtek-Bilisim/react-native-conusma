import { AppService } from "./app.service";
import { MeetingUserModel } from "./Models/meeting-user-model";
import { ConusmaWorker } from "./conusma-worker";
export declare type MediaServerConnectionReadyObserver = () => void;
export declare class Meeting {
    meetingUser: MeetingUserModel;
    conusmaWorker: ConusmaWorker;
    private observers;
    private appService;
    private mediaServerList;
    private mediaServerSocket;
    private mediaServerDevice;
    private mediaServerClient;
    private hasCamera;
    private hasMicrophone;
    private isScreenShare;
    isAudioActive: boolean;
    isVideoActive: boolean;
    constructor(meetingUser: MeetingUserModel, appService: AppService);
    attach(observer: MediaServerConnectionReadyObserver): void;
    detach(observerToRemove: MediaServerConnectionReadyObserver): void;
    private notify;
    open(localStream: MediaStream): Promise<void>;
    close(sendCloseRequest?: boolean): Promise<void>;
    private getMediaServer;
    private createClient;
    private createProducerTransport;
    private createProducer;
    private signal;
    switchCamera(localStream: MediaStream): void;
    toggleAudio(localStream: MediaStream): boolean;
    toggleVideo(localStream: MediaStream): boolean;
    enableAudioVideo(): Promise<MediaStream>;
    connectMeeting(): Promise<void>;
    isApproved(): Promise<any>;
    consume(producerUser: MeetingUserModel): Promise<any>;
    private waitWhoAreYou;
    private createConsumerTransport;
    private createConsumerChildFunction;
    private addConsumer;
    private consumeTransport;
    private resumeConsumer;
    private pauseConsumer;
    getAllUsers(): Promise<MeetingUserModel[]>;
    getProducerUsers(): Promise<MeetingUserModel[]>;
}
