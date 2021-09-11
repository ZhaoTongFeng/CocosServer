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
var XBase_1 = require("../../../Engine/Engine/ReflectSystem/XBase");
var Bullet_1 = __importDefault(require("./Bullet"));
/**
 * 弹道子弹
 * 需要一张图片进行显示
 */
var ABulletProject = /** @class */ (function (_super) {
    __extends(ABulletProject, _super);
    function ABulletProject() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //移动组件
        _this.movementComponent = null;
        return _this;
    }
    ABulletProject_1 = ABulletProject;
    ABulletProject.prototype.unUse = function () {
        _super.prototype.unUse.call(this);
    };
    ABulletProject.prototype.reUse = function () {
        _super.prototype.reUse.call(this);
        this.movementComponent = null;
    };
    var ABulletProject_1;
    ABulletProject = ABulletProject_1 = __decorate([
        XBase_1.xclass(ABulletProject_1)
    ], ABulletProject);
    return ABulletProject;
}(Bullet_1.default));
exports.default = ABulletProject;
