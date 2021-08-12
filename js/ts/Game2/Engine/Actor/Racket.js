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
var SpriteComponent_1 = __importDefault(require("../../../Engine/Component/SceneComponent/SpriteComponent"));
var XBase_1 = require("../../../Engine/Engine/ReflectSystem/XBase");
/**
 * 移动的小球
 */
var ARacket = /** @class */ (function (_super) {
    __extends(ARacket, _super);
    function ARacket() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ARacket_1 = ARacket;
    //Override
    ARacket.prototype.unUse = function () {
        _super.prototype.unUse.call(this);
    };
    //Override
    ARacket.prototype.reUse = function () {
        _super.prototype.reUse.call(this);
    };
    //Override
    ARacket.prototype.init = function (world) {
        _super.prototype.init.call(this, world);
        var spriteComp = this.spawnComponent(SpriteComponent_1.default);
        spriteComp.setTexture("rect");
    };
    //Override
    ARacket.prototype.onInit = function () {
        _super.prototype.onInit.call(this);
    };
    //Override
    ARacket.prototype.processSelfInput = function (input) {
    };
    //Override
    ARacket.prototype.updateActor = function (dt) {
    };
    //Override
    ARacket.prototype.drawDebugActor = function (graphic) {
    };
    //Override
    ARacket.prototype.onDestory = function () {
        _super.prototype.onDestory.call(this);
    };
    var ARacket_1;
    ARacket = ARacket_1 = __decorate([
        XBase_1.xclass(ARacket_1)
    ], ARacket);
    return ARacket;
}(Pawn_1.default));
exports.default = ARacket;
