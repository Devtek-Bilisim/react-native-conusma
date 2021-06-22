import { MeetingUserModel } from "./Models/meeting-user-model";
import { MediaServer } from "./media-server";
import { AppService } from "./app.service";
import { ConusmaException } from "./Exceptions/conusma-exception";

export class Connection {
    user:MeetingUserModel;
    mediaServer:MediaServer;
    localStream:MediaStream;
    remoteStream:MediaStream;
    private appService:AppService;
    
    constructor(user:MeetingUserModel, mediaServer:MediaServer, appService:AppService) {
        this.user = user;
        this.mediaServer = mediaServer;
        this.localStream = new MediaStream();
        this.remoteStream = new MediaStream();
        this.appService = appService;
    }

    public async produce(localStream:MediaStream) {
        try { 
            this.localStream = localStream;
            await this.mediaServer.createProducerTransport();
            if (this.user.Camera || this.user.ShareScreen) {
                await this.mediaServer.createProducer(localStream, 'video');
            }
            if (this.user.Mic) {
                await this.mediaServer.createProducer(localStream, 'audio');
            }
            this.user.MediaServerId = this.mediaServer.id;
            this.appService.connectMeeting(this.user);

        } catch (error) {
            throw new ConusmaException("produce", "can not send stream, please check exception", error);
        }
    }
}