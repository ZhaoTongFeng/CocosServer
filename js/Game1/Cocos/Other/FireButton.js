"use strict";
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
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
var FireButton = /** @class */ (function (_super) {
    __extends(FireButton, _super);
    function FireButton() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.isPass = false;
        return _this;
    }
    FireButton.prototype.onLoad = function () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.touch, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touch, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.untouch, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.untouch, this);
    };
    FireButton.prototype.touch = function (e) {
        this.isPass = true;
        this.node.opacity = 100;
        e.stopPropagation();
    };
    FireButton.prototype.untouch = function (e) {
        this.isPass = false;
        this.node.opacity = 50;
        e.stopPropagation();
    };
    FireButton = __decorate([
        ccclass
    ], FireButton);
    return FireButton;
}(cc.Component));
exports.default = FireButton;
