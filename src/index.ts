import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, View, Button} from 'react-native';
import * as mediaServerClient from 'mediasoup-client';
import {
  RTCView,
  mediaDevices,
  MediaStream,
  MediaStreamConstraints
} from 'react-native-webrtc';
import io from 'socket.io-client/dist/socket.io';
import { AppService } from './app.service';
class MediaServer {
  Id: number = 0;
  socket: any = null;
  mediaServerDevice:any = null;
};
export default class Conusma  {

  private appService:AppService;
  public meetingUser:any;
  private mediaServerList:Array<MediaServer> = [];
  private mediaServerSocket:any;
  private mediaServerDevice:any;
  private mediaServerClient:any;
  private hasCamera:boolean = false;
  private hasMicrophone:boolean = false;
  private isScreenShare:boolean = false;
  constructor(appId:string, parameters:{ apiUrl: string}){
    this.appService = new AppService(appId, { apiUrl: parameters.apiUrl});
  }
 
  public async open() {
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
}
