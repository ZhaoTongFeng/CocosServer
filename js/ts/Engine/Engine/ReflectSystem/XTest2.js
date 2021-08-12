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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var XBase_1 = require("./XBase");
var XTest1_1 = __importDefault(require("./XTest1"));
var XTest2 = /** @class */ (function (_super) {
    __extends(XTest2, _super);
    function XTest2() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.num = 3;
        _this.pointer = null;
        _this.nul = null;
        _this.defclss = new XTest1_1.default();
        return _this;
    }
    XTest2_1 = XTest2;
    //序列化接口
    XTest2.prototype.onToJSON = function (obj) {
        obj["abc"] = "123";
    };
    XTest2.prototype.onFromJSON = function (obj) {
        this.abc = obj['abc'];
    };
    var XTest2_1;
    __decorate([
        XBase_1.xproperty(Number, { _k_: "num_clas2", n: 1, tyoe: "input", min: 0, max: 10 })
    ], XTest2.prototype, "num", void 0);
    __decorate([
        XBase_1.xproperty(XTest1_1.default)
    ], XTest2.prototype, "pointer", void 0);
    __decorate([
        XBase_1.xproperty(String)
    ], XTest2.prototype, "qwds", void 0);
    __decorate([
        XBase_1.xproperty(String, { _k_: "ergfdsg" })
    ], XTest2.prototype, "name425", void 0);
    __decorate([
        XBase_1.xproperty(XTest1_1.default, { _k_: "hrthtrdh" })
    ], XTest2.prototype, "cls1", void 0);
    __decorate([
        XBase_1.xproperty(Array)
    ], XTest2.prototype, "poss", void 0);
    __decorate([
        XBase_1.xproperty(Array, {})
    ], XTest2.prototype, "arr1", void 0);
    __decorate([
        XBase_1.xproperty(Array)
    ], XTest2.prototype, "arr2", void 0);
    __decorate([
        XBase_1.xproperty(Map)
    ], XTest2.prototype, "mp1", void 0);
    __decorate([
        XBase_1.xproperty(Map, {})
    ], XTest2.prototype, "mp2", void 0);
    __decorate([
        XBase_1.xproperty(Set)
    ], XTest2.prototype, "st1", void 0);
    __decorate([
        XBase_1.xproperty(Set, {})
    ], XTest2.prototype, "st2", void 0);
    __decorate([
        XBase_1.xproperty(Set, {})
    ], XTest2.prototype, "st3", void 0);
    __decorate([
        XBase_1.xproperty(XTest1_1.default)
    ], XTest2.prototype, "nul", void 0);
    __decorate([
        XBase_1.xproperty(XTest1_1.default)
    ], XTest2.prototype, "defclss", void 0);
    XTest2 = XTest2_1 = __decorate([
        XBase_1.xclass(XTest2_1, { title: "物品" })
    ], XTest2);
    return XTest2;
}(XTest1_1.default));
exports.default = XTest2;
