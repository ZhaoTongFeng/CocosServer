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
var NetworkSystem_1 = __importDefault(require("../Share/NetworkSystem"));
var ServerRoomManager_1 = __importDefault(require("./ServerRoomManager"));
var ServerUserManager_1 = __importDefault(require("./ServerUserManager"));
var ServerNetworkSystem = /** @class */ (function (_super) {
    __extends(ServerNetworkSystem, _super);
    function ServerNetworkSystem() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //??????<stirng,conn>
        _this.connMap = new Map();
        _this.connPeeding = new Map();
        _this.ws = null;
        return _this;
    }
    ServerNetworkSystem_1 = ServerNetworkSystem;
    /************************************************
     * ??????Manager??????
     ************************************************/
    ServerNetworkSystem.prototype.getUserByKey = function (key) {
        var userMng = this.userManager;
        return userMng.getUserByKey(key);
    };
    ServerNetworkSystem.prototype.getKey = function (conn) { return conn["key"]; };
    /************************************************
     * ??????
     ************************************************/
    //??????????????????????????????Main.js???????????????
    ServerNetworkSystem.prototype.sendText = function (conn, msg) { };
    //??????????????????????????????Main.js???????????????
    ServerNetworkSystem.prototype._broadcast = function (ws, msg) { };
    ServerNetworkSystem.prototype.broadcast = function (msg) {
        this._broadcast(this.ws, msg);
    };
    ServerNetworkSystem.prototype.sendCmd = function (conn, cmd, obj) {
        if (obj === void 0) { obj = {}; }
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
    ServerNetworkSystem.prototype.sendBinary = function (conn, bufferView, callback) {
        if (callback === void 0) { callback = null; }
        conn["sendBinary"](bufferView, callback);
    };
    /************************************************
     * ??????
     ************************************************/
    //??????????????????????????????
    ServerNetworkSystem.prototype.onReceive = function (conn, str) {
        var data = JSON.parse(str);
        this.processReceive(conn, Number(data["opt"]), data);
    };
    ServerNetworkSystem.prototype.onReceiveBinary = function (conn, stream) {
        var byteLength = stream.buffer["byteLength"];
        var offset = stream["byteOffset"];
        var view = new Uint32Array(stream.buffer, stream["byteOffset"], 2);
        var opt = view[0];
        var leng = view[1];
        if (leng < byteLength - offset) {
            var subview = new Uint8Array(stream.buffer, stream["byteOffset"], leng);
            this.processReceive(conn, opt, subview);
        }
    };
    ServerNetworkSystem.prototype.processReceive = function (conn, opt, data) {
        var tuple = this.events.get(opt);
        if (tuple) {
            var func = tuple[0];
            var caller = tuple[1];
            var key = this.getKey(conn);
            func.call(caller, key, conn, data);
        }
        // this.printInfo();
    };
    /************************************************
     * ?????? ??? ?????? ??????
     ************************************************/
    ServerNetworkSystem.prototype.init = function () {
        this.userManager = new ServerUserManager_1.default();
        this.userManager.init(this);
        this.roomManager = new ServerRoomManager_1.default();
        this.roomManager.init(this);
        this.register(NetCmd_1.NetCmd.DEV_SERVER_STATUS, this.onServerInfo, this);
        this.register(NetCmd_1.NetCmd.HEART, this.onHeart, this);
    };
    /************************************************
     * ????????????
     ************************************************/
    //?????????
    ServerNetworkSystem.prototype.onNewClient = function (conn) {
        var key = this.getKey(conn);
        this.connPeeding.set(key, conn);
        this.userManager.onConnected(key, conn);
        console.log("?????????", key);
        this.printInfo();
    };
    //?????????
    ServerNetworkSystem.prototype.onHeart = function (key, conn, obj) {
        var user = this.getUserByKey(key);
        var out = {};
        var data = obj["data"];
        if (user) {
            var sendTime = data[0]; //??????????????????
            var curTime = this.getCurrentTime(); //????????????
            var serverTick = user.serverHartTick; //?????????????????????
            var receiveTime = data[1]; //?????????????????????
            user.delay_clientToServer = (curTime - sendTime);
            user.delay_serverToClient = receiveTime - serverTick;
            user.serverHartTick = curTime;
        }
        this.sendCmd(conn, NetCmd_1.NetCmd.HEART, out);
    };
    //????????????
    ServerNetworkSystem.prototype.onClose = function (conn, code, reason) {
        var key = this.getKey(conn);
        this.connPeeding.delete(key);
        this.connMap.delete(key);
        var userMng = this.userManager;
        userMng.onClose(key, conn);
        console.log("????????????", conn["key"], code, reason);
        this.printInfo();
    };
    //TODO ?????????????????????peeding
    ServerNetworkSystem.prototype.onTimeOut = function () {
    };
    ServerNetworkSystem.prototype.onServerInfo = function (key, conn, obj) {
        var userManger = this.userManager;
        var roomManager = this.roomManager;
        var out = {
            "ped": this.connPeeding.size,
            "es": this.connMap.size,
            "uk": userManger.userKeyMap.size,
            "uid": userManger.userIdMap.size,
            "ulose": userManger.userLoseMap.size,
            "rooms": roomManager.rooms.size
        };
        this.sendCmd(conn, NetCmd_1.NetCmd.DEV_SERVER_STATUS, out);
    };
    ServerNetworkSystem.prototype.printInfo = function () {
        // console.log(
        //     "ped", this.connPeeding.size,
        //     "es", this.connMap.size,
        //     "uk", UserManager.Ins.userKeyMap.size,
        //     "uid", UserManager.Ins.userIdMap.size,
        //     "ulose", UserManager.Ins.userLoseMap.size,
        //     "rooms", RoomManager.Ins.rooms.size
        // );
    };
    var ServerNetworkSystem_1;
    ServerNetworkSystem = ServerNetworkSystem_1 = __decorate([
        XBase_1.xclass(ServerNetworkSystem_1)
    ], ServerNetworkSystem);
    return ServerNetworkSystem;
}(NetworkSystem_1.default));
exports.default = ServerNetworkSystem;
