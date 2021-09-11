
import { UInputSystem } from "../../Engine/InputSystem/InputSystem";
import { xclass, xproperty } from "../../Engine/ReflectSystem/XBase";
import UGraphic from "../../Engine/UGraphic";
import UWorld from "../../Engine/World";
import AController from "./Controller";
/**
 * 玩家控制器
 * 响应玩家输入
 */
 @xclass(APlayerController)
export default class APlayerController extends AController{
    @xproperty(String)
    id_user:string = null;
    
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
