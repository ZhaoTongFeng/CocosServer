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
var UMath_1 = require("../UMath");
var XBase_1 = require("./XBase");
/**
 * 类装饰器
 * 基础写法：@xclass(类名)
 * 不能写成@xclass
 */
var XTest1 = /** @class */ (function (_super) {
    __extends(XTest1, _super);
    function XTest1() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.parent = null;
        _this.num = 2;
        _this.name1 = "";
        _this.abc = 0;
        //cc属性
        _this.pos = UMath_1.uu.v2(1, 2);
        _this.color = UMath_1.uu.color(1, 2, 3, 4);
        _this.rect = UMath_1.uu.rect(1, 2, 3, 4);
        _this.matrix = UMath_1.uu.matrix3();
        return _this;
    }
    XTest1_1 = XTest1;
    XTest1.prototype.onToJSON = function (obj) {
        obj["abc"] = "456";
    };
    XTest1.prototype.onFromJSON = function (obj) {
        this.abc = obj['abc'];
    };
    var XTest1_1;
    __decorate([
        XBase_1.xproperty(XBase_1.XBase)
    ], XTest1.prototype, "parent", void 0);
    __decorate([
        XBase_1.xproperty(Number, { _k_: "num_clas1", n: 1, tyoe: "input", min: 0, max: 10 })
    ], XTest1.prototype, "num", void 0);
    __decorate([
        XBase_1.xproperty(String, { title: "名字", type: "label" })
    ], XTest1.prototype, "name1", void 0);
    __decorate([
        XBase_1.xproperty(UMath_1.UVec2)
    ], XTest1.prototype, "pos", void 0);
    __decorate([
        XBase_1.xproperty(UMath_1.UColor)
    ], XTest1.prototype, "color", void 0);
    __decorate([
        XBase_1.xproperty(UMath_1.URect)
    ], XTest1.prototype, "rect", void 0);
    __decorate([
        XBase_1.xproperty(UMath_1.UMatrix3)
    ], XTest1.prototype, "matrix", void 0);
    XTest1 = XTest1_1 = __decorate([
        XBase_1.xclass(XTest1_1, { title: "英雄" })
    ], XTest1);
    return XTest1;
}(XBase_1.XBase));
exports.default = XTest1;
