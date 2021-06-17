"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Meeting = void 0;
var mediaServerClient = __importStar(require("mediasoup-client"));
var react_native_webrtc_1 = require("react-native-webrtc");
var socket_io_1 = __importDefault(require("socket.io-client/dist/socket.io"));
var conusma_exception_1 = require("./Exceptions/conusma-exception");
var conusma_worker_1 = require("./conusma-worker");
var react_native_incall_manager_1 = __importDefault(require("react-native-incall-manager"));
var react_native_device_info_1 = __importDefault(require("react-native-device-info"));
var MediaServer = /** @class */ (function () {
    function MediaServer() {
        this.Id = 0;
        this.socket = null;
        this.mediaServerDevice = null;
    }
    return MediaServer;
}());
;
var Meeting = /** @class */ (function () {
    function Meeting(meetingUser, appService) {
        this.observers = [];
        this.mediaServerList = [];
        this.hasCamera = false;
        this.hasMicrophone = false;
        this.isScreenShare = false;
        this.isAudioActive = false;
        this.isVideoActive = false;
        this.isReceviedClose = false;
        this.consumerTransports = [];
        this.connectMediaServerId = 0;
        this.cameraCrashCounter = 2;
        react_native_webrtc_1.registerGlobals();
        this.appService = appService;
        this.meetingUser = meetingUser;
        this.conusmaWorker = new conusma_worker_1.ConusmaWorker(this.appService, this.meetingUser);
    }
    Meeting.prototype.attach = function (observer) {
        this.observers.push(observer);
    };
    Meeting.prototype.detach = function (observerToRemove) {
        this.observers = this.observers.filter(function (observer) { return observerToRemove !== observer; });
    };
    Meeting.prototype.notify = function () {
        this.observers.forEach(function (observer) { return observer(); });
    };
    Meeting.prototype.open = function (localStream) {
        return __awaiter(this, void 0, void 0, function () {
            var mediaServer, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        this.isReceviedClose = false;
                        this.conusmaWorker.start();
                        this.conusmaWorker.meetingWorkerEvent.on('meetingUsers', function () {
                            console.log("Meeting users updated.");
                        });
                        this.conusmaWorker.meetingWorkerEvent.on('chatUpdates', function () {
                            console.log("Chat updated.");
                        });
                        this.conusmaWorker.meetingWorkerEvent.on('meetingUpdate', function () {
                            console.log("Meeting updated.");
                        });
                        return [4 /*yield*/, this.getMediaServer(this.meetingUser.Id)];
                    case 1:
                        mediaServer = _a.sent();
                        return [4 /*yield*/, this.createClient(mediaServer, localStream)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        throw new conusma_exception_1.ConusmaException("open", "can not open meeting , please check exception ", error_1);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Meeting.prototype.close = function (sendCloseRequest) {
        if (sendCloseRequest === void 0) { sendCloseRequest = false; }
        return __awaiter(this, void 0, void 0, function () {
            var closeData;
            return __generator(this, function (_a) {
                try {
                    if (sendCloseRequest) {
                        closeData = { 'MeetingUserId': this.meetingUser.Id };
                        this.appService.liveClose(closeData);
                    }
                    this.isReceviedClose = true;
                    if (this.conusmaWorker != null) {
                        this.conusmaWorker.terminate();
                    }
                    if (this.mediaServerClient != null) {
                        if (this.mediaServerClient.transport)
                            this.mediaServerClient.transport.close();
                        if (this.mediaServerClient.VideoProducer)
                            this.mediaServerClient.VideoProducer.close();
                        if (this.mediaServerClient.AudioProducer)
                            this.mediaServerClient.AudioProducer.close();
                        this.mediaServerClient = null;
                    }
                    this.mediaServerList.forEach(function (element) {
                        if (element != null) {
                            element.socket.close();
                        }
                    });
                    if (this.mediaServerSocket != null) {
                        this.mediaServerSocket.close();
                        this.mediaServerSocket = null;
                    }
                    this.mediaServerList = [];
                }
                catch (error) {
                    throw new conusma_exception_1.ConusmaException("close", "can not close meeting , please check exception ", error);
                }
                return [2 /*return*/];
            });
        });
    };
    Meeting.prototype.getMediaServer = function (meetingUserId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.appService.getMediaServer(meetingUserId)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Meeting.prototype.createClient = function (mediaServer, localStream) {
        return __awaiter(this, void 0, void 0, function () {
            var mediaServerElement, userInfoData, setUserInfo, routerRtpCapabilities, handlerName;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mediaServerElement = this.mediaServerList.find(function (ms) { return ms.Id == mediaServer.Id; });
                        if (!(mediaServerElement == null)) return [3 /*break*/, 2];
                        mediaServerElement = new MediaServer();
                        mediaServerElement.Id = mediaServer.Id;
                        mediaServerElement.socket = socket_io_1.default.connect(mediaServer.ConnectionDnsAddress + ":" + mediaServer.Port);
                        this.mediaServerList.push(mediaServerElement);
                        userInfoData = { 'MeetingUserId': this.meetingUser.Id, 'Token': this.appService.getJwtToken() };
                        return [4 /*yield*/, this.signal('UserInfo', userInfoData, mediaServerElement.socket)];
                    case 1:
                        setUserInfo = _a.sent();
                        _a.label = 2;
                    case 2:
                        this.mediaServerSocket = mediaServerElement.socket;
                        this.connectMediaServerId = mediaServerElement.Id;
                        this.mediaServerSocket.on('disconnect', function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                if (!this.isReceviedClose) {
                                    throw new conusma_exception_1.ConusmaException("mediaserverconnection", "mediaserverconnection disconnect");
                                }
                                return [2 /*return*/];
                            });
                        }); });
                        return [4 /*yield*/, this.signal('getRouterRtpCapabilities', null, this.mediaServerSocket)];
                    case 3:
                        routerRtpCapabilities = _a.sent();
                        handlerName = mediaServerClient.detectDevice();
                        if (handlerName) {
                            console.log("detected handler: %s", handlerName);
                        }
                        else {
                            console.error("no suitable handler found for current device");
                        }
                        this.mediaServerDevice = new mediaServerClient.Device({
                            handlerName: handlerName
                        });
                        mediaServerElement.mediaServerDevice = this.mediaServerDevice;
                        console.log("mediaServerDevice loading...");
                        return [4 /*yield*/, this.mediaServerDevice.load({ routerRtpCapabilities: routerRtpCapabilities })];
                    case 4:
                        _a.sent();
                        console.log("mediaServerDevice loaded.");
                        return [4 /*yield*/, this.createProducerTransport(localStream)];
                    case 5:
                        _a.sent();
                        this.notify();
                        return [2 /*return*/];
                }
            });
        });
    };
    Meeting.prototype.createProducerTransport = function (localStream) {
        return __awaiter(this, void 0, void 0, function () {
            var transportOptions, _a, error_2;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 11, , 12]);
                        if (!(this.mediaServerClient != null)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.close(false)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, this.open(localStream)];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 10];
                    case 3:
                        console.log("createProducerTransport started.");
                        return [4 /*yield*/, this.signal('createProducerTransport', {}, this.mediaServerSocket)];
                    case 4:
                        transportOptions = _b.sent();
                        this.mediaServerClient = new Object();
                        this.mediaServerClient.transportId = transportOptions.id;
                        _a = this.mediaServerClient;
                        return [4 /*yield*/, this.mediaServerDevice.createSendTransport(transportOptions)];
                    case 5:
                        _a.transport = _b.sent();
                        this.mediaServerClient.transport.on('connect', function (_a, callback, errback) {
                            var dtlsParameters = _a.dtlsParameters;
                            return __awaiter(_this, void 0, void 0, function () {
                                var error;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0: return [4 /*yield*/, this.signal('connectProducerTransport', {
                                                transportId: transportOptions.id,
                                                dtlsParameters: dtlsParameters
                                            }, this.mediaServerSocket)];
                                        case 1:
                                            error = _b.sent();
                                            callback();
                                            return [2 /*return*/];
                                    }
                                });
                            });
                        });
                        this.mediaServerClient.transport.on('produce', function (_a, callback, errback) {
                            var kind = _a.kind, rtpParameters = _a.rtpParameters, appData = _a.appData;
                            return __awaiter(_this, void 0, void 0, function () {
                                var paused, id;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            paused = false;
                                            paused = false;
                                            return [4 /*yield*/, this.signal('produce', {
                                                    transportId: this.mediaServerClient.transportId,
                                                    kind: kind,
                                                    rtpParameters: rtpParameters,
                                                    paused: paused,
                                                    appData: appData
                                                }, this.mediaServerSocket)];
                                        case 1:
                                            id = _b.sent();
                                            callback(id);
                                            return [2 /*return*/];
                                    }
                                });
                            });
                        });
                        if (!(this.hasCamera || this.isScreenShare)) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.createProducer(localStream, 'video')];
                    case 6:
                        _b.sent();
                        _b.label = 7;
                    case 7:
                        if (!this.hasMicrophone) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.createProducer(localStream, 'audio')];
                    case 8:
                        _b.sent();
                        _b.label = 9;
                    case 9:
                        this.mediaServerClient.Camera = this.hasCamera;
                        this.mediaServerClient.Mic = this.hasMicrophone;
                        this.mediaServerClient.Stream = localStream;
                        this.mediaServerClient.MeetingUserId = this.meetingUser.Id;
                        this.mediaServerClient.RemoteStream = null;
                        this.meetingUser.MediaServerId = this.connectMediaServerId;
                        this.meetingUser.ShareScreen = this.isScreenShare;
                        this.meetingUser.Camera = this.hasCamera;
                        this.meetingUser.Mic = this.hasMicrophone;
                        this.appService.connectMeeting(this.meetingUser);
                        _b.label = 10;
                    case 10: return [3 /*break*/, 12];
                    case 11:
                        error_2 = _b.sent();
                        throw new conusma_exception_1.ConusmaException("createProducerTransport", "createProducerTransport error", error_2);
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    Meeting.prototype.createProducer = function (localStream, kind) {
        return __awaiter(this, void 0, void 0, function () {
            var videoTrack, _a, _b, error_3;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 5, , 6]);
                        if (!(kind == 'video')) return [3 /*break*/, 2];
                        videoTrack = localStream.getVideoTracks()[0];
                        _a = this.mediaServerClient;
                        return [4 /*yield*/, this.mediaServerClient.transport.produce({
                                track: videoTrack,
                                encodings: [
                                    { maxBitrate: 500000 },
                                    { maxBitrate: 1000000 },
                                    { maxBitrate: 2000000 }
                                ],
                                codecOptions: {
                                    videoGoogleStartBitrate: 1000
                                },
                                appData: { mediaTag: 'video' }
                            })];
                    case 1:
                        _a.VideoProducer = _c.sent();
                        return [3 /*break*/, 4];
                    case 2:
                        if (!(kind == 'audio')) return [3 /*break*/, 4];
                        _b = this.mediaServerClient;
                        return [4 /*yield*/, this.mediaServerClient.transport.produce({
                                track: localStream.getAudioTracks()[0],
                                appData: { mediaTag: 'audio' }
                            })];
                    case 3:
                        _b.AudioProducer = _c.sent();
                        _c.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_3 = _c.sent();
                        console.error("createProducer error. " + error_3);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Meeting.prototype.signal = function (type, data, mediaServerSocket) {
        if (data === void 0) { data = null; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (mediaServerSocket != null) {
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            mediaServerSocket.emit(type, data, function (err, response) {
                                if (!err) {
                                    resolve(response);
                                }
                                else {
                                    reject(err);
                                }
                            });
                        })];
                }
                else {
                    console.error("no socket connection " + type);
                }
                return [2 /*return*/];
            });
        });
    };
    Meeting.prototype.switchCamera = function () {
        try {
            if (this.mediaServerClient != null && this.mediaServerClient.Stream != null) {
                var deviceModel = react_native_device_info_1.default.getModel();
                deviceModel.toLowerCase();
                if (deviceModel.includes('sm-975') || deviceModel.includes('sm-g981') || deviceModel.includes('sm-g980')) {
                    if (this.cameraCrashCounter <= 0) {
                        throw new Error("camera switching is not supported on this model ");
                    }
                }
                this.mediaServerClient.Stream.getVideoTracks()[0]._switchCamera();
                this.cameraCrashCounter--;
                return this.mediaServerClient.Stream;
            }
            else {
                throw new Error("stream not found, first call enableAudioVideo function");
            }
        }
        catch (error) {
            throw new conusma_exception_1.ConusmaException("switchCamera", "camera switching failed, please check detail exception", error);
        }
    };
    Meeting.prototype.toggleAudio = function () {
        var _this = this;
        try {
            if (this.mediaServerClient != null && this.mediaServerClient.Stream != null) {
                this.mediaServerClient.Stream.getTracks().forEach(function (t) {
                    if (t.kind === 'audio') {
                        t.enabled = !t.enabled;
                        _this.isAudioActive = t.enabled;
                    }
                });
                return this.mediaServerClient.Stream;
            }
            else {
                throw new conusma_exception_1.ConusmaException("toggleAudio", "stream not found, first call enableAudioVideo function");
            }
        }
        catch (error) {
            throw new conusma_exception_1.ConusmaException("toggleAudio", "toggleAudio failed", error);
        }
    };
    Meeting.prototype.toggleVideo = function () {
        try {
            if (this.mediaServerClient != null && this.mediaServerClient.Stream != null) {
                this.isVideoActive = !this.isVideoActive;
                this.mediaServerClient.Stream.getVideoTracks()[0].enabled = this.isVideoActive;
                return this.mediaServerClient.Stream;
            }
            else {
                throw new conusma_exception_1.ConusmaException("toggleVideo", "stream not found, first call enableAudioVideo function");
            }
        }
        catch (error) {
            throw new conusma_exception_1.ConusmaException("toggleVideo", "toggleVideo failed", error);
        }
    };
    Meeting.prototype.enableAudioVideo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var isFrontCamera, devices, facing, videoSourceId, facingMode, constraints, newStream;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        try {
                        }
                        catch (error) {
                            throw new conusma_exception_1.ConusmaException("enableAudioVideo", "can not read stream , please check exception ", error);
                        }
                        isFrontCamera = true;
                        return [4 /*yield*/, react_native_webrtc_1.mediaDevices.enumerateDevices()];
                    case 1:
                        devices = _a.sent();
                        facing = isFrontCamera ? 'front' : 'environment';
                        videoSourceId = devices.find(function (device) { return device.kind === 'videoinput' && device.facing === facing; });
                        if (videoSourceId) {
                            this.hasCamera = true;
                            this.hasMicrophone = true; // TODO: Check audio source first
                        }
                        facingMode = isFrontCamera ? 'user' : 'environment';
                        constraints = {
                            audio: true,
                            video: {
                                mandatory: {
                                    minWidth: 500,
                                    minHeight: 300,
                                    minFrameRate: 30,
                                },
                                facingMode: facingMode,
                                optional: videoSourceId ? [{ sourceId: videoSourceId }] : [],
                            },
                        };
                        return [4 /*yield*/, react_native_webrtc_1.mediaDevices.getUserMedia(constraints)];
                    case 2:
                        newStream = _a.sent();
                        this.isAudioActive = true;
                        this.isVideoActive = true;
                        return [2 /*return*/, newStream];
                }
            });
        });
    };
    Meeting.prototype.connectMeeting = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.appService.connectMeeting(this.meetingUser)];
                    case 1:
                        _a.sent();
                        console.log("User connected to the meeting.");
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        throw new conusma_exception_1.ConusmaException("connectMeeting", "can not connect meeting , please check exception", error_4);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Meeting.prototype.isApproved = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.appService.isApproved(this.meetingUser.Id)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_5 = _a.sent();
                        throw new conusma_exception_1.ConusmaException("isApproved", "user is not approved , please check exception ", error_5);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Meeting.prototype.consume = function (producerUser) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.createConsumerTransport(producerUser)];
                    case 1:
                        result = _a.sent();
                        this.consumerTransports.push(result);
                        return [2 /*return*/, result.RemoteStream];
                    case 2:
                        error_6 = _a.sent();
                        throw new conusma_exception_1.ConusmaException("consume", producerUser.Id + "The stream of the user is currently not captured. User connection information is out of date.", error_6);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Meeting.prototype.closeConsumer = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var index, _i, _a, item;
            return __generator(this, function (_b) {
                try {
                    index = 0;
                    for (_i = 0, _a = this.consumerTransports; _i < _a.length; _i++) {
                        item = _a[_i];
                        if (item.MeetingUserId == user.Id) {
                            if (item.transport) {
                                item.transport.close();
                            }
                            break;
                        }
                        index++;
                    }
                    ;
                    this.removeItemOnce(this.consumerTransports, index);
                }
                catch (error) {
                    throw new conusma_exception_1.ConusmaException("isApproved", "user is not approved , please check exception ", error);
                }
                return [2 /*return*/];
            });
        });
    };
    Meeting.prototype.removeItemOnce = function (arr, index) {
        if (index > -1) {
            arr.splice(index, 1);
        }
        return arr;
    };
    Meeting.prototype.setSpeaker = function (enable) {
        try {
            react_native_incall_manager_1.default.setSpeakerphoneOn(enable);
            react_native_incall_manager_1.default.setForceSpeakerphoneOn(enable);
        }
        catch (error) {
            throw new conusma_exception_1.ConusmaException("setSpeaker", "setSpeaker undefined error", error);
        }
    };
    Meeting.prototype.waitWhoAreYou = function (socket) {
        return new Promise(function (resolve) {
            socket.on("WhoAreYou");
            {
                console.log("WhoAreYou signal.");
                resolve({});
            }
        });
    };
    Meeting.prototype.createConsumerTransport = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var targetMediaServerClient, mediaServerInfo, userInfoData, setUserInfo, routerRtpCapabilities, handlerName;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        targetMediaServerClient = this.mediaServerList.find(function (ms) { return ms.Id == user.MediaServerId; });
                        if (!(targetMediaServerClient == null)) return [3 /*break*/, 6];
                        targetMediaServerClient = new MediaServer();
                        return [4 /*yield*/, this.appService.getMediaServerById(this.meetingUser.Id, user.MediaServerId)];
                    case 1:
                        mediaServerInfo = _a.sent();
                        if (mediaServerInfo == null) {
                            throw new conusma_exception_1.ConusmaException("createConsumerTransport", "Media server not found. (Id: " + user.MediaServerId + ")");
                        }
                        targetMediaServerClient.Id = mediaServerInfo.Id;
                        targetMediaServerClient.socket = socket_io_1.default.connect(mediaServerInfo.ConnectionDnsAddress + ":" + mediaServerInfo.Port);
                        userInfoData = { 'MeetingUserId': this.meetingUser.Id, 'Token': this.appService.getJwtToken() };
                        return [4 /*yield*/, this.signal('UserInfo', userInfoData, targetMediaServerClient.socket)];
                    case 2:
                        setUserInfo = _a.sent();
                        console.log("UserInfo signal came.");
                        return [4 /*yield*/, this.signal('getRouterRtpCapabilities', null, targetMediaServerClient.socket)];
                    case 3:
                        routerRtpCapabilities = _a.sent();
                        console.log("routerRtpCapabilities " + JSON.stringify(routerRtpCapabilities));
                        handlerName = mediaServerClient.detectDevice();
                        if (handlerName) {
                            console.log("detected handler: %s", handlerName);
                        }
                        else {
                            console.error("no suitable handler found for current device");
                        }
                        targetMediaServerClient.mediaServerDevice = new mediaServerClient.Device({
                            handlerName: handlerName
                        });
                        console.log("mediaServerDevice loading...");
                        return [4 /*yield*/, targetMediaServerClient.mediaServerDevice.load({ routerRtpCapabilities: routerRtpCapabilities })];
                    case 4:
                        _a.sent();
                        console.log("mediaServerDevice loaded.");
                        this.mediaServerList.push(targetMediaServerClient);
                        return [4 /*yield*/, this.createConsumerChildFunction(targetMediaServerClient, user)];
                    case 5: return [2 /*return*/, _a.sent()];
                    case 6: return [4 /*yield*/, this.createConsumerChildFunction(targetMediaServerClient, user)];
                    case 7: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Meeting.prototype.createConsumerChildFunction = function (targetMediaServerClient, user) {
        return __awaiter(this, void 0, void 0, function () {
            var consumerTransport, transportOptions, _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(targetMediaServerClient != null && targetMediaServerClient.socket != null)) return [3 /*break*/, 7];
                        console.log("createConsumerChildFunction start.");
                        consumerTransport = new Object();
                        consumerTransport.MediaServer = targetMediaServerClient;
                        consumerTransport.MeetingUserId = user.Id;
                        return [4 /*yield*/, this.signal("createConsumerTransport", { MeetingUserId: user.Id }, targetMediaServerClient.socket)];
                    case 1:
                        transportOptions = _b.sent();
                        consumerTransport.MediaServerSocketId = user.MediaServerSocketId;
                        consumerTransport.transportId = transportOptions.Id;
                        _a = consumerTransport;
                        return [4 /*yield*/, targetMediaServerClient.mediaServerDevice.createRecvTransport(transportOptions.transportOptions)];
                    case 2:
                        _a.transport = _b.sent();
                        consumerTransport.transport.on("connect", function (_a, callback, errback) {
                            var dtlsParameters = _a.dtlsParameters;
                            return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_b) {
                                    this.signal("connectConsumerTransport", { consumerTransportId: consumerTransport.transportId, dtlsParameters: dtlsParameters }, targetMediaServerClient.socket)
                                        .then(callback)
                                        .catch(errback);
                                    return [2 /*return*/];
                                });
                            });
                        });
                        consumerTransport.RemoteStream = new MediaStream();
                        consumerTransport.Camera = user.Camera;
                        consumerTransport.Mic = user.Mic;
                        consumerTransport.ShareScreen = user.ShareScreen;
                        console.log("createConsumerChildFunction creating the consumer.");
                        if (!(user.Camera || user.ShareScreen)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.addConsumer(consumerTransport, "video")];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4:
                        if (!user.Mic) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.addConsumer(consumerTransport, "audio")];
                    case 5:
                        _b.sent();
                        _b.label = 6;
                    case 6: return [2 /*return*/, consumerTransport];
                    case 7: throw new conusma_exception_1.ConusmaException("createConsumerChildFunction", "No socket connection.");
                }
            });
        });
    };
    Meeting.prototype.addConsumer = function (consumerTransport, kind) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!(consumerTransport != null)) return [3 /*break*/, 4];
                        if (!(kind == "video")) return [3 /*break*/, 2];
                        _a = consumerTransport;
                        return [4 /*yield*/, this.consumeTransport(consumerTransport, "video")];
                    case 1:
                        _a.videoConsumer = _c.sent();
                        this.resumeConsumer(consumerTransport, "video");
                        consumerTransport.RemoteStream.addTrack(consumerTransport.videoConsumer.track);
                        return [3 /*break*/, 4];
                    case 2:
                        _b = consumerTransport;
                        return [4 /*yield*/, this.consumeTransport(consumerTransport, "audio")];
                    case 3:
                        _b.audioConsumer = _c.sent();
                        this.resumeConsumer(consumerTransport, "audio");
                        consumerTransport.RemoteStream.addTrack(consumerTransport.audioConsumer.track);
                        consumerTransport.audioConsumer.resume();
                        _c.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Meeting.prototype.consumeTransport = function (consumerTransport, trackKind) {
        return __awaiter(this, void 0, void 0, function () {
            var rtpCapabilities, data, producerId, id, kind, rtpParameters, codecOptions, consumer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        rtpCapabilities = consumerTransport.MediaServer.mediaServerDevice.rtpCapabilities;
                        return [4 /*yield*/, this.signal("consume", { consumerTransportId: consumerTransport.transportId, rtpCapabilities: rtpCapabilities, kind: trackKind }, consumerTransport.MediaServer.socket)
                                .catch(function (err) {
                                throw new conusma_exception_1.ConusmaException("consumeTransport", "Consume error.", err);
                            })];
                    case 1:
                        data = _a.sent();
                        producerId = data.producerId, id = data.id, kind = data.kind, rtpParameters = data.rtpParameters;
                        codecOptions = {};
                        return [4 /*yield*/, consumerTransport.transport.consume({
                                id: id,
                                producerId: producerId,
                                kind: kind,
                                rtpParameters: rtpParameters,
                                codecOptions: codecOptions,
                            })];
                    case 2:
                        consumer = _a.sent();
                        return [2 /*return*/, consumer];
                }
            });
        });
    };
    Meeting.prototype.resumeConsumer = function (consumerTransport, kind) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.signal('resume', { consumerTransportId: consumerTransport.transportId, kind: kind }, consumerTransport.MediaServer.socket);
                return [2 /*return*/];
            });
        });
    };
    Meeting.prototype.pauseConsumer = function (consumerTransport, kind) {
        return __awaiter(this, void 0, void 0, function () {
            var error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        if (!(consumerTransport != null && consumerTransport.videoConsumer != null)) return [3 /*break*/, 6];
                        if (!(kind == 'video')) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.signal('pause', {
                                kind: 'video',
                                consumerTransportId: consumerTransport.transportId
                            }, consumerTransport.MediaServer.socket)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, consumerTransport.videoConsumer.pause()];
                    case 2:
                        _a.sent();
                        ;
                        consumerTransport.RemoteStream.removeTrack(consumerTransport.videoConsumer.track);
                        return [3 /*break*/, 6];
                    case 3:
                        if (!(kind == 'audio' && consumerTransport.audioConsumer != null)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.signal('pause', {
                                kind: 'audio',
                                consumerTransportId: consumerTransport.transportId
                            }, consumerTransport.MediaServer.socket)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, consumerTransport.audioConsumer.pause()];
                    case 5:
                        _a.sent();
                        consumerTransport.RemoteStream.removeTrack(consumerTransport.audioConsumer.track);
                        _a.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        error_7 = _a.sent();
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    Meeting.prototype.getAllUsers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!(this.meetingUser != null)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.appService.getMeetingUserList({ 'MeetingUserId': this.meetingUser.Id })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [2 /*return*/, []];
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_8 = _a.sent();
                        throw new conusma_exception_1.ConusmaException("getAllUsers", "Unable to fetch user list, please check detail exception");
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Meeting.prototype.getProducerUsers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var users, result, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!(this.meetingUser != null)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.appService.getMeetingUserList({ 'MeetingUserId': this.meetingUser.Id })];
                    case 1:
                        users = _a.sent();
                        result = [];
                        users.forEach(function (item) {
                            if (item.Camera == true) {
                                result.push(item);
                            }
                        });
                        return [2 /*return*/, result];
                    case 2: return [2 /*return*/, []];
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_9 = _a.sent();
                        throw new conusma_exception_1.ConusmaException("getProducerUsers", "Unable to fetch producer user list, please check detail exception");
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return Meeting;
}());
exports.Meeting = Meeting;
