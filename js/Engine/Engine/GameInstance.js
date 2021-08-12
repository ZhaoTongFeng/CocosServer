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
var ActorSystem_1 = __importDefault(require("./ActorSystem/ActorSystem"));
var AudioSystem_1 = __importDefault(require("./AudioSystem/AudioSystem"));
var Input_1 = require("./InputSystem/Input");
var XBase_1 = require("./ReflectSystem/XBase");
/**
 * 管理整个游戏
 * Client And Server 客户端和服务端都需要启动这个类
 * 生命周期：从打开APP到结束
 */
var UGameInstance = /** @class */ (function (_super) {
    __extends(UGameInstance, _super);
    function UGameInstance() {
        // static Ins = new UGameInstance();
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * 服务端客户端标识，在编写游戏逻辑时，可以选择将逻辑放到客户端或者服务端
         */
        _this._isClient = true;
        //当前游戏世界指针
        _this.view = null;
        _this.world = null;
        //全局共享的时间步长
        _this.deltaTime = 0;
        //已经过去的时间
        _this.passTime = 0;
        //输入系统
        _this.input = new Input_1.UInput();
        //音频系统
        _this.audio = new AudioSystem_1.default();
        //对象管理
        _this.actorSystem = new ActorSystem_1.default();
        return _this;
    }
    UGameInstance_1 = UGameInstance;
    UGameInstance.prototype.getIsClient = function () {
        return this._isClient;
    };
    UGameInstance.prototype.setIsClient = function (val) {
        this._isClient = val;
    };
    UGameInstance.prototype.getWorld = function () {
        return this.world;
    };
    UGameInstance.prototype.getWorldView = function () {
        return this.view;
    };
    /**
     * 打开一个关卡
     * @param world
     * @param data
     * @param view
     */
    UGameInstance.prototype.openWorld = function (world, data, view) {
        if (data === void 0) { data = null; }
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
    /**
     * 关闭关卡
     */
    UGameInstance.prototype.closeWorld = function () {
        this.world.destory();
        this.canEveryTick = false;
    };
    /**
     * 当前关卡循环
     * @param dt
     */
    UGameInstance.prototype.update = function (dt) {
        if (this.world != null) {
            this.deltaTime = dt;
            this.passTime += dt;
            this.world.update(dt);
            this.input.Clear();
        }
    };
    UGameInstance.prototype.drawDebug = function (graphic) {
        // this.world.drawDebug(graphic);
    };
    var UGameInstance_1;
    UGameInstance = UGameInstance_1 = __decorate([
        XBase_1.xclass(UGameInstance_1)
    ], UGameInstance);
    return UGameInstance;
}(Object_1.default));
exports.default = UGameInstance;
