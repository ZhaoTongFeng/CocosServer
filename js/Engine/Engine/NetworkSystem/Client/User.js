"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionStatus = void 0;
var XBase_1 = require("../../ReflectSystem/XBase");
var ConnectionStatus;
(function (ConnectionStatus) {
    ConnectionStatus[ConnectionStatus["CONNECTING"] = 0] = "CONNECTING";
    ConnectionStatus[ConnectionStatus["CONNECTED"] = 1] = "CONNECTED";
    ConnectionStatus[ConnectionStatus["LOSE"] = 2] = "LOSE";
})(ConnectionStatus = exports.ConnectionStatus || (exports.ConnectionStatus = {}));
var User = /** @class */ (function (_super) {
    __extends(User, _super);
    function User() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //用户ID
        _this.id_user = "";
        //服务端 连接标识
        _this.key_conn = "";
        //连接状态
        _this.conState = ConnectionStatus.CONNECTING;
        //当前所在房间
        _this.id_room = "";
        return _this;
    }
    User_1 = User;
    var User_1;
    __decorate([
        XBase_1.xproperty(String)
    ], User.prototype, "id_user", void 0);
    __decorate([
        XBase_1.xproperty(String)
    ], User.prototype, "key_conn", void 0);
    __decorate([
        XBase_1.xproperty(Number)
    ], User.prototype, "conState", void 0);
    __decorate([
        XBase_1.xproperty(String)
    ], User.prototype, "id_room", void 0);
    User = User_1 = __decorate([
        XBase_1.xclass(User_1)
    ], User);
    return User;
}(XBase_1.XBase));
exports.default = User;
