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
var Enums_1 = require("../Engine/Enums");
var XBase_1 = require("../Engine/ReflectSystem/XBase");
var UMath_1 = require("../Engine/UMath");
var Object_1 = __importDefault(require("../Object"));
/**
 * 角色（演员）
 * 游戏场景中 真实存在 的 东西
 * 拥有一个组件列表，可挂载任何组件
 * 创建角色，调用World中Spawn函数，传入变换信息，即可创建角色
 */
var AActor = /** @class */ (function (_super) {
    __extends(AActor, _super);
    function AActor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.world = null;
        _this.state = Enums_1.UpdateState.Peeding;
        _this.reComputeTransform = true;
        _this.components = [];
        _this.rootComponent = null;
        _this.sceneComponent = null;
        _this.collisionComponent = null;
        return _this;
    }
    AActor_1 = AActor;
    //Override
    AActor.prototype.unUse = function () {
        _super.prototype.unUse.call(this);
    };
    //Override
    AActor.prototype.reUse = function () {
        _super.prototype.reUse.call(this);
        this.world = null;
        this.components = [];
        this.rootComponent = null;
        this.sceneComponent = null;
        this.collisionComponent = null;
        this.reComputeTransform = true;
        this.state = Enums_1.UpdateState.Peeding;
    };
    //Override
    AActor.prototype.init = function (world) {
        _super.prototype.init.call(this, world);
        this.world = world;
        this.world.addActor(this);
    };
    //Override
    AActor.prototype.onInit = function () {
        this.state = Enums_1.UpdateState.Active;
    };
    //输入
    AActor.prototype.processInput = function (input) {
        if (this.state = Enums_1.UpdateState.Active) {
            this.processChildrenInput(input);
            this.processSelfInput(input);
        }
    };
    //Override
    AActor.prototype.processSelfInput = function (input) { };
    AActor.prototype.processChildrenInput = function (input) {
        this.components.forEach(function (comp) {
            comp.processInput(input);
        });
    };
    AActor.prototype.computeWorldTransform = function () {
        if (this.reComputeTransform) {
            this.reComputeTransform = false;
            this.components.forEach(function (comp) {
                comp.onComputeTransfor();
            });
        }
    };
    //更新
    AActor.prototype.update = function (dt) {
        if (this.state == Enums_1.UpdateState.Active) {
            this.computeWorldTransform();
            this.updateComponents(dt);
            this.updateActor(dt);
            this.computeWorldTransform();
        }
    };
    //Override
    AActor.prototype.updateActor = function (dt) { };
    AActor.prototype.updateComponents = function (dt) {
        this.components.forEach(function (comp) {
            comp.update(dt);
        });
    };
    //输出，实际上是更新CC的Node去输出
    AActor.prototype.drawDebug = function (graphic) {
        this.drawDebugComponents(graphic);
        this.drawDebugActor(graphic);
    };
    //Override
    AActor.prototype.drawDebugActor = function (graphic) { };
    AActor.prototype.drawDebugComponents = function (graphic) {
        this.components.forEach(function (comp) {
            comp.drawDebug(graphic);
        });
    };
    //销毁
    AActor.prototype.destory = function () {
        this.state = Enums_1.UpdateState.Dead;
    };
    //Override
    AActor.prototype.onDestory = function () {
        var _this = this;
        this.components.forEach(function (comp) {
            comp.onDestory();
            //添加到对象池
            if (comp != null) {
                comp.unUse();
                var clsName = comp.constructor.name;
                var arr = _this.world.componentPoos.get(clsName);
                arr.push(comp);
            }
        });
    };
    /**增删Component */
    AActor.prototype.spawnComponent = function (c) {
        return this.world.spawnComponent(this, c);
    };
    AActor.prototype.addComponent = function (comp) {
        this.components.push(comp);
        // console.log("add comp num:",this.components.length);
    };
    //单独删除
    AActor.prototype.removeComponent = function (comp) {
        var index = this.components.indexOf(comp);
        if (index > -1) {
            this.components[index].onDestory();
            this.components.splice(index, 1);
        }
        // console.log("remove comp num:",this.components.length);
    };
    AActor.prototype.getSceneComponent = function () {
        return this.sceneComponent;
    };
    AActor.prototype.getRootComp = function () {
        return this.rootComponent;
    };
    AActor.prototype.setSceneComponent = function (comp) {
        this.sceneComponent = comp;
    };
    AActor.prototype.setRootComp = function (comp) {
        this.rootComponent = comp;
    };
    AActor.prototype.getCollision = function () {
        return this.collisionComponent;
    };
    AActor.prototype.setCollision = function (comp) {
        this.collisionComponent = comp;
    };
    AActor.prototype.getSize = function () {
        if (!this.sceneComponent) {
            return UMath_1.uu.v2(0, 0);
        }
        else {
            return this.sceneComponent.getSize();
        }
    };
    AActor.prototype.setSize = function (pos) {
        if (!this.sceneComponent) {
            return;
        }
        else {
            this.sceneComponent.setSize(pos);
        }
    };
    AActor.prototype.getPosition = function () {
        if (!this.sceneComponent) {
            return UMath_1.uu.v2(0, 0);
        }
        else {
            return this.sceneComponent.getPosition();
        }
    };
    AActor.prototype.setPosition = function (pos) {
        if (!this.sceneComponent) {
            return;
        }
        else {
            this.sceneComponent.setPosition(pos);
            this.reComputeTransform = true;
        }
    };
    AActor.prototype.getScale = function () {
        if (!this.sceneComponent) {
            return UMath_1.uu.v2(0, 0);
        }
        else {
            return this.sceneComponent.getScale();
        }
    };
    AActor.prototype.setScale = function (pos) {
        if (!this.sceneComponent) {
            return;
        }
        else {
            this.sceneComponent.setScale(pos);
            this.reComputeTransform = true;
        }
    };
    AActor.prototype.getRotation = function () {
        if (!this.sceneComponent) {
            return 0;
        }
        else {
            return this.sceneComponent.getRotation();
        }
    };
    AActor.prototype.setRotation = function (angle) {
        if (!this.sceneComponent) {
            return;
        }
        else {
            this.sceneComponent.setRotation(angle);
            this.reComputeTransform = true;
        }
    };
    var AActor_1;
    __decorate([
        XBase_1.xproperty(Number)
    ], AActor.prototype, "state", void 0);
    __decorate([
        XBase_1.xproperty(Boolean)
    ], AActor.prototype, "reComputeTransform", void 0);
    __decorate([
        XBase_1.xproperty(XBase_1.XBase)
    ], AActor.prototype, "components", void 0);
    AActor = AActor_1 = __decorate([
        XBase_1.xclass(AActor_1)
    ], AActor);
    return AActor;
}(Object_1.default));
exports.default = AActor;
