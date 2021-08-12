
import UCollisionComponent from "../../Component/Collision/CollisionComponent";
import UComponent from "../../Component/Component";
import USceneComponent from "../../Component/SceneComponent/SceneComponent";
import { UInput } from "../../Engine/InputSystem/Input";
import { xclass } from "../../Engine/ReflectSystem/XBase";
import UGraphic from "../../Engine/UGraphic";
import { UVec2 } from "../../Engine/UMath";
import UWorld from "../../Engine/World";
import AActor from "../Actor";
import APawn from "../Pawn/Pawn";


/**
 * 控制器
 * 主要控制输入
 */
@xclass(AController)
export default class AController extends AActor {

    pawn: APawn = null;

    unUse() {
        super.unUse();
    }

    reUse() {
        super.reUse();
        this.pawn = null;
    }

    public sendData(obj:Object){
        let out = [this.id,obj];
        this.world.gameInstance.sendGameData(out);
    }

    public receiveData(obj:Object){

    }



    init(world: UWorld) {
        super.init(world);
        this.world.inputSystem.register(this);
    }

    protected processSelfInput(input: UInput) {

    }

    protected updateActor(dt) {

    }

    protected drawDebugActor(graphic: UGraphic) {

    }

    public destory() {
        this.world.inputSystem.unRegister(this);
        super.destory();
    }

    process(pawn: APawn) {
        if (pawn.controller != null) {
            pawn.controller.pawn = null;
        }
        this.pawn = pawn;
        pawn.controller = this;
    }

    unProcess() {
        this.pawn = null;
    }




    public getSceneComponent() {
        if (this.pawn) {
            return this.pawn.getSceneComponent();
        } else {
            return null;
        }
    }
    public setSceneComponent(comp: USceneComponent) {
        if (this.pawn) {
            this.pawn.setSceneComponent(comp);
        }
    }
    public getRootComp() {
        if (this.pawn) {
            return this.pawn.getRootComp();
        } else {
            return null;
        }
    }


    public setRootComp(comp: UComponent) {
        if (this.pawn) {
            this.pawn.setRootComp(comp);
        }
    }

    public getCollision() {
        return this.collisionComponent;
    }
    public setCollision(comp: UCollisionComponent) {
        this.collisionComponent = comp;
    }


    public getSize() {
        if (this.pawn) {
            return this.pawn.getSize();
        } else {
            return null;
        }
    }

    public setSize(pos: UVec2) {
        if (this.pawn) {
            this.pawn.setSize(pos);
        }
    }


    public getPosition() {
        if (this.pawn) {
            return this.pawn.getPosition();
        } else {
            return null;
        }
    }

    public setPosition(pos: UVec2) {
        if (this.pawn) {
            this.pawn.setPosition(pos);
        }
    }


    public getScale() {
        if (this.pawn) {
            return this.pawn.getScale();
        } else {
            return null;
        }
    }

    public setScale(pos: UVec2) {
        if (this.pawn) {
            this.pawn.setScale(pos);
        }
    }
    public getRotation() {
        if (this.pawn) {
            return this.pawn.getRotation();
        } else {
            return null;
        }
    }

    public setRotation(angle: number) {
        if (this.pawn) {
            this.pawn.setRotation(angle);
        }
    }
}
