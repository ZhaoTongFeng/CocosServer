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
var Manager_1 = __importDefault(require("./Manager"));
var NetCmd_1 = require("./NetCmd");
/**
 * 房间管理器
 * 操作放在XXX里面，onXXX处理客户端请求
 * 很多操作，既有可能来自客户端又有可能来自服务端
 * 创建房间，服务器主动创建房间
 * 加入房间，可能是服务器匹配
 * 退出房间，可能是被服务器踢出
 * 删除房间，玩家主动删除房间，服务器自动删除房间
 */
var RoomManager = /** @class */ (function (_super) {
    __extends(RoomManager, _super);
    function RoomManager() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //游戏实例，外部绑定
        _this.gameInstance = null;
        _this.rooms = new Map();
        return _this;
    }
    RoomManager_1 = RoomManager;
    RoomManager.prototype.getRoomById = function (id) {
        return this.rooms.get(id);
    };
    //内部操作
    RoomManager.prototype.add = function (id_room) { };
    RoomManager.prototype.delete = function (room) {
        this.rooms.delete(room.id);
    };
    //0.注册回调
    RoomManager.prototype.init = function (ns) {
        _super.prototype.init.call(this, ns);
        ns.register(NetCmd_1.NetCmd.ROOM_ADD, this.onCreate, this);
        ns.register(NetCmd_1.NetCmd.ROOM_JOIN, this.onJoin, this);
        ns.register(NetCmd_1.NetCmd.ROOM_EXIT, this.onExit, this);
        ns.register(NetCmd_1.NetCmd.ROOM_DEL, this.onDel, this);
        ns.register(NetCmd_1.NetCmd.ROOM_LIST, this.onGetList, this);
        ns.register(NetCmd_1.NetCmd.SYNC_GAME, this.onSyncGame, this);
    };
    //获取房间列表
    RoomManager.prototype.getList = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
    };
    RoomManager.prototype.onGetList = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
    };
    //服务器把房间创建好
    RoomManager.prototype.onCreate = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
    };
    //当有人加入房间(不止是自己)
    RoomManager.prototype.onJoin = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
    };
    //当有人退出房间(不止是自己)
    RoomManager.prototype.onExit = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
    };
    //删除房间请求来自客户端
    RoomManager.prototype.onDel = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
    };
    RoomManager.prototype.onSyncGame = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
    };
    var RoomManager_1;
    __decorate([
        XBase_1.xproperty(Map)
    ], RoomManager.prototype, "rooms", void 0);
    RoomManager = RoomManager_1 = __decorate([
        XBase_1.xclass(RoomManager_1)
    ], RoomManager);
    return RoomManager;
}(Manager_1.default));
exports.default = RoomManager;
