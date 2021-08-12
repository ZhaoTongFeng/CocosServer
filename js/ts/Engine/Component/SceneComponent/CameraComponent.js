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
var SceneComponent_1 = __importDefault(require("./SceneComponent"));
/**
 * 精灵图片组件
 * 挂载到Actor上，以显示图片
 */
var UCameraComponent = /** @class */ (function (_super) {
    __extends(UCameraComponent, _super);
    function UCameraComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UCameraComponent_1 = UCameraComponent;
    Object.defineProperty(UCameraComponent.prototype, "zoomRatio", {
        get: function () {
            this.owner.world.gameInstance.getWorldView().onGetSceneCameraProperty(this);
            return this._zoomRatio;
        },
        set: function (value) {
            this._zoomRatio = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UCameraComponent.prototype, "orthoSize", {
        get: function () {
            this.owner.world.gameInstance.getWorldView().onGetSceneCameraProperty(this);
            return this._orthoSize;
        },
        set: function (value) {
            this._orthoSize = value;
        },
        enumerable: false,
        configurable: true
    });
    //1.
    UCameraComponent.prototype.init = function (data) {
        _super.prototype.init.call(this, data);
    };
    UCameraComponent.prototype.register = function () {
        this.owner.world.gameInstance.getWorldView().addCameraComponent(this);
    };
    UCameraComponent.prototype.unUse = function () {
        _super.prototype.unUse.call(this);
    };
    UCameraComponent.prototype.reUse = function () {
        _super.prototype.reUse.call(this);
    };
    UCameraComponent.prototype.unRegister = function () {
        this.owner.world.gameInstance.getWorldView().removeCameraComponent(this);
    };
    //5.
    UCameraComponent.prototype.destory = function () {
        _super.prototype.destory.call(this);
    };
    var UCameraComponent_1;
    __decorate([
        XBase_1.xproperty(Number)
    ], UCameraComponent.prototype, "_zoomRatio", void 0);
    __decorate([
        XBase_1.xproperty(Number)
    ], UCameraComponent.prototype, "_orthoSize", void 0);
    UCameraComponent = UCameraComponent_1 = __decorate([
        XBase_1.xclass(UCameraComponent_1)
    ], UCameraComponent);
    return UCameraComponent;
}(SceneComponent_1.default));
exports.default = UCameraComponent;