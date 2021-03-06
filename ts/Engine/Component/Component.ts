
import AActor from "../Actor/Actor";
import { UpdateState } from "../Engine/Enums";
import { UInputSystem } from "../Engine/InputSystem/InputSystem";
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

    state: UpdateState = UpdateState.Active;

    unUse() {
        super.unUse();
    }

    reUse() {
        super.reUse();
        this.state = UpdateState.Active;
        this.owner = null;
    }

    public init(ac: AActor, id = -1) {
        super.init(ac);
        if (!ac) {
            console.warn("actor can't be null");
            return;
        }
        this.owner = ac;
        this.owner.addComponent(this);
        if (id == -1) {
            id = Number(this.owner.world.GenerateNewId());
        }
        this.id = id + "";

        this.onLoad(ac);
    }

    public onLoad(ac: AActor) {
        this.owner = ac
        if (this.owner.getRootComp() == null) {
            this.owner.setRootComp(this);
        }
        this.owner.world.actorSystem.registerObj(this);
    }




    public processInput(input: UInputSystem) {

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
        // this.owner = null;
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
