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
var World1_1 = __importDefault(require("../../../../Game1/World1"));
var GameInstance_1 = __importDefault(require("../../GameInstance"));
var XBase_1 = require("../../ReflectSystem/XBase");
var NetCmd_1 = require("../Share/NetCmd");
var Room_1 = __importDefault(require("../Share/Room"));
var ClientRoom = /** @class */ (function (_super) {
    __extends(ClientRoom, _super);
    function ClientRoom() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ClientRoom_1 = ClientRoom;
    ClientRoom.prototype.onAdd = function (user) {
        // this.game = new ClientGame();
        // this.owner = user.id_user;
        // this.users.set(user.id_user, user);
    };
    ClientRoom.prototype.onJoin = function (user) {
        // this.game = new ClientGame();
        // user.id_room = this.id;
        // this.users.set(user.id_user, user);
    };
    ClientRoom.prototype.onExit = function (user) {
        // this.users.delete(user.id_user);
        // user.id_room = "";
    };
    ClientRoom.prototype.onDel = function (user) {
    };
    //转发同步数据到GameInstance
    ClientRoom.prototype.onSyncGame = function (obj, gameInstance) {
        // let data = obj["data"];
        // // console.log("ROOM 收到数据转发给GameInstance", data);
        // gameInstance.receiveGameData(obj["data"]);
    };
    /**
     * 准备阶段
     */
    //1.1房主开始游戏
    ClientRoom.prototype.sendGameBeg = function () {
        var ns = this.mng.ns;
        ns.sendCmd(NetCmd_1.NetCmd.GAME_BEGIN);
        console.log("1.1请求开始游戏");
    };
    //1.3进入游戏关卡
    ClientRoom.prototype.onGameBeg = function (obj) {
        console.log("1.3游戏开始，进入游戏关卡");
    };
    //初始化游戏实例
    ClientRoom.prototype.initGameInstance = function () {
        var gameInstance = new GameInstance_1.default();
        gameInstance.setIsClient(true);
        gameInstance.network = this.mng.ns;
        gameInstance.room = this;
        this.gameInstance = gameInstance;
        this.sendGameReady();
        return gameInstance;
    };
    //2.1告诉服务器我已经准备好接受关卡数据
    ClientRoom.prototype.sendGameReady = function () {
        var ns = this.mng.ns;
        ns.sendCmd(NetCmd_1.NetCmd.GAME_READY);
        console.log("2.1告诉服务器我已经准备好接受关卡数据");
    };
    //2.3服务器成功收到我已经准备好了
    ClientRoom.prototype.onGameReady = function (obj) {
        console.log("2.3服务器收到我已经准备好接收数据");
    };
    //3.2客户端接收关卡数据
    ClientRoom.prototype.onLoadLevelData = function (obj) {
        console.log("3.2我收到了关卡数据，开始加载关卡");
        var ns = this.mng.ns;
        ns.sendCmd(NetCmd_1.NetCmd.GAME_LOADLEVEL);
        console.log("告诉服务器我已经接收到数据");
        var world = new World1_1.default();
        var levelData = obj["levelData"];
        this.gameInstance.openWorld(world, levelData, this);
        this.gameInstance.getWorldView().updateOnec();
    };
    //4.2开始游戏
    ClientRoom.prototype.onGamePlay = function (obj) {
        this.startUpdateGame();
        console.log("开始游戏，启动World，注意此时服务器已经启动了，客户端延迟启动");
    };
    /**
     * 同步阶段
     */
    /** 发送和接收游戏同步数据，两边保持一致，全部是从GameInstance中进行发送，并发送会GameInstance */
    ClientRoom.prototype.sendGameData = function (obj) {
        var out = {
            data: obj,
            time: new Date().getTime()
        };
        var ns = this.mng.ns;
        // console.log(out);
        ns.sendCmd(NetCmd_1.NetCmd.GAME_SEND_SERVER, out);
    };
    //6.2接收服务器的状态，更新本地状态
    ClientRoom.prototype.onReceiveGameData = function (obj) {
        var data = obj["data"];
        var time = obj["time"];
        this.gameInstance.receiveGameData(data, time);
        // console.log(data);
    };
    //5.3服务器收到了客户端发送的指令（不一定有这一步，除非变量被标记为完全可靠的）
    ClientRoom.prototype.onGameSendInput = function (obj) { };
    /**
     * 结算阶段
     */
    //7.2服务器通知游戏结束
    ClientRoom.prototype.onGameFinish = function (obj) {
    };
    //8.2服务器通知游戏结果
    ClientRoom.prototype.onGameResult = function (obj) {
    };
    //9.2服务器通知游戏彻底结束
    ClientRoom.prototype.onGameEnd = function (obj) {
    };
    var ClientRoom_1;
    ClientRoom = ClientRoom_1 = __decorate([
        XBase_1.xClient("Room"),
        XBase_1.xclass(ClientRoom_1)
    ], ClientRoom);
    return ClientRoom;
}(Room_1.default));
exports.default = ClientRoom;
