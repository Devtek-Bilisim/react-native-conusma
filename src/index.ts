import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, View, Button} from 'react-native';
import * as mediaServerClient from 'mediasoup-client';
import {
  RTCView,
  mediaDevices,
  MediaStream,
  MediaStreamConstraints,
} from 'react-native-webrtc';
export default class Conusma  {
  private appId:string;
  private apiUrl:string;

  public meetingUser:any;

  constructor(appId:string, parameters:{ apiUrl: string}){
    this.appId = appId;
    this.apiUrl = parameters.apiUrl;
  }
 
  public async open() {
    const mediaServer:any = await this.getMediaServer(this.meetingUser.Id);
    await this.createClient(mediaServer);
  }

  private async getMediaServer(meetingUserId:string) {
    var response = await fetch(this.apiUrl + "/Login/UserLogin", {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userkey: 'hd',
          password: '123',
          deviceId: 'string',
        })
      });
      let json = await response.json();
  }

  private async createClient(mediaServer:any) {

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
