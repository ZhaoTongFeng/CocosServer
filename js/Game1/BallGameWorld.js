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
var XBase_1 = require("../Engine/Engine/ReflectSystem/XBase");
var World_1 = __importDefault(require("../Engine/Engine/World"));
var RacketController_1 = __importDefault(require("./Engine/Actor/Controller/RacketController"));
var Racket_1 = __importDefault(require("./Engine/Actor/Racket"));
var RacketMovement_1 = __importDefault(require("./Engine/Component/RacketMovement"));
//游戏关卡二
var BallGameWorld = /** @class */ (function (_super) {
    __extends(BallGameWorld, _super);
    function BallGameWorld() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.movement = null;
        return _this;
    }
    BallGameWorld_1 = BallGameWorld;
    BallGameWorld.prototype.init = function (data) {
        if (data === void 0) { data = null; }
        _super.prototype.init.call(this, data);
        console.log("BallGameWorld");
        var racket1 = this.spawn(Racket_1.default);
        var movement = racket1.spawnComponent(RacketMovement_1.default);
        this.movement = movement;
        var controller1 = this.spawn(RacketController_1.default);
        controller1.process(racket1);
        controller1.racketMovement = movement;
    };
    var BallGameWorld_1;
    BallGameWorld = BallGameWorld_1 = __decorate([
        XBase_1.xclass(BallGameWorld_1)
    ], BallGameWorld);
    return BallGameWorld;
}(World_1.default));
exports.default = BallGameWorld;
