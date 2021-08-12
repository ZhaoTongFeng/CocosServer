import AActor from "../../../Engine/Actor/Actor";
import APawn from "../../../Engine/Actor/Pawn/Pawn";
import USpriteComponent from "../../../Engine/Component/SceneComponent/SpriteComponent";
import { UInput } from "../../../Engine/Engine/InputSystem/Input";
import { xclass, xStatusSync } from "../../../Engine/Engine/ReflectSystem/XBase";
import UGraphic from "../../../Engine/Engine/UGraphic";
import UWorld from "../../../Engine/Engine/World";
import RacketMovement from "../Component/RacketMovement";

/**
 * 移动的小球
 */
@xclass(ARacket)

export default class ARacket extends APawn {

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
        let spriteComp = this.spawnComponent(USpriteComponent);
        spriteComp.setTexture("rect");
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
