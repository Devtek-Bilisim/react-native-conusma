"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Connection = void 0;
var conusma_exception_1 = require("./Exceptions/conusma-exception");
var react_native_device_info_1 = __importDefault(require("react-native-device-info"));
var Connection = /** @class */ (function () {
    function Connection(user, mediaServer) {
        this.isProducer = false;
        this.cameraCrashCounter = 2;
        this.isAudioActive = true;
        this.isVideoActive = true;
        this.user = user;
        this.mediaServer = mediaServer;
        this.stream = new MediaStream();
    }
    Connection.prototype.switchCamera = function () {
        try {
            if (this.isProducer && this.stream != null) {
                var deviceModel = react_native_device_info_1.default.getModel();
                deviceModel = deviceModel.toLowerCase();
                if (deviceModel.includes('sm-n975') || deviceModel.includes('sm-g981') || deviceModel.includes('sm-g980')) {
                    if (this.cameraCrashCounter <= 0) {
                        throw new Error("camera switching is not supported on this model");
                    }
                }
                this.stream.getVideoTracks()[0]._switchCamera();
                this.cameraCrashCounter--;
                return this.stream;
            }
            else {
                throw new conusma_exception_1.ConusmaException("switchCamera", "stream not found, first call enableAudioVideo function");
            }
        }
        catch (error) {
            throw new conusma_exception_1.ConusmaException("switchCamera", "camera switching failed, please check detail exception", error);
        }
    };
    Connection.prototype.toggleAudio = function () {
        var _this = this;
        try {
            if (this.isProducer && this.stream != null) {
                this.stream.getTracks().forEach(function (t) {
                    if (t.kind === 'audio') {
                        t.enabled = !t.enabled;
                        _this.isAudioActive = t.enabled;
                    }
                });
                return this.isAudioActive;
            }
            else {
                throw new conusma_exception_1.ConusmaException("toggleAudio", "stream not found, first call enableAudioVideo function");
            }
        }
        catch (error) {
            throw new conusma_exception_1.ConusmaException("toggleAudio", "toggleAudio failed", error);
        }
    };
    Connection.prototype.toggleVideo = function () {
        try {
            if (this.isProducer && this.stream != null) {
                this.isVideoActive = !this.isVideoActive;
                this.stream.getVideoTracks()[0].enabled = this.isVideoActive;
                return this.isVideoActive;
            }
            else {
                throw new conusma_exception_1.ConusmaException("toggleVideo", "stream not found, first call enableAudioVideo function");
            }
        }
        catch (error) {
            throw new conusma_exception_1.ConusmaException("toggleVideo", "toggleVideo failed", error);
        }
    };
    return Connection;
}());
exports.Connection = Connection;
