import { UInput } from "../../Engine/InputSystem/Input";
import { xclass } from "../../Engine/ReflectSystem/XBase";
import { UMath, uu, UVec2 } from "../../Engine/UMath";
import Movement from "./MovementComponent";


@xclass(UProjectComponent)
export default class UProjectComponent extends Movement {
    
    public init(obj: any) {
        super.init(obj);

    }

    public update(dt: number) {
        //F=MA
        this.acc.x += this.force.x / this.mg
        this.acc.y += this.force.y / this.mg
        this.acc.x = (this.acc.x > 0 ? 1 : -1) * UMath.clamp(Math.abs(this.acc.x), -this.max_acc, this.max_acc);
        this.acc.y = (this.acc.y > 0 ? 1 : -1) * UMath.clamp(Math.abs(this.acc.y), -this.max_acc, this.max_acc);


        //V=V0+AT/2
        this.velocity.x += this.acc.x * dt / 2;
        this.velocity.y += this.acc.y * dt / 2;

        this.velocity.x = (this.velocity.x > 0 ? 1 : -1) * UMath.clamp(Math.abs(this.velocity.x), -this.max_vel, this.max_vel);
        this.velocity.y = (this.velocity.y > 0 ? 1 : -1) * UMath.clamp(Math.abs(this.velocity.y), -this.max_vel, this.max_vel);

        //S=VT
        let pos = this.owner.getPosition();
        pos.x += this.velocity.x * dt;
        pos.y += this.velocity.y * dt;
        this.owner.setPosition(pos);

        //旋转
        this.direction = this.velocity.normalize();
        if (!this.direction.equalZero()) {
            let angle = this.direction.signAngle(uu.v2(0, -1))
            this.owner.setRotation(180 - angle * 180 / Math.PI);
        }
    }

}
