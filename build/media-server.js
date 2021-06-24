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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaServer = void 0;
var mediaServerClient = __importStar(require("mediasoup-client"));
var conusma_exception_1 = require("./Exceptions/conusma-exception");
var MediaServer = /** @class */ (function () {
    function MediaServer(appService) {
        this.appService = appService;
        this.id = 0;
        this.socket = null;
        this.device = null;
        this.consumerTransports = [];
    }
    MediaServer.prototype.load = function () {
        return __awaiter(this, void 0, void 0, function () {
            var routerRtpCapabilities, handlerName;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.signal('getRouterRtpCapabilities', null, this.socket)];
                    case 1:
                        routerRtpCapabilities = _a.sent();
                        handlerName = mediaServerClient.detectDevice();
                        if (handlerName) {
                            console.log("detected handler: %s", handlerName);
                        }
                        else {
                            console.error("no suitable handler found for current device");
                        }
                        this.device = new mediaServerClient.Device({
                            handlerName: handlerName
                        });
                        console.log("device loading...");
                        return [4 /*yield*/, this.device.load({ routerRtpCapabilities: routerRtpCapabilities })];
                    case 2:
                        _a.sent();
                        console.log("device loaded.");
                        return [2 /*return*/];
                }
            });
        });
    };
    MediaServer.prototype.produce = function (user, localStream) {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, this.createProducerTransport()];
                    case 1:
                        _a.sent();
                        if (!(user.Camera || user.ShareScreen)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.createProducer(localStream, 'video')];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        if (!user.Mic) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.createProducer(localStream, 'audio')];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        user.MediaServerId = this.id;
                        this.appService.connectMeeting(user);
                        return [3 /*break*/, 7];
                    case 6:
                        error_1 = _a.sent();
                        throw new conusma_exception_1.ConusmaException("produce", "can not send stream, please check exception", error_1);
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    MediaServer.prototype.createProducerTransport = function () {
        return __awaiter(this, void 0, void 0, function () {
            var transportOptions, _a, error_2;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        console.log("createProducerTransport started.");
                        return [4 /*yield*/, this.signal('createProducerTransport', {}, this.socket)];
                    case 1:
                        transportOptions = _b.sent();
                        _a = this;
                        return [4 /*yield*/, this.device.createSendTransport(transportOptions)];
                    case 2:
                        _a.producerTransport = _b.sent();
                        this.producerTransport.on('connect', function (_a, callback, errback) {
                            var dtlsParameters = _a.dtlsParameters;
                            return __awaiter(_this, void 0, void 0, function () {
                                var error;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0: return [4 /*yield*/, this.signal('connectProducerTransport', {
                                                transportId: transportOptions.id,
                                                dtlsParameters: dtlsParameters
                                            }, this.socket)];
                                        case 1:
                                            error = _b.sent();
                                            callback();
                                            return [2 /*return*/];
                                    }
                                });
                            });
                        });
                        this.producerTransport.on('produce', function (_a, callback, errback) {
                            var kind = _a.kind, rtpParameters = _a.rtpParameters, appData = _a.appData;
                            return __awaiter(_this, void 0, void 0, function () {
                                var paused, id;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            paused = false;
                                            paused = false;
                                            return [4 /*yield*/, this.signal('produce', {
                                                    transportId: transportOptions.id,
                                                    kind: kind,
                                                    rtpParameters: rtpParameters,
                                                    paused: paused,
                                                    appData: appData
                                                }, this.socket)];
                                        case 1:
                                            id = _b.sent();
                                            callback(id);
                                            return [2 /*return*/];
                                    }
                                });
                            });
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _b.sent();
                        throw new conusma_exception_1.ConusmaException("createProducerTransport", "createProducerTransport error", error_2);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    MediaServer.prototype.createProducer = function (localStream, kind) {
        return __awaiter(this, void 0, void 0, function () {
            var videoTrack, _a, _b, error_3;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 5, , 6]);
                        if (!(kind == 'video')) return [3 /*break*/, 2];
                        videoTrack = localStream.getVideoTracks()[0];
                        _a = this;
                        return [4 /*yield*/, this.producerTransport.produce({
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
                        _a.videoProducer = _c.sent();
                        return [3 /*break*/, 4];
                    case 2:
                        if (!(kind == 'audio')) return [3 /*break*/, 4];
                        _b = this;
                        return [4 /*yield*/, this.producerTransport.produce({
                                track: localStream.getAudioTracks()[0],
                                appData: { mediaTag: 'audio' }
                            })];
                    case 3:
                        _b.audioProducer = _c.sent();
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
    MediaServer.prototype.signal = function (type, data, mediaServerSocket) {
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
    MediaServer.prototype.consume = function (producerUser) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.createConsumerTransport(this, producerUser)];
                    case 1:
                        result = _a.sent();
                        this.consumerTransports.push(result);
                        return [2 /*return*/, result.RemoteStream];
                    case 2:
                        error_4 = _a.sent();
                        throw new conusma_exception_1.ConusmaException("consume", producerUser.Id + "The stream of the user is currently not captured. User connection information is out of date.", error_4);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MediaServer.prototype.createConsumerTransport = function (targetMediaServerClient, user) {
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
                        return [4 /*yield*/, targetMediaServerClient.device.createRecvTransport(transportOptions.transportOptions)];
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
    MediaServer.prototype.addConsumer = function (consumerTransport, kind) {
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
    MediaServer.prototype.resumeConsumer = function (consumerTransport, kind) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.signal('resume', { consumerTransportId: consumerTransport.transportId, kind: kind }, consumerTransport.MediaServer.socket);
                return [2 /*return*/];
            });
        });
    };
    MediaServer.prototype.consumeTransport = function (consumerTransport, trackKind) {
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
    MediaServer.prototype.pauseConsumer = function (consumerTransport, kind) {
        return __awaiter(this, void 0, void 0, function () {
            var error_5;
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
                        error_5 = _a.sent();
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    MediaServer.prototype.closeConsumer = function (user) {
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
                    throw new conusma_exception_1.ConusmaException("closeConsumer", "consumer cannot be closed, please check exception", error);
                }
                return [2 /*return*/];
            });
        });
    };
    MediaServer.prototype.removeItemOnce = function (arr, index) {
        if (index > -1) {
            arr.splice(index, 1);
        }
        return arr;
    };
    MediaServer.prototype.closeProducer = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    if (this.producerTransport)
                        this.producerTransport.close();
                }
                catch (error) {
                    throw new conusma_exception_1.ConusmaException("closeProducer", "producer cannot be closed, please check exception ", error);
                }
                return [2 /*return*/];
            });
        });
    };
    return MediaServer;
}());
exports.MediaServer = MediaServer;
