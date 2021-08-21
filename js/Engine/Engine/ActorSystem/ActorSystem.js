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
var Object_1 = __importDefault(require("../../Object"));
var XBase_1 = require("../ReflectSystem/XBase");
/**
 * 对象管理器
 * 对象查询
 * 对象池
 */
var UActorSystem = /** @class */ (function (_super) {
    __extends(UActorSystem, _super);
    function UActorSystem() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.sceneComponents = [];
        _this.spriteComponents = [];
        _this.world = null;
        return _this;
    }
    UActorSystem_1 = UActorSystem;
    UActorSystem.prototype.registerSceneComponent = function (scene) {
        this.sceneComponents.push(scene);
        this.world.gameInstance.getWorldView().addSceneComponent(scene);
    };
    UActorSystem.prototype.unRegisterSceneComponent = function (scene) {
        var index = this.sceneComponents.findIndex(function (one) {
            return one == scene;
        });
        if (index > -1) {
            this.sceneComponents.splice(index, 1);
        }
        this.world.gameInstance.getWorldView().removeSceneComponent(scene);
    };
    UActorSystem.prototype.registerSprite = function (scene) {
        this.spriteComponents.push(scene);
        this.world.gameInstance.getWorldView().addSpriteComponent(scene);
    };
    UActorSystem.prototype.unRegisterSprite = function (scene) {
        var index = this.spriteComponents.findIndex(function (one) {
            return one == scene;
        });
        if (index > -1) {
            this.spriteComponents.splice(index, 1);
            this.world.gameInstance.getWorldView().removeSpriteComponent(scene);
        }
    };
    UActorSystem.prototype.init = function (world) {
        _super.prototype.init.call(this, world);
        this.world = world;
    };
    UActorSystem.prototype.destory = function () {
        _super.prototype.destory.call(this);
    };
    var UActorSystem_1;
    UActorSystem = UActorSystem_1 = __decorate([
        XBase_1.xclass(UActorSystem_1)
    ], UActorSystem);
    return UActorSystem;
}(Object_1.default));
exports.default = UActorSystem;
