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
var generator_1 = require("libnoise-ts/module/generator");
var UMath_1 = require("../../../Engine/Engine/UMath");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var CrossGraphic = /** @class */ (function (_super) {
    __extends(CrossGraphic, _super);
    function CrossGraphic() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.ctx = null;
        _this.perlin = null;
        _this.timer = 0;
        _this.z = 0;
        _this.offset = 0;
        return _this;
    }
    CrossGraphic.prototype.toCCColor = function (color) {
        return cc.color(color.r, color.g, color.b, color.a);
    };
    CrossGraphic.prototype.onLoad = function () {
        this.ctx = this.node.addComponent(cc.Graphics);
        // this.ctx = this.node.getComponent(cc.Graphics);
        // Construct new Perlin generator
        var perlin = new generator_1.Perlin();
        for (var y = 0; y < 1; y += 0.1) {
            var rowOfValues = [];
            for (var x = 0; x < 1; x += 0.1) {
                // Get value from Perlin generator
                var value = perlin.getValue(x, y, 0);
                // Floor, scale and Abs value to produce nice positive integers
                value = Math.abs(Math.floor(value * 10)) / 10;
                rowOfValues.push(value);
            }
            // Print out row of values
            console.log(rowOfValues.join(' '));
        }
        this.ctx.lineWidth = 5;
        this.ctx.strokeColor = cc.Color.BLUE;
        this.perlin = new generator_1.Perlin();
    };
    //一维
    CrossGraphic.prototype.update1 = function (dt) {
        this.offset += dt * 100;
        this.ctx.clear();
        var beg = UMath_1.uu.v2(this.offset, 0);
        var end = UMath_1.uu.v2(500, 0);
        var total = end.length();
        var dir = UMath_1.uu.v2(1, 0);
        var padding = 50;
        var p1 = beg.clone();
        var p2 = UMath_1.uu.v2(0, 0);
        var length = 0;
        var addon = 20;
        do {
            p1 = p1.sub(dir.mul(Math.floor(p1.length() / total) * total));
            var a = total - p1.length();
            if (addon < a) {
                p2 = p1.add(dir.mul(addon));
                this.drawLine(p1, p2);
            }
            else {
                p2 = p1.add(dir.mul(a));
                this.drawLine(p1, p2);
                p1.x = 0;
                p1.y = 0;
                p2 = dir.mul(addon - a);
                this.drawLine(p1, p2);
            }
            // let realpad = padding * p1.length()/total;
            var realpad = padding;
            p1 = p2.add(dir.mul(realpad));
            length += addon + realpad;
        } while (length < end.length());
    };
    CrossGraphic.prototype.update = function (dt) {
        this.offset += dt * 100;
        var beg = UMath_1.uu.v2(this.offset, 0);
        var end = UMath_1.uu.v2(500, 0);
        var dir = UMath_1.uu.v2(1, 0);
        var total = end.length();
        var p2 = UMath_1.uu.v2(0, 0);
        var padding = 50;
        var addon = 20;
        //旋转
        var angle = 0;
        var num = 60;
        var offset_angle = 360 / num;
        this.ctx.clear();
        var count = 0;
        for (var i = 0; i < num; i++) {
            var p1 = beg.clone();
            var length_1 = 0;
            var j = 0;
            do {
                var value = this.perlin.getValue(i / num, j / 1000, 0);
                p1 = p1.sub(dir.mul(Math.floor(p1.length() / total) * total));
                var a = total - p1.length();
                if (addon < a) {
                    p2 = p1.add(dir.mul(addon));
                    this.drawLine(p1, p2);
                }
                else {
                    p2 = p1.add(dir.mul(a));
                    this.drawLine(p1, p2);
                    p1.x = 0;
                    p1.y = 0;
                    p2 = dir.mul(addon - a);
                    this.drawLine(p1, p2);
                }
                // value = Math.abs(Math.floor(value * padding));
                var realpad = padding * ((p1.length() / total)) * value;
                p1 = p2.add(dir.mul(realpad));
                length_1 += addon + realpad;
                j++;
                count++;
            } while (length_1 < end.length());
            beg = beg.rotate(UMath_1.UMath.toRadians(angle + offset_angle));
            dir = dir.rotate(UMath_1.UMath.toRadians(angle + offset_angle));
            end = end.rotate(UMath_1.UMath.toRadians(angle + offset_angle));
        }
    };
    //画线
    CrossGraphic.prototype.drawLine = function (beg, end, strokeColor, lineWidth) {
        if (strokeColor === void 0) { strokeColor = UMath_1.UColor.RED(); }
        if (lineWidth === void 0) { lineWidth = 2; }
        var _strokeColor = this.toCCColor(strokeColor);
        if (_strokeColor != cc.Color.RED) {
            this.ctx.strokeColor = _strokeColor;
        }
        this.ctx.strokeColor = cc.Color.BLUE;
        this.ctx.lineWidth = lineWidth;
        this.ctx.moveTo(beg.x, beg.y);
        this.ctx.lineTo(end.x, end.y);
        this.ctx.close();
        this.ctx.stroke();
        this.ctx.strokeColor = cc.Color.RED;
    };
    CrossGraphic = __decorate([
        ccclass
    ], CrossGraphic);
    return CrossGraphic;
}(cc.Component));
exports.default = CrossGraphic;
