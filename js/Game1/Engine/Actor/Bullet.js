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
var Actor_1 = __importDefault(require("../../../Engine/Actor/Actor"));
var XBase_1 = require("../../../Engine/Engine/ReflectSystem/XBase");
/**
 * 飞行类子弹
 */
var ABullet = /** @class */ (function (_super) {
    __extends(ABullet, _super);
    function ABullet() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //攻击力
        _this.attack = 0;
        //自动销毁
        _this.timer = 0;
        _this.deadTime = 3;
        //发射者
        _this.owner = null;
        return _this;
    }
    ABullet_1 = ABullet;
    ABullet.prototype.unUse = function () {
        _super.prototype.unUse.call(this);
    };
    ABullet.prototype.reUse = function () {
        _super.prototype.reUse.call(this);
        this.owner = null;
        this.attack = 0;
        this.timer = 0;
        this.deadTime = 3;
    };
    ABullet.prototype.setOwner = function (pawn) {
        this.owner = pawn;
    };
    ABullet.prototype.getOwner = function () {
        return this.owner;
    };
    ABullet.prototype.updateActor = function (dt) {
        this.timer += dt;
        var pos = this.getPosition();
        if (this.timer > this.deadTime) {
            this.destory();
            return;
        }
        // let winSize = this.world.gameInstance.getWorldView().winSize;
        // if (pos.x < winSize.x * -1 || pos.x > winSize.x || pos.y > winSize.y || pos.y < winSize.y * -1) {
        //     this.destory();
        //     return;
        // }
    };
    var ABullet_1;
    ABullet = ABullet_1 = __decorate([
        XBase_1.xclass(ABullet_1)
    ], ABullet);
    return ABullet;
}(Actor_1.default));
exports.default = ABullet;
