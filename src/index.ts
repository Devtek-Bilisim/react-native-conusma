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
 constructor(){}
 public MeetingUser:any;
  public async open() {
    const mediaServer:any = await this.getMediaServer(this.MeetingUser.Id);
    await this.createClient(mediaServer);
  }

  private async getMediaServer(meetingUserId:string) {

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
