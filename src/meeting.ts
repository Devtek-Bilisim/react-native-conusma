import { AppService } from "./app.service";
import {
    mediaDevices, registerGlobals
} from 'react-native-webrtc';
import io from 'socket.io-client/dist/socket.io';
import { MeetingUserModel } from "./Models/meeting-user-model";
import { MeetingModel } from "./Models/meeting-model";
import { ParticipantModel } from "./Models/participant-model";
import { ConusmaException } from "./Exceptions/conusma-exception";
import { ConusmaWorker } from "./conusma-worker";
import InCallManager from 'react-native-incall-manager';
import DeviceInfo from 'react-native-device-info';
import { MediaServer } from "./media-server";



export type MediaServerConnectionReadyObserver = () => void;
export class Meeting {
    public ownerUser: MeetingUserModel;
    public users: MeetingUserModel[] = [];

    public conusmaWorker: ConusmaWorker;
    private observers: MediaServerConnectionReadyObserver[] = [];

    private appService: AppService;

    private mediaServerList: Array<MediaServer> = [];
   
    public isReceviedClose: boolean = false;

    private cameraCrashCounter = 2;
    constructor(ownerUser: MeetingUserModel, appService: AppService) {
        registerGlobals();
        this.appService = appService;
        this.ownerUser = ownerUser;
        this.conusmaWorker = new ConusmaWorker(this.appService, this.ownerUser);
    }

    public attach(observer: MediaServerConnectionReadyObserver) {
        this.observers.push(observer);
    }

    public detach(observerToRemove: MediaServerConnectionReadyObserver) {
        this.observers = this.observers.filter(observer => observerToRemove !== observer);
    }

    private notify() {
        this.observers.forEach(observer => observer());
    }
    
    public startWorker() {
        try {
            this.isReceviedClose = false;
            this.conusmaWorker.start();
            this.conusmaWorker.meetingWorkerEvent.on('meetingUsers', () => {
                console.log("Meeting users updated.");
            });
            this.conusmaWorker.meetingWorkerEvent.on('chatUpdates', () => {
                console.log("Chat updated.");
            });
            this.conusmaWorker.meetingWorkerEvent.on('meetingUpdate', () => {
                console.log("Meeting updated.");
            });
        } catch (error) {
            throw new ConusmaException("open", "can not open meeting , please check exception ", error);

        }

    }

    public async stopWorker(sendCloseRequest: boolean = false) {
        try {
            if (sendCloseRequest) {
                var closeData = { 'MeetingUserId': this.ownerUser.Id };
                await this.appService.liveClose(closeData);
            }
            this.isReceviedClose = true;
            if (this.conusmaWorker != null) {
                this.conusmaWorker.terminate();
            }
        } catch (error) {
            throw new ConusmaException("close", "can not close meeting , please check exception ", error);
        }

    }

    public async produce(user:MeetingUserModel, localStream: MediaStream) {
        try {
            const mediaServerModel: any = await this.getMediaServer(user.Id);
            await this.createClient(mediaServerModel, localStream);
        } catch (error) {
            throw new ConusmaException("produce", "can not send stream , please check exception ", error);

        }
    }

    private async getMediaServer(meetingUserId: string) {
        return await this.appService.getMediaServer(meetingUserId);
    }

