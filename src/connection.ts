import { MeetingUserModel } from "./Models/meeting-user-model";
import { MediaServer } from "./media-server";
import { AppService } from "./app.service";
import { ConusmaException } from "./Exceptions/conusma-exception";
import DeviceInfo from 'react-native-device-info';
import InCallManager from 'react-native-incall-manager';
export class Connection {
    user:MeetingUserModel;
    mediaServer:MediaServer;
    localStream:MediaStream;
    remoteStream:MediaStream;

    private cameraCrashCounter = 2;
    private appService:AppService;
    private isAudioActive = true;
    private isVideoActive = true;
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

    public switchCamera() {
        try {
            if (this.mediaServer != null && this.mediaServer.Stream != null) {

                var deviceModel: string = DeviceInfo.getModel();
                deviceModel = deviceModel.toLowerCase();
                if (deviceModel.includes('sm-n975') || deviceModel.includes('sm-g981') || deviceModel.includes('sm-g980')) {
                    if (this.cameraCrashCounter <= 0) {
                        throw new Error("camera switching is not supported on this model ");
                    }
                }
                this.mediaServer.Stream.getVideoTracks()[0]._switchCamera();
                this.cameraCrashCounter--;
                return this.mediaServer.Stream;
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
            if (this.mediaServer != null && this.mediaServer.Stream != null) {
                this.mediaServer.Stream.getTracks().forEach((t: any) => {
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
            if (this.mediaServer != null && this.mediaServer.Stream != null) {
                this.isVideoActive = !this.isVideoActive;
                this.mediaServer.Stream.getVideoTracks()[0].enabled = this.isVideoActive;
                return this.isVideoActive;
            }
            else {
                throw new ConusmaException("toggleVideo", "stream not found, first call enableAudioVideo function");
            }

        } catch (error) {
            throw new ConusmaException("toggleVideo", "toggleVideo failed", error);
        }
    }
    private async signal(type: string, data: any = null, mediaServerSocket: any): Promise<any> {
        if (mediaServerSocket != null) {
            return new Promise((resolve, reject) => {
                mediaServerSocket.emit(type, data, (err: any, response: any) => {
                    if (!err) {
                        resolve(response);
                    } else {
                        reject(err);
                    }
                });
            });
        }
        else {
            console.error("no socket connection " + type);
        }
    }
    
    public async consume(producerUser: MeetingUserModel) {
        try {
            var result = await this.createConsumerTransport(this.mediaServer, producerUser);
            this.mediaServer.consumerTransports.push(result);
            return <MediaStream>result.RemoteStream;
        } catch (error) {

            throw new ConusmaException("consume", producerUser.Id + "The stream of the user is currently not captured. User connection information is out of date.", error);
        }
    }

    private async createConsumerTransport(targetMediaServerClient: MediaServer, user: MeetingUserModel) {
        if (targetMediaServerClient != null && targetMediaServerClient.socket != null) {
            console.log("createConsumerChildFunction start.");

            var consumerTransport: any = new Object();
            consumerTransport.MediaServer = targetMediaServerClient;
            consumerTransport.MeetingUserId = user.Id;
            var transportOptions = await this.signal("createConsumerTransport", { MeetingUserId: user.Id }, targetMediaServerClient.socket);
            consumerTransport.MediaServerSocketId = user.MediaServerSocketId;
            consumerTransport.transportId = transportOptions.Id;
            consumerTransport.transport = await targetMediaServerClient.device.createRecvTransport(transportOptions.transportOptions);
            consumerTransport.transport.on("connect", async ({ dtlsParameters }: any, callback: any, errback: any) => {
                this.signal("connectConsumerTransport", { consumerTransportId: consumerTransport.transportId, dtlsParameters: dtlsParameters }, targetMediaServerClient.socket)
                    .then(callback)
                    .catch(errback);
            });
            consumerTransport.RemoteStream = new MediaStream();
            consumerTransport.Camera = user.Camera;
            consumerTransport.Mic = user.Mic;
            consumerTransport.ShareScreen = user.ShareScreen;
            console.log("createConsumerChildFunction creating the consumer.");

            if (user.Camera || user.ShareScreen) {
                await this.addConsumer(consumerTransport, "video");
            }

            if (user.Mic) {
                await this.addConsumer(consumerTransport, "audio");
            }
            return consumerTransport;
        } else {
            throw new ConusmaException("createConsumerChildFunction", "No socket connection.");
        }
    }

    private async addConsumer(consumerTransport: any, kind: string) {
        if (consumerTransport != null) {
            if (kind == "video") {
                consumerTransport.videoConsumer = await this.consumeTransport(consumerTransport, "video");
                this.resumeConsumer(consumerTransport, "video");
                consumerTransport.RemoteStream.addTrack(consumerTransport.videoConsumer.track);
            } else {
                consumerTransport.audioConsumer = await this.consumeTransport(consumerTransport, "audio");
                this.resumeConsumer(consumerTransport, "audio");
                consumerTransport.RemoteStream.addTrack(consumerTransport.audioConsumer.track);
                consumerTransport.audioConsumer.resume();
            }
        }
    }
    private async resumeConsumer(consumerTransport: any, kind: string) {
        this.signal('resume', { consumerTransportId: consumerTransport.transportId, kind: kind }, consumerTransport.MediaServer.socket);
    }


    private async consumeTransport(consumerTransport: any, trackKind: string) {
        const { rtpCapabilities } = consumerTransport.MediaServer.mediaServerDevice;
        const data = await this.signal("consume", { consumerTransportId: consumerTransport.transportId, rtpCapabilities: rtpCapabilities, kind: trackKind }, consumerTransport.MediaServer.socket)
            .catch(err => {
                throw new ConusmaException("consumeTransport", "Consume error.", err);
            });
        const {
            producerId,
            id,
            kind,
            rtpParameters,
        } = data;
        let codecOptions = {};
        const consumer = await consumerTransport.transport.consume({
            id,
            producerId,
            kind,
            rtpParameters,
            codecOptions,
        });
        return consumer;
    }

      
    private async pauseConsumer(consumerTransport: any, kind: string) {
        try {
            if (consumerTransport != null && consumerTransport.videoConsumer != null) {
                if (kind == 'video') {
                    await this.signal('pause', {
                        kind: 'video',
                        consumerTransportId: consumerTransport.transportId
                    }, consumerTransport.MediaServer.socket);
                    await consumerTransport.videoConsumer.pause();;
                    consumerTransport.RemoteStream.removeTrack(consumerTransport.videoConsumer.track);
                }
                else if (kind == 'audio' && consumerTransport.audioConsumer != null) {
                    await this.signal('pause', {
                        kind: 'audio',
                        consumerTransportId: consumerTransport.transportId
                    }, consumerTransport.MediaServer.socket);
                    await consumerTransport.audioConsumer.pause();
                    consumerTransport.RemoteStream.removeTrack(consumerTransport.audioConsumer.track);
                }
            }
        } catch (error) {

        }
    }
    public async closeConsumer(user: MeetingUserModel) {
        try {
            var index = 0;
            for (let item of this.mediaServer.consumerTransports) {
                if (item.MeetingUserId == user.Id) {
                    if (item.transport) {
                        item.transport.close();
                    }
                    break;
                }
                index++;
            };
            this.removeItemOnce(this.mediaServer.consumerTransports, index);
        } catch (error) {
            throw new ConusmaException("isApproved", "user is not approved , please check exception ", error);
        }

    }

    private removeItemOnce(arr: any, index: any) {
        if (index > -1) {
            arr.splice(index, 1);
        }
        return arr;
    }

    public setSpeaker(enable: boolean) {
        try {
            InCallManager.setSpeakerphoneOn(enable);
            InCallManager.setForceSpeakerphoneOn(enable);

        } catch (error) {
            throw new ConusmaException("setSpeaker", "setSpeaker undefined error", error);
        }
    }
}