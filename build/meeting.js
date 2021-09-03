"use strict";
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
var react_native_webrtc_1 = require("react-native-webrtc");
var socket_io_1 = __importDefault(require("socket.io-client/dist/socket.io"));
var conusma_exception_1 = require("./Exceptions/conusma-exception");
var conusma_worker_1 = require("./conusma-worker");
var react_native_incall_manager_1 = __importDefault(require("react-native-incall-manager"));
var media_server_1 = require("./media-server");
var connection_1 = require("./connection");
var react_native_1 = require("react-native");
var Meeting = /** @class */ (function () {
    function Meeting(activeUser, appService) {
        this.mediaServers = new Array();
        this.connections = new Array();
        this.isClosedRequestRecieved = false;
        this.speakerState = false;
        this.emiterheadphone = null;
        react_native_webrtc_1.registerGlobals();
        this.appService = appService;
        this.activeUser = activeUser;
        this.conusmaWorker = new conusma_worker_1.ConusmaWorker(this.appService, this.activeUser);
        this.headphone();
    }
    Meeting.prototype.open = function () {
        try {
            this.isClosedRequestRecieved = false;
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
        }
        catch (error) {
            throw new conusma_exception_1.ConusmaException("open", "cannot open, please check exception", error);
        }
    };
    Meeting.prototype.close = function (sendCloseRequest) {
        if (sendCloseRequest === void 0) { sendCloseRequest = false; }
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, item, _b, _c, server, closeData, error_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 10, , 11]);
                        this.isClosedRequestRecieved = true;
                        if (this.conusmaWorker != null) {
                            this.conusmaWorker.terminate();
                        }
                        _i = 0, _a = this.connections;
                        _d.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 7];
                        item = _a[_i];
                        if (!!item.isProducer) return [3 /*break*/, 3];
                        return [4 /*yield*/, item.mediaServer.closeConsumer(item.user)];
                    case 2:
                        _d.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, item.mediaServer.closeProducer()];
                    case 4:
                        _d.sent();
                        _d.label = 5;
                    case 5:
                        item.stream.getTracks().forEach(function (track) { return track.stop(); });
                        _d.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 1];
                    case 7:
                        this.connections = [];
                        for (_b = 0, _c = this.mediaServers; _b < _c.length; _b++) {
                            server = _c[_b];
                            if (server.socket != null && server.socket.connected) {
                                server.socket.close();
                            }
                        }
                        this.mediaServers = [];
                        if (this.emiterheadphone != null) {
                            this.emiterheadphone.remove();
                            this.emiterheadphone = null;
                        }
                        if (!sendCloseRequest) return [3 /*break*/, 9];
                        closeData = { 'MeetingUserId': this.activeUser.Id };
                        return [4 /*yield*/, this.appService.liveClose(closeData)];
                    case 8:
                        _d.sent();
                        _d.label = 9;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        error_1 = _d.sent();
                        throw new conusma_exception_1.ConusmaException("close", "cannot close, please check exception", error_1);
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    Meeting.prototype.closeForAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            var closeData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        closeData = { 'MeetingUserId': this.activeUser.Id };
                        return [4 /*yield*/, this.appService.liveMeetingCloseAll(closeData)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.close(false)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Meeting.prototype.getMeetingInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.appService.getLiveMeetingInfo({ 'MeetingUserId': this.activeUser.Id })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Meeting.prototype.createMediaServer = function (_MediaServerModel) {
        return __awaiter(this, void 0, void 0, function () {
            var mediaServer, userInfoData, setUserInfo;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mediaServer = this.mediaServers.find(function (us) { return us.id == _MediaServerModel.Id; });
                        if (!(mediaServer == null || mediaServer == undefined)) return [3 /*break*/, 3];
                        mediaServer = new media_server_1.MediaServer(this.appService);
                        mediaServer.id = _MediaServerModel.Id;
                        mediaServer.socket = socket_io_1.default.connect(_MediaServerModel.ConnectionDnsAddress + ":" + _MediaServerModel.Port);
                        this.mediaServers.push(mediaServer);
                        userInfoData = { 'MeetingUserId': this.activeUser.Id, 'Token': this.appService.getJwtToken() };
                        return [4 /*yield*/, this.signal('UserInfo', userInfoData, mediaServer.socket)];
                    case 1:
                        setUserInfo = _a.sent();
                        return [4 /*yield*/, mediaServer.load()];
                    case 2:
                        _a.sent();
                        mediaServer.socket.on('disconnect', function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                if (!this.isClosedRequestRecieved) {
                                    throw new conusma_exception_1.ConusmaException("mediaserverconnection", "mediaserverconnection disconnect");
                                }
                                return [2 /*return*/];
                            });
                        }); });
                        _a.label = 3;
                    case 3: return [2 /*return*/, mediaServer];
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
                        return [2 /*return*/, newStream];
                }
            });
        });
    };
    Meeting.prototype.connectMeeting = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.appService.connectMeeting(this.activeUser)];
                    case 1:
                        _a.sent();
                        console.log("User connected to the meeting.");
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        throw new conusma_exception_1.ConusmaException("connectMeeting", "can not connect meeting , please check exception", error_2);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Meeting.prototype.isApproved = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.appService.isApproved(this.activeUser.Id)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_3 = _a.sent();
                        throw new conusma_exception_1.ConusmaException("isApproved", "user is not approved, please check exception ", error_3);
                    case 3: return [2 /*return*/];
                }
            });
        });
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
    Meeting.prototype.getAllUsers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!(this.activeUser != null)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.appService.getMeetingUserList({ 'MeetingUserId': this.activeUser.Id })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [2 /*return*/, []];
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_4 = _a.sent();
                        throw new conusma_exception_1.ConusmaException("getAllUsers", "Unable to fetch user list, please check detail exception");
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Meeting.prototype.getProducerUsers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var users, result, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!(this.activeUser != null)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.appService.getMeetingUserList({ 'MeetingUserId': this.activeUser.Id })];
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
                        error_5 = _a.sent();
                        throw new conusma_exception_1.ConusmaException("getProducerUsers", "Unable to fetch producer user list, please check detail exception");
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Meeting.prototype.setSpeaker = function (enable, bluetooth, headSet) {
        if (bluetooth === void 0) { bluetooth = false; }
        if (headSet === void 0) { headSet = false; }
        try {
            react_native_incall_manager_1.default.start({ media: 'video' });
            this.speakerState = enable;
            if (enable) {
                react_native_incall_manager_1.default.chooseAudioRoute('SPEAKER_PHONE');
                console.log("SPEAKER_PHONE");
            }
            else {
                if (bluetooth) {
                    react_native_incall_manager_1.default.chooseAudioRoute('BLUETOOTH');
                    console.log("BLUETOOTH");
                }
                else if (headSet) {
                    react_native_incall_manager_1.default.chooseAudioRoute('WIRED_HEADSET');
                    console.log("WIRED_HEADSET");
                }
                else {
                    react_native_incall_manager_1.default.chooseAudioRoute('EARPIECE');
                    console.log("EARPIECE");
                }
            }
        }
        catch (error) {
            throw new conusma_exception_1.ConusmaException("setSpeaker", "setSpeaker undefined error", error);
        }
    };
    Meeting.prototype.headphone = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                try {
                    this.emiterheadphone = react_native_1.DeviceEventEmitter.addListener('WiredHeadset', function (data) {
                        if (data.isPlugged) {
                            _this.setSpeaker(false, false, true);
                        }
                    });
                    react_native_1.DeviceEventEmitter.addListener('onAudioDeviceChanged', function (data) {
                        console.log("----onAudioDeviceEvent");
                        console.log(data);
                        console.log("onAudioDeviceEvent");
                    });
                }
                catch (error) {
                    throw new conusma_exception_1.ConusmaException("headphone", "headphone undefined error", error);
                }
                return [2 /*return*/];
            });
        });
    };
    Meeting.prototype.produce = function (localStream) {
        return __awaiter(this, void 0, void 0, function () {
            var connection;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createConnectionForProducer()];
                    case 1:
                        connection = _a.sent();
                        connection.stream = localStream;
                        return [4 /*yield*/, connection.mediaServer.produce(this.activeUser, localStream)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, connection];
                }
            });
        });
    };
    Meeting.prototype.closeProducer = function () {
        return __awaiter(this, void 0, void 0, function () {
            var myConenctionUser, index, error_6;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        myConenctionUser = this.connections.find(function (us) { return us.user.Id == _this.activeUser.Id; });
                        if (!(myConenctionUser != null)) return [3 /*break*/, 3];
                        return [4 /*yield*/, myConenctionUser.mediaServer.closeProducer()];
                    case 1:
                        _a.sent();
                        this.activeUser.Camera = false;
                        this.activeUser.Mic = false;
                        this.activeUser.ActiveCamera = false;
                        this.activeUser.ActiveMic = false;
                        return [4 /*yield*/, this.appService.updateMeetingUser(this.activeUser)];
                    case 2:
                        _a.sent();
                        index = this.connections.findIndex(function (us) { return us.user.Id == _this.activeUser.Id; });
                        this.removeItemOnce(this.connections, index);
                        return [3 /*break*/, 4];
                    case 3: throw new conusma_exception_1.ConusmaException("closeProducer", "producer connection not found");
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_6 = _a.sent();
                        throw new conusma_exception_1.ConusmaException("closeProducer", " please check detail exception", error_6);
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Meeting.prototype.removeItemOnce = function (arr, index) {
        if (index > -1) {
            arr.splice(index, 1);
        }
        return arr;
    };
    Meeting.prototype.consume = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var connection, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.createConnectionForConsumer(user)];
                    case 1:
                        connection = _b.sent();
                        _a = connection;
                        return [4 /*yield*/, connection.mediaServer.consume(user)];
                    case 2:
                        _a.stream = _b.sent();
                        return [2 /*return*/, connection];
                }
            });
        });
    };
    Meeting.prototype.closeConsumer = function (connection) {
        return __awaiter(this, void 0, void 0, function () {
            var i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, connection.mediaServer.closeConsumer(connection.user)];
                    case 1:
                        _a.sent();
                        for (i = 0; i < this.connections.length; i++) {
                            if (this.connections[i].user.Id == connection.user.Id && this.connections[i].mediaServer.id == connection.mediaServer.id) {
                                this.removeItemOnce(this.connections, i);
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Meeting.prototype.createConnectionForProducer = function () {
        return __awaiter(this, void 0, void 0, function () {
            var mediaServerModel, mediaServer, connection;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.appService.getMediaServer(this.activeUser.Id)];
                    case 1:
                        mediaServerModel = _a.sent();
                        return [4 /*yield*/, this.createMediaServer(mediaServerModel)];
                    case 2:
                        mediaServer = _a.sent();
                        connection = new connection_1.Connection(this.activeUser, mediaServer);
                        connection.isProducer = true;
                        this.connections.push(connection);
                        return [2 /*return*/, connection];
                }
            });
        });
    };
    Meeting.prototype.createConnectionForConsumer = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var mediaServerModel, mediaServer, connection;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.appService.getMediaServerById(this.activeUser.Id, user.MediaServerId)];
                    case 1:
                        mediaServerModel = _a.sent();
                        return [4 /*yield*/, this.createMediaServer(mediaServerModel)];
                    case 2:
                        mediaServer = _a.sent();
                        connection = new connection_1.Connection(user, mediaServer);
                        this.connections.push(connection);
                        return [2 /*return*/, connection];
                }
            });
        });
    };
    return Meeting;
}());
exports.Meeting = Meeting;
