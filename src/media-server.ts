import { MeetingUserModel } from "./Models/meeting-user-model";
import * as mediaServerClient from 'mediasoup-client';
import { AppService } from "./app.service";
export class MediaServer {
    id: number = 0;
    socket: any = null;
    device: any = null;
    producerTransport:any;
    videoProducer:any;
    audioProducer:any;
    consumerTransports:any = [];

    constructor(private appService:AppService) {}

    public async produce(user:MeetingUserModel, localStream: MediaStream) {
        try {
            const mediaServerModel: any = await this.getMediaServer(user.Id);
            await this.createClient(mediaServerModel, localStream);
        } catch (error) {
            throw new ConusmaException("produce", "can not send stream , please check exception ", error);

        }
    }

    public closeProducer():void {

    }

    public consume(producerUser:MeetingUserModel):MediaStream {

    }

    public closeConsumer(user:MeetingUserModel):void {
        
    }

    

    
};