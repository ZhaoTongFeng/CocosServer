import APawn from "../../../Engine/Actor/Pawn/Pawn";
import UMovementComponent from "../../../Engine/Component/Movement/MovementComponent";
import { UInputSystem } from "../../../Engine/Engine/InputSystem/InputSystem";
import { xclass } from "../../../Engine/Engine/ReflectSystem/XBase";
import { UMath, uu } from "../../../Engine/Engine/UMath";
import APlayerShipController from "../Controller/PlayerShipController";
import AShip from "../Pawn/Ship";
import UShipEngine from "./ShipEngine";

/**
 * 飞船移动组件
 * 将移动结果直接体验到SceneComponent上，
 * 让SceneComponent去同步数据，尽量不要在这些逻辑组件上去做操作。
 */
@xclass(ShipMovement)
export default class ShipMovement extends UMovementComponent {

    //无论是客户端还是服务端都会调用这个，联机模式下，客户端没有必要去做这个操作。
    public processInput(input: UInputSystem) {
        //用自己控制器的输入，更新本地状态
        let con = (this.owner as APawn).controller as APlayerShipController;
        if (con) {
            let moveRate = con.moveForce;

            //摇杆不为0，则启用引擎，提供推力
            //否则关闭引擎，不提供推力
            let moveDir = con.moveDirection;
            this.setMoveForce(moveDir.mul(moveRate*this.max_force));
        }
    }

    public update(dt: number) {
        //服务器更新状态
        if (!this.owner.world.gameInstance.bStandAlone && this.owner.world.isClient) { return; }

        //速度和方向分开处理

        //TODO 用引擎的动力 更新加速度
        let ship = this.owner as AShip;
        let engine: UShipEngine = ship.getEngine();
        if (engine) {
            let power = engine.movePower;

        }

        //TODO 以摇杆方向为目标方向，根据当前的角速度进行差值

        //更新速度
        if (this.force.x != 0 || this.force.y != 0) {
            this.acc.x = UMath.clamp(this.acc.x + this.force.x / this.mg, -this.max_acc, this.max_acc);
            this.acc.y = UMath.clamp(this.acc.y + this.force.y / this.mg, -this.max_acc, this.max_acc);
            this.velocity.x = UMath.clamp(this.velocity.x + this.acc.x * dt / 2, -this.max_vel, this.max_vel);
            this.velocity.y = UMath.clamp(this.velocity.y + this.acc.y * dt / 2, -this.max_vel, this.max_vel);

        } else {
            this.slowdown(dt);

        }


        if (this.velocity.x != 0 || this.velocity.y != 0) {
            //更新位置
            let pos = this.owner.getPosition();
            pos.x += this.velocity.x * dt;
            pos.y += this.velocity.y * dt;
            this.owner.setPosition(pos);
            //更新角度
            this.direction = this.velocity.normalize();
            let angle = this.direction.signAngle(uu.v2(0, -1))
            let rot = 180 - angle * 180 / Math.PI;
            this.owner.setRotation(rot);
        }
    }

    /**
     * 速度逐渐归零
     * 归零的加速度有待研究，理论上太空没有阻力，除非自己减速，否则会一直往前飞。
     * @param dt 
     */
    private slowdown(dt) {
        let acc = this.max_acc / 10;
        if (this.velocity.x > 0) { this.velocity.x = Math.max(this.velocity.x - acc * dt, 0); }
        if (this.velocity.x < 0) { this.velocity.x = Math.min(this.velocity.x + acc * dt, 0); }
        if (this.velocity.y > 0) { this.velocity.y = Math.max(this.velocity.y - acc * dt, 0); }
        if (this.velocity.y < 0) { this.velocity.y = Math.min(this.velocity.y + acc * dt, 0); }
    }


    //反弹减速百分比
    protected rate: number = 0.5;
    //当前移动方向反弹
    reback() {
        // let n = UVec2.ZERO();
        // let dot = this.velocity.dot(n);
        // this.direction = this.velocity.sub(n.mul(2 * dot));
        // if (n.x != 0) { this.velocity.x = n.x * Math.abs(this.direction.x * this.velocity.x * this.rate) }
        // if (n.y != 0) { this.velocity.y = n.y * Math.abs(this.direction.y * this.velocity.y * this.rate) }
    }
}
