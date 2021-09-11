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
var Actor_1 = __importDefault(require("../../../Engine/Actor/Actor"));
var XBase_1 = require("../../../Engine/Engine/ReflectSystem/XBase");
/**
 * 角色基类
 * 包含基本的位移操作
 */
var AExplodeActor = /** @class */ (function (_super) {
    __extends(AExplodeActor, _super);
    function AExplodeActor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.timer = 0;
        _this.deadTime = 1;
        return _this;
    }
    AExplodeActor_1 = AExplodeActor;
    AExplodeActor.prototype.unUse = function () {
        _super.prototype.unUse.call(this);
    };
    AExplodeActor.prototype.reUse = function () {
        _super.prototype.reUse.call(this);
        this.timer = 0;
    };
    AExplodeActor.prototype.updateActor = function (dt) {
        this.timer += dt;
        if (this.timer > this.deadTime) {
            this.destory();
        }
    };
    var AExplodeActor_1;
    AExplodeActor = AExplodeActor_1 = __decorate([
        XBase_1.xclass(AExplodeActor_1)
    ], AExplodeActor);
    return AExplodeActor;
}(Actor_1.default));
exports.default = AExplodeActor;
