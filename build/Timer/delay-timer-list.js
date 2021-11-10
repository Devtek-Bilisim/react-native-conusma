"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DelayTimerList = void 0;
var delay_timer_1 = require("./delay-timer");
var DelayTimerList = /** @class */ (function () {
    function DelayTimerList() {
    }
    DelayTimerList.startTime = function (key) {
        try {
            var time_1 = this.timeList.get(key);
            if (time_1 == null) {
                var time = new delay_timer_1.DelayTime();
                time.key = key;
                time.start = new Date().getTime();
                this.timeList.set(key, time);
            }
            else {
                time_1.key = key;
                time_1.start = new Date().getTime();
            }
        }
        catch (error) {
            console.log("not start time");
        }
    };
    DelayTimerList.endTime = function (key) {
        try {
            var time = this.timeList.get(key);
            if (time != null) {
                time.end = new Date().getTime();
            }
        }
        catch (error) {
            console.log("not end time");
        }
    };
    DelayTimerList.getLog = function () {
        var responseArray = new Array();
        this.timeList.forEach(function (element) {
            var obj = { 'key': element.key, 'dif': element.end - element.start };
            responseArray.push(obj);
        });
        return responseArray;
    };
    DelayTimerList.timeList = new Map();
    return DelayTimerList;
}());
exports.DelayTimerList = DelayTimerList;
