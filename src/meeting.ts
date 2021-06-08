import { AppService } from "./app.service";
import * as mediaServerClient from 'mediasoup-client';
import {
  mediaDevices,
} from 'react-native-webrtc';
import io from 'socket.io-client/dist/socket.io';
import { MeetingUserModel } from "./Models/meeting-user-model";
import { MeetingModel } from "./Models/meeting-model";
import { ParticipantModel } from "./Models/participant-model";
import { ConusmaException } from "./Exceptions/conusma-exception";
class MediaServer {
  Id: number = 0;
  socket: any = null;
  mediaServerDevice:any = null;
};
export type MediaServerConnectionReadyObserver = () => void;
export class Meeting {
    public meetingUser:MeetingUserModel;
    public activeMeeting:MeetingModel;
    
    private observers: MediaServerConnectionReadyObserver[] = [];

    private appService:AppService;
    
    private mediaServerList:Array<MediaServer> = [];
    private mediaServerSocket:any;
    private mediaServerDevice:any;
    private mediaServerClient:any;
    private hasCamera:boolean = false;
    private hasMicrophone:boolean = false;
    private isScreenShare:boolean = false;
    constructor(appService:AppService){
        this.appService = appService;
        this.meetingUser = new MeetingUserModel();
        this.activeMeeting = new MeetingModel();
    }
    
    public attach(observer:MediaServerConnectionReadyObserver) {
        this.observers.push(observer);
    }

    public detach(observerToRemove:MediaServerConnectionReadyObserver) {
        this.observers = this.observers.filter(observer => observerToRemove !== observer);
    }

    private notify() {
        this.observers.forEach(observer => observer());
    }

    public async open(state:boolean = false) {
        const mediaServer:any = await this.getMediaServer(this.meetingUser.Id);
        await this.createClient(mediaServer);
    }

    public async close(state:boolean) {

    }

    private async getMediaServer(meetingUserId:string) {
        var response = await this.appService.getMediaServer(meetingUserId);
    }

    private async createClient(mediaServer:any) {
        var mediaServerElement:MediaServer = <MediaServer>this.mediaServerList.find((ms:any) => ms.Id == mediaServer.Id);
        if (mediaServerElement == null) {
        mediaServerElement = new MediaServer();
        mediaServerElement.Id = mediaServer.Id;
        mediaServerElement.socket = io.connect(mediaServer.ConnectionDnsAddress + ":" + mediaServer.Port);
        this.mediaServerList.push(mediaServerElement);
        }
        this.mediaServerSocket = mediaServerElement.socket;
        this.mediaServerSocket.on('disconnect', async () => {
            await this.close(false);
            await this.open();
        });
        this.mediaServerSocket.on('WhoAreYou', async () => {
        var userInfoData = { 'MeetingUserId': this.meetingUser.Id, 'Token': this.appService.getJwtToken() };
        let setUserInfo = await this.signal('UserInfo', userInfoData, this.mediaServerSocket);
        let routerRtpCapabilities = await this.signal('getRouterRtpCapabilities', null, this.mediaServerSocket);

        const handlerName = mediaServerClient.detectDevice();
        if (handlerName) {
            console.log("detected handler: %s", handlerName);
        } else {
            console.error("no suitable handler found for current device");
        }

        this.mediaServerDevice = new mediaServerClient.Device({
                handlerName: handlerName
            });
            mediaServerElement.mediaServerDevice = this.mediaServerDevice;
            await this.mediaServerDevice.load({ routerRtpCapabilities });
            this.notify();
        });
    }

