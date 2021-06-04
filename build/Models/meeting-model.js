"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeetingModel = void 0;
var MeetingModel = /** @class */ (function () {
    function MeetingModel() {
        this.InviteCode = "";
        this.MeetingId = "";
        this.Password = "";
        this.Name = "";
        this.ChatSave = false;
        this.Chat = false;
        this.ShareScreen = false;
        this.ParticipantApproval = false;
        this.ProfileMeeting = false;
        this.LastConnectedTime = "";
        this.OwnerId = "";
        this.AddedDate = "";
        this.ModifiedDate = "";
        this.MeetingStatus = 0;
        this.Id = 0;
    }
    return MeetingModel;
}());
exports.MeetingModel = MeetingModel;
