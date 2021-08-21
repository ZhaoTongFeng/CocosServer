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
exports.GameStatus = void 0;
var NetCmd_1 = require("../../Share/NetCmd");
var XBase_1 = require("../../../ReflectSystem/XBase");
var Manager_1 = __importDefault(require("../Manager"));
/**
 * 游戏状态
 */
var GameStatus;
(function (GameStatus) {
    GameStatus[GameStatus["PREPLAY"] = 0] = "PREPLAY";
    GameStatus[GameStatus["STARTPLAY"] = 1] = "STARTPLAY";
    GameStatus[GameStatus["PLAYING"] = 2] = "PLAYING";
    GameStatus[GameStatus["ENDPlay"] = 3] = "ENDPlay";
})(GameStatus = exports.GameStatus || (exports.GameStatus = {}));
/**
 * 游戏基类
 */
var Game = /** @class */ (function (_super) {
    __extends(Game, _super);
    function Game() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.gameStatus = GameStatus.PREPLAY;
        _this.room = null;
        /************************************************
         * 游戏场景同步
         ************************************************/
        _this.sendBuffer = [];
        _this.receiveBuffer = [];
        _this.receiveBufferTemp = []; //防止在处理数据时，接收新数据
        _this.receiveFlag = false;
        return _this;
        /************************************************
         * 发送
         ************************************************/
        // //  先添加到容器，调用SendAll发送
        // //  例子：一帧里面，把消息添加到队列
        // public send(obj: Object | Array<Object>) {
        //     //TODO 处理成二进制
        //     //处理成JSON
        //     let str = JSON.stringify(obj);
        //     console.log("Client", str);
        //     //TODO 加上meta
        //     this.sendBuffer.push(str);
        // }
        // public sendAll() {
        //     this.sendBuffer.forEach(str => {
        //         this.ws.send(str);
        //     });
        //     this.sendBuffer = [];
        // }
        /************************************************
         * 接收
         ************************************************/
        // private onReceiveData(e) {
        //     if (this.receiveFlag) {
        //         //如果正在处理数据，则添加到临时容器
        //         this.receiveBufferTemp.push(obj);
        //     } else {
        //         this.receiveBuffer.push(obj);
        //     }
        // }
    }
    Game_1 = Game;
    //0.注册回调
    Game.prototype.init = function (ns) {
        _super.prototype.init.call(this, ns);
        ns.register(NetCmd_1.NetCmd.ROOM_ADD, this.prePlay, this);
        ns.register(NetCmd_1.NetCmd.ROOM_JOIN, this.startPlay, this);
        ns.register(NetCmd_1.NetCmd.ROOM_EXIT, this.playing, this);
        ns.register(NetCmd_1.NetCmd.ROOM_DEL, this.playing, this);
    };
    //准备阶段
    Game.prototype.prePlay = function () {
    };
    Game.prototype.onPrePlay = function () {
    };
    //开始游戏
    Game.prototype.startPlay = function () {
    };
    Game.prototype.onoStart = function () {
    };
    //游戏运行时
    Game.prototype.playing = function () {
    };
    //游戏结束时
    Game.prototype.endPlay = function () {
    };
    Game.prototype.onEndPlay = function () {
    };
    var Game_1;
    Game = Game_1 = __decorate([
        XBase_1.xclass(Game_1)
    ], Game);
    return Game;
}(Manager_1.default));
exports.default = Game;
