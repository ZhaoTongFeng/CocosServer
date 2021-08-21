import UMovementComponent from "../../../Engine/Component/Movement/MovementComponent";
import { xclass } from "../../../Engine/Engine/ReflectSystem/XBase";


@xclass(UBallMovement)
export default class UBallMovement extends UMovementComponent {

    unUse() {
        super.unUse();

    }

    reUse() {
        super.reUse();
    }

    public init(obj: any) {
        super.init(obj);

    }

    public update(dt: number) {
    }

    public draw() {

    }

    onDestory() {

        super.onDestory();
    }
}
