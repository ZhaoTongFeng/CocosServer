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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var UMath_1 = require("../../../Engine/Engine/UMath");
var BackpackComponent_1 = __importDefault(require("./BackpackComponent"));
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var GraphicBattleGrid = /** @class */ (function (_super) {
    __extends(GraphicBattleGrid, _super);
    function GraphicBattleGrid() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.ctx = null;
        _this.SpriteFrameMap = new Map();
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
        _this.pickNode = null;
        _this.pickTempNode = null;
        _this.pickState = 0;
        _this.inRange = false;
        _this.pickGridPos = null;
        return _this;
    }
    GraphicBattleGrid.prototype.setSpriteFrame = function (sprite, name) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (this.SpriteFrameMap.has(name)) {
                    sprite.spriteFrame = this.SpriteFrameMap.get(name);
                }
                else {
                    //加载资源
                    cc.resources.load(name, cc.SpriteFrame, function (err, spriteFrame) {
                        if (spriteFrame != null) {
                            sprite.spriteFrame = spriteFrame;
                            _this.SpriteFrameMap.set(name, spriteFrame);
                        }
                    });
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * 生成Node节点
     * @param texName
     * @returns
     */
    GraphicBattleGrid.prototype.spawnNode = function (texName) {
        var node = new cc.Node();
        var sp = node.addComponent(cc.Sprite);
        sp.sizeMode = cc.Sprite.SizeMode.CUSTOM;
        sp.type = cc.Sprite.Type.SIMPLE;
        sp.trim = false;
        this.setSpriteFrame(sp, texName);
        node.setContentSize(this.size, this.size);
        this.node.insertChild(node, 0);
        return node;
    };
    GraphicBattleGrid.prototype.onLoad = function () {
        this.winSize = cc.v2(cc.winSize.width / 2, cc.winSize.height / 2);
        this.ctx = this.node.getComponent(cc.Graphics);
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
                this.grid[i][j] = null;
            }
        }
        for (var i = 0; i < row; i++) {
            for (var j = 0; j < col / 2; j++) {
                this.addGridNode(j, i, "character");
            }
        }
        //设置临时Node
        var sp = this.pickTempNode.addComponent(cc.Sprite);
        sp.sizeMode = cc.Sprite.SizeMode.CUSTOM;
        sp.type = cc.Sprite.Type.SIMPLE;
        sp.trim = false;
        this.setSpriteFrame(sp, "character");
        this.pickTempNode.setContentSize(this.size, this.size);
        this.pickTempNode.anchorX = 0.5;
        this.pickTempNode.anchorY = 0.5;
        this.pickTempNode.active = false;
    };
    /**
     * 获取点击位置
     * @param e
     * @returns
     */
    GraphicBattleGrid.prototype.getClickPos = function (e) {
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
    /**
     * 根据位置获取在网格中的位置
     * @param pos
     * @returns
     */
    GraphicBattleGrid.prototype.getGridPos = function (pos) {
        var gridPos = pos.clone();
        gridPos.subSelf(cc.v2(this.worldAABB.min.x, this.worldAABB.min.y));
        gridPos.x = Math.floor(gridPos.x / this.width);
        gridPos.y = Math.floor(gridPos.y / this.width);
        return gridPos;
    };
    /**
     * 此网格是否有物品
     * @param gridPos
     * @returns
     */
    GraphicBattleGrid.prototype.hasItem = function (gridPos) {
        return this.grid[gridPos.y][gridPos.x] != null;
    };
    //收到这个Node位置的偏移
    GraphicBattleGrid.prototype.setTmpNodePos = function (pos) {
        pos.x += this.offsetNode.x;
        pos.y += this.offsetNode.y;
        pos.x += this.node.x;
        pos.y += this.node.y;
        this.pickTempNode.setPosition(pos);
    };
    /**
     * 获取Node在网格中的位置
     * @param x
     * @param y
     * @returns
     */
    GraphicBattleGrid.prototype.getGridNodePos = function (x, y) {
        var pos = cc.v2();
        pos.x = x * this.width + this.gridNodeOffset.x;
        pos.y = y * this.width + this.gridNodeOffset.y;
        return pos;
    };
    /**
     * 将Node添加到网格
     * @param j
     * @param i
     * @param texName
     */
    GraphicBattleGrid.prototype.addGridNode = function (j, i, texName) {
        if (this.grid[i][j] != null) {
            //清除掉
            this.grid[i][j].destroy();
        }
        var node = this.spawnNode(texName);
        var pos = this.getGridNodePos(j, i);
        node.setPosition(pos);
        this.grid[i][j] = node;
    };
    /**
     * 删除当前网格的Node
     * @param j
     * @param i
     */
    GraphicBattleGrid.prototype.delGridINode = function (j, i) {
        if (this.grid[i][j] != null) {
            this.grid[i][j].destroy();
            this.grid[i][j] = null;
        }
    };
    /*****************************************************
     * Backpack接口 开始
     ****************************************************/
    /**
     * 是否在网格范围
     * @param pos
     * @returns
     */
    GraphicBattleGrid.prototype.isInRange = function (pos) {
        return pos.x > this.worldAABB.min.x && pos.x < this.worldAABB.max.x && pos.y > this.worldAABB.min.y && pos.y < this.worldAABB.max.y;
    };
    GraphicBattleGrid.prototype.onOutRange = function () {
        this.inRange = false;
    };
    GraphicBattleGrid.prototype.onInRange = function () {
        this.inRange = true;
    };
    /**
     * 拾取
     */
    GraphicBattleGrid.prototype.pickUp = function (clickPos, gridPos) {
        //!注意多点触控的问题
        if (this.pickState == 0) {
            this.pickGridPos = gridPos;
            var node = this.grid[gridPos.y][gridPos.x];
            //记录并隐藏被点击Node，将临时Node替换上去
            this.pickNode = node;
            this.pickNode.active = false;
            this.pickTempNode.active = true;
            this.setTmpNodePos(clickPos);
            this.pickState = 1;
        }
    };
    GraphicBattleGrid.prototype.onPickUp = function (data) {
    };
    /**
     * 放下
     * 1.放回
     * 2.转移
     * 3.交换
     */
    GraphicBattleGrid.prototype.pickDown = function () {
        if (this.pickState == 1) {
            this.pickNode.active = true;
            this.pickTempNode.active = false;
            this.pickState = 0;
            this.pickGridPos = null;
        }
    };
    GraphicBattleGrid.prototype.onPickDow = function () {
    };
    GraphicBattleGrid.prototype.onStart = function (e) {
        var clickPos = this.getClickPos(e);
        //是否在格子内
        if (this.isInRange(clickPos)) {
            //所在格子是否有物品
            var gridPos = this.getGridPos(clickPos);
            if (this.hasItem(gridPos)) {
                // this.delGridINode(gridPos.x, gridPos.y);
                this.pickUp(clickPos, gridPos);
            }
            else {
                // this.addGridNode(gridPos.x, gridPos.y, "character");
            }
            this.onInRange();
            return true;
        }
        else {
            this.onOutRange();
            return false;
        }
    };
    GraphicBattleGrid.prototype.onMove = function (e) {
        var clickPos = this.getClickPos(e);
        if (this.isInRange(clickPos)) {
            this.onInRange();
        }
        else {
            this.onOutRange();
        }
        //如果处于拾取状态则让临时Node位置跟随
        if (this.pickState == 1) {
            this.setTmpNodePos(clickPos);
        }
    };
    GraphicBattleGrid.prototype.setGridNode = function (x, y, node) {
        this.grid[y][x] = node;
    };
    GraphicBattleGrid.prototype.getGridNode = function (x, y) {
        return this.grid[y][x];
    };
    GraphicBattleGrid.prototype.onEnd = function (e, downBackpack) {
        //清除落点背包显示
        if (downBackpack != null) {
            downBackpack.onOutRange();
        }
        if (this.pickState == 0) {
            return;
        }
        //恢复
        this.pickState = 0;
        this.pickNode.active = true;
        this.pickTempNode.active = false;
        if (downBackpack == null) {
            //View返回原位，Data不做处理
        }
        else if (downBackpack.node == this.node) {
            var oldGridPos = this.pickGridPos;
            var clickPos = this.getClickPos(e);
            var newGridPos = this.getGridPos(clickPos);
            console.log("(", oldGridPos.x, ",", oldGridPos.y, ")", "(", newGridPos.x, ",", newGridPos.y, ")");
            if (newGridPos.x == oldGridPos.x && newGridPos.y == oldGridPos.y) {
                //相同位置，View放回，Data不变
            }
            else {
                var oldNode = this.grid[oldGridPos.y][oldGridPos.x];
                var newNode = this.grid[newGridPos.y][newGridPos.x];
                if (this.hasItem(newGridPos)) {
                    //存在Node
                    //交换View
                    var oldPos = oldNode.getPosition().clone();
                    var newPos = newNode.getPosition().clone();
                    oldNode.setPosition(newPos);
                    newNode.setPosition(oldPos);
                    this.grid[oldGridPos.y][oldGridPos.x] = newNode;
                    this.grid[newGridPos.y][newGridPos.x] = oldNode;
                }
                else {
                    //不存在Node
                    //移动View
                    this.grid[oldGridPos.y][oldGridPos.x] = null;
                    this.grid[newGridPos.y][newGridPos.x] = oldNode;
                    var newPos = this.getGridNodePos(newGridPos.x, newGridPos.y);
                    oldNode.setPosition(newPos);
                }
                //TODO 交换数据
            }
        }
        else {
            //其它背包，只有一种情况，自己肯定要取下来，如果对面有则放到自己这边，如果没有则不管
            //自己这边的位置
            var oldGridPos = this.pickGridPos;
            //目标位置
            var clickPos = downBackpack.getClickPos(e);
            var newGridPos = downBackpack.getGridPos(clickPos);
            console.log("(", oldGridPos.x, ",", oldGridPos.y, ")", "(", newGridPos.x, ",", newGridPos.y, ")");
            //自己肯定存在，所以将自己取下来 挂到对方上面
            var newPos = downBackpack.getGridNodePos(newGridPos.x, newGridPos.y);
            var oldNode = this.getGridNode(oldGridPos.x, oldGridPos.y);
            oldNode.removeFromParent();
            downBackpack.node.insertChild(oldNode, 0);
            oldNode.setPosition(newPos);
            var newNode = null;
            if (downBackpack.hasItem(newGridPos)) {
                //取下目标，也挂到对面
                var oldPos = this.getGridNodePos(oldGridPos.x, oldGridPos.y);
                newNode = downBackpack.getGridNode(newGridPos.x, newGridPos.y);
                newNode.removeFromParent();
                this.node.insertChild(newNode, 0);
                newNode.setPosition(oldPos);
            }
            //最终设置到网格
            downBackpack.setGridNode(newGridPos.x, newGridPos.y, oldNode);
            this.setGridNode(oldGridPos.x, oldGridPos.y, newNode);
            //TODO 交换数据
        }
        //清除状态
        this.pickGridPos = null;
        this.pickNode = null;
    };
    /*****************************************************
     * Backpack接口 结束
     ****************************************************/
    GraphicBattleGrid.prototype.drawRect = function (x, y, width, height, strokeColor, fillColor, lineWidth) {
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
    GraphicBattleGrid.prototype.drawGrid = function () {
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
    GraphicBattleGrid.prototype.update = function (dt) {
        this.ctx.clear();
        this.drawGrid();
        if (this.inRange) {
            this.drawRect(this.worldAABB.min.x, this.worldAABB.min.y, this.gridSize.x, this.gridSize.y, cc.Color.YELLOW);
        }
    };
    __decorate([
        property(cc.Node)
    ], GraphicBattleGrid.prototype, "offsetNode", void 0);
    __decorate([
        property(cc.Node)
    ], GraphicBattleGrid.prototype, "pickTempNode", void 0);
    GraphicBattleGrid = __decorate([
        ccclass
    ], GraphicBattleGrid);
    return GraphicBattleGrid;
}(BackpackComponent_1.default));
exports.default = GraphicBattleGrid;
