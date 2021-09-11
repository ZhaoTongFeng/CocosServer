import AInfo from "./Info";
import { UInputSystem } from "../../Engine/InputSystem/InputSystem";
import UWorld from "../../Engine/World";
import AActor from "../Actor";
import { xclass } from "../../Engine/ReflectSystem/XBase";
import UGraphic from "../../Engine/UGraphic";
/**
 * 玩家状态
 */
@xclass(APlayerState)
export default class APlayerState extends AInfo {
    init(world: UWorld) {
        super.init(world);

    }

    protected processSelfInput(input: UInputSystem) {

    }

    protected updateActor(dt) {

    }

    protected drawDebugActor(graphic: UGraphic) {

    }

    public destory() {

        super.destory();
    }
}