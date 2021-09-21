import UComponent from "../../../Engine/Component/Component";
import { xclass } from "../../../Engine/Engine/ReflectSystem/XBase";
import UGraphic from "../../../Engine/Engine/UGraphic";
import AShip from "../Pawn/Ship";

/**
 * 飞船引擎
 * 
 */
@xclass(UShipEngine)
export default class UShipEngine extends UComponent {
    //引擎提供的动力
    movePower = 100;

    //运行功率
    rate = 1;


    unUse() {
        super.unUse();
    }

    reUse() {
        super.reUse();
    }

    public init(obj: any) {
        super.init(obj);
        if (this.owner instanceof AShip) {
            this.owner.setEngine(this);
        }
    }

    public update(dt: number) {

    }

    public drawDebug(graphic: UGraphic) {

    }

    public destory() {
        if (this.owner instanceof AShip) {
            this.owner.setEngine(null);
        }
        super.destory();
    }
}
