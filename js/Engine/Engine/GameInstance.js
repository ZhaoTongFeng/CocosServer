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
exports.SyncMode = void 0;
var Object_1 = __importDefault(require("../Object"));
var Enums_1 = require("./Enums");
var InputSystem_1 = require("./InputSystem/InputSystem");
var NetCmd_1 = require("./NetworkSystem/Share/NetCmd");
var Protocol_1 = require("./NetworkSystem/Share/Protocol");
var XBase_1 = require("./ReflectSystem/XBase");
var UMath_1 = require("./UMath");
/**
 * 网络同步
 *
 * 发送和接收接口统一
 * GameInstance同时会在客户端和服务器运行，两者调用的发送和接收方法不同，无论发送JSON还是Binary，都需要上层进行抽象。
 * 具体来说就是，ROOM定义发送和接收接口，然后在ClientRoom和ServerRoom不同的实现
 *
 * 发送
 * 无论是客户端还是服务端，Component只管把数据添加到缓冲区，统一发送
 * TODO，如果数据过于庞大，可能需要拆分为几个部分进行 分批发送
 *
 * 接收
 * 服务端立即处理客户端数据，对World进行修改
 * 客户端接收到服务端数据，首先需要进行缓存，因为服务器以低于客户端的帧率进行更新，客户端比服务端慢了很多帧，需要进行补帧
 *
 * 统一接口设计
 * 1.UObject 中调用的发送数据方法，收集待发送数据
 * 2.发送缓冲区数据
 * 3.接收数据
 * 4.处理数据
 *
 *
 * 上面说的是，服务端和客户端跑一套代码，现在两端都能跑起来，但是，如何只在单机上跑起来（服务器或者客户端单独运行都叫单机运行）
 * 游戏主循环由三个部分组成
 *                                              单机      多人
 * 输入 键盘、触摸 更新输入标志位                  处理     客户端输入数据=》服务器，服务器处理
 * 更新 根据输入标志更新游戏逻辑，更新游戏状态      处理     服务端处理
 * 输出 根据游戏状态输出视频、音频 、网络数据       处理     游戏状态=》客户端 客户端处理
 *
 * 其实很简单，首先我们定义一个是否为单机的标志位，定义处理数据的接口
 * 输入 客户端，如果是单机，那么我们直接调用接口处理数据，否则我们将数据发送出去，服务端接收到调用相同的接口进行处理
 * 更新 如果是单机，则直接进行更新，否则检查当前是否为服务器，在服务器上进行更新
 * 输出
 *      1.客户端需要视频，服务端不需要视频，所以需要为输出定义接口，在客户端去实现接口，服务端不用实现。
 *      2.如果是单机，不需要产生网络数据输出（也不一定，服务器运行观战游戏，同步给客户端），
 *          否则需要将输出数据（客户端是输入操作，服务端发送的是世界状态）全部发送
 *          待发送的数据是在输入或更新阶段产生的，所以在添加发送数据时，也要检测，是否为单机状态
 */
var SyncMode;
(function (SyncMode) {
    SyncMode[SyncMode["ONLINE"] = 0] = "ONLINE";
    SyncMode[SyncMode["OFFLINE"] = 1] = "OFFLINE";
})(SyncMode = exports.SyncMode || (exports.SyncMode = {}));
/**
 * 游戏实例 管理整个游戏生命周期
 * Client And Server 客户端和服务端都需要启动这个类
 * 生命周期：对于客户端来说，是整个APP生命周期，对于服务端来说，可以是一个游戏房间对应一个GameInstance
 */
