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
exports.ConusmaRestApiException = void 0;
var ConusmaRestApiException = /** @class */ (function (_super) {
    __extends(ConusmaRestApiException, _super);
    function ConusmaRestApiException(_statusCode, _message, _ex) {
        var _this = _super.call(this) || this;
        _this.detailEx = new Error();
        _this.statusCode = 0;
        _this.message = "";
        _this.message = _message;
        _this.statusCode = _statusCode;
        if (_ex != null) {
            _this.detailEx = _ex;
        }
        return _this;
    }
    ;
    return ConusmaRestApiException;
}(Error));
exports.ConusmaRestApiException = ConusmaRestApiException;
