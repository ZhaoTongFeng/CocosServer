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
var UTextComponent = /** @class */ (function (_super) {
    __extends(UTextComponent, _super);
    function UTextComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.text = "";
        _this.textDirty = true;
        _this._color = UMath_1.UColor.WHITE();
        return _this;
    }
    UTextComponent_1 = UTextComponent;
    Object.defineProperty(UTextComponent.prototype, "color", {
        get: function () {
            return this._color;
        },
        set: function (value) {
            this._color = value;
            // if(this.owner.world.isClient){
            //     this.owner.world.gameInstance.getWorldView().onSpriteCompSetColor(this);
            // }
        },
        enumerable: false,
        configurable: true
    });
    UTextComponent.prototype.unUse = function () {
        _super.prototype.unUse.call(this);
    };
    UTextComponent.prototype.reUse = function () {
        _super.prototype.reUse.call(this);
        this._color = UMath_1.UColor.WHITE();
        this.textDirty = true;
        this.text = "";
    };
    UTextComponent.prototype.register = function () {
        this.owner.world.actorSystem.registerText(this);
    };
    UTextComponent.prototype.unRegister = function () {
        this.owner.world.actorSystem.unRegisterText(this);
    };
    UTextComponent.prototype.markDirty = function () {
        this.textDirty = true;
    };
    UTextComponent.prototype.getText = function () {
        return this.text;
    };
    UTextComponent.prototype.setText = function (tex) {
        this.text = tex;
        this.markDirty();
    };
    //4.
    UTextComponent.prototype.draw = function (graphic) {
        _super.prototype.draw.call(this, graphic);
        if (this.textDirty) {
            this.owner.world.gameInstance.getWorldView().onDrawText(this);
            this.textDirty = false;
        }
    };
    //5.
    UTextComponent.prototype.destory = function () {
        _super.prototype.destory.call(this);
    };
    var UTextComponent_1;
    __decorate([
        XBase_1.xproperty(String)
    ], UTextComponent.prototype, "text", void 0);
    __decorate([
        XBase_1.xproperty(UMath_1.UColor)
    ], UTextComponent.prototype, "_color", void 0);
    UTextComponent = UTextComponent_1 = __decorate([
        XBase_1.xclass(UTextComponent_1)
    ], UTextComponent);
    return UTextComponent;
}(SceneComponent_1.default));
exports.default = UTextComponent;
