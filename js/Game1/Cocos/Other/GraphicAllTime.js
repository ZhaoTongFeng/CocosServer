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
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var GraphicAllTime = /** @class */ (function (_super) {
    __extends(GraphicAllTime, _super);
    function GraphicAllTime() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.ctx = null;
        _this.radius = 10000;
        //一个格子宽度
        _this.gridWidth = 750;
        //列
        _this.gridCol = 10;
        //行
        _this.gridRow = 10;
        return _this;
    }
    GraphicAllTime.prototype.onLoad = function () {
        this.ctx = this.node.addComponent(cc.Graphics);
        this.ctx.clear();
        this.drawSphereNoise();
        // this.drawGrid();
    };
    GraphicAllTime.prototype.update = function (dt) {
    };
    GraphicAllTime.prototype.drawGrid = function () {
        // let gridWidth = this.gridWidth
        var gridWidth = this.gridWidth;
        var gridCol = this.gridCol;
        var gridRow = this.gridRow;
        var offsetCol = gridCol / 2;
        var offsetRow = gridRow / 2;
        for (var i = 0; i < gridRow; i++) {
            for (var j = 0; j < gridCol; j++) {
                var _strokeColor = cc.Color.WHITE;
                if (_strokeColor != cc.Color.RED) {
                    this.ctx.strokeColor = _strokeColor;
                }
                var x = (j - offsetCol) * gridWidth;
                var y = (i - offsetRow) * gridWidth;
                this.ctx.rect(x, y, gridWidth, gridWidth);
                this.ctx.lineWidth = 10;
                this.ctx.stroke();
            }
        }
    };
    GraphicAllTime.prototype.drawSphereNoise = function () {
        var radius = this.radius;
        var width = radius * 2;
        var haflWidth = width / 2;
        var height = radius * 2;
        var haflHeight = height / 2;
        var padding = 100;
        var minX = -1 * haflWidth;
        var minY = -1 * haflHeight;
        var col = width / padding;
        var row = height / padding;
        this.ctx.strokeColor = cc.Color.RED;
        this.ctx.lineWidth = 5;
        this.ctx.circle(0, 0, radius);
        this.ctx.stroke();
        this.ctx.strokeColor = cc.Color.WHITE;
        for (var i = 0; i <= col; i++) {
            for (var j = 0; j <= row; j++) {
                var rand = Math.random();
                this.ctx.strokeColor = cc.color(255 * rand, 255 * rand, 255 * rand);
                var pos = cc.v2(i * padding + minX + padding * (Math.random() - 0.5) * 2, j * padding + minY + padding * (Math.random() - 0.5) * 2);
                if (pos.len() < radius) {
                    this.ctx.circle(pos.x, pos.y, 1);
                    this.ctx.fill();
                }
                if (i % 3 == 0) {
                    pos = cc.v2(i * padding + minX + padding * (Math.random() - 0.5) * 2, j * padding + minY + padding * (Math.random() - 0.5) * 2);
                    if (pos.len() < radius) {
                        this.ctx.circle(pos.x, pos.y, 3);
                        this.ctx.fill();
                    }
                }
            }
        }
    };
    GraphicAllTime.prototype.drawNoise = function () {
        var winSize = cc.v2(cc.winSize.width / 2, cc.winSize.height / 2);
        var width = winSize.x * 2;
        var haflWidth = width / 2;
        var height = winSize.y * 2;
        var haflHeight = height / 2;
        var padding = 50;
        var minX = -1 * haflWidth;
        var minY = -1 * haflHeight;
        var col = width / padding;
        var row = height / padding;
        for (var i = 0; i <= col; i++) {
            for (var j = 0; j <= row; j++) {
                var rand = Math.random();
                this.ctx.strokeColor = cc.color(255 * rand, 255 * rand, 255 * rand);
                var pos = cc.v2(i * padding + minX + padding * (Math.random() - 0.5) * 2, j * padding + minY + padding * (Math.random() - 0.5) * 2);
                this.ctx.circle(pos.x, pos.y, 1);
                this.ctx.fill();
                if (i % 3 == 0) {
                    pos = cc.v2(i * padding + minX + padding * (Math.random() - 0.5) * 2, j * padding + minY + padding * (Math.random() - 0.5) * 2);
                    this.ctx.circle(pos.x, pos.y, 3);
                    this.ctx.fill();
                }
            }
        }
    };
    GraphicAllTime = __decorate([
        ccclass
    ], GraphicAllTime);
    return GraphicAllTime;
}(cc.Component));
exports.default = GraphicAllTime;
