import AActor from "../../../Engine/Actor/Actor";
import APawn from "../../../Engine/Actor/Pawn/Pawn";
import UMovementComponent from "../../../Engine/Component/Movement/MovementComponent";
import { TouchState, UInputSystem } from "../../../Engine/Engine/InputSystem/InputSystem";
import { XBase, xclass, XManager } from "../../../Engine/Engine/ReflectSystem/XBase";
import { UMath, UVec2, uu } from "../../../Engine/Engine/UMath";
import APlayerShipController from "../Controller/PlayerShipController";

export type SceneCompData = {
    pos: number[],
    rot: number
}

@xclass(UCharacterMovement)
export default class UCharacterMovement extends UMovementComponent {

    //反弹减速百分比
    protected rate: number = 0.5;

    unUse() {
        super.unUse();
    }

    reUse() {
        super.reUse();
        this.rate = 0.5;
    }


    public init(obj: any) {
        super.init(obj);

    }

    receiveData(obj: Object) {

    }

    public destory() {

        super.destory();
    }

    public processInput(input: UInputSystem) {
        //用自己控制器的输入，更新本地状态
        let con = (this.owner as APawn).controller as APlayerShipController;
        if (con) {
            let moveDir = con.moveDirection;
            let moveRate = con.moveForce;
            this.setMoveForce(moveDir.mul(moveRate));
        }

    }

    slowdown(dt) {
        let acc = this.max_acc / 10
        if (this.velocity.x > 0) {
            this.velocity.x = Math.max(this.velocity.x - acc * dt, 0);
        }
        if (this.velocity.x < 0) {
            this.velocity.x = Math.min(this.velocity.x + acc * dt, 0);
        }
        if (this.velocity.y > 0) {
            this.velocity.y = Math.max(this.velocity.y - acc * dt, 0);
        }
        if (this.velocity.y < 0) {
            this.velocity.y = Math.min(this.velocity.y + acc * dt, 0);
        }
    }

    public update(dt: number) {
        //服务器更新状态
        if (this.owner.world.isClient) { return; }

        //限制力度范围
        let forceRate = this.force.length();
        if (forceRate != 0) {
            let forceDir = this.force.normalize();
            this.force = forceDir.mul(UMath.clamp(forceRate, -this.max_force, this.max_force));
            this.acc.x = UMath.clamp(this.acc.x + this.force.x / this.mg, -this.max_acc, this.max_acc)
            this.acc.y = UMath.clamp(this.acc.y + this.force.y / this.mg, -this.max_acc, this.max_acc);

            this.velocity.x = UMath.clamp(this.velocity.x + this.acc.x * dt / 2, -this.max_vel, this.max_vel);
            this.velocity.y = UMath.clamp(this.velocity.y + this.acc.y * dt / 2, -this.max_vel, this.max_vel);
        } else {
            this.slowdown(dt);
        }

        let pos = this.owner.getPosition();
        pos.x += this.velocity.x * dt;
        pos.y += this.velocity.y * dt;
        this.owner.setPosition(pos);

        //行进方向 计算出 当前角度
        if (this.velocity.x != 0 && this.velocity.y != 0) {
            this.direction = this.velocity.normalize();

            let size = this.owner.getSize();
            let scale = this.owner.getScale();
            let size_rel = size.clone();
            size_rel.x *= scale.x / 2;
            size_rel.y *= scale.y / 2;



            //更新角度
            let rot = 0;
            if (!this.direction.equalZero()) {
                let angle = this.direction.signAngle(uu.v2(0, -1))
                rot = 180 - angle * 180 / Math.PI;
                this.owner.setRotation(rot);
            }

            // let n = UVec2.ZERO();
            // let dot = this.velocity.dot(n);
            // this.direction = this.velocity.sub(n.mul(2 * dot));
            // if (n.x != 0) { this.velocity.x = n.x * Math.abs(this.direction.x * this.velocity.x * this.rate) }
            // if (n.y != 0) { this.velocity.y = n.y * Math.abs(this.direction.y * this.velocity.y * this.rate) }
        }





    }

}
