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
var Pawn_1 = __importDefault(require("../../Actor/Pawn/Pawn"));
var XBase_1 = require("../../Engine/ReflectSystem/XBase");
var UMath_1 = require("../../Engine/UMath");
var Component_1 = __importDefault(require("../Component"));
var UMovementComponent = /** @class */ (function (_super) {
    __extends(UMovementComponent, _super);
    function UMovementComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.mg = 10; //质量
        _this.max_force = 1000;
        _this.max_acc = 500;
        _this.max_vel = 200;
        _this.force = UMath_1.uu.v2(0, 0); //力 F = MA
        _this.acc = UMath_1.uu.v2(0, 0); //加速度 A = F/M
        _this.velocity = UMath_1.uu.v2(0, 0); //速度 V = V0 + A*T/2
        _this.direction = UMath_1.uu.v2(0, 0);
        return _this;
    }
    UMovementComponent_1 = UMovementComponent;
    UMovementComponent.prototype.unUse = function () {
        _super.prototype.unUse.call(this);
    };
    UMovementComponent.prototype.reUse = function () {
        _super.prototype.reUse.call(this);
        this.mg = 10;
        this.max_force = 1000;
        this.max_acc = 500;
        this.max_vel = 200;
        this.force.x = 0;
        this.force.y = 0;
        this.acc.x = 0;
        this.acc.y = 0;
        this.velocity.x = 0;
        this.velocity.y = 0;
        this.direction.x = 0;
        this.direction.y = 0;
    };
    UMovementComponent.prototype.onLoad = function (ac) {
        _super.prototype.onLoad.call(this, ac);
        if (ac instanceof Pawn_1.default) {
            ac.setMovement(this);
        }
    };
    UMovementComponent.prototype.addMoveForce = function (value) {
        this.force.addSelf(value.mul(this.max_force));
    };
    UMovementComponent.prototype.setMoveForce = function (value) {
        this.force = value.mulSelf(this.max_force);
    };
    UMovementComponent.prototype.processInput = function (input) {
    };
    UMovementComponent.prototype.update = function (dt) {
    };
    UMovementComponent.prototype.draw = function () {
    };
    UMovementComponent.prototype.onDestory = function () {
        if (this.owner instanceof Pawn_1.default) {
            this.owner.setMovement(null);
        }
        _super.prototype.onDestory.call(this);
    };
    var UMovementComponent_1;
    __decorate([
        XBase_1.xproperty(Number)
    ], UMovementComponent.prototype, "mg", void 0);
    __decorate([
        XBase_1.xproperty(Number)
    ], UMovementComponent.prototype, "max_force", void 0);
    __decorate([
        XBase_1.xproperty(Number)
    ], UMovementComponent.prototype, "max_acc", void 0);
    __decorate([
        XBase_1.xproperty(Number)
    ], UMovementComponent.prototype, "max_vel", void 0);
    __decorate([
        XBase_1.xproperty(UMath_1.UVec2)
    ], UMovementComponent.prototype, "force", void 0);
    __decorate([
        XBase_1.xproperty(UMath_1.UVec2)
    ], UMovementComponent.prototype, "acc", void 0);
    __decorate([
        XBase_1.xproperty(UMath_1.UVec2)
    ], UMovementComponent.prototype, "velocity", void 0);
    __decorate([
        XBase_1.xproperty(UMath_1.UVec2)
    ], UMovementComponent.prototype, "direction", void 0);
    UMovementComponent = UMovementComponent_1 = __decorate([
        XBase_1.xclass(UMovementComponent_1)
    ], UMovementComponent);
    return UMovementComponent;
}(Component_1.default));
exports.default = UMovementComponent;
