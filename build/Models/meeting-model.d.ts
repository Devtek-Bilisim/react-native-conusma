export declare class MeetingModel {
    constructor();
    InviteCode: string;
    MeetingId: string;
    Password: string;
    Name: string;
    ChatSave: boolean;
    Chat: boolean;
    ShareScreen: boolean;
    ParticipantApproval: boolean;
    ProfileMeeting: boolean;
    LastConnectedTime: string;
    OwnerId: string;
    AddedDate: string;
    ModifiedDate: string;
    MeetingStatus: number;
    Id: number;
}
export declare enum MeetingStatusEnum {
    active = 1,
    end = 2,
    locked = 3
}
