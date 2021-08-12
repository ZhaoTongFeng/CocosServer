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
var MovementComponent_1 = __importDefault(require("../../../Engine/Component/Movement/MovementComponent"));
var XBase_1 = require("../../../Engine/Engine/ReflectSystem/XBase");
var UMath_1 = require("../../../Engine/Engine/UMath");
var RacketMovement = /** @class */ (function (_super) {
    __extends(RacketMovement, _super);
    function RacketMovement() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.targetPos = UMath_1.uu.v2();
        return _this;
    }
    RacketMovement_1 = RacketMovement;
    RacketMovement.prototype.update = function (dt) {
        this.owner.setPosition(this.targetPos);
    };
    var RacketMovement_1;
    __decorate([
        XBase_1.xproperty(UMath_1.UVec2)
    ], RacketMovement.prototype, "targetPos", void 0);
    RacketMovement = RacketMovement_1 = __decorate([
        XBase_1.xclass(RacketMovement_1),
        XBase_1.xStatusSync(RacketMovement_1, ["targetPos"])
    ], RacketMovement);
    return RacketMovement;
}(MovementComponent_1.default));
exports.default = RacketMovement;
