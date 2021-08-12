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
var CollisionComponent_1 = __importDefault(require("./CollisionComponent"));
var USphereComponent = /** @class */ (function (_super) {
    __extends(USphereComponent, _super);
    function USphereComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.radius = 64;
        _this.center = UMath_1.uu.v2();
        _this.xMinMax = UMath_1.uu.v2(); //X轴最大和最小 用在碰撞检测前的排序
        return _this;
    }
    USphereComponent_1 = USphereComponent;
    USphereComponent.prototype.unUse = function () {
        _super.prototype.unUse.call(this);
    };
    USphereComponent.prototype.reUse = function () {
        _super.prototype.reUse.call(this);
        this.radius = 64;
        this.center.x = 0;
        this.center.y = 0;
        this.xMinMax.x = 0;
        this.xMinMax.y = 0;
    };
    USphereComponent.prototype.onComputeTransfor = function () {
        this.center = this.owner.getPosition();
        this.radius = this.owner.getSize().x / 2 * this.owner.getScale().x - this.padding.x;
        this.xMinMax.x = this.center.x - this.radius;
        this.xMinMax.y = this.center.x + this.radius;
    };
    USphereComponent.prototype.drawDebug = function (graphic) {
        if (this.owner.world.isDebug) {
            _super.prototype.drawDebug.call(this, graphic);
            graphic.drawCircle(this.center.x, this.center.y, this.radius, UMath_1.UColor.YELLOW());
        }
    };
    USphereComponent.prototype.getMinX = function () {
        return this.xMinMax.x;
    };
    USphereComponent.prototype.getMaxX = function () {
        return this.xMinMax.y;
    };
    var USphereComponent_1;
    __decorate([
        XBase_1.xproperty(Number)
    ], USphereComponent.prototype, "radius", void 0);
    __decorate([
        XBase_1.xproperty(UMath_1.UVec2)
    ], USphereComponent.prototype, "center", void 0);
    __decorate([
        XBase_1.xproperty(UMath_1.UVec2)
    ], USphereComponent.prototype, "xMinMax", void 0);
    USphereComponent = USphereComponent_1 = __decorate([
        XBase_1.xclass(USphereComponent_1)
    ], USphereComponent);
    return USphereComponent;
}(CollisionComponent_1.default));
exports.default = USphereComponent;
