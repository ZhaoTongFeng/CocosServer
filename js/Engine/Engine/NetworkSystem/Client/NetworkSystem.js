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
exports.ConnectionStatus = void 0;
var Object_1 = __importDefault(require("../../../Object"));
var XBase_1 = require("../../ReflectSystem/XBase");
var NetCmd_1 = require("../Share/NetCmd");
var RoomManager_1 = __importDefault(require("./RoomManager"));
var UserManager_1 = __importDefault(require("./UserManager"));
var ConnectionStatus;
(function (ConnectionStatus) {
    ConnectionStatus[ConnectionStatus["NO"] = 0] = "NO";
    ConnectionStatus[ConnectionStatus["CONNECTING"] = 1] = "CONNECTING";
    ConnectionStatus[ConnectionStatus["CONNECTED"] = 2] = "CONNECTED";
    ConnectionStatus[ConnectionStatus["RECONNECT"] = 3] = "RECONNECT";
})(ConnectionStatus = exports.ConnectionStatus || (exports.ConnectionStatus = {}));
/**
 * 网络管理器
 * 客户端只有一个，服务端也只有一个
 *
 */
var UNetworkSystem = /** @class */ (function (_super) {
    __extends(UNetworkSystem, _super);
    function UNetworkSystem() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //网络连接状态
        _this.conState = ConnectionStatus.NO;
        _this.delay = 0;
        _this.url = "wss://www.llag.net/game/id=123";
        _this.ws = null;
        _this.events = new Map();
        //重连
        _this.reConFlag = false;
        _this.reConDelay = 1000;
        _this.reConHandle = -1;
        //心跳包
        _this.heartFlag = false;
        _this.heartHandle = -1;
        _this.heartDelay = 5000;
        _this.sendTime = 0;
        return _this;
    }
    UNetworkSystem_1 = UNetworkSystem;
    /************************************************
     * 访问Manager数据
     ************************************************/
    UNetworkSystem.prototype.getUserById = function (id) {
        return UserManager_1.default.Ins.getUserById(id);
    };
    UNetworkSystem.prototype.getRoomById = function (id) {
        return RoomManager_1.default.Ins.getRoomById(id);
    };
    /************************************************
     * 发送
     ************************************************/
    /** 普通请求指令 */
    //1.1.发送命令
    // 直接发送即可
    UNetworkSystem.prototype.sendCmd = function (cmd, obj) {
        obj["opt"] = cmd;
        var str = JSON.stringify(obj);
        this.ws.send(str);
        console.log("Client", obj);
    };
    /************************************************
     * 接收
     ************************************************/
    UNetworkSystem.prototype.onReceiveData = function (e) {
        var str = e.data;
        var obj = JSON.parse(str);
        var opt = Number(obj["opt"]);
        console.log("Server:" + str);
        //发送回调
        var tuple = this.events.get(opt);
        if (tuple) {
            var func = tuple[0];
            var caller = tuple[1];
            func.call(caller, obj);
        }
        // if (this.receiveFlag) {
        //     //如果正在处理数据，则添加到临时容器
        //     this.receiveBufferTemp.push(obj);
        // } else {
        //     this.receiveBuffer.push(obj);
        // }
    };
    /************************************************
     * 指令 和 系统 注册
     ************************************************/
    UNetworkSystem.prototype.register = function (cmd, callback, caller) { this.events.set(cmd, [callback, caller]); };
    UNetworkSystem.prototype.unRegister = function (cmd) { this.events.delete(cmd); };
    //初始化网络相关系统
    UNetworkSystem.prototype.init = function () {
        UserManager_1.default.Ins.init(this);
        RoomManager_1.default.Ins.init(this);
        this.register(NetCmd_1.NetCmd.HEART, this.onHeart, this);
        this.connect();
    };
    /************************************************
     * 生命周期
     * 处理基本事务，断线重连，心跳包，网络信息维护
     ************************************************/
    //连接
    UNetworkSystem.prototype.connect = function (data) {
        var _this = this;
        if (data === void 0) { data = null; }
        this.conState = ConnectionStatus.CONNECTING;
        this.ws = new WebSocket(this.url);
        this.ws.onopen = function (e) {
            _this.onConnected(e);
        };
        this.ws.onmessage = function (e) {
            _this.onReceiveData(e);
        };
        this.ws.onerror = function (e) {
            _this.onError(e);
        };
        this.ws.onclose = function (e) {
            _this.onClose(e);
        };
    };
    //连接成功，转发给UserManager
    UNetworkSystem.prototype.onConnected = function (e) {
        this.conState = ConnectionStatus.CONNECTED;
        console.log("UNetworkSystem Opened");
        UserManager_1.default.Ins.onConnected();
        //开启心跳
        // this.startHeart();
        this.endReConnect();
    };
    UNetworkSystem.prototype.onError = function (e) {
        // console.log("Send Text fired an error");
        // this.conState = ConnectionStatus.RECONNECT;
    };
    UNetworkSystem.prototype.onClose = function (e) {
        console.log("WebSocket instance closed.");
        this.conState = ConnectionStatus.RECONNECT;
        //关闭心跳
        this.endHeart();
        this.startReConnect();
    };
    UNetworkSystem.prototype.startReConnect = function () {
        var _this = this;
        if (!this.reConFlag) {
            this.reConFlag = true;
            this.reConHandle = setTimeout(function () {
                console.log("尝试重连");
                _this.connect();
                _this.reConFlag = false;
            }, this.reConDelay);
        }
    };
    UNetworkSystem.prototype.endReConnect = function () {
        if (this.reConFlag) {
            console.log("重连成功");
            this.reConFlag = false;
            clearInterval(this.reConHandle);
            console.log("重新登录");
            UserManager_1.default.Ins.login();
        }
    };
    UNetworkSystem.prototype.startHeart = function () {
        var _this = this;
        if (!this.heartFlag) {
            this.heartFlag = true;
            this.heartHandle = setInterval(function () {
                _this.sendHeart();
            }, this.heartDelay);
        }
    };
    UNetworkSystem.prototype.endHeart = function () {
        if (this.heartFlag) {
            this.heartFlag = false;
            clearTimeout(this.heartHandle);
        }
    };
    UNetworkSystem.prototype.getCurrentTime = function () {
        return new Date().getTime();
    };
    UNetworkSystem.prototype.sendHeart = function () {
        this.sendTime = this.getCurrentTime();
        this.sendCmd(NetCmd_1.NetCmd.HEART, {});
    };
    UNetworkSystem.prototype.onHeart = function () {
        //TODO 计算延迟
        var curTime = this.getCurrentTime();
        this.delay = curTime - this.sendTime;
        console.log("延迟", this.delay);
    };
    var UNetworkSystem_1;
    UNetworkSystem = UNetworkSystem_1 = __decorate([
        XBase_1.xclass(UNetworkSystem_1)
    ], UNetworkSystem);
    return UNetworkSystem;
}(Object_1.default));
exports.default = UNetworkSystem;
