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
exports.AIMoveBehavior = exports.AIMoveState = void 0;
var AIController_1 = __importDefault(require("../../../Engine/Actor/Controller/AIController"));
var Pawn_1 = __importDefault(require("../../../Engine/Actor/Pawn/Pawn"));
var Enums_1 = require("../../../Engine/Engine/Enums");
var XBase_1 = require("../../../Engine/Engine/ReflectSystem/XBase");
var UMath_1 = require("../../../Engine/Engine/UMath");
var Ship_1 = __importDefault(require("../Pawn/Ship"));
var AIMoveState;
(function (AIMoveState) {
    AIMoveState[AIMoveState["IDLE"] = 0] = "IDLE";
    AIMoveState[AIMoveState["MOVING"] = 1] = "MOVING";
})(AIMoveState = exports.AIMoveState || (exports.AIMoveState = {}));
var AIMoveBehavior;
(function (AIMoveBehavior) {
    AIMoveBehavior[AIMoveBehavior["IDLEMOVE"] = 0] = "IDLEMOVE";
    AIMoveBehavior[AIMoveBehavior["JUSTMOVE"] = 1] = "JUSTMOVE";
})(AIMoveBehavior = exports.AIMoveBehavior || (exports.AIMoveBehavior = {}));
/**
 * AI控制器
 * 控制AI行为，比如移动，射击
 */
