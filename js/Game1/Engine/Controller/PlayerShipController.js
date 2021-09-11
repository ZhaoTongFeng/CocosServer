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
var PlayerController_1 = __importDefault(require("../../../Engine/Actor/Controller/PlayerController"));
var XBase_1 = require("../../../Engine/Engine/ReflectSystem/XBase");
var UMath_1 = require("../../../Engine/Engine/UMath");
/**
 * 玩家控制器
 * 响应玩家输入
 */
var APlayerShipController = /** @class */ (function (_super) {
    __extends(APlayerShipController, _super);
    function APlayerShipController() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.target = UMath_1.uu.v2(0, 0);
        _this.timer = 0;
        _this.fequence = 5;
        //移动方向
        _this.moveDirection = UMath_1.uu.v2();
        _this.moveForce = 0;
        //开火方向
        _this.fireDirection = UMath_1.UVec2.ZERO();
        _this.fireRate = 0;
        _this.flootRate = 1000;
        _this.isFire = false;
        return _this;
    }
    APlayerShipController_1 = APlayerShipController;
    APlayerShipController.prototype.unUse = function () {
        _super.prototype.unUse.call(this);
    };
    APlayerShipController.prototype.reUse = function () {
        _super.prototype.reUse.call(this);
        this.target.x = 0;
        this.target.y = 0;
        this.fireDirection.x = 0;
        this.fireDirection.y = 0;
        this.timer = 0;
        this.fequence = 5;
        this.fireRate = 0;
        this.isFire = false;
    };
    APlayerShipController.prototype.init = function (world) {
        _super.prototype.init.call(this, world);
    };
    //SERVER
    APlayerShipController.prototype.receiveData = function (obj) {
        if (obj["1"] != undefined) {
            this.moveForce = obj["1"] / this.flootRate;
        }
        if (obj["2"] != undefined && obj["3"] != undefined) {
            this.moveDirection.x = obj["2"] / this.flootRate;
            this.moveDirection.y = obj["3"] / this.flootRate;
        }
        if (obj["4"] != undefined) {
            this.isFire = obj["4"];
        }
    };
    //CLIENT
    APlayerShipController.prototype.processSelfInput = function (input) {
        if (this.world.isClient && this == this.world.playerController) {
            var obj = {};
            var needSend = false;
            if (this.moveForce != input.leftJoyRate) {
                this.moveForce = input.leftJoyRate;
                obj["1"] = Math.floor(this.moveForce * this.flootRate);
                needSend = true;
            }
            if (this.moveDirection.equals(input.leftJoyDir) == false) {
                obj["2"] = Math.floor(this.moveDirection.x * this.flootRate);
                obj["3"] = Math.floor(this.moveDirection.y * this.flootRate);
                this.moveDirection = input.leftJoyDir;
                needSend = true;
            }
            if (this.isFire != input.isPassFireButton) {
                this.isFire = input.isPassFireButton;
                obj["4"] = this.isFire;
                needSend = true;
            }
            if (needSend) {
                this.world.gameInstance.sendGameData(obj, this);
            }
        }
        //2.用点击位置设置目标方向
        // let pos = this.getPosition();
        // let dir = this.target.sub(pos).normalize();
        // if (input.clickPos != null) {
        //     this.target = input.clickPos;
        //     // console.log(input.clickPos.x, input.clickPos.y, pos.x, pos.y);
        // }
        // this.movementComponent.force.x += dir.x * this.movementComponent.max_force;
        // this.movementComponent.force.y += dir.y * this.movementComponent.max_force;
        // this.fireRate = input.rightJoyRate;
        // this.fireDirection = input.rightJoyDir;
    };
    APlayerShipController.prototype.updateActor = function (dt) {
        if (this.fireRate != 0) {
            this.timer += dt;
            if (this.timer > 1 / this.fequence) {
                this.timer = 0;
                this.fire();
            }
        }
        else {
            this.timer = 0;
        }
    };
    APlayerShipController.prototype.drawDebugActor = function (graphic) {
    };
    APlayerShipController.prototype.destory = function () {
        _super.prototype.destory.call(this);
    };
    APlayerShipController.prototype.fire = function () {
        // let bullet = this.world.spawn(ABullet);
        // let spriteComp = bullet.spawnComponent(USpriteComponent);
        // spriteComp.setTexture("bullet_1");
        // bullet.movementComponent = bullet.spawnComponent(UBulletMovement);
        // bullet.spawnComponent(USphereComponent);
        // bullet.setScale(uu.v2(0.5, 0.5));
        // bullet.setPosition(this.getPosition().clone());
        // bullet.owner = this;
        // // //1.摇杆方向发射子弹
        // // let direction = this.fireDirection;
        // // //2.朝target方向发射
        // // // let direction = this.target.sub(bullet.getPosition())
        // // // direction.normalizeSelf();
        // // let speed = 500;
        // // bullet.movementComponent.velocity.x = direction.x * speed
        // // bullet.movementComponent.velocity.y = direction.y * speed
    };
    var APlayerShipController_1;
    __decorate([
        XBase_1.xproperty(UMath_1.UVec2)
    ], APlayerShipController.prototype, "moveDirection", void 0);
    __decorate([
        XBase_1.xproperty(Number)
    ], APlayerShipController.prototype, "moveForce", void 0);
    __decorate([
        XBase_1.xproperty(UMath_1.UVec2)
    ], APlayerShipController.prototype, "fireDirection", void 0);
    __decorate([
        XBase_1.xproperty(Number)
    ], APlayerShipController.prototype, "fireRate", void 0);
    APlayerShipController = APlayerShipController_1 = __decorate([
        XBase_1.xclass(APlayerShipController_1)
    ], APlayerShipController);
    return APlayerShipController;
}(PlayerController_1.default));
exports.default = APlayerShipController;
