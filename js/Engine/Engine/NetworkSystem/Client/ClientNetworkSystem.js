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
var XBase_1 = require("../../ReflectSystem/XBase");
var NetCmd_1 = require("../Share/NetCmd");
var NetworkSystem_1 = __importDefault(require("../Share/NetworkSystem"));
var ClientRoomManager_1 = __importDefault(require("./ClientRoomManager"));
var ClientUserManager_1 = __importDefault(require("./ClientUserManager"));
var ConnectionStatus;
(function (ConnectionStatus) {
    ConnectionStatus[ConnectionStatus["NO"] = 0] = "NO";
    ConnectionStatus[ConnectionStatus["CONNECTING"] = 1] = "CONNECTING";
    ConnectionStatus[ConnectionStatus["CONNECTED"] = 2] = "CONNECTED";
    ConnectionStatus[ConnectionStatus["RECONNECT"] = 3] = "RECONNECT";
})(ConnectionStatus = exports.ConnectionStatus || (exports.ConnectionStatus = {}));
/**
 * ???????????????
 * ????????????????????????????????????????????????
 *
 */
var ClientNetworkSystem = /** @class */ (function (_super) {
    __extends(ClientNetworkSystem, _super);
    function ClientNetworkSystem() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // protected url = "wss://www.llag.net/game/id=123";
        _this.url = "ws://localhost:52312";
        //??????????????????
        _this.conState = ConnectionStatus.NO;
        _this.delay = 0;
        _this.ws = null;
        //??????
        _this.reConFlag = false;
        _this.reConDelay = 1000;
        _this.reConHandle = -1;
        //?????????
        _this.heartFlag = false;
        _this.heartHandle = -1;
        _this.heartDelay = 10 * 1000;
        _this.sendTime = 0;
        _this.receiveTime = 0;
        return _this;
    }
    ClientNetworkSystem_1 = ClientNetworkSystem;
    //TODO ???????????????????????????????????????????????????????????????????????????????????????????????????????????????
    //????????????frame????????????
    ClientNetworkSystem.prototype.sendAllGameInput = function (obj) {
        var userMng = this.userManager;
        if (userMng.isLogin) {
            var roomMng = this.roomManager;
            roomMng.syncGame(obj);
        }
    };
    /************************************************
     * ??????Manager??????
     ************************************************/
    ClientNetworkSystem.prototype.getLocId = function () {
        var userMng = this.userManager;
        return userMng.id_loc;
    };
    ClientNetworkSystem.prototype.isThisUser = function (id_user) {
        var userMng = this.userManager;
        return userMng.id_loc == id_user;
    };
    /************************************************
     * ??????
     ************************************************/
    ClientNetworkSystem.prototype.sendCmd = function (cmd, obj) {
        if (obj === void 0) { obj = {}; }
        obj["opt"] = cmd;
        var str = JSON.stringify(obj);
        this.ws.send(str);
        if (cmd != NetCmd_1.NetCmd.HEART) {
            // console.log("Client", obj);
        }
    };
    ClientNetworkSystem.prototype.sendBinary = function (binBuffer) {
        this.ws.send(binBuffer);
    };
    /************************************************
     * ??????
     ************************************************/
    ClientNetworkSystem.prototype.onReceive = function (str) {
        var obj = JSON.parse(str);
        this.processReceive(Number(obj["opt"]), obj);
    };
    ClientNetworkSystem.prototype.onReceiveBinary = function (bin) {
        var view = new Uint32Array(bin);
        this.processReceive(view[0], view);
    };
    ClientNetworkSystem.prototype.processReceive = function (opt, data) {
        //????????????
        //???????????????????????????????????????
        var tuple = this.events.get(opt);
        if (tuple) {
            var func = tuple[0];
            var caller = tuple[1];
            func.call(caller, data);
        }
        //????????????????????????on??????
        this.emit(opt + "", data);
    };
    /************************************************
     * ?????? ??? ?????? ??????
     ************************************************/
    //???????????????????????????
    ClientNetworkSystem.prototype.init = function () {
        _super.prototype.init.call(this);
        this.userManager = new ClientUserManager_1.default();
        this.userManager.init(this);
        this.roomManager = new ClientRoomManager_1.default();
        this.roomManager.init(this);
        this.register(NetCmd_1.NetCmd.HEART, this.onHeart, this);
    };
    /************************************************
     * ????????????
     * ??????????????????????????????????????????????????????????????????
     ************************************************/
    //??????
    ClientNetworkSystem.prototype.connect = function (data) {
        var _this = this;
        if (data === void 0) { data = null; }
        console.log("????????????", this.url);
        this.conState = ConnectionStatus.CONNECTING;
        this.ws = new WebSocket(this.url);
        this.ws.binaryType = "arraybuffer";
        this.ws.onopen = function (e) {
            _this.onConnected(e);
        };
        this.ws.onmessage = function (e) {
            if (e.data instanceof ArrayBuffer) {
                _this.onReceiveBinary(e.data);
            }
            else {
                _this.onReceive(e.data);
            }
        };
        this.ws.onerror = function (e) {
            _this.onError(e);
        };
        this.ws.onclose = function (e) {
            _this.onClose(e);
        };
    };
    //????????????????????????UserManager
    ClientNetworkSystem.prototype.onConnected = function (e) {
        var array = [1.1, 1.2, 1.3];
        var bufferView = new Uint8Array(array);
        this.ws.send(bufferView);
        this.conState = ConnectionStatus.CONNECTED;
        console.log("UNetworkSystem Opened");
        this.userManager.onConnected();
        //????????????
        this.startHeart();
        this.endReConnect();
    };
    ClientNetworkSystem.prototype.onError = function (e) {
        // console.log("Send Text fired an error");
        // this.conState = ConnectionStatus.RECONNECT;
    };
    ClientNetworkSystem.prototype.onClose = function (e) {
        console.log("WebSocket instance closed.");
        this.conState = ConnectionStatus.RECONNECT;
        //????????????
        this.endHeart();
        this.startReConnect();
    };
    ClientNetworkSystem.prototype.startReConnect = function () {
        var _this = this;
        if (!this.reConFlag) {
            this.reConFlag = true;
            this.reConHandle = setTimeout(function () {
                console.log("????????????");
                _this.connect();
                _this.reConFlag = false;
            }, this.reConDelay);
        }
    };
    ClientNetworkSystem.prototype.endReConnect = function () {
        if (this.reConFlag) {
            console.log("????????????");
            this.reConFlag = false;
            clearInterval(this.reConHandle);
            console.log("????????????");
            var userMngq = this.userManager;
            userMngq.login();
        }
    };
    ClientNetworkSystem.prototype.startHeart = function () {
        var _this = this;
        if (!this.heartFlag) {
            this.heartFlag = true;
            this.heartHandle = setInterval(function () {
                _this.sendHeart();
            }, this.heartDelay);
        }
    };
    ClientNetworkSystem.prototype.endHeart = function () {
        if (this.heartFlag) {
            this.heartFlag = false;
            clearTimeout(this.heartHandle);
        }
    };
    //???????????????
    //???????????????
    //???????????????
    //????????????????????? ????????????
    //????????? ?????????????????????????????????
    ClientNetworkSystem.prototype.sendHeart = function () {
        this.sendTime = this.getCurrentTime(); //????????????
        this.sendCmd(NetCmd_1.NetCmd.HEART, {
            data: [this.sendTime, this.receiveTime]
        });
    };
    ClientNetworkSystem.prototype.onHeart = function (obj) {
        this.receiveTime = this.getCurrentTime(); //????????????
    };
    ClientNetworkSystem.prototype.getServerInfo = function () {
        this.sendCmd(NetCmd_1.NetCmd.DEV_SERVER_STATUS);
    };
    var ClientNetworkSystem_1;
    ClientNetworkSystem.Ins = null;
    ClientNetworkSystem = ClientNetworkSystem_1 = __decorate([
        XBase_1.xclass(ClientNetworkSystem_1)
    ], ClientNetworkSystem);
    return ClientNetworkSystem;
}(NetworkSystem_1.default));
exports.default = ClientNetworkSystem;
