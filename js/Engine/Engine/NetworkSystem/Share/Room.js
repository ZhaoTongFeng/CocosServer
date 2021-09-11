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
Object.defineProperty(exports, "__esModule", { value: true });
var Enums_1 = require("../../Enums");
var XBase_1 = require("../../ReflectSystem/XBase");
var Room = /** @class */ (function (_super) {
    __extends(Room, _super);
    function Room() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //房间ID
        _this.id = "";
        //用户列表
        _this.users = new Set();
        //房主
        _this.owner = null;
        //倒计时
        _this.time = 0;
        _this.handle = -1;
        _this.mng = null;
        _this.game = null;
        _this.gameInstance = null;
        //更新句柄
        _this.handle_game = -1;
        _this.fps = 60;
        _this.clientFps = 60;
        _this.serverFps = 15;
        _this.frameTime = 0;
        _this.frameTimer = 0;
        _this.time_cur = 0;
        _this.time_last = 0;
        return _this;
    }
    Room_1 = Room;
    /**
     * 开始更新游戏
     * 客户端晚于服务端开始游戏
     */
    Room.prototype.startUpdateGame = function () {
        var _this = this;
        if (this.gameInstance.getIsClient()) {
            this.fps = this.clientFps;
        }
        else {
            this.fps = this.serverFps;
        }
        var world = this.gameInstance.getWorld();
        world.gameState = Enums_1.GameState.Playing;
        this.frameTime = 1 / this.fps;
        this.time_cur = this.mng.ns.getCurrentTime();
        this.time_last = this.mng.ns.getCurrentTime();
        this.handle_game = setInterval(function () {
            _this.time_cur = new Date().getTime();
            var offset = _this.time_cur - _this.time_last;
            if (offset > _this.frameTime * 1000) {
                var dt = offset / 1000;
                _this.time_last = _this.time_cur;
                _this.updateGame(dt);
            }
            // console.log(offset);
        }, 16);
    };
    Room.prototype.sendGameData = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
    };
    ;
    Room.prototype.updateGame = function (dt) {
        this.gameInstance.update(dt);
    };
    Room.prototype.endUpdateGame = function () {
        clearInterval(this.handle_game);
    };
    Room.prototype.getAllUsers = function () {
        var _this = this;
        var users = [];
        this.users.forEach(function (id) {
            var user = _this.mng.getUserById(id);
            users.push(user);
        });
        return users;
    };
    Room.prototype.initGameInstance = function () { };
    Room.prototype.getUserCount = function () { return this.users.size; };
    //玩家创建房间
    Room.prototype.onAdd = function (user) { };
    //玩家加入房间
    Room.prototype.onJoin = function (user) { };
    //玩家退出房间
    Room.prototype.onExit = function (user) { };
    //房间被删除
    Room.prototype.onDel = function (user) { };
    //转发同步数据到GameInstance
    Room.prototype.onSyncGame = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
    };
    Room.prototype.onBeginGame = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
    };
    var Room_1;
    __decorate([
        XBase_1.xproperty(String)
    ], Room.prototype, "id", void 0);
    __decorate([
        XBase_1.xproperty(Set)
    ], Room.prototype, "users", void 0);
    __decorate([
        XBase_1.xproperty(String)
    ], Room.prototype, "owner", void 0);
    __decorate([
        XBase_1.xproperty(Number)
    ], Room.prototype, "time", void 0);
    Room = Room_1 = __decorate([
        XBase_1.xclass(Room_1)
    ], Room);
    return Room;
}(XBase_1.XBase));
exports.default = Room;
