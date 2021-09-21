import APawn from "../../../Engine/Actor/Pawn/Pawn";
import UMovementComponent from "../../../Engine/Component/Movement/MovementComponent";
import { UInputSystem } from "../../../Engine/Engine/InputSystem/InputSystem";
import { xclass } from "../../../Engine/Engine/ReflectSystem/XBase";
import { uu } from "../../../Engine/Engine/UMath";
import APlayerShipController from "../Controller/PlayerShipController";

@xclass(ShipMovement2)
export default class ShipMovement2 extends UMovementComponent {
    clear() {
        this.velocity.x = 0;
        this.velocity.y = 0;
    }
    public processInput(input: UInputSystem) {
        let con = (this.owner as APawn).controller as APlayerShipController;
        if (!con) { return; }
        let moveRate = con.moveForce;
        let moveDir = con.moveDirection;
        this.velocity.x = this.max_vel * moveDir.x;
        this.velocity.y = this.max_vel * moveDir.y;
    }

    public update(dt: number) {
        //服务器更新状态
        if (!this.owner.world.gameInstance.bStandAlone && this.owner.world.isClient) { return; }

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
}
