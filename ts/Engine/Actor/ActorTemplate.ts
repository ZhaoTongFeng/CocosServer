
import { UInputSystem } from "../Engine/InputSystem/InputSystem";
import { xclass } from "../Engine/ReflectSystem/XBase";
import UGraphic from "../Engine/UGraphic";
import UWorld from "../Engine/World";
import AActor from "./Actor";

@xclass(AActorTemplate)
export default class AActorTemplate extends AActor {
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
    protected processSelfInput(input: UInputSystem) {

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
