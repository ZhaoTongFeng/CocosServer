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
var ShipMovement2 = /** @class */ (function (_super) {
    __extends(ShipMovement2, _super);
    function ShipMovement2() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ShipMovement2_1 = ShipMovement2;
    ShipMovement2.prototype.clear = function () {
        this.velocity.x = 0;
        this.velocity.y = 0;
    };
    ShipMovement2.prototype.processInput = function (input) {
        var con = this.owner.controller;
        if (!con) {
            return;
        }
        var moveRate = con.moveForce;
        var moveDir = con.moveDirection;
        this.velocity.x = this.max_vel * moveDir.x;
        this.velocity.y = this.max_vel * moveDir.y;
    };
    ShipMovement2.prototype.update = function (dt) {
        //服务器更新状态
        if (!this.owner.world.gameInstance.bStandAlone && this.owner.world.isClient) {
            return;
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
    var ShipMovement2_1;
    ShipMovement2 = ShipMovement2_1 = __decorate([
        XBase_1.xclass(ShipMovement2_1)
    ], ShipMovement2);
    return ShipMovement2;
}(MovementComponent_1.default));
exports.default = ShipMovement2;
