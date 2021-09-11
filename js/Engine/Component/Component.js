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
var Object_1 = __importDefault(require("../Object"));
/**
 * 组件基类
 * 也支持嵌套，但是所有的更新全部都是Actor组件列表中进行。而且更新顺序是按照组件添加的顺序，也就是说，碰撞组件必须添加在移动组件后面。
 *
 */
var UComponent = /** @class */ (function (_super) {
    __extends(UComponent, _super);
    function UComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.owner = null;
        _this.state = Enums_1.UpdateState.Active;
        return _this;
    }
    UComponent_1 = UComponent;
    UComponent.prototype.unUse = function () {
        _super.prototype.unUse.call(this);
    };
    UComponent.prototype.reUse = function () {
        _super.prototype.reUse.call(this);
        this.state = Enums_1.UpdateState.Active;
        this.owner = null;
    };
    UComponent.prototype.init = function (ac, id) {
        if (id === void 0) { id = -1; }
        _super.prototype.init.call(this, ac);
        if (!ac) {
            console.warn("actor can't be null");
            return;
        }
        this.owner = ac;
        this.owner.addComponent(this);
        if (id == -1) {
            id = Number(this.owner.world.GenerateNewId());
        }
        this.id = id + "";
        this.onLoad(ac);
    };
    UComponent.prototype.onLoad = function (ac) {
        this.owner = ac;
        if (this.owner.getRootComp() == null) {
            this.owner.setRootComp(this);
        }
        this.owner.world.actorSystem.registerObj(this);
    };
    UComponent.prototype.processInput = function (input) {
    };
    UComponent.prototype.update = function (dt) {
    };
    UComponent.prototype.drawDebug = function (graphic) {
    };
    UComponent.prototype.destory = function () {
        this.owner.removeComponent(this);
    };
    UComponent.prototype.onDestory = function () {
        if (this.owner.getRootComp() == this) {
            this.owner.setRootComp(null);
        }
        // this.owner = null;
    };
    UComponent.prototype.isRoot = function () {
        return this == this.owner.getRootComp();
    };
    UComponent.prototype.isMainScene = function () {
        return false;
    };
    UComponent.prototype.isCollision = function () {
        return false;
    };
    UComponent.prototype.onComputeTransfor = function () {
    };
    var UComponent_1;
    UComponent = UComponent_1 = __decorate([
        XBase_1.xclass(UComponent_1)
    ], UComponent);
    return UComponent;
}(Object_1.default));
exports.default = UComponent;
