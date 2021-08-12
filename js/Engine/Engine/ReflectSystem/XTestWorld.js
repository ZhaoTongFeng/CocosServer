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
var XBase_1 = require("./XBase");
var XTestWorld = /** @class */ (function (_super) {
    __extends(XTestWorld, _super);
    function XTestWorld() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.objects = [];
        return _this;
    }
    XTestWorld_1 = XTestWorld;
    var XTestWorld_1;
    __decorate([
        XBase_1.xproperty(Array)
    ], XTestWorld.prototype, "objects", void 0);
    XTestWorld = XTestWorld_1 = __decorate([
        XBase_1.xclass(XTestWorld_1)
    ], XTestWorld);
    return XTestWorld;
}(XBase_1.XBase));
exports.default = XTestWorld;