var UGameInstance = /** @class */ (function (_super) {
    __extends(UGameInstance, _super);
    function UGameInstance() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //是否为单机模式
        _this._bStandAlone = false;
        /**
         * 服务端客户端标识
         * 在编写游戏逻辑时，可以选择将逻辑放到客户端或者服务端
        */
        _this._isClient = false;
        //游戏房间
        _this.room = null;
        //客户端发送队列只有操作
        _this.protocolSystem = null;
        _this.receiveProtocolSystem = null;
        _this.sendBuffer = [];
        _this.receiveBuffer = [];
        //服务器分区发送数据
        //服务端发送数据 网格，Item是消息队列
        _this.gridWidth = 750;
        _this.gridCol = 10;
        _this.halfGridCol = _this.gridCol / 2;
        _this.gridRow = 10;
        _this.halfGridRow = _this.gridRow / 2;
        //网格分区数据
        _this.sendBuffer2 = [];
        /**
         * 客户端内插值优化
         * 废弃，每一个具有Position的显示组件，都必须在组件进行差值，否则会因为rate的刷新而抖动
         */
        _this.oldTick = 0;
        _this.curTick = 0;
        _this.timeFrame = 0;
        _this.frameTimer = 0;
        _this.frameRate = 0;
        /**
         * 游戏主循环
         * 处理输入 本地|网络处理
         * 更新世界
         * 处理输出
         */
        _this.deltaTime = 0; //全局共享的时间步长
        _this.passTime = 0; //从游戏实例启动 到现在的时间
        _this.debugTimer = 0;
        _this.debugDelay = 5;
        /**
         * 客户端服务端共享系统
         */
        //本地输入系统
        _this.input = new InputSystem_1.UInputSystem();
        //音频系统
        _this.audioSystem = null;
        //关卡系统
        _this.levelSystem = null;
        /** 游戏同步系统 */
        _this.network = null;
        /**
         * 关卡
         */
        //World和WorldView适配器
        _this.view = null;
        _this.world = null;
        return _this;
    }
    UGameInstance_1 = UGameInstance;
    Object.defineProperty(UGameInstance.prototype, "bStandAlone", {
        get: function () { return this._bStandAlone; },
        set: function (value) { this._bStandAlone = value; },
        enumerable: false,
        configurable: true
    });
    UGameInstance.prototype.getIsClient = function () { return this._isClient; };
    UGameInstance.prototype.setIsClient = function (val) { this._isClient = val; };
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
    //内插值 计算出两次数据包的时间步长
    UGameInstance.prototype.computeFrameRate = function (time) {
        this.frameTimer = 0;
        this.curTick = time;
        if (this.curTick != 0 && this.oldTick != 0) {
            this.timeFrame = this.curTick - this.oldTick;
        }
        this.oldTick = this.curTick;
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
    //分区发送数据 根据每个玩家的位置，把9宫格的数据传出
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
    //接收JSON数据 只负责接受数据，至于数据怎么处理，由关卡里面去实现
    UGameInstance.prototype.receiveGameData = function (obj, time) {
        this.receiveBuffer = obj;
        if (!this._isClient) {
            //服务器立即处理请求更新状态，而不是等到更新时再处理
            this.processSyncData();
        }
        else {
            //客户端处理时间戳
            this.computeFrameRate(time);
        }
    };
    //处理JSON数据
    UGameInstance.prototype.processSyncData = function () {
        var _this = this;
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
    //发送二进制数据
    UGameInstance.prototype.sendBinaryGameData = function () {
        if (this.protocolSystem.hasData()) {
            this.protocolSystem.opt = NetCmd_1.NetCmd.GAME_SEND_BINARY;
            this.room.sendBinaryGameData(this.protocolSystem.getAll());
            this.protocolSystem.clear();
        }
    };
    //接收二进制数据
    UGameInstance.prototype.receiveBinaryGameData = function (data) {
        this.receiveProtocolSystem.bSetResponse = true;
        this.receiveProtocolSystem.binBufferView = data;
        if (!this._isClient) {
            this.receiveProtocolSystem.responseBufferView();
        }
        else {
            var time = data[2];
            this.computeFrameRate(time);
        }
    };
    //处理二进制数据
    UGameInstance.prototype.processSyncDataBinary = function () {
        this.receiveProtocolSystem.responseBufferView();
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
        this.deltaTime = dt;
        this.passTime += dt;
        //1.处理输入
        if (this._isClient) {
            this.processSyncData();
            this.processSyncDataBinary();
            this.frameTimer += dt * 1000;
            this.frameRate = UMath_1.UMath.clamp01(this.frameTimer / this.timeFrame / 2);
        }
        this.protocolSystem.clear();
        //2.用输入或状态更新世界，并且将本机的操作添加到发送队列
        this.world.update(dt);
        //3.发送输出，单机模式暂时，不发送任何数据
        if (!this.bStandAlone) {
            if (this._isClient) {
                this.sendAllGameData();
            }
            else {
                this.sendAllGridGameData();
            }
            this.sendBinaryGameData();
        }
    };
    UGameInstance.prototype.getWorld = function () { return this.world; };
    UGameInstance.prototype.getWorldView = function () { return this.view; };
    UGameInstance.prototype.setWorldView = function (view) { this.view = view; };
    //打开一个关卡
    UGameInstance.prototype.openWorld = function (world, data, view) {
        if (data === void 0) { data = null; }
        if (this.world != null) {
            console.warn("WARN: currentWorld not null,");
            this.closeWorld();
        }
        this.initSendBuffer();
        this.protocolSystem = new Protocol_1.ProtocolSystem(this);
        this.receiveProtocolSystem = new Protocol_1.ProtocolSystem(this);
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
