import UMovementComponent from "../../../Engine/Component/Movement/MovementComponent";
import { xclass, xproperty, xStatusSync } from "../../../Engine/Engine/ReflectSystem/XBase";
import { uu, UVec2 } from "../../../Engine/Engine/UMath";


@xclass(RacketMovement)
@xStatusSync(["targetPos"])
export default class RacketMovement extends UMovementComponent {
    @xproperty(UVec2)
    targetPos: UVec2 = uu.v2();

    public update(dt: number) {
        this.owner.setPosition(this.targetPos);
    }
}
