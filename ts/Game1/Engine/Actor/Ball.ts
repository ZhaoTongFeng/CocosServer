import AActor from "../../../Engine/Actor/Actor";
import APawn from "../../../Engine/Actor/Pawn/Pawn";
import { UInput } from "../../../Engine/Engine/InputSystem/Input";
import { xclass } from "../../../Engine/Engine/ReflectSystem/XBase";
import UGraphic from "../../../Engine/Engine/UGraphic";
import UWorld from "../../../Engine/Engine/World";

/**
 * 移动的小球
 */
@xclass(ABall)
export default class ABall extends AActor {
    //Override
    public unUse() {
        super.unUse();
    }

    //Override
    public reUse() {
        super.reUse();
    }

    //Override
    init(world: UWorld) {
        super.init(world);
    }

    //Override
    onInit() {
        super.onInit();
    }

    //Override
    protected processSelfInput(input: UInput) {

    }
    //Override
    protected updateActor(dt) {

    }
    //Override
    protected drawDebugActor(graphic: UGraphic) {

    }
    //Override
    public onDestory() {
        super.onDestory();
    }
}
