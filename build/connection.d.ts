import { MeetingUserModel } from "./Models/meeting-user-model";
import { MediaServer } from "./media-server";
export declare class Connection {
    user: MeetingUserModel;
    mediaServer: MediaServer;
    stream: MediaStream;
    isProducer: boolean;
    private cameraCrashCounter;
    isAudioActive: boolean;
    isVideoActive: boolean;
    constructor(user: MeetingUserModel, mediaServer: MediaServer);
    switchCamera(): MediaStream;
    toggleAudio(): boolean;
    toggleVideo(): boolean;
}
