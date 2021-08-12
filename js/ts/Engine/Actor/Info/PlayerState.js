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
var Info_1 = __importDefault(require("./Info"));
var XBase_1 = require("../../Engine/ReflectSystem/XBase");
/**
 * 玩家状态
 */
var APlayerState = /** @class */ (function (_super) {
    __extends(APlayerState, _super);
    function APlayerState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    APlayerState_1 = APlayerState;
    APlayerState.prototype.init = function (world) {
        _super.prototype.init.call(this, world);
    };
    APlayerState.prototype.processSelfInput = function (input) {
    };
    APlayerState.prototype.updateActor = function (dt) {
    };
    APlayerState.prototype.drawDebugActor = function (graphic) {
    };
    APlayerState.prototype.destory = function () {
        _super.prototype.destory.call(this);
    };
    var APlayerState_1;
    APlayerState = APlayerState_1 = __decorate([
        XBase_1.xclass(APlayerState_1)
    ], APlayerState);
    return APlayerState;
}(Info_1.default));
exports.default = APlayerState;
