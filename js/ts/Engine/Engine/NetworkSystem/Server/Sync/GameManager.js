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
var XBase_1 = require("../../../ReflectSystem/XBase");
var Manager_1 = __importDefault(require("../Manager"));
/**
 * TODO 暂时不要做这个，一个游戏一个服务器，如果游戏有多个模式，则通过GameMode进行区别
 * 玩家开始一个新游戏有两种模式
 *  房间模式
 *      组队模式(英雄联盟,绝地求生)
 *      组队：1.玩家先创建一个房间，然后可以邀请好友加入（组队房间），2.玩家加入一个房间
 *      匹配：寻找两个（多个）实力相近的房间
 *      游戏准备：将所有房间全部合并到一个房间（游戏房间），编上TeamId
 *      游戏中：对房间内的游戏数据进行同步
 *
 * 游戏管理器
 *      一个服务器上可能跑多个游戏（注意是截然不同的两个游戏，而不是相同游戏的不同模式）
 *      比如客户端有一个 吃鸡和一个英雄联盟，服务端同时在跑一个吃鸡和英雄联盟，玩家创建一个游戏房间，将根据玩家传入的游戏ID选择对应游戏，
 *      这种是概念对于游戏平台来说的，比如Stream，一个服务器运行不同游戏，一般一个服务器跑一种游戏就可以了
 *      对于一把游戏，只需要在游戏开始时创建一个类型的游戏房间即可，不需要传入什么游戏ID。
 */
var GameManager = /** @class */ (function (_super) {
    __extends(GameManager, _super);
    function GameManager() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.gameMap = new Map();
        return _this;
    }
    GameManager_1 = GameManager;
    //0.注册回调
    GameManager.prototype.init = function (ns) {
        _super.prototype.init.call(this, ns);
    };
    GameManager.prototype.onAdd = function (key, conn, obj) {
    };
    GameManager.prototype.onJoin = function (key, conn, obj) {
    };
    GameManager.prototype.onExit = function (key, conn, obj) {
    };
    GameManager.prototype.onDel = function (key, conn, obj) {
    };
    //准备阶段
    GameManager.prototype.prePlay = function () {
    };
    GameManager.prototype.onPrePlay = function () {
    };
    //开始游戏
    GameManager.prototype.startPlay = function () {
    };
    GameManager.prototype.onoStart = function () {
    };
    //游戏运行时
    GameManager.prototype.playing = function () {
    };
    //游戏结束时
    GameManager.prototype.endPlay = function () {
    };
    GameManager.prototype.onEndPlay = function () {
    };
    var GameManager_1;
    __decorate([
        XBase_1.xproperty(Map)
    ], GameManager.prototype, "gameMap", void 0);
    GameManager = GameManager_1 = __decorate([
        XBase_1.xclass(GameManager_1)
    ], GameManager);
    return GameManager;
}(Manager_1.default));
exports.default = GameManager;
