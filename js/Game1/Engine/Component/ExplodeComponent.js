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
var SceneComponent_1 = __importDefault(require("../../../Engine/Component/SceneComponent/SceneComponent"));
var XBase_1 = require("../../../Engine/Engine/ReflectSystem/XBase");
var UMath_1 = require("../../../Engine/Engine/UMath");
var UExplodeComponent = /** @class */ (function (_super) {
    __extends(UExplodeComponent, _super);
    function UExplodeComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._offset = UMath_1.uu.v2();
        _this.timer = 0;
        _this.deadTime = 1;
        return _this;
    }
    UExplodeComponent_1 = UExplodeComponent;
    Object.defineProperty(UExplodeComponent.prototype, "offset", {
        get: function () {
            return this._offset;
        },
        set: function (value) {
            //将绝对坐标转换成相对坐标
            var dir = this.owner.getPosition().normalize();
            dir.mulSelf(16);
            this._offset = value.sub(this.owner.getPosition()).mul(0.5);
        },
        enumerable: false,
        configurable: true
    });
    UExplodeComponent.prototype.unUse = function () {
        _super.prototype.unUse.call(this);
    };
    UExplodeComponent.prototype.reUse = function () {
        _super.prototype.reUse.call(this);
        this._offset.x = 0;
        this._offset.y = 0;
        this.timer = 0;
        this.deadTime = 1;
    };
    UExplodeComponent.prototype.update = function (dt) {
        _super.prototype.update.call(this, dt);
        this.timer += dt;
        if (this.timer > this.deadTime) {
            this.destory();
        }
    };
    UExplodeComponent.prototype.drawDebug = function (graphic) {
        _super.prototype.drawDebug.call(this, graphic);
        var center = this.owner.getPosition().add(this.offset);
        var start = center.clone();
        var end = center.clone();
        var length = 20;
        var half = 10;
        start.x -= half;
        end.x += half;
        graphic.drawLine(start, end, UMath_1.UColor.WHITE());
        start.x += half;
        end.x -= half;
        start.y += half;
        end.y -= half;
        graphic.drawLine(start, end, UMath_1.UColor.WHITE());
        // graphic.drawCircle(center.x, center.y, 10);
    };
    var UExplodeComponent_1;
    UExplodeComponent = UExplodeComponent_1 = __decorate([
        XBase_1.xclass(UExplodeComponent_1)
    ], UExplodeComponent);
    return UExplodeComponent;
}(SceneComponent_1.default));
exports.default = UExplodeComponent;
