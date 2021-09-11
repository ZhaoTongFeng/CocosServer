import AActor from "../../../Engine/Actor/Actor";
import AAIController from "../../../Engine/Actor/Controller/AIController";
import APawn from "../../../Engine/Actor/Pawn/Pawn";
import { UpdateState } from "../../../Engine/Engine/Enums";
import { UInputSystem } from "../../../Engine/Engine/InputSystem/InputSystem";
import { xclass } from "../../../Engine/Engine/ReflectSystem/XBase";
import UGraphic from "../../../Engine/Engine/UGraphic";
import { UVec2, uu, UColor } from "../../../Engine/Engine/UMath";
import UWorld from "../../../Engine/Engine/World";
import AShip from "../Pawn/Ship";


export enum AIMoveState {
    IDLE,
    MOVING,
}

export enum AIMoveBehavior {
    IDLEMOVE,
    JUSTMOVE
}

/**
 * AI控制器
 * 控制AI行为，比如移动，射击
 */
@xclass(AAIShipController)
export default class AAIShipController extends AAIController {

    //配置属性
    protected target: UVec2 = uu.v2(0, 0);
    protected moveState: AIMoveState = AIMoveState.IDLE;
    protected moveBehavior: AIMoveBehavior = AIMoveBehavior.JUSTMOVE


    //移动计时器
    protected moveTimer: number = 3;
    protected moveDelay: number = 5;

    //目标范围
    protected range: number = 300;

    unUse() {
        super.unUse();
    }

    reUse() {
        super.reUse();
        this.target.x = 0;
        this.target.y = 0;
        this.moveState = AIMoveState.IDLE;
        this.moveBehavior = AIMoveBehavior.JUSTMOVE;
        this.moveTimer = 3;
        this.moveDelay = 5;
        this.range = 300;
    }

    init(world: UWorld) {
        super.init(world);

    }

    protected processSelfInput(input: UInputSystem) {
        let pos = this.getPosition();
        let movement = this.pawn.getMovement();
        movement.force = UVec2.ZERO();

        let dir = this.target.sub(pos).normalize();

        movement.force.x += dir.x * movement.max_force * Math.random();
        movement.force.y += dir.y * movement.max_force * Math.random();
    }

    protected drawDebugActor(graphic: UGraphic) {
        if (!this.world.isDebug) {
            return;
        }
        let actor = this.findCloseOtherTeam();

        if (actor) {
            graphic.drawLine(this.getPosition(), actor.getPosition(), UColor.YELLOW());
        }

        let inRange = this.moveState == AIMoveState.IDLE;

        graphic.drawLine(this.getPosition(), this.target, inRange ? UColor.BLUE() : UColor.RED());
        graphic.drawCircle(this.target.x, this.target.y, this.range, inRange ? UColor.BLUE() : UColor.RED());
    }


    //随机设置目的地
    protected setRandomTarget() {
        let winSize = this.world.gameInstance.getWorldView().winSize;
        this.target.x = (Math.random() - 0.5) * winSize.x * 2;
        this.target.y = (Math.random() - 0.5) * winSize.y * 2;
    }

    //AI行为， 切换一个位置，到达之后，停顿3秒
    idleMove(dt) {
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
                let distence = this.target.sub(this.getPosition()).lengthSq();
                if (distence < this.range * this.range) {
                    this.moveState = AIMoveState.IDLE;
                }


                break;
            }
        }
    }

    //AI行为 每隔3秒，切换一个target位置
    justMove(dt) {
        this.moveTimer += dt;
        if (this.moveTimer > this.moveDelay) {
            this.moveTimer = 0;
            this.setRandomTarget();
        }
    }

    //找到场景中最近的Actor
    findClose() {
        let start = this.getPosition();
        let min = 9999999999;
        let target: AActor = null;
        this.world.actors.forEach(actor => {
            if (actor != this.pawn &&
                actor instanceof APawn &&
                actor.state == UpdateState.Active &&
                actor.getSceneComponent() != null) {
                let leng = start.sub(actor.getPosition()).lengthSq();
                if (leng < min) {
                    target = actor;
                    min = leng;
                }
            }
        });
        return target;
    }

    //找到场景中最近的其它队伍的Ship
    findCloseOtherTeam() {
        let start = this.getPosition();
        let min = 9999999999;
        let target: AActor = null;

        const thisShip = this.pawn as AShip;
        if (!thisShip) { return null; }
        const thisBattle = thisShip.getBattleComp();
        if (!thisBattle) { return null; }

        const thisTeamId = thisBattle.getTreamId();

        this.world.actors.forEach(actor => {
            if (actor != this.pawn &&
                actor instanceof AShip &&
                actor.state == UpdateState.Active &&
                actor.getSceneComponent() != null) {

                const targetBattle = actor.getBattleComp();
                if (targetBattle) {
                    const targetTeam = targetBattle.getTreamId();
                    if (targetTeam != thisTeamId) {
                        const leng = start.sub(actor.getPosition()).lengthSq();
                        if (leng < min) {
                            target = actor;
                            min = leng;
                        }
                    }
                }

            }
        });
        return target;
    }



    protected updateActor(dt) {
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
    }
}
