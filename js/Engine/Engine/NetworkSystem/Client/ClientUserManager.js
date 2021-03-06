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
var NetCmd_1 = require("../Share/NetCmd");
var UserManager_1 = __importDefault(require("../Share/UserManager"));
var XBase_1 = require("../../ReflectSystem/XBase");
var ClientUser_1 = __importDefault(require("./ClientUser"));
var ClientUserManager = /** @class */ (function (_super) {
    __extends(ClientUserManager, _super);
    function ClientUserManager() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.id_loc = null;
        _this.isLogin = false;
        //?????????socket
        _this.key_conn = "";
        return _this;
    }
    ClientUserManager_1 = ClientUserManager;
    ClientUserManager.prototype.add = function (id_user) {
        var user = new ClientUser_1.default();
        user.id_user = id_user;
        this.userIdMap.set(id_user, user);
        return user;
    };
    ClientUserManager.prototype.select = function (id) {
        var user = this.userIdMap.get(id);
        if (user) {
            return user;
        }
    };
    ClientUserManager.prototype.insert = function (user) { };
    ClientUserManager.prototype.update = function (user) { };
    ClientUserManager.prototype.delete = function (id) {
        this.userIdMap.delete(id);
    };
    //??????????????????
    ClientUserManager.prototype.getList = function () {
        this.ns.sendCmd(NetCmd_1.NetCmd.USER_LIST);
    };
    //0.????????????
    ClientUserManager.prototype.init = function (ns) {
        _super.prototype.init.call(this, ns);
        this.ns.register(NetCmd_1.NetCmd.HELLOW, this.onHellow, this);
        this.ns.register(NetCmd_1.NetCmd.LOGIN, this._onLogin, this);
    };
    //1.?????????????????????????????????
    ClientUserManager.prototype.onConnected = function () {
    };
    //2.????????????
    ClientUserManager.prototype.onHellow = function (obj) {
        var key_conn = obj["key_conn"];
        this.key_conn = key_conn;
        console.log("????????????????????????", obj);
    };
    //??????
    ClientUserManager.prototype.register = function (id_user) {
        this.id_loc = id_user;
        this.login();
    };
    //3.??????
    //?????????????????????
    ClientUserManager.prototype.login = function () {
        if (this.id_loc) {
            var out = {
                id_user: this.id_loc
            };
            this.ns.sendCmd(NetCmd_1.NetCmd.LOGIN, out);
        }
    };
    //4.????????????
    //?????????????????????
    ClientUserManager.prototype.onLogin = function () { };
    ClientUserManager.prototype._onLogin = function (obj) {
        var code = Number(obj["code"]);
        if (code == 0) {
            console.log("????????????");
            this.isLogin = true;
            var user = this.add(this.id_loc);
            user.mng = this;
            user.key_conn = this.key_conn;
            console.log(this.id_loc);
        }
        else {
            console.log("????????????");
        }
    };
    var ClientUserManager_1;
    ClientUserManager = ClientUserManager_1 = __decorate([
        XBase_1.xclass(ClientUserManager_1)
    ], ClientUserManager);
    return ClientUserManager;
}(UserManager_1.default));
exports.default = ClientUserManager;
