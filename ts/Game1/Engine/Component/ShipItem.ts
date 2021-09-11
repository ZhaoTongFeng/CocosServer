import UComponent from "../../../Engine/Component/Component";
import { xclass } from "../../../Engine/Engine/ReflectSystem/XBase";
import UGraphic from "../../../Engine/Engine/UGraphic";
import { UVec2, uu } from "../../../Engine/Engine/UMath";



/**
 * 飞船格子物品
 */
 @xclass(UShipItem)
export default class UShipItem extends UComponent {
    //网格中位置
    protected itemPosition: UVec2 = uu.v2();

    //生命值，每一个道具都有生命值，但是不一定有攻击力等属性
    health: number = 100;


    setItemPosition(x: number, y: number) {
        this.itemPosition.x = x;
        this.itemPosition.y = y;
    }
    getItemPosition() {
        return this.itemPosition;
    }


    unUse() {
        super.unUse();
    }

    reUse() {
        super.reUse();
        this.itemPosition.x = 0;
        this.itemPosition.y = 0;
        this.health = 100;
    }


    public init(obj: any) {
        super.init(obj);

    }


    public update(dt: number) {

    }

    public drawDebug(graphic: UGraphic) {

    }

    public destory() {

        super.destory();
    }
}
