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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var XBase_1 = require("../../ReflectSystem/XBase");
var NetCmd_1 = require("../Share/NetCmd");
var Manager_1 = __importDefault(require("./Manager"));
var User_1 = __importStar(require("./User"));
var UserManager = /** @class */ (function (_super) {
    __extends(UserManager, _super);
    function UserManager() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //用户信息
        _this.userKeyMap = new Map();
        //连接状态用户
        _this.userIdMap = new Map();
        //断线用户
        _this.userLoseMap = new Map();
        return _this;
    }
    UserManager_1 = UserManager;
    UserManager.prototype.getUserByKey = function (key) {
        return this.userKeyMap.get(key);
    };
    UserManager.prototype.getUserById = function (id) {
        return this.userIdMap.get(id);
    };
    //0.注册回调
    UserManager.prototype.init = function (ns) {
        _super.prototype.init.call(this, ns);
        ns.register(NetCmd_1.NetCmd.LOGIN, this.onLogin, this);
    };
    //1.网络连接成功，发送第一个包
    UserManager.prototype.newConnected = function (key, conn) {
        this.hellow(key, conn);
    };
    //2.发送第一个包
    UserManager.prototype.hellow = function (key, conn) {
        var out = {
            opt: NetCmd_1.NetCmd.HELLOW,
            key_conn: key
        };
        //因为还没有创建User，所以只能用这种方式先发送，后面统一用user进行发送
        var str = JSON.stringify(out);
        this.ns.sendText(conn, str);
        console.log("发送首包", str);
    };
    //3.登录
    //登录之后再创建User
    UserManager.prototype.onLogin = function (key, conn, obj) {
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
                user = new User_1.default();
                user.id_user = id_user;
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
        this.ns.connMap.set(key, user);
        this.ns.connPeeding.delete(key);
        //返回登录结果
        var out = {
            code: code
        };
        user.sendCmd(NetCmd_1.NetCmd.LOGIN, out);
    };
    UserManager.prototype.onClose = function (key, conn) {
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
    var UserManager_1;
    UserManager.Ins = new UserManager_1();
    __decorate([
        XBase_1.xproperty(Map)
    ], UserManager.prototype, "userKeyMap", void 0);
    __decorate([
        XBase_1.xproperty(Map)
    ], UserManager.prototype, "userIdMap", void 0);
    __decorate([
        XBase_1.xproperty(Map)
    ], UserManager.prototype, "userLoseMap", void 0);
    UserManager = UserManager_1 = __decorate([
        XBase_1.xclass(UserManager_1)
    ], UserManager);
    return UserManager;
}(Manager_1.default));
exports.default = UserManager;
