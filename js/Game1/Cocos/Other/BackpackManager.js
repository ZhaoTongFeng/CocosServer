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
var BackpackManager = /** @class */ (function (_super) {
    __extends(BackpackManager, _super);
    function BackpackManager() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.canTouch = true;
        _this.backpacks = [];
        _this.currentBackpack = null;
        return _this;
    }
    // LIFE-CYCLE CALLBACKS:
    BackpackManager.prototype.onLoad = function () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this); //手指在目标区域外离开
    };
    BackpackManager.prototype.start = function () {
        this.backpacks = this.node.getComponentsInChildren("BackpackComponent");
        console.log(this.backpacks);
    };
    //判断点击位置，是否处于任何一个背包范围
    //如果处于背包则执行背包操作
    BackpackManager.prototype.onTouchStart = function (e) {
        var _this = this;
        if (this.canTouch) {
            this.backpacks.forEach(function (backpack) {
                if (backpack.onStart(e)) {
                    _this.currentBackpack = backpack;
                    return;
                }
            });
            if (this.currentBackpack) {
            }
        }
    };
    BackpackManager.prototype.onTouchMove = function (e) {
        if (this.canTouch) {
            this.backpacks.forEach(function (backpack) {
                backpack.onMove(e);
            });
        }
    };
    //在放下的时候，将下面的backpack传给正在移动的backpack
    //放下被点击Node
    BackpackManager.prototype.onTouchEnd = function (e) {
        if (this.canTouch && this.currentBackpack) {
            //找出落点背包
            var downBackpack_1 = null;
            this.backpacks.forEach(function (backpack) {
                var clickPos = backpack.getClickPos(e);
                if (backpack.isInRange(clickPos)) {
                    downBackpack_1 = backpack;
                    return;
                }
            });
            //在当前背包进行处理
            this.currentBackpack.onEnd(e, downBackpack_1);
            this.currentBackpack = null;
        }
    };
    BackpackManager.prototype.onTouchCancel = function (e) {
        if (this.canTouch && this.currentBackpack) {
            this.currentBackpack.onEnd(e, null);
            this.currentBackpack = null;
        }
    };
    BackpackManager = __decorate([
        ccclass
    ], BackpackManager);
    return BackpackManager;
}(cc.Component));
exports.default = BackpackManager;
