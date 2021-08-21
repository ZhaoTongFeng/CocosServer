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
var Input_1 = require("./InputSystem/Input");
var XBase_1 = require("./ReflectSystem/XBase");
/**
 * 游戏实例 管理整个游戏生命周期
 * Client And Server 客户端和服务端都需要启动这个类
 * 生命周期：对于客户端来说，是整个APP生命周期，对于服务端来说，可以是一个游戏房间对应一个GameInstance
 */
var UGameInstance = /** @class */ (function (_super) {
    __extends(UGameInstance, _super);
    function UGameInstance() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 共享系统 */
        //本地输入系统
        _this.input = new Input_1.UInput();
        //音频系统
        _this.audio = null;
        //关卡系统
        _this.levelSystem = null;
        /** 游戏同步系统 */
        /** 网络数据系统 */
        _this.network = null;
        /**
         * 服务端客户端标识
         * 在编写游戏逻辑时，可以选择将逻辑放到客户端或者服务端
         */
        _this._isClient = false;
        _this.sendBuffer = [];
        _this.receiveBuffer = [];
        _this.receiveBufferTemp = []; //防止在处理数据时，接收新数据
        _this.receiveFlag = false;
        //当前游戏世界指针
        _this.view = null;
        _this.world = null;
        //全局共享的时间步长
        _this.deltaTime = 0;
        //从游戏实例启动 到现在的时间 
        _this.passTime = 0;
        _this.fps = 60;
        _this.frameTime = 0;
        _this.frameTimer = 0;
        return _this;
    }
    UGameInstance_1 = UGameInstance;
    UGameInstance.prototype.getIsClient = function () { return this._isClient; };
    UGameInstance.prototype.setIsClient = function (val) { this._isClient = val; };
    //每一帧调用这个去发送，但不是立即发送，这结束之后才会被全部发送
    UGameInstance.prototype.sendGameData = function (obj) {
        this.sendBuffer.push(obj);
    };
    //只负责接受数据，至于数据怎么处理，由关卡里面去实现
    UGameInstance.prototype.receiveGameData = function (obj) {
        if (this.receiveFlag) {
            //如果正在处理数据，则添加到临时容器
            this.receiveBufferTemp.push(obj);
        }
        else {
            this.receiveBuffer.push(obj);
        }
    };
    //全部发送，并清空
    UGameInstance.prototype.sendAllGameData = function () {
        if (this.sendBuffer.length != 0) {
            this.network.sendAllGameInput(this.sendBuffer);
            this.sendBuffer = [];
        }
    };
    //处理所有网络输入
    UGameInstance.prototype.startProcessSyncData = function () {
        var _this = this;
        this.receiveFlag = true;
        //上一帧的多个数据包
        this.receiveBuffer.forEach(function (buffer) {
            _this.world.inputSystem.processNetInput(buffer);
        });
    };
    //结束处理网络输入
    //清空已处理数据 并交换未处理数据，等待下一帧处理
    UGameInstance.prototype.endProcessSyncData = function () {
        this.receiveBuffer = [];
        this.receiveBuffer.concat(this.receiveBufferTemp);
        this.receiveBufferTemp = [];
        this.receiveFlag = false;
    };
    UGameInstance.prototype.processSyncData = function () {
        this.startProcessSyncData();
        this.endProcessSyncData();
    };
    UGameInstance.prototype.getWorld = function () { return this.world; };
    UGameInstance.prototype.getWorldView = function () { return this.view; };
    /** 关卡管理 */
    //打开一个关卡
    UGameInstance.prototype.openWorld = function (world, data, view) {
        if (data === void 0) { data = null; }
        this.frameTime = 1 / this.fps;
        this.view = view;
        if (this.world != null) {
            console.warn("WARN: currentWorld not null,");
            this.closeWorld();
        }
        this.canEveryTick = true;
        this.passTime = 0;
        this.world = world;
        this.world.gameInstance = this;
        this.world.init(data);
    };
    //当前关卡 网络处理+逻辑处理+本地输入循环
    UGameInstance.prototype.update = function (dt) {
        this.deltaTime = dt;
        this.passTime += dt;
        //TODO 锁定逻辑针，不受到操作卡住逻辑。
        this.frameTimer += dt;
        if (this.frameTimer > this.frameTime) {
            this.frameTimer = 0;
            if (this.world != null) {
                //1.处理网络输入
                this.processSyncData();
                //2.用输入或状态更新世界，并且将本机的操作添加到发送队列
                this.world.update(dt);
                //清除当前本地输入
                this.input.Clear();
                //3.发送当前帧输入
                this.sendAllGameData();
            }
            this.passTime = 0;
        }
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
        this.world.debugSystem.debugAll(graphic);
    };
    var UGameInstance_1;
    UGameInstance = UGameInstance_1 = __decorate([
        XBase_1.xclass(UGameInstance_1)
    ], UGameInstance);
    return UGameInstance;
}(Object_1.default));
exports.default = UGameInstance;
