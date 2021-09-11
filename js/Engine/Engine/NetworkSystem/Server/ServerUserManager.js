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
var User_1 = require("../Share/User");
var UserManager_1 = __importDefault(require("../Share/UserManager"));
var ServerUser_1 = __importDefault(require("./ServerUser"));
var ServerUserManager = /** @class */ (function (_super) {
    __extends(ServerUserManager, _super);
    function ServerUserManager() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //用户信息
        _this.userKeyMap = new Map();
        //断线用户
        _this.userLoseMap = new Map();
        return _this;
    }
    ServerUserManager_1 = ServerUserManager;
    ServerUserManager.prototype.spawnNewUser = function (id_user) {
        var user = new ServerUser_1.default();
        user.mng = this;
        user.id_user = id_user;
        return user;
    };
    ServerUserManager.prototype.getUserByKey = function (key) {
        return this.userKeyMap.get(key);
    };
    ServerUserManager.prototype.onGetList = function (key, conn, obj) {
        var user = this.getUserByKey(key);
        if (!user) {
            console.log("未登录", key, obj);
            return;
        }
        var out = {
            data: this.toJSON()
        };
        // let arr = [];
        // this.rooms.forEach(room => {
        //     let ids = [];
        //     room.users.forEach((user, id) => {
        //         ids.push(id);
        //     });
        //     arr.push({
        //         id: room.id,
        //         size: room.users.size,
        //         ids: ids
        //     });
        // });
        user.sendCmd(NetCmd_1.NetCmd.USER_LIST, out);
    };
    //0.注册回调
    ServerUserManager.prototype.init = function (ns) {
        _super.prototype.init.call(this, ns);
        ns.register(NetCmd_1.NetCmd.LOGIN, this.onLogin, this);
    };
    //1.网络连接成功，发送第一个包
    ServerUserManager.prototype.onConnected = function (key, conn) {
        this.hellow(key, conn);
    };
    //2.发送第一个包
    ServerUserManager.prototype.hellow = function (key, conn) {
        var out = {
            opt: NetCmd_1.NetCmd.HELLOW,
            key_conn: key
        };
        //因为还没有创建User，所以只能用这种方式先发送，后面统一用user进行发送
        var str = JSON.stringify(out);
        this.ns.sendText(conn, str);
        console.log("发送首包", str);
    };
    ServerUserManager.prototype.login = function (key, conn, obj) {
        var code = 0;
        var id_user = obj["id_user"];
        //如果用户存在，则重新连接，否则创建新用户对象
        //TODO 重新连接，还要判断玩家当前状态，如果在游戏中，还要调用游戏断线重连的逻辑
        var user = this.userLoseMap.get(id_user);
        if (user) {
            console.log("用户重新连接", user.id_user);
            this.userIdMap.set(id_user, user);
            this.userLoseMap.delete(id_user);
        }
        else {
            user = this.userIdMap.get(id_user);
            if (!user) {
                user = this.spawnNewUser(id_user);
                console.log("用户首次登录", user.id_user);
            }
            else {
                console.log("连接状态下的用户重新登录", user.id_user);
            }
        }
        user.key_conn = key;
        user.conn = conn;
        user.conState = User_1.ConnectionStatus.CONNECTED;
        //添加到Map
        this.userIdMap.set(id_user + "", user);
        this.userKeyMap.set(key, user);
        //切换连接状态
        var ns = this.ns;
        ns.connMap.set(key, user);
        ns.connPeeding.delete(key);
        //返回登录结果
        var out = {
            code: code
        };
        user.sendCmd(NetCmd_1.NetCmd.LOGIN, out);
    };
    //3.登录
    //登录之后再创建User
    ServerUserManager.prototype.onLogin = function (key, conn, obj) {
        this.login(key, conn, obj);
    };
    ServerUserManager.prototype.onClose = function (key, conn) {
        var user = this.userKeyMap.get(key);
        //断开连接时，用户不一定已经登录
        if (user) {
            user.conState = User_1.ConnectionStatus.LOSE;
            //不从idMap中清除，只清除连接
            // this.userIdMap.delete(user.id_user);
            this.userKeyMap.delete(user.key_conn);
            this.userIdMap.delete(user.id_user);
            this.userLoseMap.set(user.id_user, user);
            console.log("已登录用户断开连接", user.id_user);
        }
    };
    var ServerUserManager_1;
    __decorate([
        XBase_1.xproperty(Map)
    ], ServerUserManager.prototype, "userKeyMap", void 0);
    __decorate([
        XBase_1.xproperty(Map)
    ], ServerUserManager.prototype, "userLoseMap", void 0);
    ServerUserManager = ServerUserManager_1 = __decorate([
        XBase_1.xclass(ServerUserManager_1),
        XBase_1.xStatusSync(["userKeyMap", "userLoseMap"])
    ], ServerUserManager);
    return ServerUserManager;
}(UserManager_1.default));
exports.default = ServerUserManager;
