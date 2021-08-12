
import { xclass, xproperty } from "../../Engine/ReflectSystem/XBase";
import UGraphic from "../../Engine/UGraphic";
import { UVec2, uu, UColor } from "../../Engine/UMath";
import UCollisionComponent from "./CollisionComponent";


@xclass(USphereComponent)
export default class USphereComponent extends UCollisionComponent {
    @xproperty(Number)
    radius: number = 64;

    @xproperty(UVec2)
    center: UVec2 = uu.v2();

    @xproperty(UVec2)
    xMinMax: UVec2 = uu.v2();//X轴最大和最小 用在碰撞检测前的排序

    unUse() {
        super.unUse();

    }

    reUse() {
        super.reUse();
        this.radius = 64;
        this.center.x = 0;
        this.center.y = 0;
        this.xMinMax.x = 0;
        this.xMinMax.y = 0;
    }

    onComputeTransfor() {
        this.center = this.owner.getPosition();
        this.radius = this.owner.getSize().x / 2 * this.owner.getScale().x - this.padding.x;
        this.xMinMax.x = this.center.x - this.radius;
        this.xMinMax.y = this.center.x + this.radius;
    }

    public drawDebug(graphic: UGraphic) {
        if (this.owner.world.isDebug) {
            super.drawDebug(graphic)
            graphic.drawCircle(this.center.x, this.center.y, this.radius, UColor.YELLOW());
        }

    }

    getMinX() {
        return this.xMinMax.x;
    }
    getMaxX() {
        return this.xMinMax.y;
    }
}
