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
var BackpackComponent = /** @class */ (function (_super) {
    __extends(BackpackComponent, _super);
    function BackpackComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    //触摸响应
    BackpackComponent.prototype.onStart = function (e) {
        throw new Error("Method not implemented.");
    };
    BackpackComponent.prototype.onMove = function (e) {
        throw new Error("Method not implemented.");
    };
    BackpackComponent.prototype.onEnd = function (e, downBackpack) {
        throw new Error("Method not implemented.");
    };
    BackpackComponent.prototype.getClickPos = function (e) {
        throw new Error("Method not implemented.");
    };
    //范围位置
    BackpackComponent.prototype.isInRange = function (clickPos) {
        throw new Error("Method not implemented.");
    };
    BackpackComponent.prototype.onInRange = function () {
        throw new Error("Method not implemented.");
    };
    BackpackComponent.prototype.onOutRange = function () {
        throw new Error("Method not implemented.");
    };
    BackpackComponent.prototype.getGridPos = function (pos) {
        throw new Error("Method not implemented.");
    };
    BackpackComponent.prototype.getGridNodePos = function (x, y) {
        throw new Error("Method not implemented.");
    };
    BackpackComponent.prototype.hasItem = function (gridPos) {
        throw new Error("Method not implemented.");
    };
    BackpackComponent.prototype.setGridNode = function (x, y, node) {
        throw new Error("Method not implemented.");
    };
    BackpackComponent.prototype.getGridNode = function (x, y) {
        throw new Error("Method not implemented.");
    };
    //拾取
    BackpackComponent.prototype.pickUp = function (clickPos, gridPos) {
        throw new Error("Method not implemented.");
    };
    BackpackComponent.prototype.onPickUp = function (data) {
        throw new Error("Method not implemented.");
    };
    //放下
    BackpackComponent.prototype.pickDown = function () {
        throw new Error("Method not implemented.");
    };
    BackpackComponent.prototype.onPickDow = function () {
        throw new Error("Method not implemented.");
    };
    BackpackComponent = __decorate([
        ccclass
    ], BackpackComponent);
    return BackpackComponent;
}(cc.Component));
exports.default = BackpackComponent;
