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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var NetCmd_1 = require("./NetCmd");
var User_1 = __importDefault(require("./User"));
var Manager_1 = __importDefault(require("./Manager"));
var UserManager = /** @class */ (function (_super) {
    __extends(UserManager, _super);
    function UserManager() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.locUser = null;
        _this.userIdMap = new Map();
        //2.第一个包
        _this.key_conn = "";
        return _this;
    }
    UserManager.prototype.getUserById = function (id) {
        return this.userIdMap.get(id);
    };
    UserManager.prototype.add = function (id_user) {
        var user = new User_1.default();
        user.id_user = id_user;
        this.userIdMap.set(id_user, user);
        return user;
    };
    UserManager.prototype.select = function (id) {
    };
    UserManager.prototype.insert = function () {
    };
    UserManager.prototype.update = function () {
    };
    UserManager.prototype.delete = function (id) {
    };
    //注册本机用户
    UserManager.prototype.register = function (id_user) {
        if (this.locUser == null) {
            this.locUser = this.add(id_user);
        }
        else {
            this.locUser.id_user = id_user;
        }
        this.locUser.key_conn = this.key_conn;
        this.login();
    };
    //0.注册回调
    UserManager.prototype.init = function (ns) {
        _super.prototype.init.call(this, ns);
        this.ns.register(NetCmd_1.NetCmd.HELLOW, this.onHellow, this);
        this.ns.register(NetCmd_1.NetCmd.LOGIN, this._onLogin, this);
    };
    //1.网络连接成功，立即登录
    UserManager.prototype.onConnected = function () {
    };
    UserManager.prototype.onHellow = function (obj) {
        var key_conn = obj["key_conn"];
        this.key_conn = key_conn;
        console.log("收到的第一个包：", obj);
    };
    //3.登录
    //发送账号和密码
    UserManager.prototype.login = function () {
        if (this.locUser) {
            var out = {
                id_user: this.locUser.id_user
            };
            this.ns.sendCmd(NetCmd_1.NetCmd.LOGIN, out);
        }
    };
    //4.登录回调
    //执行下一步操作
    UserManager.prototype.onLogin = function () { };
    UserManager.prototype._onLogin = function (obj) {
        var code = Number(obj["code"]);
        if (code == 0) {
            console.log("登录成功");
            console.log(this.locUser);
        }
        else {
            console.log("登录失败");
        }
        this.onLogin();
    };
    UserManager.Ins = new UserManager();
    return UserManager;
}(Manager_1.default));
exports.default = UserManager;
