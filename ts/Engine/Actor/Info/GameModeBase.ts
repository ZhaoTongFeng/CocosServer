import AInfo from "./Info";
import { UInputSystem } from "../../Engine/InputSystem/InputSystem";
import UWorld from "../../Engine/World";
import AActor from "../Actor";
import { xclass } from "../../Engine/ReflectSystem/XBase";
import UGraphic from "../../Engine/UGraphic";
/**
 * 关卡游玩模式
 */
 @xclass(AGameModeBase)
export default class AGameModeBase extends AInfo{
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