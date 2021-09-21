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
var UWorldView_1 = __importDefault(require("../../UWorldView"));
var NetCmd_1 = require("../Share/NetCmd");
var Room_1 = __importDefault(require("../Share/Room"));
var ServerRoom = /** @class */ (function (_super) {
    __extends(ServerRoom, _super);
    function ServerRoom() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ServerRoom_1 = ServerRoom;
    //房间广播
    ServerRoom.prototype.broadcast = function (cmd, obj) {
        var _this = this;
        try {
            this.users.forEach(function (id_user) {
                var user = _this.mng.getUserById(id_user);
                if (user) {
                    user.sendCmd(cmd, obj);
                }
            });
        }
        catch (error) {
            console.log(error);
        }
    };
    ServerRoom.prototype.broadcastBinary = function (view) {
        var _this = this;
        try {
            this.users.forEach(function (id_user) {
                var user = _this.mng.getUserById(id_user);
                if (user) {
                    user.sendBinary(view);
                }
            });
        }
        catch (error) {
            console.log(error);
        }
    };
    ServerRoom.prototype.onAdd = function (user) {
        //记录房主信息，并直接将房主添加到房间
        this.owner = user.id_user;
        this.users.add(user.id_user);
        //返回房间号
        var out = {
            code: 0,
            id_room: this.id
        };
        user.sendCmd(NetCmd_1.NetCmd.ROOM_ADD, out);
    };
    ServerRoom.prototype.onJoin = function (user) {
        if (this.users.has(this.id)) {
            var out_1 = {
                code: 2,
                err: "已加入该房间"
            };
            user.sendCmd(NetCmd_1.NetCmd.ROOM_JOIN, out_1);
            return;
        }
        //先通知已经在房间内的用户,有新玩家进，房间内的用户，只需要去获取这个新用户数据即可
        var out = {
            code: 0,
            id_user: user.id_user,
            id_room: this.id
        };
        this.broadcast(NetCmd_1.NetCmd.ROOM_JOIN, out);
        //注意，这里是广播之后再添加的
        user.id_room = this.id;
        this.users.add(user.id_user);
        //然后通知加入者，将房间信息发送给它
        var ids = [];
        this.users.forEach(function (user, id) {
            ids.push(id);
        });
        out["ids"] = ids;
        user.sendCmd(NetCmd_1.NetCmd.ROOM_JOIN, out);
    };
    //玩家退出房间
    ServerRoom.prototype.onExit = function (user) {
        //如果是房主寻找下一继承人
        var _this = this;
        if (user.id_user == this.owner && this.users.size > 0) {
            this.owner = "";
            this.users.forEach(function (id) {
                _this.owner = id;
                console.log("房主更换为", _this.id, _this.owner);
                return;
            });
        }
        user.id_room = "";
        var out = {
            code: 0,
            id_user: user.id_user,
            id_room: this.id,
            owner: this.owner
        };
        this.broadcast(NetCmd_1.NetCmd.ROOM_EXIT, out);
        //广播之后再删除
        this.users.delete(user.id_user);
        //如果房间一个人都没有了，则删除这个房间（或者放回房间池里）
        if (this.users.size == 0) {
            this.mng.delete(this);
        }
    };
    //房间被删除
    ServerRoom.prototype.onDel = function (user) {
        var _this = this;
        this.users.forEach(function (id_user) {
            var user = _this.mng.getUserById(id_user);
            if (user) {
                user.id_room = null;
            }
        });
        var out = {
            id_room: this.id
        };
        this.broadcast(NetCmd_1.NetCmd.ROOM_DEL, out);
        this.users.clear();
        this.mng.delete(this);
    };
    /**
     * 准备阶段
     */
    //1.2客户端要求开始游戏
    ServerRoom.prototype.onGameBeg = function (user) {
        console.log("1.2客户端请求开始游戏");
        if (user.id_user != this.owner) {
            return;
        }
        //1.通知所有客户端进入游戏Scene
        this.broadcast(NetCmd_1.NetCmd.GAME_BEGIN, {});
        //2.启动游戏实例，加载初始关卡，开启一个倒计时，倒计时结束后向所有客户端发送关卡数据
        this.initGameInstance();
    };
    ServerRoom.prototype.initGameInstance = function () {
        var _this = this;
        if (this.gameInstance != null) {
            this.endUpdateGame();
            this.gameInstance = null;
        }
        console.log("启动游戏实例，并进入关卡");
        var gameInstance = new GameInstance_1.default();
        gameInstance.setIsClient(false);
        gameInstance.network = this.mng.ns;
        gameInstance.room = this;
        //服务器和客户端更新的精髓，worldview只具备接口
        //但是任然存在函数的无用调用
        gameInstance.setWorldView(new UWorldView_1.default());
        this.gameInstance = gameInstance;
        console.log("初始化世界，生成关卡数据");
        var world = new World1_1.default();
        this.gameInstance.openWorld(world, {}, this);
        this.time = 1;
        this.handle = setInterval(function () {
            _this.time -= 1;
            console.log(_this.time, "秒后发送关卡数据");
        }, 1000);
        setTimeout(function () {
            clearInterval(_this.handle);
            _this.sendGameLevel();
        }, this.time * 1000);
        return gameInstance;
    };
    //2.2客户端进入游戏场景，准备接受关卡数据
    ServerRoom.prototype.onGameReady = function (user) {
        console.log("2.2客户端已进入游戏场景并初始化好引擎");
        //改变玩家是否准备就绪标志位
        user.game_ready = 1;
        console.log(user.id_user, "准备接受关卡数据");
        user.sendCmd(NetCmd_1.NetCmd.GAME_READY, {});
    };
    //3.1向准备就绪的玩家发送关卡初始数据
    ServerRoom.prototype.sendGameLevel = function () {
        var _this = this;
        console.log("向所有玩家发送关卡数据");
        var levelData = this.gameInstance.getWorld().toJSON();
        var out = {
            levelData: levelData
        };
        this.broadcast(NetCmd_1.NetCmd.GAME_LOADLEVEL, out);
        this.time = 1;
        this.handle = setInterval(function () {
            _this.time -= 1;
            console.log(_this.time, "秒后发送开始游戏");
        }, 1000);
        //设置一个开始游戏倒计时
        setTimeout(function () {
            clearInterval(_this.handle);
            _this.sendGamePlay();
        }, this.time * 1000);
    };
    //3.3客户端接收关卡数据完成，当所有客户端都接收到数据时，提前开始游戏
    ServerRoom.prototype.onLoadLevelData = function (user) {
        console.log("3.3客户端加载关卡数据完毕");
        user.game_loaded = 1;
        console.log(user.id_user, "客户端加载数据成功");
    };
    //4.1正式开始游戏
    ServerRoom.prototype.sendGamePlay = function () {
        //服务器以30帧更新
        // this.fps = 30;
        this.startUpdateGame();
        console.log("正式开始游戏");
        var out = {};
        this.broadcast(NetCmd_1.NetCmd.GAME_PLAY, out);
    };
    //4.3客户端开始游戏
    ServerRoom.prototype.onGamePlay = function (user) {
        console.log("4.3客户端开始游戏");
        console.log(user.id_user, "正式开始游戏");
    };
    /**
     * 同步阶段
     */
    ServerRoom.prototype.sendGameData = function (obj) {
        var out = {
            data: obj,
            time: new Date().getTime()
        };
        this.broadcast(NetCmd_1.NetCmd.GAME_SEND_SERVER, out);
    };
    ServerRoom.prototype.sendBinaryGameData = function (view) {
        this.broadcastBinary(view);
    };
    //6.3服务器收到客户端输入，更新Controller状态
    ServerRoom.prototype.onReceiveGameData = function (user, obj) {
        var data = obj["data"];
        var time = obj["time"];
        this.gameInstance.receiveGameData(data, time);
    };
    ServerRoom.prototype.onReceiveBinaryGameData = function (user, data) {
        this.gameInstance.receiveBinaryGameData(data);
    };
    /**
     * 结算阶段
     */
    //7.1服务端，通知所有玩家，游戏结束
    ServerRoom.prototype.sendGameFinish = function (obj) {
        console.log("发送游戏结束");
        var out = {};
        this.broadcast(NetCmd_1.NetCmd.GAME_FINISH, out);
    };
    //7.3
    ServerRoom.prototype.onSendGameFinish = function (user) {
    };
    //8.1服务端，告诉每一个客户端游戏结果
    ServerRoom.prototype.sendGameResult = function (obj) {
        console.log("发送游戏结果");
        var out = {};
        this.broadcast(NetCmd_1.NetCmd.GAME_RESULT, out);
    };
    //8.3
    ServerRoom.prototype.onSendGameResult = function (user) {
    };
    //9.1服务端，告诉客户端游戏已经彻底结束
    ServerRoom.prototype.sendGameEnd = function (obj) {
        console.log("发送游戏彻底结束");
        var out = {};
        this.broadcast(NetCmd_1.NetCmd.GAME_END, out);
    };
    //9.3
    ServerRoom.prototype.onSendGameEnd = function (user) {
    };
    var ServerRoom_1;
    ServerRoom = ServerRoom_1 = __decorate([
        XBase_1.xServer("Room"),
        XBase_1.xclass(ServerRoom_1)
    ], ServerRoom);
    return ServerRoom;
}(Room_1.default));
exports.default = ServerRoom;
