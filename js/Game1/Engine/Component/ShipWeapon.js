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
exports.FireState = exports.WeaponFactory = exports.DamageMode = exports.BulletUpdate = exports.WeaponTargetMode = exports.WeaponCrossMode = void 0;
var XBase_1 = require("../../../Engine/Engine/ReflectSystem/XBase");
var UMath_1 = require("../../../Engine/Engine/UMath");
var ShipItem_1 = __importDefault(require("./ShipItem"));
/**
 * 武器瞄准模式
 * 1.方向
 * 2.目标
 */
var WeaponCrossMode;
(function (WeaponCrossMode) {
    WeaponCrossMode[WeaponCrossMode["DIR"] = 0] = "DIR";
    WeaponCrossMode[WeaponCrossMode["TARGET"] = 1] = "TARGET";
})(WeaponCrossMode = exports.WeaponCrossMode || (exports.WeaponCrossMode = {}));
/**
 * 目标模式
 * 1.位置
 * 2.AShip
 * 3.Bullet
 */
var WeaponTargetMode;
(function (WeaponTargetMode) {
})(WeaponTargetMode = exports.WeaponTargetMode || (exports.WeaponTargetMode = {}));
/**
 * 子弹追踪模式
 * 不追踪
 * 追踪
 */
var BulletUpdate;
(function (BulletUpdate) {
    BulletUpdate[BulletUpdate["SINGLE"] = 0] = "SINGLE";
    BulletUpdate[BulletUpdate["FOLLOW"] = 1] = "FOLLOW";
})(BulletUpdate = exports.BulletUpdate || (exports.BulletUpdate = {}));
/**
 * 子弹伤害模式
 * 单个伤害
 * 范围伤害
 */
var DamageMode;
(function (DamageMode) {
})(DamageMode = exports.DamageMode || (exports.DamageMode = {}));
var WeaponFactory = /** @class */ (function () {
    function WeaponFactory() {
    }
    WeaponFactory.prototype.getWeapon = function () {
    };
    return WeaponFactory;
}());
exports.WeaponFactory = WeaponFactory;
/**
 * 发射状态
 * 准备就绪
 * 发射中
 * 冷却中
 */
var FireState;
(function (FireState) {
    FireState[FireState["READY"] = 0] = "READY";
    FireState[FireState["FIRING"] = 1] = "FIRING";
    FireState[FireState["STOP"] = 2] = "STOP";
})(FireState = exports.FireState || (exports.FireState = {}));
/**
 * 武器基类
 * 角色挂上这个武器，就能发射武器
 */
var UShipWeapon = /** @class */ (function (_super) {
    __extends(UShipWeapon, _super);
    function UShipWeapon() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //方向模式
        _this.mode = WeaponCrossMode.DIR;
        //1.方向
        _this.fireDirection = UMath_1.UVec2.ZERO();
        _this.fireRate = 0;
        //2.目标
        _this.target = UMath_1.uu.v2(0, 0);
        // protected target: AShip = null;
        // protected target: ABullet = null;
        //发射频率
        _this.timer = 0;
        _this.fequence = 5;
        //冷却
        _this.ac_timer = 0;
        _this.ac = 0;
        //过热0-1
        _this.hot = 0;
        //消耗
        _this.cost = 0;
        _this.fireState = FireState.READY;
        return _this;
    }
    UShipWeapon_1 = UShipWeapon;
    UShipWeapon.prototype.unUse = function () {
        _super.prototype.unUse.call(this);
    };
    UShipWeapon.prototype.reUse = function () {
        _super.prototype.reUse.call(this);
        this.mode = WeaponCrossMode.DIR;
        this.fireDirection.y = 0;
        this.fireDirection.x = 0;
        this.fireRate = 0;
        this.target.x = 0;
        this.target.y = 0;
        this.timer = 0;
        this.fequence = 0;
        this.ac_timer = 0;
        this.ac = 0;
        this.hot = 0;
        this.cost = 0;
        this.fireState = FireState.READY;
    };
    /**
     * 开始发射
     * 开始计时
     */
    UShipWeapon.prototype.startFire = function () {
        if (this.fireState == FireState.READY) {
            this.fireState = FireState.FIRING;
        }
    };
    /**
     * 每次发射
     * 开火=生成子弹+挂载移动组件
     */
    UShipWeapon.prototype.onFire = function () {
    };
    /**
     * 结束开火
     */
    UShipWeapon.prototype.finishFire = function () {
        this.fireState = FireState.STOP;
    };
    UShipWeapon.prototype.init = function (obj) {
        _super.prototype.init.call(this, obj);
    };
    UShipWeapon.prototype.processInput = function (input) {
    };
    UShipWeapon.prototype.update = function (dt) {
        switch (this.fireState) {
            case FireState.READY: {
                //等待阶段
                break;
            }
            case FireState.FIRING: {
                //发射中
                this.timer += dt;
                if (this.timer > 1 / this.fequence) {
                    this.timer = 0;
                    this.onFire();
                }
                break;
            }
            case FireState.STOP: {
                //冷却阶段
                break;
            }
        }
    };
    UShipWeapon.prototype.drawDebug = function (graphic) {
    };
    UShipWeapon.prototype.destory = function () {
        _super.prototype.destory.call(this);
    };
    var UShipWeapon_1;
    UShipWeapon = UShipWeapon_1 = __decorate([
        XBase_1.xclass(UShipWeapon_1)
    ], UShipWeapon);
    return UShipWeapon;
}(ShipItem_1.default));
exports.default = UShipWeapon;
