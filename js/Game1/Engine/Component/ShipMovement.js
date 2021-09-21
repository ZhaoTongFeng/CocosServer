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
 * 飞船移动组件
 * 将移动结果直接体验到SceneComponent上，
 * 让SceneComponent去同步数据，尽量不要在这些逻辑组件上去做操作。
 */
var ShipMovement = /** @class */ (function (_super) {
    __extends(ShipMovement, _super);
    function ShipMovement() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //反弹减速百分比
        _this.rate = 0.5;
        return _this;
    }
    ShipMovement_1 = ShipMovement;
    //无论是客户端还是服务端都会调用这个，联机模式下，客户端没有必要去做这个操作。
    ShipMovement.prototype.processInput = function (input) {
        //用自己控制器的输入，更新本地状态
        var con = this.owner.controller;
        if (con) {
            var moveRate = con.moveForce;
            //摇杆不为0，则启用引擎，提供推力
            //否则关闭引擎，不提供推力
            var moveDir = con.moveDirection;
            this.setMoveForce(moveDir.mul(moveRate * this.max_force));
        }
    };
    ShipMovement.prototype.update = function (dt) {
        //服务器更新状态
        if (!this.owner.world.gameInstance.bStandAlone && this.owner.world.isClient) {
            return;
        }
        //速度和方向分开处理
        //TODO 用引擎的动力 更新加速度
        var ship = this.owner;
        var engine = ship.getEngine();
        if (engine) {
            var power = engine.movePower;
        }
        //TODO 以摇杆方向为目标方向，根据当前的角速度进行差值
        //更新速度
        if (this.force.x != 0 || this.force.y != 0) {
            this.acc.x = UMath_1.UMath.clamp(this.acc.x + this.force.x / this.mg, -this.max_acc, this.max_acc);
            this.acc.y = UMath_1.UMath.clamp(this.acc.y + this.force.y / this.mg, -this.max_acc, this.max_acc);
            this.velocity.x = UMath_1.UMath.clamp(this.velocity.x + this.acc.x * dt / 2, -this.max_vel, this.max_vel);
            this.velocity.y = UMath_1.UMath.clamp(this.velocity.y + this.acc.y * dt / 2, -this.max_vel, this.max_vel);
        }
        else {
            this.slowdown(dt);
        }
        if (this.velocity.x != 0 || this.velocity.y != 0) {
            //更新位置
            var pos = this.owner.getPosition();
            pos.x += this.velocity.x * dt;
            pos.y += this.velocity.y * dt;
            this.owner.setPosition(pos);
            //更新角度
            this.direction = this.velocity.normalize();
            var angle = this.direction.signAngle(UMath_1.uu.v2(0, -1));
            var rot = 180 - angle * 180 / Math.PI;
            this.owner.setRotation(rot);
        }
    };
    /**
     * 速度逐渐归零
     * 归零的加速度有待研究，理论上太空没有阻力，除非自己减速，否则会一直往前飞。
     * @param dt
     */
    ShipMovement.prototype.slowdown = function (dt) {
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
    ShipMovement.prototype.reback = function () {
        // let n = UVec2.ZERO();
        // let dot = this.velocity.dot(n);
        // this.direction = this.velocity.sub(n.mul(2 * dot));
        // if (n.x != 0) { this.velocity.x = n.x * Math.abs(this.direction.x * this.velocity.x * this.rate) }
        // if (n.y != 0) { this.velocity.y = n.y * Math.abs(this.direction.y * this.velocity.y * this.rate) }
    };
    var ShipMovement_1;
    ShipMovement = ShipMovement_1 = __decorate([
        XBase_1.xclass(ShipMovement_1)
    ], ShipMovement);
    return ShipMovement;
}(MovementComponent_1.default));
exports.default = ShipMovement;
