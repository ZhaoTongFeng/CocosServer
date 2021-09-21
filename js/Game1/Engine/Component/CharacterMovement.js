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
var MovementComponent_1 = __importDefault(require("../../../Engine/Component/Movement/MovementComponent"));
var XBase_1 = require("../../../Engine/Engine/ReflectSystem/XBase");
var UMath_1 = require("../../../Engine/Engine/UMath");
/**
 * 移动组件
 * 将移动结果直接体验到SceneComponent上，让SceneComponent去同步数据，尽量不要在这些逻辑组件上去做操作。
 */
var UCharacterMovement = /** @class */ (function (_super) {
    __extends(UCharacterMovement, _super);
    function UCharacterMovement() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //反弹减速百分比
        _this.rate = 0.5;
        return _this;
    }
    UCharacterMovement_1 = UCharacterMovement;
    //无论是客户端还是服务端都会调用这个，联机模式下，客户端没有必要去做这个操作。
    UCharacterMovement.prototype.processInput = function (input) {
        //用自己控制器的输入，更新本地状态
        var con = this.owner.controller;
        if (con) {
            var moveDir = con.moveDirection;
            var moveRate = con.moveForce;
            this.setMoveForce(moveDir.mul(moveRate));
        }
    };
    UCharacterMovement.prototype.update = function (dt) {
        //服务器更新状态
        if (this.owner.world.isClient) {
            return;
        }
        //限制力度范围
        var forceRate = this.force.length();
        if (forceRate != 0) {
            var forceDir = this.force.normalize();
            this.force = forceDir.mul(UMath_1.UMath.clamp(forceRate, -this.max_force, this.max_force));
            this.acc.x = UMath_1.UMath.clamp(this.acc.x + this.force.x / this.mg, -this.max_acc, this.max_acc);
            this.acc.y = UMath_1.UMath.clamp(this.acc.y + this.force.y / this.mg, -this.max_acc, this.max_acc);
            this.velocity.x = UMath_1.UMath.clamp(this.velocity.x + this.acc.x * dt / 2, -this.max_vel, this.max_vel);
            this.velocity.y = UMath_1.UMath.clamp(this.velocity.y + this.acc.y * dt / 2, -this.max_vel, this.max_vel);
        }
        else {
            this.slowdown(dt);
        }
        var pos = this.owner.getPosition();
        pos.x += this.velocity.x * dt;
        pos.y += this.velocity.y * dt;
        this.owner.setPosition(pos);
        //行进方向 计算出 当前角度
        if (this.velocity.x != 0 && this.velocity.y != 0) {
            this.direction = this.velocity.normalize();
            var size = this.owner.getSize();
            var scale = this.owner.getScale();
            var size_rel = size.clone();
            size_rel.x *= scale.x / 2;
            size_rel.y *= scale.y / 2;
            //更新角度
            var rot = 0;
            if (!this.direction.equalZero()) {
                var angle = this.direction.signAngle(UMath_1.uu.v2(0, -1));
                rot = 180 - angle * 180 / Math.PI;
                this.owner.setRotation(rot);
            }
        }
    };
    /**
     * 速度逐渐归零
     * 归零的加速度有待研究，理论上太空没有阻力，除非自己减速，否则会一直往前飞。
     * @param dt
     */
    UCharacterMovement.prototype.slowdown = function (dt) {
        var acc = this.max_acc / 10;
        if (this.velocity.x > 0) {
            this.velocity.x = Math.max(this.velocity.x - acc * dt, 0);
        }
        if (this.velocity.x < 0) {
            this.velocity.x = Math.min(this.velocity.x + acc * dt, 0);
        }
        if (this.velocity.y > 0) {
            this.velocity.y = Math.max(this.velocity.y - acc * dt, 0);
        }
        if (this.velocity.y < 0) {
            this.velocity.y = Math.min(this.velocity.y + acc * dt, 0);
        }
    };
    //当前移动方向反弹
    UCharacterMovement.prototype.reback = function () {
        // let n = UVec2.ZERO();
        // let dot = this.velocity.dot(n);
        // this.direction = this.velocity.sub(n.mul(2 * dot));
        // if (n.x != 0) { this.velocity.x = n.x * Math.abs(this.direction.x * this.velocity.x * this.rate) }
        // if (n.y != 0) { this.velocity.y = n.y * Math.abs(this.direction.y * this.velocity.y * this.rate) }
    };
    var UCharacterMovement_1;
    UCharacterMovement = UCharacterMovement_1 = __decorate([
        XBase_1.xclass(UCharacterMovement_1)
    ], UCharacterMovement);
    return UCharacterMovement;
}(MovementComponent_1.default));
exports.default = UCharacterMovement;
