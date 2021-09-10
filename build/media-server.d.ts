import { MeetingUserModel } from "./Models/meeting-user-model";
import { AppService } from "./app.service";
export declare class MediaServer {
    private appService;
    id: number;
    socket: any;
    device: any;
    producerTransport: any;
    videoProducer: any;
    audioProducer: any;
    consumerTransports: any;
    constructor(appService: AppService);
    load(): Promise<void>;
    produce(user: MeetingUserModel, localStream: MediaStream): Promise<void>;
    private createProducerTransport;
    private createProducer;
    private signal;
    consume(producerUser: MeetingUserModel): Promise<any>;
    private createConsumerTransport;
    addConsumer(consumerTransport: any, kind: string): Promise<void>;
    resumeConsumer(consumerTransport: any, kind: string): Promise<void>;
    private consumeTransport;
    pauseConsumer(consumerTransport: any, kind: string): Promise<void>;
    closeConsumer(user: MeetingUserModel): Promise<void>;
    private removeItemOnce;
    closeProducer(): Promise<void>;
}
