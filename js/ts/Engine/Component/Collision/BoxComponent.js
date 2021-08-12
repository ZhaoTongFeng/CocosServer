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
var UBoxComponent = /** @class */ (function (_super) {
    __extends(UBoxComponent, _super);
    function UBoxComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.worldAabb = new UMath_1.AABB();
        return _this;
    }
    UBoxComponent_1 = UBoxComponent;
    UBoxComponent.prototype.unUse = function () {
        _super.prototype.unUse.call(this);
    };
    UBoxComponent.prototype.reUse = function () {
        _super.prototype.reUse.call(this);
        this.worldAabb.max.x = 0;
        this.worldAabb.max.y = 0;
        this.worldAabb.min.x = 0;
        this.worldAabb.min.y = 0;
    };
    UBoxComponent.prototype.onComputeTransfor = function () {
        var pos = this.owner.getPosition();
        var size = this.owner.getSize();
        var scale = this.owner.getScale();
        this.worldAabb.min.x = pos.x - size.x / 2 * scale.x + this.padding.x;
        this.worldAabb.min.y = pos.y - size.y / 2 * scale.y + this.padding.y;
        this.worldAabb.max.x = this.worldAabb.min.x + size.x * scale.x - this.padding.x;
        this.worldAabb.max.y = this.worldAabb.min.y + size.y * scale.y - this.padding.y;
    };
    UBoxComponent.prototype.drawDebug = function (graphic) {
        if (this.owner.world.isDebug) {
            _super.prototype.drawDebug.call(this, graphic);
            graphic.drawRect(this.worldAabb.min.x, this.worldAabb.min.y, this.owner.getSize().x * this.owner.getScale().x, this.owner.getSize().y * this.owner.getScale().y, UMath_1.UColor.YELLOW());
        }
    };
    UBoxComponent.prototype.getMinX = function () {
        return this.worldAabb.min.x;
    };
    UBoxComponent.prototype.getMaxX = function () {
        return this.worldAabb.max.x;
    };
    var UBoxComponent_1;
    __decorate([
        XBase_1.xproperty(UMath_1.AABB)
    ], UBoxComponent.prototype, "worldAabb", void 0);
    UBoxComponent = UBoxComponent_1 = __decorate([
        XBase_1.xclass(UBoxComponent_1)
    ], UBoxComponent);
    return UBoxComponent;
}(CollisionComponent_1.default));
exports.default = UBoxComponent;