var AAIShipController = /** @class */ (function (_super) {
    __extends(AAIShipController, _super);
    function AAIShipController() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //配置属性
        _this.target = UMath_1.uu.v2(0, 0);
        _this.moveState = AIMoveState.IDLE;
        _this.moveBehavior = AIMoveBehavior.JUSTMOVE;
        //移动计时器
        _this.moveTimer = 3;
        _this.moveDelay = 5;
        //目标范围
        _this.range = 300;
        return _this;
    }
    AAIShipController_1 = AAIShipController;
    AAIShipController.prototype.unUse = function () {
        _super.prototype.unUse.call(this);
    };
    AAIShipController.prototype.reUse = function () {
        _super.prototype.reUse.call(this);
        this.target.x = 0;
        this.target.y = 0;
        this.moveState = AIMoveState.IDLE;
        this.moveBehavior = AIMoveBehavior.JUSTMOVE;
        this.moveTimer = 3;
        this.moveDelay = 5;
        this.range = 300;
    };
    AAIShipController.prototype.init = function (world) {
        _super.prototype.init.call(this, world);
    };
    AAIShipController.prototype.processSelfInput = function (input) {
        var pos = this.getPosition();
        var movement = this.pawn.getMovement();
        movement.force = UMath_1.UVec2.ZERO();
        var dir = this.target.sub(pos).normalize();
        movement.force.x += dir.x * movement.max_force * Math.random();
        movement.force.y += dir.y * movement.max_force * Math.random();
    };
    AAIShipController.prototype.drawDebugActor = function (graphic) {
        if (!this.world.isDebug) {
            return;
        }
        var actor = this.findCloseOtherTeam();
        if (actor) {
            graphic.drawLine(this.getPosition(), actor.getPosition(), UMath_1.UColor.YELLOW());
        }
        var inRange = this.moveState == AIMoveState.IDLE;
        graphic.drawLine(this.getPosition(), this.target, inRange ? UMath_1.UColor.BLUE() : UMath_1.UColor.RED());
        graphic.drawCircle(this.target.x, this.target.y, this.range, inRange ? UMath_1.UColor.BLUE() : UMath_1.UColor.RED());
    };
    //随机设置目的地
    AAIShipController.prototype.setRandomTarget = function () {
        var winSize = this.world.gameInstance.getWorldView().winSize;
        this.target.x = (Math.random() - 0.5) * winSize.x * 2;
        this.target.y = (Math.random() - 0.5) * winSize.y * 2;
    };
    //AI行为， 切换一个位置，到达之后，停顿3秒
    AAIShipController.prototype.idleMove = function (dt) {
        switch (this.moveState) {
            case AIMoveState.IDLE: {
                //倒计时生成一个目的地，切换到移动状态
                this.moveTimer += dt;
                if (this.moveTimer > this.moveDelay) {
                    this.moveTimer = 0;
                    this.moveState = AIMoveState.MOVING;
                    this.setRandomTarget();
                }
                break;
            }
            case AIMoveState.MOVING: {
                //移动到目标点位附近，切换到IDLE状态
                var distence = this.target.sub(this.getPosition()).lengthSq();
                if (distence < this.range * this.range) {
                    this.moveState = AIMoveState.IDLE;
                }
                break;
            }
        }
    };
    //AI行为 每隔3秒，切换一个target位置
    AAIShipController.prototype.justMove = function (dt) {
        this.moveTimer += dt;
        if (this.moveTimer > this.moveDelay) {
            this.moveTimer = 0;
            this.setRandomTarget();
        }
    };
    //找到场景中最近的Actor
    AAIShipController.prototype.findClose = function () {
        var _this = this;
        var start = this.getPosition();
        var min = 9999999999;
        var target = null;
        this.world.actors.forEach(function (actor) {
            if (actor != _this.pawn &&
                actor instanceof Pawn_1.default &&
                actor.state == Enums_1.UpdateState.Active &&
                actor.getSceneComponent() != null) {
                var leng = start.sub(actor.getPosition()).lengthSq();
                if (leng < min) {
                    target = actor;
                    min = leng;
                }
            }
        });
        return target;
    };
    //找到场景中最近的其它队伍的Ship
    AAIShipController.prototype.findCloseOtherTeam = function () {
        var _this = this;
        var start = this.getPosition();
        var min = 9999999999;
        var target = null;
        var thisShip = this.pawn;
        if (!thisShip) {
            return null;
        }
        var thisBattle = thisShip.getBattleComp();
        if (!thisBattle) {
            return null;
        }
        var thisTeamId = thisBattle.getTreamId();
        this.world.actors.forEach(function (actor) {
            if (actor != _this.pawn &&
                actor instanceof Ship_1.default &&
                actor.state == Enums_1.UpdateState.Active &&
                actor.getSceneComponent() != null) {
                var targetBattle = actor.getBattleComp();
                if (targetBattle) {
                    var targetTeam = targetBattle.getTreamId();
                    if (targetTeam != thisTeamId) {
                        var leng = start.sub(actor.getPosition()).lengthSq();
                        if (leng < min) {
                            target = actor;
                            min = leng;
                        }
                    }
                }
            }
        });
        return target;
    };
    AAIShipController.prototype.updateActor = function (dt) {
        switch (this.moveBehavior) {
            case AIMoveBehavior.IDLEMOVE: {
                this.idleMove(dt);
                break;
            }
            case AIMoveBehavior.JUSTMOVE: {
                this.justMove(dt);
                break;
            }
        }
        // 发射子弹
        // this.timer += dt;
        // if (this.timer > 1 / this.fequence) {
        //     this.timer = 0;
        //     let bullet = this.world.spawn(ABullet);
        //     bullet.setPosition(this.getPosition().clone());
        //     bullet.owner = this;
        //     // let direction = this.target.sub(bullet.getPosition())
        //     let direction = this.world.player.getPosition().sub(bullet.getPosition())
        //     direction.normalizeSelf();
        //     let speed = 500;
        //     bullet.movementComponent.velocity.x = direction.x * speed
        //     bullet.movementComponent.velocity.y = direction.y * speed
        // }
        // 发射子弹v2 进入范围开始攻击
        // this.timer += dt;
        // let direction = this.world.player.getPosition().sub(this.getPosition())
        // if (this.timer > 1 / this.fequence && direction.lengthSqr() < 200000) {
        //     this.timer = 0;
        //     this.fire();
        // }
    };
    var AAIShipController_1;
    AAIShipController = AAIShipController_1 = __decorate([
        XBase_1.xclass(AAIShipController_1)
    ], AAIShipController);
    return AAIShipController;
}(AIController_1.default));
exports.default = AAIShipController;
