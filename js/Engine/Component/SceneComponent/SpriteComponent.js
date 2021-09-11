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
var XBase_1 = require("../../Engine/ReflectSystem/XBase");
var UMath_1 = require("../../Engine/UMath");
var SceneComponent_1 = __importDefault(require("./SceneComponent"));
/**
 * 精灵图片组件
 * 挂载到Actor上，以显示图片
 */
var USpriteComponent = /** @class */ (function (_super) {
    __extends(USpriteComponent, _super);
    function USpriteComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.textureName = "";
        _this.needUpdateTexture = true;
        _this._color = UMath_1.UColor.WHITE();
        return _this;
    }
    USpriteComponent_1 = USpriteComponent;
    Object.defineProperty(USpriteComponent.prototype, "color", {
        get: function () {
            return this._color;
        },
        set: function (value) {
            this._color = value;
            if (this.owner.world.isClient) {
                this.owner.world.gameInstance.getWorldView().onSpriteCompSetColor(this);
            }
        },
        enumerable: false,
        configurable: true
    });
    USpriteComponent.prototype.unUse = function () {
        _super.prototype.unUse.call(this);
    };
    USpriteComponent.prototype.reUse = function () {
        _super.prototype.reUse.call(this);
        this._color = UMath_1.UColor.WHITE();
        this.needUpdateTexture = true;
        this.textureName = "";
    };
    USpriteComponent.prototype.register = function () {
        this.owner.world.actorSystem.registerSprite(this);
    };
    USpriteComponent.prototype.unRegister = function () {
        this.owner.world.actorSystem.unRegisterSprite(this);
    };
    USpriteComponent.prototype.markTextureDirty = function () {
        this.needUpdateTexture = true;
    };
    USpriteComponent.prototype.onComputeTransfor = function () {
        _super.prototype.onComputeTransfor.call(this);
    };
    USpriteComponent.prototype.getTexture = function () {
        return this.textureName;
    };
    USpriteComponent.prototype.setTexture = function (tex) {
        this.textureName = tex;
        this.markTextureDirty();
    };
    //4.
    USpriteComponent.prototype.draw = function (graphic) {
        _super.prototype.draw.call(this, graphic);
        if (this.needUpdateTexture) {
            this.owner.world.gameInstance.getWorldView().onDrawTexture(this);
            this.needUpdateTexture = false;
        }
    };
    //5.
    USpriteComponent.prototype.destory = function () {
        _super.prototype.destory.call(this);
    };
    var USpriteComponent_1;
    __decorate([
        XBase_1.xproperty(String)
    ], USpriteComponent.prototype, "textureName", void 0);
    __decorate([
        XBase_1.xproperty(UMath_1.UColor)
    ], USpriteComponent.prototype, "_color", void 0);
    USpriteComponent = USpriteComponent_1 = __decorate([
        XBase_1.xclass(USpriteComponent_1)
    ], USpriteComponent);
    return USpriteComponent;
}(SceneComponent_1.default));
exports.default = USpriteComponent;
