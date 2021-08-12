

import { xclass, xproperty } from "../../Engine/ReflectSystem/XBase";
import { UVec2, uu } from "../../Engine/UMath";
import UComponent from "../Component";
import USceneComponent from "../SceneComponent/SceneComponent";


/**
 * 碰撞组件基类
 */
@xclass(UCollisionComponent)
export default class UCollisionComponent extends UComponent {
    @xproperty(UVec2)
    protected padding: UVec2 = uu.v2();

    public setPadding(pad: UVec2 | number) {
        if (pad instanceof UVec2) {
            this.padding = pad;
        } else {
            this.padding.x = pad;
        }

    }

    unUse() {
        super.unUse();

    }

    reUse() {
        super.reUse();
        this.padding.x = 0;
        this.padding.y = 0;
    }

    public init(obj: any) {
        super.init(obj);
        if (!obj) {
            return;
        }
        if (this.owner.getCollision() == null) {
            this.owner.setCollision(this);
        }
        this.owner.world.collisionSystem.insert(this);
    }

    onDestory() {
        this.owner.world.collisionSystem.delete(this);
        super.onDestory();
    }

    getMinX() {

    }
    getMaxX() {

    }
}
