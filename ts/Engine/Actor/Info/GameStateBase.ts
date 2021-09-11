import AInfo from "./Info";
import { UInputSystem } from "../../Engine/InputSystem/InputSystem";
import UWorld from "../../Engine/World";
import AActor from "../Actor";
import { xclass } from "../../Engine/ReflectSystem/XBase";
import UGraphic from "../../Engine/UGraphic";
/**
 * 游戏关卡状态
 * 比如比赛状况，双方得分等数据
 */
@xclass(AGameStateBase)
export default class AGameStateBase extends AInfo {
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