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
var Object_1 = __importDefault(require("../Object"));
var XBase_1 = require("./ReflectSystem/XBase");
var UMath_1 = require("./UMath");
/**
 * 渲染接口
 * Client Only
 * 在创建GameInstance时进行绑定，如果是客户端就在WorldView里面进行绑定
 */
var UGraphic = /** @class */ (function (_super) {
    __extends(UGraphic, _super);
    function UGraphic() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UGraphic_1 = UGraphic;
    //开始绘制
    UGraphic.prototype.begDrawDebug = function () { };
    //结束绘制
    UGraphic.prototype.endDrawDebug = function () { };
    //网格
    UGraphic.prototype.drawGrid = function () { };
    //线
    UGraphic.prototype.drawLine = function (beg, end, strokeColor, lineWidth) {
        if (strokeColor === void 0) { strokeColor = UMath_1.UColor.RED(); }
        if (lineWidth === void 0) { lineWidth = 2; }
    };
    //矩形
    UGraphic.prototype.drawRect = function (x, y, width, height, strokeColor, fillColor, lineWidth) {
        if (strokeColor === void 0) { strokeColor = UMath_1.UColor.RED(); }
        if (fillColor === void 0) { fillColor = UMath_1.UColor.BLACK(); }
        if (lineWidth === void 0) { lineWidth = 5; }
    };
    //圆
    UGraphic.prototype.drawCircle = function (x, y, radius, strokeColor) {
        if (strokeColor === void 0) { strokeColor = UMath_1.UColor.RED(); }
    };
    //椭圆
    UGraphic.prototype.drawEllipse = function () { };
    //弧线/曲线/部分圆/圆形
    UGraphic.prototype.drawArc = function () { };
    //三次方贝塞尔曲线
    UGraphic.prototype.drawBezierCurve = function () { };
    //二次方贝塞尔曲线
    UGraphic.prototype.drawQuadraticCurve = function () { };
    var UGraphic_1;
    UGraphic = UGraphic_1 = __decorate([
        XBase_1.xclass(UGraphic_1)
    ], UGraphic);
    return UGraphic;
}(Object_1.default));
exports.default = UGraphic;
