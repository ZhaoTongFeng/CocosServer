import AActor from "../../../Engine/Actor/Actor";
import { xclass } from "../../../Engine/Engine/ReflectSystem/XBase";


/**
 * 角色基类
 * 包含基本的位移操作
 */
@xclass(AExplodeActor)
export default class AExplodeActor extends AActor {

    timer: number = 0;
    deadTime: number = 1;

    unUse() {
        super.unUse();
    }

    reUse() {
        super.reUse();
        this.timer = 0;
    }

    protected updateActor(dt) {
        this.timer += dt;
        if (this.timer > this.deadTime) {
            this.destory();
        }
    }


}
