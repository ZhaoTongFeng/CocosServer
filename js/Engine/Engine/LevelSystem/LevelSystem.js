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
exports.LevelSystem = void 0;
var Object_1 = __importDefault(require("../../Object"));
var XBase_1 = require("../ReflectSystem/XBase");
/**
 * 多个关卡管理
 * 关卡流送
 * 关卡剔除
 */
var LevelSystem = /** @class */ (function (_super) {
    __extends(LevelSystem, _super);
    function LevelSystem() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.instance = null;
        return _this;
    }
    LevelSystem_1 = LevelSystem;
    LevelSystem.prototype.init = function (instance) {
        _super.prototype.init.call(this, instance);
        this.instance = instance;
    };
    var LevelSystem_1;
    LevelSystem = LevelSystem_1 = __decorate([
        XBase_1.xclass(LevelSystem_1)
    ], LevelSystem);
    return LevelSystem;
}(Object_1.default));
exports.LevelSystem = LevelSystem;
