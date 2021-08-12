
import { UInput } from "../../Engine/InputSystem/Input";
import { xclass } from "../../Engine/ReflectSystem/XBase";
import UGraphic from "../../Engine/UGraphic";
import UWorld from "../../Engine/World";
import AController from "./Controller";
/**
 * 玩家控制器
 * 响应玩家输入
 */
 @xclass(APlayerController)
export default class APlayerController extends AController{
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
