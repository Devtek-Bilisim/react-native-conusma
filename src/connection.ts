import { MeetingUserModel } from "./Models/meeting-user-model";
import { MediaServer } from "./media-server";
import { AppService } from "./app.service";
import { ConusmaException } from "./Exceptions/conusma-exception";
import DeviceInfo from 'react-native-device-info';
export class Connection {
    user:MeetingUserModel;
    mediaServer:MediaServer;
    stream:MediaStream;
    isProducer:boolean = false;

    private cameraCrashCounter = 2;
    
    public isAudioActive = true;
    public isVideoActive = true;

    constructor(user:MeetingUserModel, mediaServer:MediaServer) {
        this.user = user;
        this.mediaServer = mediaServer;
        this.stream = new MediaStream();
    }
    
    public switchCamera() {
        try {
            if (this.isProducer && this.stream != null) {

                var deviceModel: string = DeviceInfo.getModel();
                deviceModel = deviceModel.toLowerCase();
                if (deviceModel.includes('sm-n975') || deviceModel.includes('sm-g981') || deviceModel.includes('sm-g980')) {
                    if (this.cameraCrashCounter <= 0) {
                        throw new Error("camera switching is not supported on this model ");
                    }
                }
                (this.stream as any).getVideoTracks()[0]._switchCamera();
                this.cameraCrashCounter--;
                return this.stream;
            }
            else {
                throw new Error("stream not found, first call enableAudioVideo function");
            }

        } catch (error) {
            throw new ConusmaException("switchCamera", "camera switching failed, please check detail exception", error);
        }
    }

    public toggleAudio() {
        try {
            if (this.isProducer && this.stream != null) {
                this.stream.getTracks().forEach((t: any) => {
                    if (t.kind === 'audio') {
                        t.enabled = !t.enabled;
                        this.isAudioActive = t.enabled;

                    }
                });
                return this.isAudioActive;
            }
            else {
                throw new ConusmaException("toggleAudio", "stream not found, first call enableAudioVideo function");
            }

        } catch (error) {
            throw new ConusmaException("toggleAudio", "toggleAudio failed", error);
        }
    }
    public toggleVideo() {
        try {
            if (this.isProducer && this.stream != null) {
                this.isVideoActive = !this.isVideoActive;
                this.stream.getVideoTracks()[0].enabled = this.isVideoActive;
                return this.isVideoActive;
            }
            else {
                throw new ConusmaException("toggleVideo", "stream not found, first call enableAudioVideo function");
            }

        } catch (error) {
            throw new ConusmaException("toggleVideo", "toggleVideo failed", error);
        }
    }
}