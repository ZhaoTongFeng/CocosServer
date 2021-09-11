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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var SphereComponent_1 = __importDefault(require("../../../Engine/Component/Collision/SphereComponent"));
var SpriteComponent_1 = __importDefault(require("../../../Engine/Component/SceneComponent/SpriteComponent"));
var XBase_1 = require("../../../Engine/Engine/ReflectSystem/XBase");
var UMath_1 = require("../../../Engine/Engine/UMath");
var BulletProject_1 = __importDefault(require("../Actor/BulletProject"));
var BulletMovement_1 = __importDefault(require("./BulletMovement"));
var ShipWeapon_1 = __importStar(require("./ShipWeapon"));
var UShipWeaponProject = /** @class */ (function (_super) {
    __extends(UShipWeaponProject, _super);
    function UShipWeaponProject() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.textureName = "weapon/proj/proj";
        _this.firing = false;
        return _this;
    }
    UShipWeaponProject_1 = UShipWeaponProject;
    UShipWeaponProject.prototype.unUse = function () {
        _super.prototype.unUse.call(this);
    };
    UShipWeaponProject.prototype.reUse = function () {
        _super.prototype.reUse.call(this);
        this.textureName = "weapon/proj/proj";
    };
    UShipWeaponProject.prototype.init = function (obj) {
        _super.prototype.init.call(this, obj);
    };
    UShipWeaponProject.prototype.drawDebug = function (graphic) {
    };
    UShipWeaponProject.prototype.destory = function () {
        _super.prototype.destory.call(this);
    };
    UShipWeaponProject.prototype.update = function (dt) {
        if (this.owner.world.isClient) {
            return;
        }
        switch (this.fireState) {
            case ShipWeapon_1.FireState.READY: {
                //等待阶段
                break;
            }
            case ShipWeapon_1.FireState.FIRING: {
                //发射中
                this.timer += dt;
                if (this.timer > 1 / this.fequence) {
                    this.timer = 0;
                    this.onFire();
                }
                break;
            }
            case ShipWeapon_1.FireState.STOP: {
                //冷却阶段
                this.fireState = ShipWeapon_1.FireState.READY;
                break;
            }
        }
    };
    /**
     * 开始发射
     * 开始计时
     */
    UShipWeaponProject.prototype.startFire = function () {
        if (this.fireState == ShipWeapon_1.FireState.READY) {
            this.fireState = ShipWeapon_1.FireState.FIRING;
            console.log("开火");
        }
    };
    /**
     * 结束开火
     */
    UShipWeaponProject.prototype.finishFire = function () {
        if (this.fireState == ShipWeapon_1.FireState.FIRING) {
            this.fireState = ShipWeapon_1.FireState.STOP;
            console.log("停火");
        }
    };
    //CLIENT
    UShipWeaponProject.prototype.receiveData = function (obj) {
        if (obj["opt"] == "fire") {
            var wId = obj["wId"];
            var id = obj["id"];
            var rand = obj["rand"];
            var px = obj["px"];
            var py = obj["py"];
            var vx = obj["vx"];
            var vy = obj['vy'];
            var mId = obj["mId"];
            var sId = obj["sId"];
            this.owner.world.setCurrentGenID(Number(wId));
            var bullet = new BulletProject_1.default();
            bullet.init(this.owner.world, id);
            //显示
            var spriteComp = new SpriteComponent_1.default();
            spriteComp.init(bullet, sId);
            spriteComp.setTexture(this.textureName + rand);
            spriteComp.needSync = false;
            //碰撞
            // let collision = bullet.spawnComponent(USphereComponent);
            // collision.setPadding(8);
            //基本属性
            bullet.setScale(UMath_1.uu.v2(0.5, 0.5));
            bullet.setPosition(UMath_1.uu.v2(px, py));
            bullet.setOwner(this.owner);
            //移动
            bullet.movementComponent = new BulletMovement_1.default();
            bullet.movementComponent.init(bullet, mId);
            bullet.movementComponent.velocity.x = vx;
            bullet.movementComponent.velocity.y = vy;
        }
    };
    /**
     * 每次发射
     * 开火=生成子弹+挂载移动组件
     */
    UShipWeaponProject.prototype.onFire = function () {
        var bullet = this.owner.world.spawn(BulletProject_1.default);
        var id = bullet.id;
        //显示
        var spriteComp = bullet.spawnComponent(SpriteComponent_1.default);
        var rand = 1 + Math.floor(Math.random() * 2.9);
        spriteComp.setTexture(this.textureName + rand);
        spriteComp.needSync = false;
        //碰撞
        var collision = bullet.spawnComponent(SphereComponent_1.default);
        // collision.setPadding(8);
        //基本属性
        bullet.setScale(UMath_1.uu.v2(0.5, 0.5));
        var pos = this.owner.getPosition().clone();
        bullet.setPosition(pos);
        bullet.setOwner(this.owner);
        //移动
        bullet.movementComponent = bullet.spawnComponent(BulletMovement_1.default);
        // //1.摇杆方向发射子弹
        // let direction = this.fireDirection;
        //2.朝target方向发射
        var direction = UMath_1.uu.v2(0, 1);
        direction = direction.rotate(UMath_1.UMath.toRadians(this.owner.getRotation()));
        var speed = 500;
        var vx = direction.x * speed;
        var vy = direction.y * speed;
        bullet.movementComponent.velocity.x = vx;
        bullet.movementComponent.velocity.y = vy;
        var obj = {
            wId: this.owner.world.getCurrentGenID(),
            opt: "fire",
            id: id,
            sId: spriteComp.id,
            mId: bullet.movementComponent.id,
            rand: rand,
            px: pos.x,
            py: pos.y,
            vx: vx,
            vy: vy
        };
        this.owner.world.gameInstance.sendGameData(obj, this);
    };
    //SERVER
    UShipWeaponProject.prototype.processInput = function (input) {
        if (!this.owner.world.isClient) {
            var con = this.owner.controller;
            if (con) {
                this.firing = con.isFire;
                if (this.firing) {
                    this.startFire();
                }
                else {
                    this.finishFire();
                }
            }
        }
    };
    var UShipWeaponProject_1;
    UShipWeaponProject = UShipWeaponProject_1 = __decorate([
        XBase_1.xclass(UShipWeaponProject_1)
    ], UShipWeaponProject);
    return UShipWeaponProject;
}(ShipWeapon_1.default));
exports.default = UShipWeaponProject;