    private async createClient(mediaServerModel: any, localStream: MediaStream) {
        var mediaServer: MediaServer = <MediaServer>this.mediaServerList.find((ms: any) => ms.Id == mediaServerModel.Id);
        
        if (mediaServer == null) {
            mediaServer = new MediaServer();
            mediaServer.id = mediaServerModel.Id;
            mediaServer.socket = io.connect(mediaServerModel.ConnectionDnsAddress + ":" + mediaServerModel.Port);
            this.mediaServerList.push(mediaServer);
            var userInfoData = { 'MeetingUserId': this.ownerUser.Id, 'Token': this.appService.getJwtToken() };
            let setUserInfo = await this.signal('UserInfo', userInfoData, mediaServer.socket);

        }
      
        mediaServer.socket.on('disconnect', async () => {
            if (!this.isReceviedClose) {
                throw new ConusmaException("mediaserverconnection", "mediaserverconnection disconnect");
            }
        });

        let routerRtpCapabilities = await this.signal('getRouterRtpCapabilities', null, mediaServer.socket);
        const handlerName = mediaServerClient.detectDevice();
        if (handlerName) {
            console.log("detected handler: %s", handlerName);
        } else {
            console.error("no suitable handler found for current device");
        }

        mediaServer.device = new mediaServerClient.Device({
            handlerName: handlerName
        });
     
        console.log("device loading...");
        await mediaServer.device.load({ routerRtpCapabilities });
        console.log("device loaded.");

        await this.createProducerTransport(mediaServer, localStream);
        this.notify();
    }
    private async createProducerTransport(user:MeetingUserModel, mediaServer:MediaServer, localStream: MediaStream) {
        try {
                console.log("createProducerTransport started.");
                var transportOptions: any = await this.signal('createProducerTransport', {}, mediaServer.socket);
    

                mediaServer.transport = await mediaServer.device.createSendTransport(transportOptions);
                mediaServer.transport.on('connect', async ({ dtlsParameters }: any, callback: any, errback: any) => {
                    let error = await this.signal('connectProducerTransport', {
                        transportId: transportOptions.id,
                        dtlsParameters
                    }, mediaServer.socket);
                    callback();
                });
                
                mediaServer.transport.on('produce', async ({ kind, rtpParameters, appData }: any,
                    callback: any, errback: any) => {
                    let paused = false;
                    paused = false;
                    let id = await this.signal('produce', {
                        transportId: transportOptions.id,
                        kind,
                        rtpParameters,
                        paused,
                        appData
                    }, mediaServer.socket);
                    callback(id)
                });
                if (user.Camera || user.ShareScreen) {
                    await this.createProducer(localStream, 'video');
                }
                if (user.Mic) {
                    await this.createProducer(localStream, 'audio');
                }
        
                user.MediaServerId = mediaServer.id;
                this.appService.connectMeeting(user);
        } catch (error) {
            throw new ConusmaException("createProducerTransport", "createProducerTransport error", error);
        }
    }
    private async createProducer(localStream: MediaStream, kind: string) {
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
                /*
                  // react-native-webrtc does not support setParameters
                  let aparameters = this.mediaServerClient.AudioProducer.rtpSender.getParameters();
                  if (!aparameters.encodings) {
                      aparameters.encodings = [{}];
                  }
                  aparameters.encodings[0].maxBitrate = 50 * 1000;
                  await this.mediaServerClient.AudioProducer.rtpSender.setParameters(aparameters);*/
            }

        } catch (error) {
            console.error("createProducer error. " + error);
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
    public switchCamera() {
        try {
            if (this.mediaServerClient != null && this.mediaServerClient.Stream != null) {

                var deviceModel: string = DeviceInfo.getModel();
                deviceModel = deviceModel.toLowerCase();
                if (deviceModel.includes('sm-n975') || deviceModel.includes('sm-g981') || deviceModel.includes('sm-g980')) {
                    if (this.cameraCrashCounter <= 0) {
                        throw new Error("camera switching is not supported on this model ");
                    }
                }
                this.mediaServerClient.Stream.getVideoTracks()[0]._switchCamera();
                this.cameraCrashCounter--;
                return this.mediaServerClient.Stream;
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
            if (this.mediaServerClient != null && this.mediaServerClient.Stream != null) {
                this.mediaServerClient.Stream.getTracks().forEach((t: any) => {
                    if (t.kind === 'audio') {
                        t.enabled = !t.enabled;
                        this.isAudioActive = t.enabled;

                    }
                });
                return <MediaStream>this.mediaServerClient.Stream;
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
            if (this.mediaServerClient != null && this.mediaServerClient.Stream != null) {
                this.isVideoActive = !this.isVideoActive;
                this.mediaServerClient.Stream.getVideoTracks()[0].enabled = this.isVideoActive;
                return <MediaStream>this.mediaServerClient.Stream;
            }
            else {
                throw new ConusmaException("toggleVideo", "stream not found, first call enableAudioVideo function");
            }

        } catch (error) {
            throw new ConusmaException("toggleVideo", "toggleVideo failed", error);
        }
    }

    public async enableAudioVideo() {
        try {

        } catch (error) {
            throw new ConusmaException("enableAudioVideo", "can not read stream , please check exception ", error);

        }
        const isFrontCamera = true;
        const devices = await mediaDevices.enumerateDevices();
        const facing = isFrontCamera ? 'front' : 'environment';
        const videoSourceId = devices.find(
            (device: any) => device.kind === 'videoinput' && device.facing === facing,
        );
        if (videoSourceId) {
            this.hasCamera = true;
            this.hasMicrophone = true; // TODO: Check audio source first
        }
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
                optional: videoSourceId ? [{ sourceId: videoSourceId }] : [],
            },
        };
        const newStream: MediaStream = await mediaDevices.getUserMedia(constraints);
        this.isAudioActive = true;
        this.isVideoActive = true;
        return newStream;
    }
    public async connectMeeting() {
        try {
            await this.appService.connectMeeting(this.meetingUser);
            console.log("User connected to the meeting.");
        } catch (error) {
            throw new ConusmaException("connectMeeting", "can not connect meeting , please check exception", error);
        }

    }
    public async isApproved() {
        try {
            return await this.appService.isApproved(this.meetingUser.Id);

        } catch (error) {
            throw new ConusmaException("isApproved", "user is not approved , please check exception ", error);
        }
    }
    public async consume(producerUser: MeetingUserModel) {
        try {
            var result = await this.createConsumerTransport(producerUser);
            this.consumerTransports.push(result);
            return <MediaStream>result.RemoteStream;
        } catch (error) {

            throw new ConusmaException("consume", producerUser.Id + "The stream of the user is currently not captured. User connection information is out of date.", error);
        }
    }

    public async closeConsumer(user: MeetingUserModel) {
        try {
            var index = 0;
            for (let item of this.consumerTransports) {
                if (item.MeetingUserId == user.Id) {
                    if (item.transport) {
                        item.transport.close();
                    }
                    break;
                }
                index++;
            };
            this.removeItemOnce(this.consumerTransports, index);
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
    private waitWhoAreYou(socket: any) {
        return new Promise(resolve => {
            socket.on("WhoAreYou")
            {
                console.log("WhoAreYou signal.");
                resolve({});
            }
        });
    }
    private async createConsumerTransport(user: MeetingUserModel) {
        var targetMediaServerClient: MediaServer = <MediaServer>this.mediaServerList.find((ms: any) => ms.Id == user.MediaServerId);

        if (targetMediaServerClient == null) {
            targetMediaServerClient = new MediaServer();

            var mediaServerInfo: any = await this.appService.getMediaServerById(this.meetingUser.Id, user.MediaServerId);
            if (mediaServerInfo == null) {
                throw new ConusmaException("createConsumerTransport", "Media server not found. (Id: " + user.MediaServerId + ")");
            }
            targetMediaServerClient.Id = mediaServerInfo.Id;
            targetMediaServerClient.socket = io.connect(mediaServerInfo.ConnectionDnsAddress + ":" + mediaServerInfo.Port);

            /*console.log("waiting WhoAreYou signal...");
            var waitResponse = await this.waitWhoAreYou(targetMediaServerClient.socket);
            console.log("WhoAreYou signal came.");*/

            var userInfoData = { 'MeetingUserId': this.meetingUser.Id, 'Token': this.appService.getJwtToken() };
            let setUserInfo = await this.signal('UserInfo', userInfoData, targetMediaServerClient.socket);
            console.log("UserInfo signal came.");

            let routerRtpCapabilities = await this.signal('getRouterRtpCapabilities', null, targetMediaServerClient.socket);
            console.log("routerRtpCapabilities " + JSON.stringify(routerRtpCapabilities));

            const handlerName = mediaServerClient.detectDevice();
            if (handlerName) {
                console.log("detected handler: %s", handlerName);
            } else {
                console.error("no suitable handler found for current device");
            }

            targetMediaServerClient.mediaServerDevice = new mediaServerClient.Device({
                handlerName: handlerName
            });
            console.log("mediaServerDevice loading...");
            await targetMediaServerClient.mediaServerDevice.load({ routerRtpCapabilities });
            console.log("mediaServerDevice loaded.");
            this.mediaServerList.push(targetMediaServerClient);
            return await this.createConsumerChildFunction(targetMediaServerClient, user);
        } else {
            return await this.createConsumerChildFunction(targetMediaServerClient, user);
        }
    }

    private async createConsumerChildFunction(targetMediaServerClient: MediaServer, user: MeetingUserModel) {
        if (targetMediaServerClient != null && targetMediaServerClient.socket != null) {
            console.log("createConsumerChildFunction start.");

            var consumerTransport: any = new Object();
            consumerTransport.MediaServer = targetMediaServerClient;
            consumerTransport.MeetingUserId = user.Id;
            var transportOptions = await this.signal("createConsumerTransport", { MeetingUserId: user.Id }, targetMediaServerClient.socket);
            consumerTransport.MediaServerSocketId = user.MediaServerSocketId;
            consumerTransport.transportId = transportOptions.Id;
            consumerTransport.transport = await targetMediaServerClient.mediaServerDevice.createRecvTransport(transportOptions.transportOptions);
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

    private async resumeConsumer(consumerTransport: any, kind: string) {
        this.signal('resume', { consumerTransportId: consumerTransport.transportId, kind: kind }, consumerTransport.MediaServer.socket);
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

    public async getAllUsers() {
        try {
            if (this.meetingUser != null) {
                return <MeetingUserModel[]>await this.appService.getMeetingUserList({ 'MeetingUserId': this.meetingUser.Id });
            } else {
                return [];
            }

        } catch (error) {
            throw new ConusmaException("getAllUsers", "Unable to fetch user list, please check detail exception");
        }

    }

    public async getProducerUsers() {
        try {
            if (this.meetingUser != null) {
                var users = await this.appService.getMeetingUserList({ 'MeetingUserId': this.meetingUser.Id });
                var result: MeetingUserModel[] = [];
                users.forEach((item: any) => {
                    if (item.Camera == true) {
                        result.push(item);
                    }
                });
                return result;
            } else {
                return [];
            }
        } catch (error) {
            throw new ConusmaException("getProducerUsers", "Unable to fetch producer user list, please check detail exception");
        }

    }
}