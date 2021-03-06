import { AppService } from "./app.service";
import { MeetingUserModel } from "./Models/meeting-user-model";
import { ConusmaWorker } from "./conusma-worker";
import { MediaServer } from "./media-server";
import { Connection } from "./connection";
import { MeetingModel } from "./Models/meeting-model";
import { SpeakerEnum } from "./Enums/speaker-enum";
import { ActiveSpeakers } from "./Components/active-speakers";
export declare class Meeting {
    activeUser: MeetingUserModel;
    conusmaWorker: ConusmaWorker;
    mediaServers: MediaServer[];
    connections: Connection[];
    private appService;
    isClosedRequestRecieved: boolean;
    speakerState: boolean;
    private emiterheadphone;
    activeSpeakers: ActiveSpeakers;
    constructor(activeUser: MeetingUserModel, appService: AppService);
    open(): void;
    close(sendCloseRequest?: boolean): Promise<void>;
    closeForAll(): Promise<void>;
    getMeetingInfo(): Promise<MeetingModel>;
    private createMediaServer;
    private signal;
    enableAudioVideo(): Promise<MediaStream>;
    connectMeeting(): Promise<void>;
    isApproved(): Promise<any>;
    private waitWhoAreYou;
    getAllUsers(): Promise<MeetingUserModel[]>;
    getProducerUsers(): Promise<MeetingUserModel[]>;
    setSpeaker(enable: boolean): void;
    selectSpeaker(speaker: SpeakerEnum): void;
    private headphone;
    produce(localStream: MediaStream): Promise<Connection>;
    closeProducer(): Promise<void>;
    private removeItemOnce;
    consume(user: MeetingUserModel): Promise<Connection>;
    closeConsumer(connection: Connection): Promise<void>;
    private createConnectionForProducer;
    private createConnectionForConsumer;
}
