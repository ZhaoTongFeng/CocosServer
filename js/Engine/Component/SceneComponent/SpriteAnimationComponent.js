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
var SpriteComponent_1 = __importDefault(require("./SpriteComponent"));
/**
 * 精灵图片组件
 * 挂载到Actor上，以显示图片
 */
var USpriteAnimationComponent = /** @class */ (function (_super) {
    __extends(USpriteAnimationComponent, _super);
    function USpriteAnimationComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //动画ID
        _this.texIndex = null;
        _this.isLoop = true;
        _this.isFinish = true;
        _this.fps = 16;
        _this.frameTime = 1 / 16;
        _this.frameIndex = 0;
        _this.timer = 0;
        return _this;
    }
    USpriteAnimationComponent_1 = USpriteAnimationComponent;
    USpriteAnimationComponent.getTextureNames = function (name, size, start, symbol) {
        if (start === void 0) { start = 1; }
        if (symbol === void 0) { symbol = ""; }
        var texturesNames = [];
        for (var i = start; i <= size; i++) {
            texturesNames.push(name + symbol + i);
        }
        return texturesNames;
    };
    USpriteAnimationComponent.RegisterAllAnimation = function () {
        var textures = USpriteAnimationComponent_1.getTextureNames(USpriteAnimationComponent_1.Ani_Explostion, 16, 1);
        USpriteAnimationComponent_1.Animations.set(USpriteAnimationComponent_1.Ani_Explostion, textures);
        textures = USpriteAnimationComponent_1.getTextureNames(USpriteAnimationComponent_1.Ani_MuzzleFlash, 3, 1);
        USpriteAnimationComponent_1.Animations.set(USpriteAnimationComponent_1.Ani_MuzzleFlash, textures);
    };
    USpriteAnimationComponent.prototype.unUse = function () {
        _super.prototype.unUse.call(this);
    };
    USpriteAnimationComponent.prototype.reUse = function () {
        _super.prototype.reUse.call(this);
        this.texIndex = null;
        this.isLoop = true;
        this.isFinish = true;
        this.fps = 16;
        this.frameTime = 1 / 16;
        this.frameIndex = 0;
        this.timer = 0;
    };
    USpriteAnimationComponent.prototype.setAnimation = function (name) {
        this.texIndex = name;
    };
    USpriteAnimationComponent.prototype.setFPS = function (newFps) {
        this.fps = newFps;
        this.frameTime = 1 / newFps;
    };
    USpriteAnimationComponent.prototype.play = function (isLoop) {
        if (isLoop === void 0) { isLoop = true; }
        this.isLoop = isLoop;
        this.isFinish = false;
    };
    USpriteAnimationComponent.prototype.update = function (dt) {
        _super.prototype.update.call(this, dt);
        if (!this.owner.world.isClient) {
            return;
        }
        if (this.texIndex != null) {
            var textures = USpriteAnimationComponent_1.Animations.get(this.texIndex);
            if (this.isFinish == false) {
                this.timer += dt;
                if (this.timer > this.frameTime) {
                    this.timer = 0;
                    var newFrameIndex = (this.frameIndex + 1) % textures.length;
                    this.setTexture(textures[newFrameIndex]);
                    if (newFrameIndex < this.frameIndex && this.isLoop == false) {
                        this.isFinish = true;
                    }
                    this.frameIndex = newFrameIndex;
                }
            }
        }
    };
    var USpriteAnimationComponent_1;
    USpriteAnimationComponent.Ani_Explostion = "explosion/explosion";
    USpriteAnimationComponent.Ani_MuzzleFlash = "weapon/muzzleflash/muzzleflash";
    USpriteAnimationComponent.Animations = new Map();
    USpriteAnimationComponent = USpriteAnimationComponent_1 = __decorate([
        XBase_1.xclass(USpriteAnimationComponent_1)
    ], USpriteAnimationComponent);
    return USpriteAnimationComponent;
}(SpriteComponent_1.default));
exports.default = USpriteAnimationComponent;
