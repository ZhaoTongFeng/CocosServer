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
var Component_1 = __importDefault(require("../../../Engine/Component/Component"));
var SpriteComponent_1 = __importDefault(require("../../../Engine/Component/SceneComponent/SpriteComponent"));
var XBase_1 = require("../../../Engine/Engine/ReflectSystem/XBase");
var UMath_1 = require("../../../Engine/Engine/UMath");
var Ship_1 = __importDefault(require("../Pawn/Ship"));
/**
 * 护盾
 */
var UShipShield = /** @class */ (function (_super) {
    __extends(UShipShield, _super);
    function UShipShield() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.spriteComp = null;
        _this.timer = 0;
        _this.hitTime = 0.5; //恢复原始颜色
        _this.hitColor = UMath_1.UColor.RED();
        _this.oldColor = UMath_1.UColor.WHITE();
        return _this;
    }
    UShipShield_1 = UShipShield;
    UShipShield.prototype.onHit = function () {
        this.timer = this.hitTime;
    };
    UShipShield.prototype.unUse = function () {
        _super.prototype.unUse.call(this);
    };
    UShipShield.prototype.reUse = function () {
        _super.prototype.reUse.call(this);
        this.timer = 0;
        this.hitTime = 0.5;
    };
    UShipShield.prototype.init = function (obj) {
        _super.prototype.init.call(this, obj);
        this.spriteComp = this.owner.spawnComponent(SpriteComponent_1.default);
        this.spriteComp.setTexture("shield_cover");
        if (this.owner instanceof Ship_1.default) {
            this.owner.setShield(this);
        }
    };
    UShipShield.prototype.update = function (dt) {
        if (this.spriteComp) {
            if (this.timer > 0) {
                this.timer -= dt;
                this.timer = UMath_1.UMath.clamp(this.timer, 0, this.hitTime);
                var rate = this.timer / this.hitTime; //0 old 1 hit;
                var r = UMath_1.UMath.lerp(this.oldColor.r, this.hitColor.r, rate);
                var g = UMath_1.UMath.lerp(this.oldColor.g, this.hitColor.g, rate);
                var b = UMath_1.UMath.lerp(this.oldColor.b, this.hitColor.b, rate);
                var a = UMath_1.UMath.lerp(this.oldColor.a, this.hitColor.a, rate);
                this.spriteComp.color = UMath_1.uu.color(r, g, b, a);
            }
        }
    };
    UShipShield.prototype.drawDebug = function (graphic) {
    };
    UShipShield.prototype.destory = function () {
        if (this.spriteComp) {
            this.spriteComp.destory();
        }
        this.spriteComp = null;
        if (this.owner instanceof Ship_1.default) {
            this.owner.setShield(null);
        }
        _super.prototype.destory.call(this);
    };
    var UShipShield_1;
    UShipShield = UShipShield_1 = __decorate([
        XBase_1.xclass(UShipShield_1)
    ], UShipShield);
    return UShipShield;
}(Component_1.default));
exports.default = UShipShield;
