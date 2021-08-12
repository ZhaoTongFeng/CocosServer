import UObject from "../../Object";
import { xclass } from "../ReflectSystem/XBase";
import UWorld from "../World";

/**
 * 对象管理器
 * 对象查询
 * 对象池
 */
@xclass(UActorSystem)
export default class UActorSystem extends UObject {

    world: UWorld = null;
    init(world: UWorld) {
        super.init(world);
        this.world = world;

    }



    public destory() {
        super.destory();
    }
}
