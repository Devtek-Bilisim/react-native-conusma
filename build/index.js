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
var mediaServerClient = __importStar(require("mediasoup-client"));
var react_native_webrtc_1 = require("react-native-webrtc");
var socket_io_1 = __importDefault(require("socket.io-client/dist/socket.io"));
var app_service_1 = require("./app.service");
var MediaServer = /** @class */ (function () {
    function MediaServer() {
        this.Id = 0;
        this.socket = null;
        this.mediaServerDevice = null;
    }
    return MediaServer;
}());
;
var Conusma = /** @class */ (function () {
    function Conusma(appId, parameters) {
        this.mediaServerList = [];
        this.appService = new app_service_1.AppService(appId, { apiUrl: parameters.apiUrl });
    }
    Conusma.prototype.open = function () {
        return __awaiter(this, void 0, void 0, function () {
            var mediaServer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getMediaServer(this.meetingUser.Id)];
                    case 1:
                        mediaServer = _a.sent();
                        return [4 /*yield*/, this.createClient(mediaServer)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Conusma.prototype.close = function (state) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    Conusma.prototype.getMediaServer = function (meetingUserId) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.appService.getMediaServer(meetingUserId)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Conusma.prototype.createClient = function (mediaServer) {
        return __awaiter(this, void 0, void 0, function () {
            var mediaServerElement;
            var _this = this;
            return __generator(this, function (_a) {
                mediaServerElement = this.mediaServerList.find(function (ms) { return ms.Id == mediaServer.Id; });
                if (mediaServerElement == null) {
                    mediaServerElement = new MediaServer();
                    mediaServerElement.Id = mediaServer.Id;
                    mediaServerElement.socket = socket_io_1.default.connect(mediaServer.ConnectionDnsAddress + ":" + mediaServer.Port);
                    this.mediaServerList.push(mediaServerElement);
                }
                this.mediaServerSocket = mediaServerElement.socket;
                this.mediaServerSocket.on('disconnect', function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, this.close(false)];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, this.open()];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                this.mediaServerSocket.on('WhoAreYou', function () { return __awaiter(_this, void 0, void 0, function () {
                    var userInfoData, setUserInfo, routerRtpCapabilities, handlerName;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                userInfoData = { 'MeetingUserId': this.meetingUser.Id, 'Token': this.appService.getJwtToken() };
                                return [4 /*yield*/, this.signal('UserInfo', userInfoData, this.mediaServerSocket)];
                            case 1:
                                setUserInfo = _a.sent();
                                return [4 /*yield*/, this.signal('getRouterRtpCapabilities', null, this.mediaServerSocket)];
                            case 2:
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
                                return [4 /*yield*/, this.mediaServerDevice.load({ routerRtpCapabilities: routerRtpCapabilities })];
                            case 3:
                                _a.sent();
                                this.createProducerTransport();
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    Conusma.prototype.createProducerTransport = function () {
    };
    Conusma.prototype.signal = function (type, data, mediaServerSocket) {
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
    Conusma.prototype.enableAudioVideo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var isFrontCamera, devices, facing, videoSourceId, facingMode, constraints, newStream;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
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
    return Conusma;
}());
exports.default = Conusma;
