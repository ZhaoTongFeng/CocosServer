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
var XBase_1 = require("../../Engine/ReflectSystem/XBase");
var UMath_1 = require("../../Engine/UMath");
var Component_1 = __importDefault(require("../Component"));
/**
 * 碰撞组件基类
 */
var UCollisionComponent = /** @class */ (function (_super) {
    __extends(UCollisionComponent, _super);
    function UCollisionComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.padding = UMath_1.uu.v2();
        return _this;
    }
    UCollisionComponent_1 = UCollisionComponent;
    UCollisionComponent.prototype.setPadding = function (pad) {
        if (pad instanceof UMath_1.UVec2) {
            this.padding = pad;
        }
        else {
            this.padding.x = pad;
        }
    };
    UCollisionComponent.prototype.unUse = function () {
        _super.prototype.unUse.call(this);
    };
    UCollisionComponent.prototype.reUse = function () {
        _super.prototype.reUse.call(this);
        this.padding.x = 0;
        this.padding.y = 0;
    };
    UCollisionComponent.prototype.init = function (obj) {
        _super.prototype.init.call(this, obj);
        if (!obj) {
            return;
        }
        if (this.owner.getCollision() == null) {
            this.owner.setCollision(this);
        }
        this.owner.world.collisionSystem.insert(this);
    };
    UCollisionComponent.prototype.onDestory = function () {
        this.owner.world.collisionSystem.delete(this);
        _super.prototype.onDestory.call(this);
    };
    UCollisionComponent.prototype.getMinX = function () {
    };
    UCollisionComponent.prototype.getMaxX = function () {
    };
    var UCollisionComponent_1;
    __decorate([
        XBase_1.xproperty(UMath_1.UVec2)
    ], UCollisionComponent.prototype, "padding", void 0);
    UCollisionComponent = UCollisionComponent_1 = __decorate([
        XBase_1.xclass(UCollisionComponent_1)
    ], UCollisionComponent);
    return UCollisionComponent;
}(Component_1.default));
exports.default = UCollisionComponent;
