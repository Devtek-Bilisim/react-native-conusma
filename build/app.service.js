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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
var conusma_restapi_exception_1 = require("./Exceptions/conusma-restapi-exception");
var AppService = /** @class */ (function () {
    function AppService(appId, parameters) {
        this.version = "1.0.0";
        this.appId = appId;
        this.apiUrl = parameters.apiUrl;
        this.token = "";
        this.deviceId = parameters.deviceId;
        this.version = parameters.version;
    }
    AppService.prototype.setJwtToken = function (token) {
        this.token = token;
    };
    AppService.prototype.getJwtToken = function () {
        return this.token;
    };
    AppService.prototype.createUserWithDeviceId = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, fetch(this.apiUrl + "/User/AddUserWithAppCode", {
                            method: 'POST',
                            headers: {
                                accept: 'application/json',
                                'content-type': 'application/json',
                            },
                            body: JSON.stringify({
                                appCode: this.appId,
                                deviceCode: this.deviceId,
                            })
                        })];
                    case 1:
                        response = _c.sent();
                        if (!!response.ok) return [3 /*break*/, 3];
                        _a = conusma_restapi_exception_1.ConusmaRestApiException.bind;
                        _b = [void 0, response.status];
                        return [4 /*yield*/, response.text()];
                    case 2: throw new (_a.apply(conusma_restapi_exception_1.ConusmaRestApiException, _b.concat([_c.sent()])))();
                    case 3: return [4 /*yield*/, response.json()];
                    case 4: return [2 /*return*/, _c.sent()];
                }
            });
        });
    };
    AppService.prototype.getMediaServer = function (meetingUserId) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch(this.apiUrl + "/Live/GetMediaServer/" + meetingUserId, {
                            method: 'POST',
                            headers: {
                                accept: 'application/json',
                                'content-type': 'application/json',
                                'Token': this.token
                            }
                        })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AppService.prototype.isApproved = function (meetingUserId) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch(this.apiUrl + "/Live/IsItApproved/" + meetingUserId, {
                            method: 'POST',
                            headers: {
                                accept: 'application/json',
                                'content-type': 'application/json',
                                'Token': this.token
                            }
                        })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AppService.prototype.getMeetings = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, fetch(this.apiUrl + "/Meeting/GetMeetings", {
                            method: 'GET',
                            headers: {
                                accept: 'application/json',
                                'content-type': 'application/json',
                                'Token': this.token
                            }
                        })];
                    case 1:
                        response = _c.sent();
                        if (!!response.ok) return [3 /*break*/, 3];
                        _a = conusma_restapi_exception_1.ConusmaRestApiException.bind;
                        _b = [void 0, response.status];
                        return [4 /*yield*/, response.text()];
                    case 2: throw new (_a.apply(conusma_restapi_exception_1.ConusmaRestApiException, _b.concat([_c.sent()])))();
                    case 3: return [4 /*yield*/, response.json()];
                    case 4: return [2 /*return*/, _c.sent()];
                }
            });
        });
    };
    AppService.prototype.joinMeetingById = function (meetingId) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch(this.apiUrl + "/Meeting/JoinMeeting", {
                            method: 'POST',
                            headers: {
                                accept: 'application/json',
                                'content-type': 'application/json',
                                'Token': this.token
                            },
                            body: JSON.stringify({
                                meetingId: meetingId,
                            })
                        })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AppService.prototype.login = function (userKey, password, deviceId) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch(this.apiUrl + "/Login/UserLogin", {
                            method: 'POST',
                            headers: {
                                accept: 'application/json',
                                'content-type': 'application/json',
                            },
                            body: JSON.stringify({
                                userKey: userKey,
                                password: password,
                                deviceId: deviceId
                            })
                        })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AppService.prototype.checkSafeDeviceCode = function (code, deviceId) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch(this.apiUrl + "/Login/SafeDeviceCodeCheck", {
                            method: 'POST',
                            headers: {
                                accept: 'application/json',
                                'content-type': 'application/json',
                            },
                            body: JSON.stringify({
                                code: code,
                                deviceId: deviceId
                            })
                        })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AppService.prototype.googleLogin = function (googleToken, deviceId) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch(this.apiUrl + "/Login/GoogleUserLogin", {
                            method: 'POST',
                            headers: {
                                accept: 'application/json',
                                'content-type': 'application/json',
                            },
                            body: JSON.stringify({
                                googleToken: googleToken,
                                deviceId: deviceId
                            })
                        })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AppService.prototype.isTokenValid = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch(this.apiUrl + "/Login/TokenIsValid", {
                            method: 'POST',
                            headers: {
                                accept: 'application/json',
                                'content-type': 'application/json',
                                'Token': this.token
                            }
                        })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AppService.prototype.signup = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch(this.apiUrl + "/User/AddUser", {
                            method: 'POST',
                            headers: {
                                accept: 'application/json',
                                'content-type': 'application/json',
                            },
                            body: JSON.stringify(data)
                        })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AppService.prototype.signupConfirm = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch(this.apiUrl + "/User/EMailVerificationCode", {
                            method: 'POST',
                            headers: {
                                accept: 'application/json',
                                'content-type': 'application/json',
                            },
                            body: JSON.stringify(data)
                        })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AppService.prototype.forgotPassword = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch(this.apiUrl + "/User/ForgotPassword", {
                            method: 'POST',
                            headers: {
                                accept: 'application/json',
                                'content-type': 'application/json',
                            },
                            body: JSON.stringify(data)
                        })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AppService.prototype.controlForgotPasswordCode = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch(this.apiUrl + "/User/ControlForgotPasswordCode", {
                            method: 'POST',
                            headers: {
                                accept: 'application/json',
                                'content-type': 'application/json',
                            },
                            body: JSON.stringify(data)
                        })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AppService.prototype.changePassword = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch(this.apiUrl + "/User/ChangePassword", {
                            method: 'POST',
                            headers: {
                                accept: 'application/json',
                                'content-type': 'application/json',
                                Token: this.token
                            },
                            body: JSON.stringify(data)
                        })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AppService.prototype.createPublicUser = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, fetch(this.apiUrl + "/Login/PublicUserCreate", {
                            method: 'POST',
                            headers: {
                                accept: 'application/json',
                                'content-type': 'application/json'
                            }
                        })];
                    case 1:
                        response = _c.sent();
                        if (!!response.ok) return [3 /*break*/, 3];
                        _a = conusma_restapi_exception_1.ConusmaRestApiException.bind;
                        _b = [void 0, response.status];
                        return [4 /*yield*/, response.text()];
                    case 2: throw new (_a.apply(conusma_restapi_exception_1.ConusmaRestApiException, _b.concat([_c.sent()])))();
                    case 3: return [4 /*yield*/, response.json()];
                    case 4: return [2 /*return*/, _c.sent()];
                }
            });
        });
    };
    AppService.prototype.createMeeting = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch(this.apiUrl + "/Meeting/CreateNewMeeting", {
                            method: 'POST',
                            headers: {
                                accept: 'application/json',
                                'content-type': 'application/json',
                                Token: this.token
                            }
                        })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AppService.prototype.createSchedule = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch(this.apiUrl + "/Meeting/CreateSchedule", {
                            method: 'POST',
                            headers: {
                                accept: 'application/json',
                                'content-type': 'application/json',
                                Token: this.token
                            },
                            body: JSON.stringify(data)
                        })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AppService.prototype.updateSchedule = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch(this.apiUrl + "/Meeting/UpdateSchedule", {
                            method: 'POST',
                            headers: {
                                accept: 'application/json',
                                'content-type': 'application/json',
                                Token: this.token
                            },
                            body: JSON.stringify(data)
                        })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AppService.prototype.getSchedules = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch(this.apiUrl + "/Meeting/GetSchedules", {
                            method: 'POST',
                            headers: {
                                accept: 'application/json',
                                'content-type': 'application/json',
                                Token: this.token
                            }
                        })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AppService.prototype.getSchedule = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch(this.apiUrl + "/Meeting/GetSchedule", {
                            method: 'POST',
                            headers: {
                                accept: 'application/json',
                                'content-type': 'application/json',
                                Token: this.token
                            },
                            body: JSON.stringify({
                                id: id
                            })
                        })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AppService.prototype.addFile = function (fileName, meetingId, fileBase64) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch(this.apiUrl + "/File/Add", {
                            method: 'POST',
                            headers: {
                                accept: 'application/json',
                                'content-type': 'application/json',
                                Token: this.token
                            },
                            body: JSON.stringify({
                                fileName: fileName,
                                meetingId: meetingId,
                                fileDataBase64: fileBase64
                            })
                        })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AppService.prototype.getFile = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch(this.apiUrl + "/File/Get" + file, {
                            method: 'GET',
                            headers: {
                                accept: 'application/json',
                                'content-type': 'application/json',
                                Token: this.token
                            }
                        })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AppService.prototype.addLogs = function (logs) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch(this.apiUrl + "/ClientLog/AddLogList", {
                            method: 'POST',
                            headers: {
                                accept: 'application/json',
                                'content-type': 'application/json',
                                Token: this.token
                            },
                            body: JSON.stringify({
                                logs: logs
                            })
                        })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AppService.prototype.addLog = function (status, category, message, meetingId, username, hasCam, hasMic, isCamActive, isMicActive) {
        return __awaiter(this, void 0, void 0, function () {
            var log, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        log = {
                            "uuid": this.deviceId,
                            "ClientVer": "1.0.0",
                            "Mac": "50:9C:58:3C:0B:DB",
                            "Platform": "",
                            "DeviceModel": "",
                            "DevicePlatform": "",
                            "DeviceVersion": "",
                            "DeviceManufacturer": "",
                            "DeviceIsVirtual": "",
                            "UserName": username,
                            "MeetingId": meetingId,
                            "Resolution": "",
                            "Browser": "",
                            "BrowserVersion": "",
                            "OS": "",
                            "OSVersion": "",
                            "HasCam": hasCam,
                            "HasMic": hasMic,
                            "IsCamActive": isCamActive,
                            "IsMicActive": isMicActive,
                            "Status": status,
                            "Title": category,
                            "Detail": message,
                        };
                        return [4 /*yield*/, fetch(this.apiUrl + "/ClientLog/AddLog", {
                                method: 'POST',
                                headers: {
                                    accept: 'application/json',
                                    'content-type': 'application/json',
                                    Token: this.token
                                },
                                body: JSON.stringify({
                                    log: log
                                })
                            })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AppService.prototype.getCountries = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch(this.apiUrl + "/Tool/GetCountryCode", {
                            method: 'GET',
                            headers: {
                                accept: 'application/json',
                                'content-type': 'application/json',
                                Token: this.token
                            }
                        })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AppService.prototype.getProfile = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch(this.apiUrl + "/User/GetUserProfile", {
                            method: 'POST',
                            headers: {
                                accept: 'application/json',
                                'content-type': 'application/json',
                                Token: this.token
                            }
                        })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AppService.prototype.updateProfile = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch(this.apiUrl + "/User/UpdateUserProfile", {
                            method: 'POST',
                            headers: {
                                accept: 'application/json',
                                'content-type': 'application/json',
                                Token: this.token
                            },
                            body: JSON.stringify(data)
                        })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AppService.prototype.updateMeeting = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch(this.apiUrl + "/Meeting/UpdateMeeting", {
                            method: 'POST',
                            headers: {
                                accept: 'application/json',
                                'content-type': 'application/json',
                                Token: this.token
                            },
                            body: JSON.stringify(data)
                        })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AppService.prototype.invite = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch(this.apiUrl + "/Meeting/InviteMeeting", {
                            method: 'POST',
                            headers: {
                                accept: 'application/json',
                                'content-type': 'application/json',
                                Token: this.token
                            },
                            body: JSON.stringify(data)
                        })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AppService.prototype.isMeetingValid = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch(this.apiUrl + "/Meeting/MeetingIsValid", {
                            method: 'POST',
                            headers: {
                                accept: 'application/json',
                                'content-type': 'application/json',
                                Token: this.token
                            },
                            body: JSON.stringify(data)
                        })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AppService.prototype.joinMeeting = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch(this.apiUrl + "/Meeting/JoinMeeting", {
                            method: 'POST',
                            headers: {
                                accept: 'application/json',
                                'content-type': 'application/json',
                                Token: this.token
                            },
                            body: JSON.stringify(data)
                        })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AppService.prototype.controlInviteCode = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch(this.apiUrl + "/Meeting/InviteCodeControl", {
                            method: 'GET',
                            headers: {
                                accept: 'application/json',
                                'content-type': 'application/json',
                                Token: this.token
                            }
                        })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AppService.prototype.sendEmailVerification = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch(this.apiUrl + "/User/SendEmailVerification", {
                            method: 'POST',
                            headers: {
                                accept: 'application/json',
                                'content-type': 'application/json',
                                Token: this.token
                            }
                        })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AppService.prototype.getTimezones = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch(this.apiUrl + "/Tool/GetTimeZone", {
                            method: 'GET',
                            headers: {
                                accept: 'application/json',
                                'content-type': 'application/json',
                                Token: this.token
                            }
                        })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return AppService;
}());
exports.AppService = AppService;
