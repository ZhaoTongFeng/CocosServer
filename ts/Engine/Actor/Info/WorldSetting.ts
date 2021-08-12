import AInfo from "./Info";
import { UInput } from "../../Engine/InputSystem/Input";
import UWorld from "../../Engine/World";
import AActor from "../Actor";
import { xclass } from "../../Engine/ReflectSystem/XBase";
import UGraphic from "../../Engine/UGraphic";

/**
 * 关卡配置
 */
@xclass(AWorldSetting)
export default class AWorldSetting extends AInfo {
    init(world: UWorld) {
        super.init(world);

    }
    
    protected processSelfInput(input: UInput) {

    }

    protected updateActor(dt) {

    }

    protected drawDebugActor(graphic: UGraphic) {

    }

    public destory() {

        super.destory();
    }
}