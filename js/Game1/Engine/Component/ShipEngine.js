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
var Component_1 = __importDefault(require("../../../Engine/Component/Component"));
var XBase_1 = require("../../../Engine/Engine/ReflectSystem/XBase");
var Ship_1 = __importDefault(require("../Pawn/Ship"));
/**
 * 飞船引擎
 *
 */
var UShipEngine = /** @class */ (function (_super) {
    __extends(UShipEngine, _super);
    function UShipEngine() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //引擎提供的动力
        _this.movePower = 100;
        //运行功率
        _this.rate = 1;
        return _this;
    }
    UShipEngine_1 = UShipEngine;
    UShipEngine.prototype.unUse = function () {
        _super.prototype.unUse.call(this);
    };
    UShipEngine.prototype.reUse = function () {
        _super.prototype.reUse.call(this);
    };
    UShipEngine.prototype.init = function (obj) {
        _super.prototype.init.call(this, obj);
        if (this.owner instanceof Ship_1.default) {
            this.owner.setEngine(this);
        }
    };
    UShipEngine.prototype.update = function (dt) {
    };
    UShipEngine.prototype.drawDebug = function (graphic) {
    };
    UShipEngine.prototype.destory = function () {
        if (this.owner instanceof Ship_1.default) {
            this.owner.setEngine(null);
        }
        _super.prototype.destory.call(this);
    };
    var UShipEngine_1;
    UShipEngine = UShipEngine_1 = __decorate([
        XBase_1.xclass(UShipEngine_1)
    ], UShipEngine);
    return UShipEngine;
}(Component_1.default));
exports.default = UShipEngine;
