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
var XBase_1 = require("../../../Engine/Engine/ReflectSystem/XBase");
var UMath_1 = require("../../../Engine/Engine/UMath");
var BattleComponent_1 = __importDefault(require("./BattleComponent"));
/**
 * 玩家当前操控的角色的战斗系统组件
 * 显示不同
 */
var UPlayerBattleComponent = /** @class */ (function (_super) {
    __extends(UPlayerBattleComponent, _super);
    function UPlayerBattleComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UPlayerBattleComponent_1 = UPlayerBattleComponent;
    UPlayerBattleComponent.prototype.init = function (obj) {
        _super.prototype.init.call(this, obj);
    };
    UPlayerBattleComponent.prototype.processInput = function (input) {
    };
    UPlayerBattleComponent.prototype.update = function (dt) {
    };
    //绘制血量：红色、护盾：蓝色、充能武器？：黄色（有可能不止一种武器）
    UPlayerBattleComponent.prototype.drawDebug = function (graphic) {
        return;
        var width = 10;
        var height = this.owner.getSize().y * this.owner.getScale().y;
        var lineWidth = 3; //线条宽度
        var paddingActor = 5; //距离Actor边框的距离
        var paddingEach = 5; //每个条的间距
        var borderColor = UMath_1.UColor.WHITE();
        var fillColor = UMath_1.UColor.RED();
        var actorSzie = this.owner.getSize().x / 2 * this.owner.getScale().x;
        var actorPos = this.owner.getPosition();
        var y = actorPos.y - height / 2;
        //左
        fillColor = UMath_1.UColor.RED();
        var x = actorPos.x - actorSzie - paddingActor - width;
        graphic.drawRect(x, y, width, height, borderColor, fillColor, lineWidth);
        //右
        fillColor = UMath_1.UColor.BLUE();
        x = actorPos.x + actorSzie + paddingActor;
        graphic.drawRect(x, y, width, height, borderColor, fillColor, lineWidth);
        //下
        fillColor = UMath_1.UColor.YELLOW();
        x = actorPos.x - actorSzie;
        y = actorPos.y - height / 2 - paddingActor - width;
        graphic.drawRect(x, y, height, width, borderColor, fillColor, lineWidth);
        //上
        fillColor = UMath_1.UColor.RED();
        width *= 2;
        height *= 2;
        x = actorPos.x - height / 2;
        y = actorPos.y + actorSzie + paddingActor;
        graphic.drawRect(x, y, height, width, borderColor, fillColor, lineWidth);
    };
    UPlayerBattleComponent.prototype.destory = function () {
        _super.prototype.destory.call(this);
    };
    var UPlayerBattleComponent_1;
    UPlayerBattleComponent = UPlayerBattleComponent_1 = __decorate([
        XBase_1.xclass(UPlayerBattleComponent_1)
    ], UPlayerBattleComponent);
    return UPlayerBattleComponent;
}(BattleComponent_1.default));
exports.default = UPlayerBattleComponent;
