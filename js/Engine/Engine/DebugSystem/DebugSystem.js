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
exports.UDebugSystem = void 0;
var Object_1 = __importDefault(require("../../Object"));
var XBase_1 = require("../ReflectSystem/XBase");
var UMath_1 = require("../UMath");
var UDebugSystem = /** @class */ (function (_super) {
    __extends(UDebugSystem, _super);
    function UDebugSystem() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.world = null;
        return _this;
    }
    UDebugSystem_1 = UDebugSystem;
    UDebugSystem.prototype.debugAll = function (graphic) {
        var winSize = this.world.gameInstance.getWorldView().winSize;
        graphic.drawRect(winSize.x * -1, winSize.y * -1, winSize.x * 2, winSize.y * 2, UMath_1.UColor.BLUE());
        this.world.actors.forEach(function (actor) {
            actor.drawDebug(graphic);
        });
    };
    UDebugSystem.prototype.init = function (world) {
        _super.prototype.init.call(this, world);
        this.world = world;
    };
    var UDebugSystem_1;
    UDebugSystem = UDebugSystem_1 = __decorate([
        XBase_1.xclass(UDebugSystem_1)
    ], UDebugSystem);
    return UDebugSystem;
}(Object_1.default));
exports.UDebugSystem = UDebugSystem;