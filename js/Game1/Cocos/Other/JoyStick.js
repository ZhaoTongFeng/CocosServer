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
var JoyStick = /** @class */ (function (_super) {
    __extends(JoyStick, _super);
    function JoyStick() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.intter = null;
        _this.outter = null;
        _this.outerSprite = null;
        _this.radius = 0;
        _this.direction = UMath_1.uu.v2(); //方向
        _this.rate = 0; //长度
        _this.bResetCenter = false; //松开按钮之后是否复位到中心
        _this.intterLength = 0.5; //死区范围
        _this.intterLengthRate = 0.9;
        _this._intterPos = cc.v2();
        _this.keyboardDir = cc.v2();
        return _this;
    }
    JoyStick_1 = JoyStick;
    Object.defineProperty(JoyStick.prototype, "intterPos", {
        set: function (value) {
            if (value.equals(cc.Vec2.ZERO)) {
                this.rate = 0;
                this.direction = UMath_1.uu.v2(value.x, value.y);
                this._intterPos = value;
            }
            else {
                var length_1 = UMath_1.UMath.clamp(value.mag(), -1 * this.radius, this.radius);
                this.rate = length_1 / this.radius;
                this.direction = UMath_1.uu.v2(value.x, value.y).normalize();
                var res = this.direction.mul(length_1);
                this._intterPos.x = res.x;
                this._intterPos.y = res.y;
            }
            this.intter.setPosition(this._intterPos);
            this.outerSprite.fillRange = -1 * this.rate;
            this.node.emit(JoyStick_1.JOYSTICK_CHANGE, this.direction, this.rate);
        },
        enumerable: false,
        configurable: true
    });
    JoyStick.prototype.onLoad = function () {
        this.radius = this.node.getContentSize().width / 2;
        this.windowPos = cc.v2(cc.winSize.width / 2, cc.winSize.height / 2);
        this.outerSprite = this.outter.getComponent(cc.Sprite);
        this.intterLength = this.intterLengthRate * this.radius * this.intterLengthRate * this.radius;
        //手指在目标区域外离开
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouching, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouching, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onEndTouch, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onEndTouch, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyboardStart, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUpEnd, this);
    };
    JoyStick.prototype.getVec = function (e) {
        var vector = cc.v2(e.touch.getLocationX(), e.touch.getLocationY());
        vector.subSelf(this.windowPos);
        vector.subSelf(this.node.getPosition());
        return vector;
    };
    JoyStick.prototype.computeIntterPos = function (e) {
        var vector = this.getVec(e);
        this.intterPos = vector;
    };
    JoyStick.prototype.computeIntterPosEnd = function (e) {
        var vector = this.getVec(e);
        if (vector.lengthSqr() <= this.intterLength) {
            this.intterPos = cc.Vec2.ZERO;
        }
        else {
            this.intterPos = vector;
        }
    };
    JoyStick.prototype.onTouching = function (e) {
        this.computeIntterPos(e);
        e.stopPropagation();
    };
    JoyStick.prototype.onEndTouch = function (e) {
        if (this.bResetCenter) {
            this.intterPos = cc.Vec2.ZERO;
        }
        else {
            this.computeIntterPosEnd(e);
        }
        e.stopPropagation();
    };
    JoyStick.prototype.onKeyboardStart = function (event) {
        switch (event.keyCode) {
            case cc.macro.KEY.w:
                this.keyboardDir.y = this.radius;
                break;
            case cc.macro.KEY.s:
                this.keyboardDir.y = -this.radius;
                break;
            case cc.macro.KEY.a:
                this.keyboardDir.x = -this.radius;
                break;
            case cc.macro.KEY.d:
                this.keyboardDir.x = this.radius;
                break;
        }
        this.intterPos = this.keyboardDir;
    };
    JoyStick.prototype.onKeyUpEnd = function (event) {
        switch (event.keyCode) {
            case cc.macro.KEY.w:
            case cc.macro.KEY.s:
                this.keyboardDir.y = 0;
                break;
            case cc.macro.KEY.a:
            case cc.macro.KEY.d:
                this.keyboardDir.x = 0;
                break;
        }
        this.intterPos = this.keyboardDir;
    };
    var JoyStick_1;
    JoyStick.JOYSTICK_CHANGE = "JOYSTICK_CHANGE";
    __decorate([
        property(cc.Node)
    ], JoyStick.prototype, "intter", void 0);
    __decorate([
        property(cc.Node)
    ], JoyStick.prototype, "outter", void 0);
    JoyStick = JoyStick_1 = __decorate([
        ccclass
    ], JoyStick);
    return JoyStick;
}(cc.Component));
exports.default = JoyStick;
