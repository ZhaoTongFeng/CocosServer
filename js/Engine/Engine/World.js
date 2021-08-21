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
var CollisionSystem_1 = __importDefault(require("./CollisionSystem/CollisionSystem"));
var DebugSystem_1 = require("./DebugSystem/DebugSystem");
var Enums_1 = require("./Enums");
var InputSystem_1 = require("./InputSystem/InputSystem");
var XBase_1 = require("./ReflectSystem/XBase");
/**
 * 一个关卡 逻辑关卡
 * 生命周期：从创建关卡到结束
 */
var UWorld = /** @class */ (function (_super) {
    __extends(UWorld, _super);
    function UWorld() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 关卡状态 */
        _this.isDebug = false;
        _this.isUpdating = false;
        _this.gameState = Enums_1.GameState.Paused;
        _this.actors = [];
        _this.actors_kill = [];
        _this.actors_peending = [];
        _this.actorPool = new Map();
        _this.componentPoos = new Map();
        _this.maxActorCount = 0;
        /** 系统 */
        _this.collisionSystem = null;
        //controller在这里注册，收到网络请求时统一进行处理
        _this.inputSystem = null;
        _this.debugSystem = null;
        //对象管理
        _this.actorSystem = null;
        /** 指针 */
        _this.gameInstance = null;
        _this.gameMode = null;
        _this.player = null;
        _this.usePool = true;
        _this.isClient = false;
        return _this;
    }
    UWorld_1 = UWorld;
    // 被创建时 初始化关卡
    UWorld.prototype.init = function (data) {
        if (data === void 0) { data = null; }
        _super.prototype.init.call(this, data);
        this.collisionSystem = new CollisionSystem_1.default();
        this.collisionSystem.init(this);
        this.inputSystem = new InputSystem_1.UInputSystem();
        this.inputSystem.init(this);
        this.debugSystem = new DebugSystem_1.UDebugSystem();
        this.debugSystem.init(this);
        this.actorSystem = new ActorSystem_1.default();
        this.actorSystem.init(this);
        this.gameState = Enums_1.GameState.Playing;
        this.isClient = this.gameInstance.getIsClient();
    };
    //释放关卡
    UWorld.prototype.destory = function () {
        this.actors = [];
        this.actors_kill = [];
        this.actors_peending = [];
        this.isUpdating = false;
        this.gameState = Enums_1.GameState.Paused;
    };
    //更新逻辑主循环
    //帧循环，被Instance初始化之后，会被放到CC的Update下面
    UWorld.prototype.update = function (dt) {
        var _this = this;
        if (this.gameState == Enums_1.GameState.Playing) {
            //本地输入
            this.actors.forEach(function (ac) {
                ac.processInput(_this.gameInstance.input);
            });
            //TODO 如果是单机模式则直接在这里消耗指令
            //更新
            this.isUpdating = true;
            this.actors.forEach(function (actor) {
                if (actor.canEveryTick) {
                    actor.update(dt);
                }
            });
            this.isUpdating = false;
            this.updateWorld(dt);
            //添加这一帧添加的AC
            for (var i = 0; i < this.actors_peending.length; i++) {
                this.actors_peending[i].onInit();
                this.actors.push(this.actors_peending[i]);
            }
            this.actors_peending = [];
            //删除这一帧删除的AC
            for (var i = this.actors.length - 1; i >= 0; i--) {
                if (this.actors[i].state == Enums_1.UpdateState.Dead) {
                    this.actors[i].onDestory();
                    //添加到对象池
                    if (this.usePool) {
                        this.actors[i].unUse();
                        if (this.actors[i] != null) {
                            var clsName = this.actors[i].constructor.name;
                            var arr = this.actorPool.get(clsName);
                            arr.push(this.actors[i]);
                        }
                    }
                    this.actors.splice(i, 1);
                }
            }
        }
    };
    //Override Actor 更新完成之后操作，比如碰撞检测
    UWorld.prototype.updateWorld = function (dt) { };
    //在程序中生成Actor，所有actor的创建，必须通过这个注册
    UWorld.prototype.spawn = function (c) {
        var actor = null;
        if (this.usePool) {
            var clsName = c.name;
            if (this.actorPool.has(clsName) == false) {
                this.actorPool.set(clsName, []);
            }
            var arr = this.actorPool.get(clsName);
            if (arr.length == 0) {
                actor = new c();
            }
            else {
                actor = arr.pop();
                actor = actor;
                actor.reUse();
            }
        }
        if (actor == null) {
            actor = new c();
        }
        actor.init(this);
        return actor;
    };
    UWorld.prototype.spawnComponent = function (actor, c) {
        var comp = null;
        if (this.usePool) {
            var clsName = c.name;
            if (this.componentPoos.has(clsName) == false) {
                this.componentPoos.set(clsName, []);
            }
            var arr = this.componentPoos.get(clsName);
            if (arr.length == 0) {
                // console.log("New Component", clsName);
                comp = new c();
            }
            else {
                comp = arr.pop();
                comp = comp;
                comp.reUse();
            }
        }
        if (comp == null) {
            comp = new c();
        }
        comp.init(actor);
        return comp;
    };
    /**
     * 增加Actor
     * 需要考虑在更新过程中添加的情况，而删除Actor，不需要考虑，因为全部都是这一帧结束后删除
     * @param actor
     */
    UWorld.prototype.addActor = function (actor) {
        if (this.isUpdating) {
            this.actors_peending.push(actor);
        }
        else {
            actor.onInit();
            this.actors.push(actor);
        }
        if (this.actors.length > this.maxActorCount) {
            this.maxActorCount = this.actors.length;
            // console.log("最大Actor数量", this.maxActorCount);
        }
        // console.log("add actor num:",this.actors.length);
    };
    var UWorld_1;
    UWorld = UWorld_1 = __decorate([
        XBase_1.xclass(UWorld_1)
    ], UWorld);
    return UWorld;
}(Object_1.default));
exports.default = UWorld;
