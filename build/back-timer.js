"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.backtimer = void 0;
var react_native_background_timer_1 = __importDefault(require("react-native-background-timer"));
var conusma_exception_1 = require("./Exceptions/conusma-exception");
var backtimer = /** @class */ (function () {
    function backtimer() {
        this.active = true;
    }
    backtimer.prototype.start = function (interval) {
        var _this = this;
        this.id = react_native_background_timer_1.default.setTimeout(function () {
            // this will be executed once after 10 seconds
            // even when app is the the background
            console.log('tac');
            if (_this.active) {
                _this.start(interval);
            }
        }, interval);
    };
    backtimer.prototype.terminate = function () {
        try {
            this.active = false;
            react_native_background_timer_1.default.clearTimeout(this.id);
            react_native_background_timer_1.default.stop();
        }
        catch (error) {
            throw new conusma_exception_1.ConusmaException("ConusmaWorker", "terminated interval error", error);
        }
    };
    return backtimer;
}());
exports.backtimer = backtimer;
