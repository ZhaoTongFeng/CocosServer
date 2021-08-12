
import { XBase, xclass, xproperty } from "../../Engine/ReflectSystem/XBase";
import UGraphic from "../../Engine/UGraphic";
import { AABB, UColor, uu, UVec2 } from "../../Engine/UMath";
import UCollisionComponent from "./CollisionComponent";



@xclass(UBoxComponent)
export default class UBoxComponent extends UCollisionComponent {
    @xproperty(AABB)
    worldAabb: AABB = new AABB();

    unUse() {
        super.unUse();
    }

    reUse() {
        super.reUse();
        this.worldAabb.max.x = 0;
        this.worldAabb.max.y = 0;
        this.worldAabb.min.x = 0;
        this.worldAabb.min.y = 0;
    }
    onComputeTransfor() {
        let pos = this.owner.getPosition();
        let size = this.owner.getSize();
        let scale = this.owner.getScale();
        this.worldAabb.min.x = pos.x - size.x / 2 * scale.x + this.padding.x;
        this.worldAabb.min.y = pos.y - size.y / 2 * scale.y + this.padding.y;
        this.worldAabb.max.x = this.worldAabb.min.x + size.x * scale.x - this.padding.x;
        this.worldAabb.max.y = this.worldAabb.min.y + size.y * scale.y - this.padding.y;
    }

    public drawDebug(graphic: UGraphic) {
        if (this.owner.world.isDebug) {
            super.drawDebug(graphic)
            graphic.drawRect(this.worldAabb.min.x, this.worldAabb.min.y, this.owner.getSize().x * this.owner.getScale().x, this.owner.getSize().y * this.owner.getScale().y, UColor.YELLOW());
        }
    }

    getMinX() {
        return this.worldAabb.min.x;
    }
    getMaxX() {
        return this.worldAabb.max.x;
    }
}
