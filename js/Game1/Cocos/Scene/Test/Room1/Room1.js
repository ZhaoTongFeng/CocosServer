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
var ClientNetworkSystem_1 = __importDefault(require("../../../../../Engine/Engine/NetworkSystem/Client/ClientNetworkSystem"));
var NetCmd_1 = require("../../../../../Engine/Engine/NetworkSystem/Share/NetCmd");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var Room1 = /** @class */ (function (_super) {
    __extends(Room1, _super);
    function Room1() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.label = null;
        _this.startBtn = null;
        _this.layout = null;
        _this.loginBtn = null;
        _this.nameEditBox = null;
        _this.isDev = false;
        _this.intervalHandles = [];
        return _this;
    }
    Room1.prototype.addInterval = function (handle) {
        this.intervalHandles.push(handle);
    };
    Room1.prototype.clearInterval = function () {
        this.intervalHandles.forEach(function (handle) {
            clearInterval(handle);
        });
    };
    Room1.prototype.onLoad = function () {
        var network = ClientNetworkSystem_1.default.Ins;
        //3.显示实时的延迟推送
        network.on(NetCmd_1.NetCmd.ROOM_LIST + "", this.onLoadRoomList, this);
        network.on(NetCmd_1.NetCmd.USER_LIST + "", this.onLoadUserList, this);
        network.on(NetCmd_1.NetCmd.DEV_SERVER_STATUS + "", this.onLoadServerStatus, this);
        network.on(NetCmd_1.NetCmd.GAME_BEGIN + "", this.onGameBegin, this);
        network.on(NetCmd_1.NetCmd.LOGIN + "", this.onLogin, this);
        this.addInterval(setInterval(this.loadRoomList, 1000));
        this.addInterval(setInterval(this.loadUserList, 2000));
        this.addInterval(setInterval(this.loadServerStatus, 1000));
        this.startBtn.node.on("click", this.gameBegin, this);
        this.loginBtn.node.on("click", this.login, this);
        if (this.isDev) {
            this._login("ZTF");
        }
        // let arrayBuffer = new ArrayBuffer(10);
        // let array = Array.prototype.slice.call(new Uint8Array(arrayBuffer));
        // let array = "我的啥奥德赛";
        // let array = [1.1,1.2,1.3];
        // let bufferView = new Uint8Array(array);
        // console.warn(bufferView.);
        // let data = {
        //     "id": 1234,
        //     "data": {
        //         "a": "a"
        //     }
        // }
        // let str = JSON.stringify(data);
        // let buf = new Uint8Array([]);
    };
    /** 1.登录，输入名字，点击登录 */
    Room1.prototype.login = function () {
        var name = this.nameEditBox.string;
        if (name == "") {
            return;
        }
        this.nameEditBox.enabled = false;
        this._login(name);
    };
    Room1.prototype._login = function (id) {
        var network = ClientNetworkSystem_1.default.Ins;
        var userManager = network.userManager;
        userManager.register(id);
    };
    Room1.prototype.onLogin = function () {
        //2.直接进入房间
        var network = ClientNetworkSystem_1.default.Ins;
        var roomManager = network.roomManager;
        roomManager.join("abc");
    };
    /** 加载房间内玩家信息 */
    Room1.prototype.loadRoomList = function () {
        var network = ClientNetworkSystem_1.default.Ins;
        var roomManager = network.roomManager;
        roomManager.getList();
    };
    Room1.prototype.loadUserList = function () {
        var network = ClientNetworkSystem_1.default.Ins;
        var userManager = network.userManager;
        userManager.getList();
    };
    Room1.prototype.onLoadRoomList = function (obj) {
        var _this = this;
        var network = ClientNetworkSystem_1.default.Ins;
        var roomManager = network.roomManager;
        roomManager.fromJSON(obj["data"]);
        roomManager.rooms.forEach(function (room, id) {
            room.mng = roomManager;
        });
        // console.log(network.roomManager);
        var room = roomManager.rooms.get("abc");
        if (room) {
            var userManager_1 = network.userManager;
            this.layout.node.removeAllChildren();
            var i_1 = 0;
            room.users.forEach(function (id_user) {
                var user = userManager_1.userIdMap.get(id_user);
                if (user) {
                    var node = new cc.Node();
                    var label = node.addComponent(cc.Label);
                    label.fontSize = 24;
                    label.string = i_1 + " " + id_user + " " + "延迟(C2S)：" + user.delay_clientToServer + " " + "延迟(S2C)：" + user.delay_serverToClient + " " + "总延迟：" + user.getTotalDelay();
                    _this.layout.node.addChild(node);
                }
                else {
                    console.warn("user null", id_user, userManager_1.userIdMap);
                }
                i_1++;
            });
            // for (let i = 0; i < room.users.size; i++) {
            //     let id_user = room.users
            // }
        }
        else {
            console.warn("room null");
        }
    };
    Room1.prototype.onLoadUserList = function (obj) {
        var network = ClientNetworkSystem_1.default.Ins;
        var userManager = network.userManager;
        userManager.fromJSON(obj["data"]);
        userManager.userIdMap.forEach(function (user, id) {
            user.mng = userManager;
        });
        // console.log(userManager);
    };
    /** 获取服务器信息 */
    Room1.prototype.loadServerStatus = function () {
        var network = ClientNetworkSystem_1.default.Ins;
        network.getServerInfo();
    };
    Room1.prototype.onLoadServerStatus = function (obj) {
        var ped = obj["ped"];
        var es = obj["es"];
        var uk = obj["uk"];
        var uid = obj["uid"];
        var ulose = obj["ulose"];
        var rooms = obj["rooms"];
        var str = "";
        str += "等待登录：" + ped + "，";
        str += "已建立连接：" + es + "，";
        str += "UserKeyMap：" + uk + "，";
        str += "UserIdMap：" + uid + "，";
        str += "断线：" + ulose + "，";
        str += "房间数：" + rooms + "，";
        this.label.string = str;
        if (this.isDev) {
            this.gameBegin();
        }
    };
    /** 进入游戏场景 */
    Room1.prototype.gameBegin = function () {
        var network = ClientNetworkSystem_1.default.Ins;
        var roomManager = network.roomManager;
        roomManager.sendGameBeg();
    };
    Room1.prototype.onGameBegin = function (obj) {
        this.clearInterval();
        console.log("切换场景");
        var network = ClientNetworkSystem_1.default.Ins;
        network.targetOff(this);
        cc.director.loadScene("Game1");
    };
    __decorate([
        property(cc.Label)
    ], Room1.prototype, "label", void 0);
    __decorate([
        property(cc.Button)
    ], Room1.prototype, "startBtn", void 0);
    __decorate([
        property(cc.Layout)
    ], Room1.prototype, "layout", void 0);
    __decorate([
        property(cc.Button)
    ], Room1.prototype, "loginBtn", void 0);
    __decorate([
        property(cc.EditBox)
    ], Room1.prototype, "nameEditBox", void 0);
    Room1 = __decorate([
        ccclass
    ], Room1);
    return Room1;
}(cc.Component));
exports.default = Room1;
