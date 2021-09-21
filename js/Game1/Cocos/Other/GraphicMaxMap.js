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
var GraphicMaxMap = /** @class */ (function (_super) {
    __extends(GraphicMaxMap, _super);
    function GraphicMaxMap() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.ctx = null;
        _this.radius = 50;
        _this.centerPos = cc.v2();
        _this.enemyPos = [];
        _this.selfSize = 20;
        _this.enemySize = 10;
        return _this;
    }
    GraphicMaxMap.prototype.onLoad = function () {
        this.ctx = this.node.getComponent(cc.Graphics);
        this.enemyPos.push(cc.v2(0, 1));
        this.enemyPos.push(cc.v2(1, 0));
    };
    GraphicMaxMap.prototype.update = function () {
        // this.ctx.clear();
        // this.drawBackground();
        // this.drawSelf();
        // UGameInstance.Ins.getWorld().actors.forEach(actor => {
        //     if (actor instanceof APawn) {
        //         let pos = actor.getPosition();
        //         if (!pos.equalZero()) {
        //             this.drawEnemy(pos);
        //         }
        //     }
        // });
        // // this.enemyPos.forEach(pos => {
        // //     this.drawEnemy(pos);
        // // });
    };
    GraphicMaxMap.prototype.drawBackground = function () {
        // this.ctx.strokeColor = cc.Color.WHITE;
        // this.ctx.lineWidth = 5;
        // this.ctx.circle(0, 0, this.radius);
        // this.ctx.stroke();
    };
    GraphicMaxMap.prototype.drawSelf = function () {
        this.ctx.fillColor = cc.Color.YELLOW;
        this.ctx.circle(0, 0, this.selfSize);
        this.ctx.fill();
    };
    GraphicMaxMap.prototype.drawEnemy = function (pos) {
        // let realPos = this.centerPos.sub(pos).normalize().mul(this.radius);
        this.ctx.fillColor = cc.Color.RED;
        this.ctx.circle(pos.x, pos.y, this.enemySize);
        this.ctx.fill();
    };
    GraphicMaxMap = __decorate([
        ccclass
    ], GraphicMaxMap);
    return GraphicMaxMap;
}(cc.Component));
exports.default = GraphicMaxMap;
