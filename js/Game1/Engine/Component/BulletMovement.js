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
var ProjectComponent_1 = __importDefault(require("../../../Engine/Component/Movement/ProjectComponent"));
var XBase_1 = require("../../../Engine/Engine/ReflectSystem/XBase");
var UMath_1 = require("../../../Engine/Engine/UMath");
var UBulletMovement = /** @class */ (function (_super) {
    __extends(UBulletMovement, _super);
    function UBulletMovement() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.target = UMath_1.UVec2.ZERO();
        return _this;
    }
    UBulletMovement_1 = UBulletMovement;
    UBulletMovement.prototype.unUse = function () {
        _super.prototype.unUse.call(this);
    };
    UBulletMovement.prototype.reUse = function () {
        _super.prototype.reUse.call(this);
        this.target.x = 0;
        this.target.y = 0;
    };
    UBulletMovement.prototype.init = function (obj) {
        _super.prototype.init.call(this, obj);
    };
    //TODO 应该让Controller提供输入
    UBulletMovement.prototype.processInput = function (input) {
        if (!this.target.equals(UMath_1.UVec2.ZERO())) {
            //1.目标方向恒力
            var pos = this.owner.getPosition();
            var dir = this.target.sub(pos).normalize();
            this.force.x += dir.x * this.max_force;
            this.force.y += dir.y * this.max_force;
        }
    };
    UBulletMovement.prototype.update = function (dt) {
        //是否更新一次
        if (this.target.equalZero()) {
        }
        // //找到最近的Ac
        // let start = this.owner.getPosition();
        // let min = 9999999999;
        // let target: AActor = null;
        // this.owner.world.actors.forEach(actor => {
        //     let leng = start.sub(actor.getPosition()).lengthSqr();
        //     if (this.owner != actor && actor != this.owner && (actor instanceof ABullet) == false && leng < min) {
        //         target = actor;
        //         min = leng
        //     }
        // });
        // if (target) {
        //     this.target = target.getPosition()
        // }
        //更新输入
        _super.prototype.update.call(this, dt);
    };
    UBulletMovement.prototype.drawDebug = function (graphic) {
        if (this.owner.world.isDebug) {
            //当前位置->目标位置
            var start = this.owner.getPosition();
            var end = this.target;
            graphic.drawLine(start, end);
        }
    };
    var UBulletMovement_1;
    UBulletMovement = UBulletMovement_1 = __decorate([
        XBase_1.xclass(UBulletMovement_1)
    ], UBulletMovement);
    return UBulletMovement;
}(ProjectComponent_1.default));
exports.default = UBulletMovement;
