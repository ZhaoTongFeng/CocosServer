
import UCameraComponent from "../Component/SceneComponent/CameraComponent";
import { UInput } from "../Engine/InputSystem/Input";
import { xclass } from "../Engine/ReflectSystem/XBase";
import UGraphic from "../Engine/UGraphic";
import UWorld from "../Engine/World";
import AActor from "./Actor";

@xclass(ACameraActor)
export default class ACameraActor extends AActor {
    cameraComp: UCameraComponent = null;
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
        this.cameraComp = this.spawnComponent(UCameraComponent);

    }

    //Override
    onInit() {
        super.onInit();
    }

    //Override
    protected processSelfInput(input: UInput) {
        if (input.isTouchMove) {
            // console.log(input.clickPos.x, input.clickPos.y);
        }
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
