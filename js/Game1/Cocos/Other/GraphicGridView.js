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
var GraphicGridView = /** @class */ (function (_super) {
    __extends(GraphicGridView, _super);
    function GraphicGridView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.ctx = null;
        //网格属性
        _this.grid = null;
        _this.worldAABB = new UMath_1.AABB();
        _this.width = 32 / 5;
        _this.row = 5;
        _this.col = 5;
        _this.gridSize = cc.v2();
        //网格中Node的位置偏移
        _this.gridNodeOffset = cc.v2();
        return _this;
    }
    GraphicGridView.prototype.setGridElement = function (x, y, index) {
        this.grid[y][x] = index;
    };
    GraphicGridView.prototype.getGridElement = function (x, y) {
        return this.grid[y][x];
    };
    //接收一维数组
    GraphicGridView.prototype.setGridData = function (arr) {
        for (var i = 0; i < arr.length - 1;) {
            var index = arr[i];
            var x = index % this.col;
            var y = (index - x) / this.col;
            this.grid[y][x] = arr[i + 1];
            i += 2;
        }
    };
    GraphicGridView.prototype.onLoad = function () {
        this.ctx = this.node.addComponent(cc.Graphics);
        var width = this.width;
        var row = this.row;
        var col = this.col;
        this.gridSize = cc.v2(col * width, row * width);
        this.worldAABB.min = UMath_1.uu.v2(-1 * (width * col / 2), -1 * (width * row / 2));
        this.worldAABB.max.x = this.worldAABB.min.x + width * col;
        this.worldAABB.max.y = this.worldAABB.min.y + width * row;
        var offset = cc.v2(this.worldAABB.min.x + width / 2, this.worldAABB.min.y + width / 2);
        this.gridNodeOffset = offset;
        this.grid = [];
        for (var i = 0; i < row; i++) {
            this.grid[i] = [];
            for (var j = 0; j < col; j++) {
                this.grid[i][j] = 0;
            }
        }
    };
    /*****************************************************
     * 辅助函数
     ****************************************************/
    //逻辑位置
    GraphicGridView.prototype.getGridPos = function (pos) {
        var gridPos = pos.clone();
        gridPos.subSelf(cc.v2(this.worldAABB.min.x, this.worldAABB.min.y));
        gridPos.x = Math.floor(gridPos.x / this.width);
        gridPos.y = Math.floor(gridPos.y / this.width);
        return gridPos;
    };
    //物理位置
    GraphicGridView.prototype.getElementPos = function (x, y) {
        var pos = cc.v2();
        pos.x = x * this.width + this.gridNodeOffset.x;
        pos.y = y * this.width + this.gridNodeOffset.y;
        return pos;
    };
    //是否在网格范围
    GraphicGridView.prototype.isInRange = function (pos) {
        return pos.x > this.worldAABB.min.x && pos.x < this.worldAABB.max.x && pos.y > this.worldAABB.min.y && pos.y < this.worldAABB.max.y;
    };
    /*****************************************************
     * 逻辑
     ****************************************************/
    /*****************************************************
     * 输出
     ****************************************************/
    GraphicGridView.prototype.drawRect = function (x, y, width, height, strokeColor, fillColor, lineWidth) {
        if (strokeColor === void 0) { strokeColor = cc.Color.RED; }
        if (fillColor === void 0) { fillColor = cc.Color.BLACK; }
        if (lineWidth === void 0) { lineWidth = 5; }
        if (strokeColor != cc.Color.RED) {
            this.ctx.strokeColor = strokeColor;
        }
        this.ctx.rect(x, y, width, height);
        this.ctx.lineWidth = lineWidth;
        this.ctx.stroke();
        this.ctx.strokeColor = cc.Color.RED;
        if (!(fillColor.r == 0 && fillColor.g == 0 && fillColor.b == 0)) {
            this.ctx.fillColor = fillColor;
            this.ctx.fill();
        }
    };
    GraphicGridView.prototype.update = function (dt) {
        this.ctx.clear();
        for (var i = 0; i < this.row; i++) {
            for (var j = 0; j < this.col; j++) {
                var index = this.grid[i][j];
                if (index != 0) {
                    var pos = this.getElementPos(j, i);
                    var lineWidth = 5;
                    this.drawRect(pos.x - this.width / 2, pos.y - this.width / 2, this.width - lineWidth / 2, this.width - lineWidth / 2, cc.Color.RED, cc.Color.YELLOW);
                }
            }
        }
    };
    GraphicGridView = __decorate([
        ccclass
    ], GraphicGridView);
    return GraphicGridView;
}(cc.Component));
exports.default = GraphicGridView;
