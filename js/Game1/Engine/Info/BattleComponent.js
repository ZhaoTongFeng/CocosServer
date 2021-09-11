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
var UMath_1 = require("../../../Engine/Engine/UMath");
var Ship_1 = __importDefault(require("../Pawn/Ship"));
/**
 * 战斗系统组件
 * 生命血量等数据、UI
 */
var UBattleComponent = /** @class */ (function (_super) {
    __extends(UBattleComponent, _super);
    function UBattleComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.teamId = "";
        return _this;
    }
    UBattleComponent_1 = UBattleComponent;
    UBattleComponent.prototype.unUse = function () {
        _super.prototype.unUse.call(this);
    };
    UBattleComponent.prototype.reUse = function () {
        _super.prototype.reUse.call(this);
        this.teamId = "";
    };
    UBattleComponent.prototype.setTeamId = function (id) {
        if (id != "") {
            if (this.owner instanceof Ship_1.default) {
                //从老的Team中删除
                var oldBattle = this.owner.getBattleComp();
                if (oldBattle) {
                    var oldArr = UBattleComponent_1.Teams.get(oldBattle.teamId);
                    if (oldArr) {
                        var index = oldArr.indexOf(this.owner);
                        if (index >= 0) {
                            oldArr.splice(index, 1);
                        }
                    }
                }
                //添加到新的Team
                var newArr = UBattleComponent_1.Teams.get(id);
                if (newArr == null || newArr == undefined) {
                    newArr = [];
                    UBattleComponent_1.Teams.set(id, newArr);
                    UBattleComponent_1.TeamColor.push(UMath_1.uu.color(Math.random() * 255, Math.random() * 255, Math.random() * 255));
                }
                newArr.push(this.owner);
                this.teamId = id;
            }
        }
    };
    UBattleComponent.prototype.getTreamId = function () {
        return this.teamId;
    };
    UBattleComponent.prototype.init = function (obj) {
        _super.prototype.init.call(this, obj);
        if (obj instanceof Ship_1.default) {
            obj.setBattleComp(this);
        }
    };
    UBattleComponent.prototype.processInput = function (input) {
    };
    UBattleComponent.prototype.update = function (dt) {
    };
    //绘制血量：红色、护盾：蓝色、充能武器？：黄色（有可能不止一种武器）
    UBattleComponent.prototype.drawDebug = function (graphic) {
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
        // //左
        // fillColor = UColor.RED;
        var x = actorPos.x - actorSzie - paddingActor - width;
        // graphic.drawRect(x, y, width, height, borderColor, fillColor, lineWidth);
        // //右
        // fillColor = UColor.BLUE;
        // x = actorPos.x + actorSzie + paddingActor;
        // graphic.drawRect(x, y, width, height, borderColor, fillColor, lineWidth);
        // //下
        // fillColor = UColor.YELLOW;
        // x = actorPos.x - actorSzie;
        // y = actorPos.y - height / 2 - paddingActor - width;
        // graphic.drawRect(x, y, height, width, borderColor, fillColor, lineWidth);
        // 上
        fillColor = UMath_1.UColor.YELLOW();
        x = actorPos.x - actorSzie;
        y = actorPos.y + height / 2 + paddingActor;
        graphic.drawRect(x, y, height, width, borderColor, UBattleComponent_1.TeamColor[this.teamId], lineWidth);
    };
    UBattleComponent.prototype.onDestory = function () {
        if (this.owner instanceof Ship_1.default) {
            this.owner.setBattleComp(null);
        }
        _super.prototype.onDestory.call(this);
    };
    var UBattleComponent_1;
    //队伍
    UBattleComponent.TeamColor = [];
    UBattleComponent.Teams = new Map();
    UBattleComponent = UBattleComponent_1 = __decorate([
        XBase_1.xclass(UBattleComponent_1)
    ], UBattleComponent);
    return UBattleComponent;
}(Component_1.default));
exports.default = UBattleComponent;
