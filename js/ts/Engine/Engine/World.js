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
var CollisionSystem_1 = __importDefault(require("./CollisionSystem/CollisionSystem"));
var Enums_1 = require("./Enums");
var XBase_1 = require("./ReflectSystem/XBase");
var UMath_1 = require("./UMath");
/**
 * 一个关卡
 * 生命周期：从创建关卡到结束
 */
var UWorld = /** @class */ (function (_super) {
    __extends(UWorld, _super);
    function UWorld() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.actors = [];
        _this.actors_kill = [];
        _this.actors_peending = [];
        _this.isUpdating = false;
        _this.gameState = Enums_1.GameState.Paused;
        //系统
        _this.collisionSystem = null;
        _this.gameMode = null;
        _this.player = null;
        _this.isDebug = false;
        _this.networkTimer = 0;
        _this.gameInstance = null;
        _this.actorPool = new Map();
        _this.componentPoos = new Map();
        _this.maxActorCount = 0;
        return _this;
    }
    UWorld_1 = UWorld;
    //TODO 可以加一个时钟
    /**
     * 初始化关卡
     */
    UWorld.prototype.init = function (data) {
        if (data === void 0) { data = null; }
        _super.prototype.init.call(this, data);
        //DO SOMETHING
        this.collisionSystem = new CollisionSystem_1.default();
        ;
        this.collisionSystem.world = this;
        this.gameState = Enums_1.GameState.Playing;
    };
    /**
     * 帧循环，被Instance初始化之后，会被放到CC的Update下面
     * @param dt
     */
    UWorld.prototype.update = function (dt) {
        var _this = this;
        if (this.gameState == Enums_1.GameState.Playing) {
            // //网络输入
            // UNetworkSystem.Ins.receiveFlag = true;
            // //处理，清除，交换
            // UNetworkSystem.Ins.receiveBuffer.forEach(msg => {
            //     console.log(msg);
            // });
            // UNetworkSystem.Ins.receiveBuffer = [];
            // UNetworkSystem.Ins.receiveBuffer.concat(UNetworkSystem.Ins.receiveBufferTemp);
            // UNetworkSystem.Ins.receiveBufferTemp = [];
            // UNetworkSystem.Ins.receiveFlag = false;
            //本地输入
            this.actors.forEach(function (ac) {
                ac.processInput(_this.gameInstance.input);
            });
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
                    this.actors[i].unUse();
                    if (this.actors[i] != null) {
                        var clsName = this.actors[i].constructor.name;
                        var arr = this.actorPool.get(clsName);
                        arr.push(this.actors[i]);
                    }
                    this.actors.splice(i, 1);
                }
            }
            // //每二十针发送一次消息
            // this.networkTimer += dt;
            // if (this.networkTimer > 1) {
            //     //模拟发送消息
            //     UNetworkSystem.Ins.send(dt + "");
            //     UNetworkSystem.Ins.sendAll();
            //     this.networkTimer = 0;
            // }
        }
    };
    UWorld.prototype.updateWorld = function (dt) {
    };
    UWorld.prototype.drawDebug = function (graphic) {
        var winSize = this.gameInstance.getWorldView().winSize;
        graphic.drawRect(winSize.x * -1, winSize.y * -1, winSize.x * 2, winSize.y * 2, UMath_1.UColor.BLUE());
        this.actors.forEach(function (actor) {
            actor.drawDebug(graphic);
        });
    };
    /**
     * 释放关卡
     */
    UWorld.prototype.destory = function () {
        this.actors = [];
        this.actors_kill = [];
        this.actors_peending = [];
        this.isUpdating = false;
        this.gameState = Enums_1.GameState.Paused;
    };
    /**
     * 在程序中生成Actor
     * TODO 这里做对象池，所有的生成都通过这个函数
     */
    UWorld.prototype.spawn = function (c) {
        var actor = null;
        var clsName = c.name;
        if (this.actorPool.has(clsName) == false) {
            this.actorPool.set(clsName, []);
        }
        var arr = this.actorPool.get(clsName);
        if (arr.length == 0) {
            // console.log("New Actor", clsName);
            actor = new c();
        }
        else {
            actor = arr.pop();
            actor = actor;
            actor.reUse();
        }
        if (actor == null) {
            console.log("NULL New Actor", clsName);
            actor = new c();
        }
        actor.init(this);
        return actor;
    };
    UWorld.prototype.spawnComponent = function (actor, c) {
        var comp = null;
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
        if (comp == null) {
            console.log("NULL New Component", clsName);
            comp = new c();
        }
        comp.init(actor);
        return comp;
    };
    /**增删Actor */
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
    UWorld.prototype.removeActor = function (actor) {
        var index = this.actors.indexOf(actor);
        if (index > -1) {
            this.actors.splice(index, 1);
        }
        index = this.actors_peending.indexOf(actor);
        if (index > -1) {
            this.actors_peending.splice(index, 1);
        }
        console.log("after remove actor num:", this.actors.length);
    };
    var UWorld_1;
    UWorld = UWorld_1 = __decorate([
        XBase_1.xclass(UWorld_1)
    ], UWorld);
    return UWorld;
}(Object_1.default));
exports.default = UWorld;
