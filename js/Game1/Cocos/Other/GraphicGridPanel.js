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
var GraphicGridPanel = /** @class */ (function (_super) {
    __extends(GraphicGridPanel, _super);
    function GraphicGridPanel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.ctx = null;
        _this.offsetNode = null;
        _this.winSize = cc.v2();
        //网格属性
        _this.grid = null;
        _this.worldAABB = new UMath_1.AABB();
        _this.width = 100;
        _this.row = 5;
        _this.col = 5;
        _this.size = 0;
        _this.gridSize = cc.v2();
        //网格中Node的位置偏移
        _this.gridNodeOffset = cc.v2();
        _this.currentIndex = 0;
        return _this;
    }
    GraphicGridPanel_1 = GraphicGridPanel;
    GraphicGridPanel.prototype.setGridElement = function (x, y, index) {
        this.grid[y][x] = index;
    };
    GraphicGridPanel.prototype.getGridElement = function (x, y) {
        return this.grid[y][x];
    };
    //输出一维数组
    GraphicGridPanel.prototype.getGridData = function () {
        var arr = [];
        var index = 0;
        for (var i = 0; i < this.row; i++) {
            for (var j = 0; j < this.col; j++) {
                if (this.grid[i][j] != 0) {
                    arr.push(j + i * this.col);
                    arr.push(this.grid[i][j]);
                }
                index++;
            }
        }
        return arr;
    };
    //接收一维数组
    GraphicGridPanel.prototype.setGridData = function (arr) {
        for (var i = 0; i < arr.length - 1;) {
            var index = arr[i];
            var x = index % this.col;
            var y = (index - x) / this.col;
            this.grid[y][x] = arr[i + 1];
            i += 2;
        }
    };
    GraphicGridPanel.prototype.onLoad = function () {
        this.winSize = cc.v2(cc.winSize.width / 2, cc.winSize.height / 2);
        this.ctx = this.node.addComponent(cc.Graphics);
        var width = this.width;
        var row = this.row;
        var col = this.col;
        var padding = 8;
        var size = width - padding * 2;
        this.size = size;
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
        for (var i = 0; i < row; i++) {
            for (var j = 0; j < col; j++) {
                this.setGridElement(j, i, 1);
            }
        }
        var arr = this.getGridData();
        GraphicGridPanel_1.gridData = arr;
        this.setGridData(arr);
        this.node.on(cc.Node.EventType.TOUCH_START, this.checkElement, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.checkElement, this);
    };
    /*****************************************************
     * 辅助函数
     ****************************************************/
    //点击位置
    GraphicGridPanel.prototype.getClickPos = function (e) {
        // this.cameraCtrl.stop();
        var touch = e.touch;
        //世界坐标
        var vector = cc.v2(touch.getLocationX(), touch.getLocationY());
        vector.subSelf(this.winSize);
        vector.x -= this.offsetNode.x;
        vector.y -= this.offsetNode.y;
        vector.x -= this.node.x;
        vector.y -= this.node.y;
        // let camerPos = this.camera.node.getPosition()
        var camerPos = cc.v2();
        vector.addSelf(camerPos);
        return vector;
    };
    //逻辑位置
    GraphicGridPanel.prototype.getGridPos = function (pos) {
        var gridPos = pos.clone();
        gridPos.subSelf(cc.v2(this.worldAABB.min.x, this.worldAABB.min.y));
        gridPos.x = Math.floor(gridPos.x / this.width);
        gridPos.y = Math.floor(gridPos.y / this.width);
        return gridPos;
    };
    //物理位置
    GraphicGridPanel.prototype.getElementPos = function (x, y) {
        var pos = cc.v2();
        pos.x = x * this.width + this.gridNodeOffset.x;
        pos.y = y * this.width + this.gridNodeOffset.y;
        return pos;
    };
    //是否在网格范围
    GraphicGridPanel.prototype.isInRange = function (pos) {
        return pos.x > this.worldAABB.min.x && pos.x < this.worldAABB.max.x && pos.y > this.worldAABB.min.y && pos.y < this.worldAABB.max.y;
    };
    /*****************************************************
     * 逻辑
     ****************************************************/
    GraphicGridPanel.prototype.checkElement = function (e) {
        var clickPos = this.getClickPos(e);
        //是否在格子内
        if (this.isInRange(clickPos)) {
            //所在格子是否有物品
            var gridPos = this.getGridPos(clickPos);
            this.setGridElement(gridPos.x, gridPos.y, this.currentIndex);
            return true;
        }
        else {
            return false;
        }
    };
    /*****************************************************
     * 输出
     ****************************************************/
    GraphicGridPanel.prototype.drawRect = function (x, y, width, height, strokeColor, fillColor, lineWidth) {
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
    GraphicGridPanel.prototype.drawGridLine = function () {
        this.ctx.lineWidth = 5;
        this.ctx.strokeColor = cc.Color.RED;
        var row = this.row;
        var col = this.col;
        var gridLength = this.width;
        var width = this.gridSize.x;
        var height = this.gridSize.y;
        var leftPos = this.worldAABB.min;
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
    GraphicGridPanel.prototype.update = function (dt) {
        this.ctx.clear();
        this.drawGridLine();
        for (var i = 0; i < this.row; i++) {
            for (var j = 0; j < this.col; j++) {
                var index = this.grid[i][j];
                if (index != 0) {
                    var pos = this.getElementPos(j, i);
                    var lineWidth = 5;
                    this.drawRect(pos.x - this.width / 2 + lineWidth, pos.y - this.width / 2 + lineWidth, this.width - lineWidth * 2, this.width - lineWidth * 2, cc.Color.YELLOW, cc.Color.YELLOW);
                }
            }
        }
    };
    var GraphicGridPanel_1;
    GraphicGridPanel.gridData = [];
    __decorate([
        property(cc.Node)
    ], GraphicGridPanel.prototype, "offsetNode", void 0);
    GraphicGridPanel = GraphicGridPanel_1 = __decorate([
        ccclass
    ], GraphicGridPanel);
    return GraphicGridPanel;
}(cc.Component));
exports.default = GraphicGridPanel;
