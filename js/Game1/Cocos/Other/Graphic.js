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
Object.defineProperty(exports, "__esModule", { value: true });
var UMath_1 = require("../../../Engine/Engine/UMath");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var Graphic = /** @class */ (function (_super) {
    __extends(Graphic, _super);
    function Graphic() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.ctx = null;
        return _this;
    }
    Graphic.prototype.toCCColor = function (color) {
        return cc.color(color.r, color.g, color.b, color.a);
    };
    Graphic.prototype.onLoad = function () {
        this.ctx = this.node.getComponent(cc.Graphics);
        /**配置 */
        // this.ctx.lineCap = cc.Graphics.LineCap.ROUND;//末端样式
        // this.ctx.lineJoin = cc.Graphics.LineJoin.MITER;//相交拐角
        this.ctx.lineWidth = 5;
        // this.ctx.miterLimit =20;//最大斜接长度，超过这个值就将join设置成 bevel（就是不做邻接处理，夹角越小越长，
        // this.ctx.strokeColor = new cc.Color().fromHEX('#0000ff');
        this.ctx.strokeColor = cc.Color.RED;
        // this.ctx.fillColor = cc.Color.BLUE;
        // this.drawLine(this.ctx);
        // this.drawRect(this.ctx);
        // this.drawCircle(this.ctx);
        // this.drawEllipse(this.ctx);
        // this.drawArc(this.ctx);
        // this.drawBezierCurve(this.ctx);
        // this.drawQuadraticCurve(this.ctx);
        // this.drawGrid(this.ctx);
        // this.begDrawDebug();
        // this.drawGrid();
    };
    Graphic.prototype.begDrawDebug = function () {
        this.ctx.clear();
    };
    Graphic.prototype.endDrawDebug = function () {
    };
    Graphic.prototype.drawGrid = function () {
        var row = 5;
        var col = 5;
        var gridLength = 100;
        var pos = cc.v2();
        var width = col * gridLength;
        var height = row * gridLength;
        var leftPos = cc.v2(width / -2, height / -2);
        leftPos.addSelf(pos);
        for (var i = 0; i <= row; i++) {
            var n = i * gridLength;
            this.ctx.moveTo(leftPos.x, leftPos.y + n);
            this.ctx.lineTo(leftPos.x + width, leftPos.y + n);
        }
        for (var i = 0; i <= col; i++) {
            var n = i * gridLength;
            this.ctx.moveTo(leftPos.x + n, leftPos.y);
            this.ctx.lineTo(leftPos.x + n, leftPos.y + height);
        }
        this.ctx.stroke();
    };
    //画线
    Graphic.prototype.drawLine = function (beg, end, strokeColor, lineWidth) {
        if (strokeColor === void 0) { strokeColor = UMath_1.UColor.RED(); }
        if (lineWidth === void 0) { lineWidth = 2; }
        var _strokeColor = this.toCCColor(strokeColor);
        if (_strokeColor != cc.Color.RED) {
            this.ctx.strokeColor = _strokeColor;
        }
        this.ctx.lineWidth = lineWidth;
        this.ctx.moveTo(beg.x, beg.y);
        this.ctx.lineTo(end.x, end.y);
        // this.ctx.lineTo(100, 0);
        // this.ctx.lineTo(0, 0);
        this.ctx.close();
        this.ctx.stroke();
        // this.ctx.fill();
        this.ctx.strokeColor = cc.Color.RED;
    };
    //矩形
    Graphic.prototype.drawRect = function (x, y, width, height, strokeColor, fillColor, lineWidth) {
        if (strokeColor === void 0) { strokeColor = UMath_1.UColor.RED(); }
        if (fillColor === void 0) { fillColor = UMath_1.UColor.BLACK(); }
        if (lineWidth === void 0) { lineWidth = 5; }
        var _strokeColor = this.toCCColor(strokeColor);
        var _fillColor = this.toCCColor(fillColor);
        if (_strokeColor != cc.Color.RED) {
            this.ctx.strokeColor = _strokeColor;
        }
        this.ctx.rect(x, y, width, height);
        this.ctx.lineWidth = lineWidth;
        this.ctx.stroke();
        this.ctx.strokeColor = cc.Color.RED;
        if (!(_fillColor.r == 0 && _fillColor.g == 0 && _fillColor.b == 0)) {
            this.ctx.fillColor = _fillColor;
            this.ctx.fill();
        }
    };
    //圆
    Graphic.prototype.drawCircle = function (x, y, radius, strokeColor) {
        if (strokeColor === void 0) { strokeColor = UMath_1.UColor.RED(); }
        var _strokeColor = this.toCCColor(strokeColor);
        if (_strokeColor != cc.Color.RED) {
            this.ctx.strokeColor = _strokeColor;
        }
        this.ctx.circle(x, y, radius);
        this.ctx.stroke();
        // this.ctx.fill();
        this.ctx.strokeColor = cc.Color.RED;
    };
    //椭圆
    Graphic.prototype.drawEllipse = function () {
        this.ctx.ellipse(0, 0, 100, 200); //上下圆半径
        this.ctx.stroke();
        this.ctx.fill();
    };
    //弧线/曲线/部分圆/圆形
    Graphic.prototype.drawArc = function () {
        this.ctx.arc(100, 75, 50, 0, 1.5 * Math.PI);
        this.ctx.stroke();
        // this.ctx.fill();
    };
    //三次方贝塞尔曲线
    Graphic.prototype.drawBezierCurve = function () {
        this.ctx.moveTo(0, 0);
        this.ctx.bezierCurveTo(100, 100, 200, 0, 300, 100);
        this.ctx.stroke();
    };
    //二次方贝塞尔曲线
    Graphic.prototype.drawQuadraticCurve = function () {
        this.ctx.moveTo(0, 0);
        this.ctx.quadraticCurveTo(100, 100, 200, 0);
        this.ctx.stroke();
    };
    Graphic = __decorate([
        ccclass
    ], Graphic);
    return Graphic;
}(cc.Component));
exports.default = Graphic;
