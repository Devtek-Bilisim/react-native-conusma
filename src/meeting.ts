import { AppService } from "./app.service";
import {
    mediaDevices, registerGlobals
} from 'react-native-webrtc';
import io from 'socket.io-client/dist/socket.io';
import { MeetingUserModel } from "./Models/meeting-user-model";
import { ConusmaException } from "./Exceptions/conusma-exception";
import { ConusmaWorker } from "./conusma-worker";
import InCallManager from 'react-native-incall-manager';

import { MediaServer } from "./media-server";
import { Connection } from "./connection";


export class Meeting {
    public activeUser: MeetingUserModel;
    public conusmaWorker: ConusmaWorker;

    public mediaServers: Array<MediaServer> = [];
    public connections: Array<Connection> = [];

    private appService: AppService;

    public isClosedRequestRecieved: boolean = false;
    

    constructor(activeUser: MeetingUserModel, appService: AppService) {
        registerGlobals();
        this.appService = appService;
        this.activeUser = activeUser;
        this.conusmaWorker = new ConusmaWorker(this.appService, this.activeUser);
    }

    public startWorker() {
        try {
            this.isClosedRequestRecieved = false;
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
            throw new ConusmaException("startWorker", "cannot start worker, please check exception", error);

        }
    }

    public async stopWorker(sendCloseRequest: boolean = false) {
        try {
            if (sendCloseRequest) {
                var closeData = { 'MeetingUserId': this.activeUser.Id };
                await this.appService.liveClose(closeData);
            }
            this.isClosedRequestRecieved = true;
            if (this.conusmaWorker != null) {
                this.conusmaWorker.terminate();
            }
        } catch (error) {
            throw new ConusmaException("stopWorker", "can not stop worker, please check exception", error);
        }
    }

    private async getMediaServer(meetingUserId: string) {
        return await this.appService.getMediaServer(meetingUserId);
    }

    private async createMediaServer(mediaServerModel: any) {
        var mediaServer: MediaServer = <MediaServer>this.mediaServers.find((ms: any) => ms.Id == mediaServerModel.Id);
        
        if (mediaServer == null) {
            mediaServer = new MediaServer(this.appService);
            mediaServer.id = mediaServerModel.Id;
            mediaServer.socket = io.connect(mediaServerModel.ConnectionDnsAddress + ":" + mediaServerModel.Port);
            this.mediaServers.push(mediaServer);
            var userInfoData = { 'MeetingUserId': this.activeUser.Id, 'Token': this.appService.getJwtToken() };
            let setUserInfo = await this.signal('UserInfo', userInfoData, mediaServer.socket);

        }
      
        mediaServer.socket.on('disconnect', async () => {
            if (!this.isClosedRequestRecieved) {
                throw new ConusmaException("mediaserverconnection", "mediaserverconnection disconnect");
            }
        });

        await mediaServer.load();
        
        return mediaServer;
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
        return newStream;
    }
    public async connectMeeting() {
        try {
            await this.appService.connectMeeting(this.activeUser);
            console.log("User connected to the meeting.");
        } catch (error) {
            throw new ConusmaException("connectMeeting", "can not connect meeting , please check exception", error);
        }

    }
    public async isApproved() {
        try {
            return await this.appService.isApproved(this.activeUser.Id);

        } catch (error) {
            throw new ConusmaException("isApproved", "user is not approved, please check exception ", error);
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
    public async getAllUsers() {
        try {
            if (this.activeUser != null) {
                return <MeetingUserModel[]>await this.appService.getMeetingUserList({ 'MeetingUserId': this.activeUser.Id });
            } else {
                return [];
            }

        } catch (error) {
            throw new ConusmaException("getAllUsers", "Unable to fetch user list, please check detail exception");
        }

    }

    public async getProducerUsers() {
        try {
            if (this.activeUser != null) {
                var users = await this.appService.getMeetingUserList({ 'MeetingUserId': this.activeUser.Id });
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
    public setSpeaker(enable: boolean) {
        try {
            InCallManager.setSpeakerphoneOn(enable);
            InCallManager.setForceSpeakerphoneOn(enable);

        } catch (error) {
            throw new ConusmaException("setSpeaker", "setSpeaker undefined error", error);
        }
    }
}