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
var MovementComponent_1 = __importDefault(require("./MovementComponent"));
var UProjectComponent = /** @class */ (function (_super) {
    __extends(UProjectComponent, _super);
    function UProjectComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UProjectComponent_1 = UProjectComponent;
    UProjectComponent.prototype.init = function (obj) {
        _super.prototype.init.call(this, obj);
    };
    UProjectComponent.prototype.update = function (dt) {
        //F=MA
        this.acc.x += this.force.x / this.mg;
        this.acc.y += this.force.y / this.mg;
        this.acc.x = (this.acc.x > 0 ? 1 : -1) * UMath_1.UMath.clamp(Math.abs(this.acc.x), -this.max_acc, this.max_acc);
        this.acc.y = (this.acc.y > 0 ? 1 : -1) * UMath_1.UMath.clamp(Math.abs(this.acc.y), -this.max_acc, this.max_acc);
        //V=V0+AT/2
        this.velocity.x += this.acc.x * dt / 2;
        this.velocity.y += this.acc.y * dt / 2;
        this.velocity.x = (this.velocity.x > 0 ? 1 : -1) * UMath_1.UMath.clamp(Math.abs(this.velocity.x), -this.max_vel, this.max_vel);
        this.velocity.y = (this.velocity.y > 0 ? 1 : -1) * UMath_1.UMath.clamp(Math.abs(this.velocity.y), -this.max_vel, this.max_vel);
        //S=VT
        var pos = this.owner.getPosition();
        pos.x += this.velocity.x * dt;
        pos.y += this.velocity.y * dt;
        this.owner.setPosition(pos);
        //旋转
        this.direction = this.velocity.normalize();
        if (!this.direction.equalZero()) {
            var angle = this.direction.signAngle(UMath_1.uu.v2(0, -1));
            this.owner.setRotation(180 - angle * 180 / Math.PI);
        }
    };
    var UProjectComponent_1;
    UProjectComponent = UProjectComponent_1 = __decorate([
        XBase_1.xclass(UProjectComponent_1)
    ], UProjectComponent);
    return UProjectComponent;
}(MovementComponent_1.default));
exports.default = UProjectComponent;
