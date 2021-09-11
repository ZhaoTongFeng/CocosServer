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
Object.defineProperty(exports, "__esModule", { value: true });
var XBase_1 = require("../../../Engine/Engine/ReflectSystem/XBase");
var UMath_1 = require("../../../Engine/Engine/UMath");
var ShipWeapon_1 = __importStar(require("./ShipWeapon"));
var UShipWeaponLaser = /** @class */ (function (_super) {
    __extends(UShipWeaponLaser, _super);
    function UShipWeaponLaser() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.holdTime = 10;
        _this.holdTimer = 0;
        _this.stopTime = 0.5;
        _this.stopTimer = 0;
        return _this;
    }
    UShipWeaponLaser_1 = UShipWeaponLaser;
    UShipWeaponLaser.prototype.unUse = function () {
        _super.prototype.unUse.call(this);
    };
    UShipWeaponLaser.prototype.reUse = function () {
        _super.prototype.reUse.call(this);
        this.holdTime = 10;
        this.holdTimer = 0;
        this.stopTime = 0.5;
        this.stopTimer = 0;
    };
    /**
     * 开始发射
     * 开始计时
     */
    UShipWeaponLaser.prototype.startFire = function () {
        if (this.fireState == ShipWeapon_1.FireState.READY) {
            this.fireState = ShipWeapon_1.FireState.FIRING;
        }
    };
    /**
     * 每次发射
     * 开火=生成子弹+挂载移动组件
     */
    UShipWeaponLaser.prototype.onFire = function () {
    };
    /**
     * 结束开火
     */
    UShipWeaponLaser.prototype.finishFire = function () {
        this.fireState = ShipWeapon_1.FireState.STOP;
    };
    UShipWeaponLaser.prototype.init = function (obj) {
        _super.prototype.init.call(this, obj);
        this.fequence = 50;
    };
    UShipWeaponLaser.prototype.processInput = function (input) {
    };
    UShipWeaponLaser.prototype.update = function (dt) {
        switch (this.fireState) {
            case ShipWeapon_1.FireState.READY: {
                //等待阶段
                this.fireState = ShipWeapon_1.FireState.FIRING;
                // this.holdTimer += dt;
                // if (this.holdTimer > this.holdTime) {
                //     this.holdTimer = 0;
                //     this.fireState = FireState.FIRING
                // }
                break;
            }
            case ShipWeapon_1.FireState.FIRING: {
                //发射中
                this.timer += dt;
                if (this.timer > this.holdTime) {
                    this.timer = 0;
                    this.fireState = ShipWeapon_1.FireState.STOP;
                }
                break;
            }
            case ShipWeapon_1.FireState.STOP: {
                //冷却阶段
                this.stopTimer += dt;
                if (this.stopTimer > this.stopTime) {
                    this.stopTimer = 0;
                    this.fireState = ShipWeapon_1.FireState.READY;
                }
                break;
            }
        }
    };
    UShipWeaponLaser.prototype.drawDebug = function (graphic) {
        if (this.fireState == ShipWeapon_1.FireState.FIRING) {
            var start = this.owner.getPosition();
            var end = this.target;
            graphic.drawLine(start, end, UMath_1.UColor.WHITE(), 10);
        }
    };
    UShipWeaponLaser.prototype.destory = function () {
        _super.prototype.destory.call(this);
    };
    var UShipWeaponLaser_1;
    UShipWeaponLaser = UShipWeaponLaser_1 = __decorate([
        XBase_1.xclass(UShipWeaponLaser_1)
    ], UShipWeaponLaser);
    return UShipWeaponLaser;
}(ShipWeapon_1.default));
exports.default = UShipWeaponLaser;
