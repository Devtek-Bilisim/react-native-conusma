import { MeetingUserModel } from "./Models/meeting-user-model";
import * as mediaServerClient from 'mediasoup-client';
import { AppService } from "./app.service";
import { ConusmaException } from "./Exceptions/conusma-exception";
export class MediaServer {
    id: number = 0;
    socket: any = null;
    device: any = null;
    producerTransport:any;
    videoProducer:any;
    audioProducer:any;
    consumerTransports:any = [];

    constructor(private appService:AppService) {}

    public async load() {
        let routerRtpCapabilities = await this.signal('getRouterRtpCapabilities', null, this.socket);
        const handlerName = mediaServerClient.detectDevice();
        if (handlerName) {
            console.log("detected handler: %s", handlerName);
        } else {
            console.error("no suitable handler found for current device");
        }

        this.device = new mediaServerClient.Device({
            handlerName: handlerName
        });
     
        console.log("device loading...");
        await this.device.load({ routerRtpCapabilities });
        console.log("device loaded.");
    }

    public async createProducerTransport() {
        try {
                console.log("createProducerTransport started.");
                var transportOptions: any = await this.signal('createProducerTransport', {}, this.socket);
    
                this.producerTransport = await this.device.createSendTransport(transportOptions);
                this.producerTransport.on('connect', async ({ dtlsParameters }: any, callback: any, errback: any) => {
                    let error = await this.signal('connectProducerTransport', {
                        transportId: transportOptions.id,
                        dtlsParameters
                    }, this.socket);
                    callback();
                });
                
                this.producerTransport.on('produce', async ({ kind, rtpParameters, appData }: any,
                    callback: any, errback: any) => {
                    let paused = false;
                    paused = false;
                    let id = await this.signal('produce', {
                        transportId: transportOptions.id,
                        kind,
                        rtpParameters,
                        paused,
                        appData
                    }, this.socket);
                    callback(id)
                });
        } catch (error) {
            throw new ConusmaException("createProducerTransport", "createProducerTransport error", error);
        }
    }

    public async createProducer(localStream: MediaStream, kind: string) {
        try {
            if (kind == 'video') {
                const videoTrack = localStream.getVideoTracks()[0];
                this.videoProducer = await this.producerTransport.produce({
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
                this.audioProducer = await this.producerTransport.transport.produce({
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
    public closeProducer():void {

    }

    public consume(producerUser:MeetingUserModel):MediaStream {

    }

    public closeConsumer(user:MeetingUserModel):void {
        
    }

    

    
};