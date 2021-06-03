"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConusmaException = void 0;
var ConusmaException = /** @class */ (function (_super) {
    __extends(ConusmaException, _super);
    function ConusmaException(_type, _message, _ex) {
        var _this = _super.call(this) || this;
        _this.detailEx = new Error();
        _this.message = "";
        _this.type = "";
        _this.className = "";
        _this.message = _message;
        _this.type = _type;
        if (_ex != null) {
            _this.detailEx = _ex;
        }
        console.error(JSON.stringify(_this));
        return _this;
    }
    ;
    return ConusmaException;
}(Error));
exports.ConusmaException = ConusmaException;
