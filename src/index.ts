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
        
        this.createProducerTransport();
    });
  }

  private createProducerTransport() {

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
	  return newStream;
  }
}
