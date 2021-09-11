import UCollisionComponent from "../../Component/Collision/CollisionComponent";
import UMovementComponent from "../../Component/Movement/MovementComponent";
import USceneComponent from "../../Component/SceneComponent/SceneComponent";
import { UInputSystem } from "../../Engine/InputSystem/InputSystem";
import { xclass, xproperty } from "../../Engine/ReflectSystem/XBase";
import UWorld from "../../Engine/World";
import AActor from "../Actor";
import AAIController from "../Controller/AIController";
import AController from "../Controller/Controller";

/**
 * 角色基类
 * 包含基本的位移操作
 */
@xclass(APawn)
export default class APawn extends AActor {
    @xproperty(AController,{})
    public controller: AController = null;

    @xproperty(UMovementComponent,{})
    protected movementComponent: UMovementComponent = null;

    unUse() {
        super.unUse();

    }

    reUse() {
        super.reUse();
        this.controller = null;
        this.movementComponent = null;
    }


    public getMovement() {
        return this.movementComponent;
    }
    public setMovement(movement: UMovementComponent) {
        this.movementComponent = movement
    }



    //输入
    protected processSelfInput(input: UInputSystem) {

    }


    //更新

    protected updateActor(dt) {

    }


    //销毁
    public destory() {
        super.destory();
    }


    onDestory() {
        if (this.controller instanceof AAIController) {
            this.controller.destory();
        }
        super.onDestory();
    }
}

