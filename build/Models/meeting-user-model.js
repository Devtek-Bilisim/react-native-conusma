"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeetingUserModel = void 0;
var MeetingUserModel = /** @class */ (function () {
    function MeetingUserModel() {
        this.UserId = "";
        this.PublicUserId = "";
        this.MeetingFullName = "";
        this.MediaServerSocketId = "";
        this.RaiseHandTime = "";
        this.Reaction = "";
        this.ReactionTime = "";
        this.IAmHereTime = "";
        this.Approved = false;
        this.ActiveCamera = false;
        this.ActiveMic = false;
        this.Camera = false;
        this.Mic = false;
        this.ShareScreen = false;
        this.RaiseHand = false;
        this.IsVirtualHost = false;
        this.MeetingId = 0;
        this.MediaServerId = 0;
        this.Status = 4;
        this.UserType = 1;
        this.Id = "";
        this.AddedDate = "";
        this.ModifiedDate = "";
    }
    return MeetingUserModel;
}());
exports.MeetingUserModel = MeetingUserModel;
