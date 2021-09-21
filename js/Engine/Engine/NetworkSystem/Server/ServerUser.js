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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var XBase_1 = require("../../ReflectSystem/XBase");
var User_1 = __importDefault(require("../Share/User"));
var ServerUser = /** @class */ (function (_super) {
    __extends(ServerUser, _super);
    function ServerUser() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //socket 连接
        _this.conn = null;
        return _this;
    }
    ServerUser_1 = ServerUser;
    ServerUser.prototype.sendCmd = function (cmd, obj) {
        var ns = this.mng.ns;
        ns.sendCmd(this.conn, cmd, obj);
    };
    ServerUser.prototype.sendBinary = function (view, callback) {
        if (callback === void 0) { callback = null; }
        var ns = this.mng.ns;
        ns.sendBinary(this.conn, view, callback);
    };
    var ServerUser_1;
    ServerUser = ServerUser_1 = __decorate([
        XBase_1.xServer("User"),
        XBase_1.xclass(ServerUser_1)
    ], ServerUser);
    return ServerUser;
}(User_1.default));
exports.default = ServerUser;