    private async createProducerTransport(localStream:MediaStream) {
        try {
            if (this.mediaServerClient != null) {
                await this.close(false);
                await this.open();
            }
            else {
                var transportOptions: any = await this.signal('createProducerTransport', {}, this.mediaServerSocket);
                this.mediaServerClient = new Object();
                this.mediaServerClient.transportId = transportOptions.id;
                this.mediaServerClient.transport = await this.mediaServerDevice.createSendTransport(transportOptions);
                this.mediaServerClient.transport.on('connect', async ({ dtlsParameters }:any, callback:any, errback:any) => {
                    let error = await this.signal('connectProducerTransport', {
                        transportId: transportOptions.id,
                        dtlsParameters
                    }, this.mediaServerSocket);
                    callback();
                });
                this.mediaServerClient.transport.on('produce', async ({ kind, rtpParameters, appData }:any,
                    callback:any, errback:any) => {
                    let paused = false;
                    paused = false;
                    let id = await this.signal('produce', {
                        transportId: this.mediaServerClient.transportId,
                        kind,
                        rtpParameters,
                        paused,
                        appData
                    }, this.mediaServerSocket);
                    callback(id)
                });
                if (this.hasCamera || this.isScreenShare) {
                    await this.createProducer(localStream, 'video');
                }
                if (this.hasMicrophone) {
                    await this.createProducer(localStream, 'audio');
                }

                this.mediaServerClient.Camera = this.hasCamera;
                this.mediaServerClient.Mic = this.hasMicrophone;
                this.mediaServerClient.Stream = localStream;
                this.mediaServerClient.MeetingUserId = this.meetingUser.Id;
                this.mediaServerClient.RemoteStream = null;
            }
        } catch (error) {
            console.error("createProducerTransport error. " + error);
            await this.close(false);
            await this.open();
        }
    }
    private async createProducer(localStream:MediaStream, kind:string) {
        try {
            if (kind == 'video') {
                const videoTrack = localStream.getVideoTracks()[0];
                this.mediaServerClient.VideoProducer = await this.mediaServerClient.transport.produce({
                    track: videoTrack,
                    encodings: [
                        { maxBitrate: 500000 },
                        { maxBitrate: 1000000 },
                        { maxBitrate: 2000000 }
                    ],
                    codecOptions:
                    {
                        videoGoogleStartBitrate: 1000
                    },
                    appData: { mediaTag: 'video' }
                });
            }
            else if (kind == 'audio') {
                this.mediaServerClient.AudioProducer = await this.mediaServerClient.transport.produce({
                    track: localStream.getAudioTracks()[0],
                    appData: { mediaTag: 'audio' }
                });
                let aparameters = this.mediaServerClient.AudioProducer.rtpSender.getParameters();
                if (!aparameters.encodings) {
                    aparameters.encodings = [{}];
                }
                aparameters.encodings[0].maxBitrate = 50 * 1000;
                await this.mediaServerClient.AudioProducer.rtpSender.setParameters(aparameters);
            }

        } catch (error) {
            console.error("createProducer error. " + error);
        }
    }
    private async signal(type: string, data:any = null, mediaServerSocket:any): Promise<any> {
        if (mediaServerSocket != null) {
            return new Promise((resolve, reject) => {
                mediaServerSocket.emit(type, data, (err:any, response:any) => {
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
    public async enableAudioVideo() {
        const isFrontCamera = true;
        const devices = await mediaDevices.enumerateDevices();
        const facing = isFrontCamera ? 'front' : 'environment';
        const videoSourceId = devices.find(
        (device: any) => device.kind === 'videoinput' && device.facing === facing,
        );
        const facingMode = isFrontCamera ? 'user' : 'environment';
        const constraints: any = {
        audio: true,
        video: {
            mandatory: {
            minWidth: 500,
            minHeight: 300,
            minFrameRate: 30,
            },
            facingMode,
            optional: videoSourceId ? [{sourceId: videoSourceId}] : [],
        },
        };
        const newStream:any = await mediaDevices.getUserMedia(constraints);
        await this.createProducerTransport(newStream);
        return newStream;
    }

    public async consume(participant:ParticipantModel) {

    }

    private async createConsumerTransport(user:MeetingUserModel) {
        var targetMediaServerClient:MediaServer = <MediaServer>this.mediaServerList.find((ms:any) => ms.Id == user.MediaServerId);

        if (targetMediaServerClient == null) {
            targetMediaServerClient = new MediaServer();

            var mediaServerInfo:any = await this.appService.getMediaServerById(this.meetingUser.Id, user.MediaServerId);
            if (mediaServerInfo == null) {
                throw new ConusmaException("createConsumerTransport", "Media server not found. (" + user.MediaServerId + ")");
            }

            targetMediaServerClient.Id = mediaServerInfo.Id;
            targetMediaServerClient.socket = io.connect(mediaServerInfo.ConnectionDnsAddress + ":" + mediaServerInfo.Port);

            var userInfoData:any = { 'MeetingUserId': this.meetingUser.Id, 'Token': this.appService.getJwtToken()};
            let setUserInfo = await this.signal("UserInfo", userInfoData, targetMediaServerClient.socket);
            let routerRtpCapabilities = await this.signal("getRouterRtpCapabilities", null, targetMediaServerClient.socket);
            const handlerName = mediaServerClient.detectDevice();
            if (handlerName) {
                console.log("detected handler: %s", handlerName);
            } else {
                console.error("no suitable handler found for current device");
            }
            targetMediaServerClient.mediaServerDevice = new mediaServerClient.Device({
                handlerName: handlerName
            });
            this.mediaServerList.push(targetMediaServerClient);
            return await this.createConsumerChildFunction(targetMediaServerClient, user);
        }  else {
            return await this.createConsumerChildFunction(targetMediaServerClient, user);
        }
    }

    private async createConsumerChildFunction(targetMediaServerClient:MediaServer, user:MeetingUserModel) {
        if (targetMediaServerClient != null && targetMediaServerClient.socket != null) {
            var consumerTransport: any = new Object();
            consumerTransport.MediaServer = targetMediaServerClient;
            consumerTransport.MeetingUserId = user.Id;
            var transportOptions = await this.signal("createConsumerTransport", { MeetingUserId: user.Id }, targetMediaServerClient.socket);
            consumerTransport.MediaServerSocketId = user.MediaServerSocketId;
            consumerTransport.transportId = transportOptions.Id;
            consumerTransport.transport = await targetMediaServerClient.mediaServerDevice.createRecvTransport(transportOptions.transportOptions);
            consumerTransport.transport.on("connect", async ( {dtlsParameters}:any, callback:any, errback:any) => {
                this.signal("connectConsumerTransport", { consumerTransportId: consumerTransport.transportId, dtlsParameters: dtlsParameters }, targetMediaServerClient.socket)
                .then(callback)
                .catch(errback);
            });
            
            consumerTransport.RemoteStream = new MediaStream();
            consumerTransport.Camera = user.Camera;
            consumerTransport.Mic = user.Mic;
            consumerTransport.ShareScreen = user.ShareScreen;
            if (user.Camera || user.ShareScreen) {
                await this.addConsumer(consumerTransport, "video");
                await this.pauseConsumer(consumerTransport, "video");
            }

            if (user.Mic) {
                await this.addConsumer(consumerTransport, "audio");
            }
        }
    }

    private async addConsumer(consumerTransport:any, kind:string) {
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

    private async consumeTransport(consumerTransport:any, trackKind: string) {
        const { rtpCapabilities } = this.mediaServerDevice;
        const data = await this.signal("consume", { consumerTransportId: consumerTransport.transportId, rtpCapabilities: rtpCapabilities, kind: trackKind }, consumerTransport.MediaServer.socket)
        .catch(err => {
            throw new ConusmaException("consumeTransport", "Consume error: " + err)
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

    private async resumeConsumer(consumerTransport:any, kind:string) {
        this.signal('resume', { consumerTransportId: consumerTransport.transportId, kind: kind }, consumerTransport.MediaServer.socket);
    }
    private async pauseConsumer(consumerTransport:any, kind:string) {
        try {
            if (consumerTransport != null && consumerTransport.videoConsumer != null) {
                if (kind == 'video') {
                    await this.signal('pause', {
                        kind: 'video',
                        consumerTransportId: consumerTransport.transportId
                    }, consumerTransport.MediaServer.socket);
                    await consumerTransport.videoConsumer.pause();;
                    consumerTransport.RStream.removeTrack(consumerTransport.videoConsumer.track);
                }
                else if (kind == 'audio' && consumerTransport.audioConsumer != null) {
                    await this.signal('pause', {
                        kind: 'audio',
                        consumerTransportId: consumerTransport.transportId
                    }, consumerTransport.MediaServer.socket);
                    await consumerTransport.audioConsumer.pause();
                    consumerTransport.RStream.removeTrack(consumerTransport.audioConsumer.track);
                }
            }
        } catch (error) {

        }
    }
}