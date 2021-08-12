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
var CameraComponent_1 = __importDefault(require("../Component/SceneComponent/CameraComponent"));
var XBase_1 = require("../Engine/ReflectSystem/XBase");
var Actor_1 = __importDefault(require("./Actor"));
var ACameraActor = /** @class */ (function (_super) {
    __extends(ACameraActor, _super);
    function ACameraActor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.cameraComp = null;
        return _this;
    }
    ACameraActor_1 = ACameraActor;
    //Override
    ACameraActor.prototype.unUse = function () {
        _super.prototype.unUse.call(this);
    };
    //Override
    ACameraActor.prototype.reUse = function () {
        _super.prototype.reUse.call(this);
    };
    //Override
    ACameraActor.prototype.init = function (world) {
        _super.prototype.init.call(this, world);
        this.cameraComp = this.spawnComponent(CameraComponent_1.default);
    };
    //Override
    ACameraActor.prototype.onInit = function () {
        _super.prototype.onInit.call(this);
    };
    //Override
    ACameraActor.prototype.processSelfInput = function (input) {
        if (input.isTouchMove) {
            // console.log(input.clickPos.x, input.clickPos.y);
        }
    };
    //Override
    ACameraActor.prototype.updateActor = function (dt) {
    };
    //Override
    ACameraActor.prototype.drawDebugActor = function (graphic) {
    };
    //Override
    ACameraActor.prototype.onDestory = function () {
        _super.prototype.onDestory.call(this);
    };
    var ACameraActor_1;
    ACameraActor = ACameraActor_1 = __decorate([
        XBase_1.xclass(ACameraActor_1)
    ], ACameraActor);
    return ACameraActor;
}(Actor_1.default));
exports.default = ACameraActor;
