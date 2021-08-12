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
var NetCmd_1 = require("../Share/NetCmd");
var RoomManager_1 = __importDefault(require("./RoomManager"));
var UserManager_1 = __importDefault(require("./UserManager"));
var UNetworkSystem = /** @class */ (function (_super) {
    __extends(UNetworkSystem, _super);
    function UNetworkSystem() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //连接<stirng,conn>
        _this.connMap = new Map();
        _this.connPeeding = new Map();
        _this.ws = null;
        _this.isDebug = true;
        //回调注册
        _this.events = new Map();
        return _this;
    }
    UNetworkSystem_1 = UNetworkSystem;
    /************************************************
     * 访问Manager数据
     ************************************************/
    UNetworkSystem.prototype.getUserByKey = function (key) {
        return UserManager_1.default.Ins.getUserByKey(key);
    };
    UNetworkSystem.prototype.getUserById = function (id) {
        return UserManager_1.default.Ins.getUserById(id);
    };
    UNetworkSystem.prototype.getRoomById = function (id) {
        return RoomManager_1.default.Ins.getRoomById(id);
    };
    UNetworkSystem.prototype.getKey = function (conn) { return conn["key"]; };
    /************************************************
     * 发送
     ************************************************/
    //发送接口，需要在外部Main.js中进行绑定
    UNetworkSystem.prototype.sendText = function (conn, msg) { };
    //广播接口，需要在外部Main.js中进行绑定
    UNetworkSystem.prototype._broadcast = function (ws, msg) { };
    UNetworkSystem.prototype.broadcast = function (msg) {
        this._broadcast(this.ws, msg);
    };
    UNetworkSystem.prototype.sendCmd = function (conn, cmd, obj) {
        try {
            obj["opt"] = cmd;
            var str = null;
            if (typeof obj == "string") {
                str = obj;
            }
            else {
                str = JSON.stringify(obj);
            }
            this.sendText(conn, str);
        }
        catch (error) {
            console.log(error);
        }
    };
    /************************************************
     * 接收
     ************************************************/
    UNetworkSystem.prototype.onReceive = function (conn, str) {
        var data = JSON.parse(str);
        var tuple = this.events.get(Number(data["opt"]));
        if (tuple) {
            var func = tuple[0];
            var caller = tuple[1];
            var key = this.getKey(conn);
            func.call(caller, key, conn, data);
        }
        this.printInfo();
    };
    /************************************************
     * 指令 和 系统 注册
     ************************************************/
    UNetworkSystem.prototype.init = function () {
        UserManager_1.default.Ins.init(this);
        RoomManager_1.default.Ins.init(this);
        this.register(NetCmd_1.NetCmd.HEART, this.onHeart, this);
    };
    UNetworkSystem.prototype.register = function (cmd, callback, caller) { this.events.set(cmd, [callback, caller]); };
    UNetworkSystem.prototype.unRegister = function (cmd) { this.events.delete(cmd); };
    /************************************************
     * 生命周期
     ************************************************/
    //新连接
    UNetworkSystem.prototype.onNewClient = function (conn) {
        var key = this.getKey(conn);
        this.connPeeding.set(key, conn);
        UserManager_1.default.Ins.newConnected(key, conn);
        console.log("新连接", key);
        this.printInfo();
    };
    //心跳包
    UNetworkSystem.prototype.onHeart = function (key, conn, obj) {
        this.sendCmd(conn, NetCmd_1.NetCmd.HEART, {});
    };
    //连接断开
    UNetworkSystem.prototype.onClose = function (conn, code, reason) {
        var key = this.getKey(conn);
        this.connPeeding.delete(key);
        this.connMap.delete(key);
        UserManager_1.default.Ins.onClose(key, conn);
        console.log("连接断开", conn["key"], code, reason);
        this.printInfo();
    };
    //TODO 连接超时，清除peeding
    UNetworkSystem.prototype.onTimeOut = function () {
    };
    UNetworkSystem.prototype.printInfo = function () {
        console.log("ped", this.connPeeding.size, "es", this.connMap.size, "uk", UserManager_1.default.Ins.userKeyMap.size, "uid", UserManager_1.default.Ins.userIdMap.size, "ulose", UserManager_1.default.Ins.userLoseMap.size, "rooms", RoomManager_1.default.Ins.rooms.size);
    };
    var UNetworkSystem_1;
    UNetworkSystem = UNetworkSystem_1 = __decorate([
        XBase_1.xclass(UNetworkSystem_1)
    ], UNetworkSystem);
    return UNetworkSystem;
}(XBase_1.XBase));
exports.default = UNetworkSystem;
