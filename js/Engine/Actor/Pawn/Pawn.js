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
var Actor_1 = __importDefault(require("../Actor"));
var AIController_1 = __importDefault(require("../Controller/AIController"));
/**
 * 角色基类
 * 包含基本的位移操作
 */
var APawn = /** @class */ (function (_super) {
    __extends(APawn, _super);
    function APawn() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.controller = null;
        _this.movementComponent = null;
        return _this;
    }
    APawn_1 = APawn;
    APawn.prototype.unUse = function () {
        _super.prototype.unUse.call(this);
    };
    APawn.prototype.reUse = function () {
        _super.prototype.reUse.call(this);
        this.controller = null;
        this.movementComponent = null;
    };
    APawn.prototype.getMovement = function () {
        return this.movementComponent;
    };
    APawn.prototype.setMovement = function (movement) {
        this.movementComponent = movement;
    };
    //创建
    APawn.prototype.init = function (world) {
        _super.prototype.init.call(this, world);
    };
    //输入
    APawn.prototype.processSelfInput = function (input) {
    };
    //更新
    APawn.prototype.updateActor = function (dt) {
    };
    //销毁
    APawn.prototype.destory = function () {
        _super.prototype.destory.call(this);
    };
    APawn.prototype.onDestory = function () {
        if (this.controller instanceof AIController_1.default) {
            this.controller.destory();
        }
        _super.prototype.onDestory.call(this);
    };
    var APawn_1;
    APawn = APawn_1 = __decorate([
        XBase_1.xclass(APawn_1)
    ], APawn);
    return APawn;
}(Actor_1.default));
exports.default = APawn;
