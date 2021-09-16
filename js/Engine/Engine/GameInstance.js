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
var Object_1 = __importDefault(require("../Object"));
var Enums_1 = require("./Enums");
var InputSystem_1 = require("./InputSystem/InputSystem");
var NetCmd_1 = require("./NetworkSystem/Share/NetCmd");
var XBase_1 = require("./ReflectSystem/XBase");
var UMath_1 = require("./UMath");
/**
 * 游戏实例 管理整个游戏生命周期
 * Client And Server 客户端和服务端都需要启动这个类
 * 生命周期：对于客户端来说，是整个APP生命周期，对于服务端来说，可以是一个游戏房间对应一个GameInstance
 */
var UGameInstance = /** @class */ (function (_super) {
    __extends(UGameInstance, _super);
    function UGameInstance() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * 服务端客户端标识
         * 在编写游戏逻辑时，可以选择将逻辑放到客户端或者服务端
         */
        _this._isClient = false;
        _this.room = null;
        //客户端发送队列只有操作
        _this.sendBuffer = [];
        _this.receiveBuffer = [];
        //服务端发送数据 网格，Item是消息队列
        //一个格子宽度
        _this.gridWidth = 750;
        //列
        _this.gridCol = 10;
        _this.halfGridCol = _this.gridCol / 2;
        //行
        _this.gridRow = 10;
        _this.halfGridRow = _this.gridRow / 2;
        _this.sendBuffer2 = [];
        /** 接收方，根据是服务器还是客户端，分别进行处理，如果是服务端则收到的是输入，客户端收到的是输出 */
        _this.oldTick = 0;
        _this.curTick = 0;
        _this.timeFrame = 0;
        //内插值计时器
        _this.frameTimer = 0;
        _this.frameRate = 0;
        //当前关卡 网络处理+逻辑处理+本地输入循环
        _this.debugTimer = 0;
        _this.debugDelay = 5;
        /** 共享系统 */
        //本地输入系统
        _this.input = new InputSystem_1.UInputSystem();
        //音频系统
        _this.audio = null;
        //关卡系统
        _this.levelSystem = null;
        /** 游戏同步系统 */
        /** 网络数据系统 */
        _this.network = null;
        //当前游戏世界指针
        _this.view = null;
        _this.world = null;
        //全局共享的时间步长
        _this.deltaTime = 0;
        //从游戏实例启动 到现在的时间 
        _this.passTime = 0;
        return _this;
    }
    UGameInstance_1 = UGameInstance;
    UGameInstance.prototype.getIsClient = function () { return this._isClient; };
    UGameInstance.prototype.setIsClient = function (val) { this._isClient = val; };
    /** 关卡管理 */
    UGameInstance.prototype.initSendBuffer = function () {
        var gridWidth = this.gridWidth;
        var gridCol = this.gridCol;
        var gridRow = this.gridRow;
        this.sendBuffer2 = [];
        for (var i = 0; i < gridRow; i++) {
            this.sendBuffer2[i] = [];
            for (var j = 0; j < gridCol; j++) {
                this.sendBuffer2[i][j] = [];
            }
        }
    };
    UGameInstance.prototype.cleanSendBuffer = function () {
        var gridWidth = this.gridWidth;
        var gridCol = this.gridCol;
        var gridRow = this.gridRow;
        for (var i = 0; i < gridRow; i++) {
            for (var j = 0; j < gridCol; j++) {
                this.sendBuffer2[i][j] = [];
            }
        }
    };
    //以actor为单位，将数据添加到网格
    UGameInstance.prototype.sendGameGridData = function (obj, target, actor) {
        try {
            var out = {
                id: target.id,
                data: obj
            };
            var gridx = actor.gridx;
            var gridy = actor.gridy;
            var grid = this.sendBuffer2[gridy][gridx];
            grid.push(out);
        }
        catch (error) {
            console.log(error);
        }
    };
    //根据每个玩家的位置，把9宫格的数据传出
    UGameInstance.prototype.sendAllGridGameData = function () {
        var _this = this;
        try {
            var map_1 = this.world.pUserControllerMap;
            var users = this.world.users;
            var gridCol_1 = this.gridCol;
            var gridRow_1 = this.gridRow;
            users.forEach(function (user) {
                var con = map_1.get(user.id_user);
                var ac = con.pawn;
                var gridx = ac.gridx;
                var gridy = ac.gridy;
                var arr = [];
                for (var m = -1; m <= 1; m++) {
                    for (var n = -1; n <= 1; n++) {
                        var tx = gridx + n;
                        var ty = gridy + m;
                        if (tx >= 0 && tx < gridCol_1 && ty >= 0 && ty < gridRow_1) {
                            var grid = _this.sendBuffer2[ty][tx];
                            if (grid.length != 0) {
                                arr = arr.concat(grid);
                            }
                        }
                    }
                }
                if (arr.length != 0) {
                    var out = {
                        data: arr,
                        time: new Date().getTime()
                    };
                    user.sendCmd(NetCmd_1.NetCmd.GAME_SEND_SERVER, out);
                }
            });
            this.cleanSendBuffer();
        }
        catch (error) {
            console.log(error);
        }
    };
    /** 发送方只管发 */
    //先将发送数据存到缓存
    UGameInstance.prototype.sendGameData = function (obj, target) {
        var out = {
            id: target.id,
            data: obj
        };
        this.sendBuffer.push(out);
    };
    //通过ROOM，全部发送，并清空
    UGameInstance.prototype.sendAllGameData = function () {
        if (this.sendBuffer.length != 0) {
            this.room.sendGameData(this.sendBuffer);
            this.sendBuffer = [];
        }
    };
    //只负责接受数据，至于数据怎么处理，由关卡里面去实现
    UGameInstance.prototype.receiveGameData = function (obj, time) {
        this.receiveBuffer = obj;
        this.frameTimer = 0;
        //计算出两次数据包的时间步长
        this.curTick = time;
        if (this.curTick != 0 && this.oldTick != 0) {
            this.timeFrame = this.curTick - this.oldTick;
        }
        this.oldTick = this.curTick;
        //服务器立即处理请求更新状态，而不是等到更新时再处理
        if (!this._isClient) {
            this.processSyncData();
        }
    };
    //处理网络数据
    UGameInstance.prototype.processSyncData = function () {
        var _this = this;
        if (this.receiveBuffer.length != 0) {
            // console.log(this.receiveBuffer);
        }
        this.receiveBuffer.forEach(function (buffer) {
            //从哪儿来到哪儿去
            var id = buffer.id;
            var obj = _this.world.actorSystem.objMap.get(id);
            if (obj) {
                obj.receiveData(buffer.data);
            }
        });
        this.receiveBuffer = [];
    };
    UGameInstance.prototype.update = function (dt) {
        if (this.world == null) {
            return;
        }
        if (this.world.gameState != Enums_1.GameState.Playing) {
            return;
        }
        this.debugTimer += dt;
        if (this.debugTimer > this.debugDelay) {
            this.debugTimer = 0;
        }
        this.frameTimer += dt * 1000;
        this.frameRate = UMath_1.UMath.clamp01(this.frameTimer / this.timeFrame / 2);
        this.deltaTime = dt;
        this.passTime += dt;
        //1.处理输入
        if (this._isClient) {
            this.processSyncData();
        }
        //2.用输入或状态更新世界，并且将本机的操作添加到发送队列
        this.world.update(dt);
        //3.发送输出
        if (this._isClient) {
            this.sendAllGameData();
        }
        else {
            this.sendAllGridGameData();
        }
        this.passTime = 0;
    };
    UGameInstance.prototype.getWorld = function () { return this.world; };
    UGameInstance.prototype.getWorldView = function () { return this.view; };
    UGameInstance.prototype.setWorldView = function (view) {
        this.view = view;
    };
    //打开一个关卡
    UGameInstance.prototype.openWorld = function (world, data, view) {
        if (data === void 0) { data = null; }
        // XTestMain();
        // this.view = view;
        if (this.world != null) {
            console.warn("WARN: currentWorld not null,");
            this.closeWorld();
        }
        this.initSendBuffer();
        this.canEveryTick = true;
        this.passTime = 0;
        this.world = world;
        this.world.gameInstance = this;
        this.world.init(data);
    };
    //TODO 切换关卡
    UGameInstance.prototype.switchWorld = function (oldWorldData) {
    };
    //关闭关卡
    UGameInstance.prototype.closeWorld = function () {
        this.world.destory();
        this.canEveryTick = false;
    };
    //调试关卡
    UGameInstance.prototype.drawDebug = function (graphic) {
        if (this._isClient && this.world && this.world.debugSystem) {
            this.world.debugSystem.debugAll(graphic);
        }
    };
    var UGameInstance_1;
    UGameInstance = UGameInstance_1 = __decorate([
        XBase_1.xclass(UGameInstance_1)
    ], UGameInstance);
    return UGameInstance;
}(Object_1.default));
exports.default = UGameInstance;
