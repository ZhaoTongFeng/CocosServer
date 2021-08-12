
import AActor from "../Actor/Actor";
import { UpdateState } from "../Engine/Enums";
import { UInput } from "../Engine/InputSystem/Input";
import { xclass, xproperty } from "../Engine/ReflectSystem/XBase";
import UGraphic from "../Engine/UGraphic";
import UObject from "../Object";

/**
 * 组件基类
 * 也支持嵌套，但是所有的更新全部都是Actor组件列表中进行。而且更新顺序是按照组件添加的顺序，也就是说，碰撞组件必须添加在移动组件后面。
 * 
 */

@xclass(UComponent)
export default class UComponent extends UObject {
    public owner: AActor = null;

    @xproperty(Number)
    state: UpdateState = UpdateState.Active;

    unUse() {
        super.unUse();
    }

    reUse() {
        super.reUse();
        this.state = UpdateState.Active;
        this.owner = null;
    }

    public init(obj: any) {
        super.init(obj);
        if (!obj) {
            console.warn("actor can't be null");
            return;
        }

        this.owner = obj as AActor;
        if (this.owner.getRootComp() == null) {
            this.owner.setRootComp(this);
        }
        this.owner.addComponent(this);
    }

    public processInput(input: UInput) {

    }
    public update(dt: number) {

    }
    public drawDebug(graphic: UGraphic) {

    }

    public destory() {
        this.owner.removeComponent(this);
    }
    onDestory() {
        if (this.owner.getRootComp() == this) {
            this.owner.setRootComp(null);
        }
        this.owner = null;
    }


    isRoot() {
        return this == this.owner.getRootComp();
    }
    isMainScene() {
        return false;
    }
    isCollision() {
        return false;
    }

    onComputeTransfor() {

    }
}
