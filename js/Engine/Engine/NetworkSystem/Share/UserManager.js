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
var Manager_1 = __importDefault(require("./Manager"));
var XBase_1 = require("../../ReflectSystem/XBase");
var NetCmd_1 = require("./NetCmd");
var UserManager = /** @class */ (function (_super) {
    __extends(UserManager, _super);
    function UserManager() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //连接状态用户
        _this.userIdMap = new Map();
        return _this;
    }
    UserManager_1 = UserManager;
    UserManager.prototype.getUserById = function (id) {
        return this.userIdMap.get(id);
    };
    UserManager.prototype.init = function (ns) {
        _super.prototype.init.call(this, ns);
        ns.register(NetCmd_1.NetCmd.USER_LIST, this.onGetList, this);
    };
    UserManager.prototype.add = function (id_user) { };
    UserManager.prototype.onGetList = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
    };
    //获取用户
    UserManager.prototype.select = function (id) { };
    UserManager.prototype.insert = function (user) { };
    UserManager.prototype.update = function (user) { };
    UserManager.prototype.delete = function (id) { };
    UserManager.prototype.onConnected = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
    };
    var UserManager_1;
    __decorate([
        XBase_1.xproperty(Map)
    ], UserManager.prototype, "userIdMap", void 0);
    UserManager = UserManager_1 = __decorate([
        XBase_1.xclass(UserManager_1),
        XBase_1.xStatusSync(["userIdMap"])
    ], UserManager);
    return UserManager;
}(Manager_1.default));
exports.default = UserManager;
