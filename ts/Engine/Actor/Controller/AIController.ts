
import { UInputSystem } from "../../Engine/InputSystem/InputSystem";
import { xclass } from "../../Engine/ReflectSystem/XBase";
import UGraphic from "../../Engine/UGraphic";
import UWorld from "../../Engine/World";
import AController from "./Controller";


/**
 * AI控制器，由AI控制Pawn行为
 */
@xclass(AAIController)
export default class AAIController extends AController{
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
