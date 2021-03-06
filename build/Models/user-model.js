"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
var UserModel = /** @class */ (function () {
    function UserModel() {
        this.Name = "";
        this.SurName = "";
        this.UserName = "";
        this.Token = "";
        this.Email = "";
        this.EmailVerified = false;
        this.PhoneNumber = "";
        this.Address1 = "";
        this.Address2 = "";
        this.City = "";
        this.State = "";
        this.ZipCode = "";
        this.Photo = "";
        this.GooglePhoto = "";
        this.TimeZone = "";
        this.User_Type = 1;
        this.LicenseFeaturesId = 1;
        this.Id = "";
        this.AddedDate = "";
        this.ModifiedDate = "";
    }
    return UserModel;
}());
exports.UserModel = UserModel;
