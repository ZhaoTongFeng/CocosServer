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
var Object_1 = __importDefault(require("../../../Object"));
var XBase_1 = require("../../ReflectSystem/XBase");
var NetCmd_1 = require("./NetCmd");
/**
 * 网络管理器
 * 客户端只有一个，服务端也只有一个
 *
 */
var NetworkSystem = /** @class */ (function (_super) {
    __extends(NetworkSystem, _super);
    function NetworkSystem() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.isDebug = true;
        _this.delay = 0;
        /************************************************
         * 指令 和 系统 注册
         ************************************************/
        //回调注册
        _this.events = new Map();
        _this.userManager = null;
        _this.roomManager = null;
        return _this;
    }
    NetworkSystem_1 = NetworkSystem;
    /************************************************
     * 访问Manager数据
     ************************************************/
    NetworkSystem.prototype.getUserById = function (id) {
        return this.userManager.getUserById(id);
    };
    NetworkSystem.prototype.getRoomById = function (id) {
        return this.roomManager.getRoomById(id);
    };
    /************************************************
     * 发送
     ************************************************/
    /** 普通请求指令 */
    //1.1.发送命令
    // 直接发送即可
    NetworkSystem.prototype.sendCmd = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
    };
    NetworkSystem.prototype.sendText = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
    };
    /************************************************
     * 接收
     ************************************************/
    NetworkSystem.prototype.onReceive = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
    };
    NetworkSystem.prototype.register = function (cmd, callback, caller) { this.events.set(cmd, [callback, caller]); };
    NetworkSystem.prototype.unRegister = function (cmd) { this.events.delete(cmd); };
    //初始化网络相关系统
    NetworkSystem.prototype.init = function () {
        this.register(NetCmd_1.NetCmd.HEART, this.onHeart, this);
    };
    /************************************************
     * 生命周期
     * 处理基本事务，断线重连，心跳包，网络信息维护
     ************************************************/
    NetworkSystem.prototype.onClose = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
    };
    NetworkSystem.prototype.onHeart = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
    };
    NetworkSystem.prototype.login = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
    };
    var NetworkSystem_1;
    NetworkSystem = NetworkSystem_1 = __decorate([
        XBase_1.xclass(NetworkSystem_1)
    ], NetworkSystem);
    return NetworkSystem;
}(Object_1.default));
exports.default = NetworkSystem;
