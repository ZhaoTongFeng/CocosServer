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
var Pawn_1 = __importDefault(require("../../../Engine/Actor/Pawn/Pawn"));
var XBase_1 = require("../../../Engine/Engine/ReflectSystem/XBase");
var UMath_1 = require("../../../Engine/Engine/UMath");
/**
 * 飞船
 * 包含一个网格插槽，能插上各种ShipItem
 */
var AShip = /** @class */ (function (_super) {
    __extends(AShip, _super);
    function AShip() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //战斗属性
        _this.battleComp = null;
        //装备插槽 尺寸
        _this.itemSize = UMath_1.uu.v2(1, 3);
        //装备插槽 存储
        _this.items = [];
        //护盾
        _this.shieldComp = null;
        //主武器
        _this.weaponComp = null;
        //引擎
        _this.engineComp = null;
        return _this;
    }
    AShip_1 = AShip;
    AShip.prototype.setBattleComp = function (comp) { this.battleComp = comp; };
    AShip.prototype.getBattleComp = function () { return this.battleComp; };
    AShip.prototype.setShield = function (comp) { this.shieldComp = comp; };
    AShip.prototype.getShield = function () { return this.shieldComp; };
    AShip.prototype.setWeapon = function (comp) { this.weaponComp = comp; };
    AShip.prototype.getWeapon = function () { return this.weaponComp; };
    AShip.prototype.setEngine = function (comp) { this.engineComp = comp; };
    AShip.prototype.getEngine = function () { return this.engineComp; };
    AShip.prototype.setItemsSize = function (x, y) {
        this.itemSize.y = y;
        this.itemSize.x = x;
    };
    AShip.prototype.getItemSize = function () {
        return this.itemSize;
    };
    AShip.prototype.addItem = function (item) {
        var itemPos = item.getItemPosition();
        this.items[itemPos.y][itemPos.x] = item;
    };
    AShip.prototype.removeItem = function (item) {
        var itemPos = item.getItemPosition();
        this.items[itemPos.y][itemPos.x] = null;
    };
    AShip.prototype.unUse = function () {
        _super.prototype.unUse.call(this);
    };
    AShip.prototype.reUse = function () {
        _super.prototype.reUse.call(this);
        this.battleComp = null;
        this.itemSize.x = 0;
        this.itemSize.y = 0;
        this.items = [];
    };
    AShip.prototype.init = function (obj) {
        _super.prototype.init.call(this, obj);
        for (var i = 0; i < this.itemSize.y; i++) {
            this.items.push([]);
        }
    };
    AShip.prototype.processSelfInput = function (input) {
    };
    AShip.prototype.updateActor = function (dt) {
    };
    var AShip_1;
    AShip = AShip_1 = __decorate([
        XBase_1.xclass(AShip_1)
    ], AShip);
    return AShip;
}(Pawn_1.default));
exports.default = AShip;
