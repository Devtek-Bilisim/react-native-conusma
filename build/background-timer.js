"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.backgroundTimer = void 0;
var events_1 = __importDefault(require("events"));
var react_native_background_timer_1 = __importDefault(require("react-native-background-timer"));
var conusma_exception_1 = require("./Exceptions/conusma-exception");
var backgroundTimer = /** @class */ (function () {
    function backgroundTimer() {
        this.tickEventEmitter = new events_1.default();
        this.timeoutActive = true;
    }
    backgroundTimer.prototype.start = function (interval) {
        var _this = this;
        this.timerId = react_native_background_timer_1.default.setTimeout(function () {
            if (_this.timeoutActive) {
                _this.tickEventEmitter.emit('timeout');
                _this.start(interval);
            }
        }, interval);
    };
    backgroundTimer.prototype.terminate = function () {
        try {
            this.timeoutActive = false;
            this.tickEventEmitter.removeAllListeners();
            react_native_background_timer_1.default.clearTimeout(this.timerId);
            react_native_background_timer_1.default.stop();
        }
        catch (error) {
            throw new conusma_exception_1.ConusmaException("ConusmaWorker", "terminated interval error", error);
        }
    };
    return backgroundTimer;
}());
exports.backgroundTimer = backgroundTimer;
