"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeetingStatusEnum = exports.MeetingModel = void 0;
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
var MeetingStatusEnum;
(function (MeetingStatusEnum) {
    MeetingStatusEnum[MeetingStatusEnum["active"] = 1] = "active";
    MeetingStatusEnum[MeetingStatusEnum["end"] = 2] = "end";
    MeetingStatusEnum[MeetingStatusEnum["locked"] = 3] = "locked";
})(MeetingStatusEnum = exports.MeetingStatusEnum || (exports.MeetingStatusEnum = {}));
