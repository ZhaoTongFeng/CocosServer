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
var Component_1 = __importDefault(require("../../../Engine/Component/Component"));
var XBase_1 = require("../../../Engine/Engine/ReflectSystem/XBase");
var UMath_1 = require("../../../Engine/Engine/UMath");
/**
 * 飞船格子物品
 */
var UShipItem = /** @class */ (function (_super) {
    __extends(UShipItem, _super);
    function UShipItem() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //网格中位置
        _this.itemPosition = UMath_1.uu.v2();
        //生命值，每一个道具都有生命值，但是不一定有攻击力等属性
        _this.health = 100;
        return _this;
    }
    UShipItem_1 = UShipItem;
    UShipItem.prototype.setItemPosition = function (x, y) {
        this.itemPosition.x = x;
        this.itemPosition.y = y;
    };
    UShipItem.prototype.getItemPosition = function () {
        return this.itemPosition;
    };
    UShipItem.prototype.unUse = function () {
        _super.prototype.unUse.call(this);
    };
    UShipItem.prototype.reUse = function () {
        _super.prototype.reUse.call(this);
        this.itemPosition.x = 0;
        this.itemPosition.y = 0;
        this.health = 100;
    };
    UShipItem.prototype.init = function (obj) {
        _super.prototype.init.call(this, obj);
    };
    UShipItem.prototype.update = function (dt) {
    };
    UShipItem.prototype.drawDebug = function (graphic) {
    };
    UShipItem.prototype.destory = function () {
        _super.prototype.destory.call(this);
    };
    var UShipItem_1;
    UShipItem = UShipItem_1 = __decorate([
        XBase_1.xclass(UShipItem_1)
    ], UShipItem);
    return UShipItem;
}(Component_1.default));
exports.default = UShipItem;
