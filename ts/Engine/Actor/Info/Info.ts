import UCollisionComponent from "../../Component/Collision/CollisionComponent";
import UComponent from "../../Component/Component";
import USceneComponent from "../../Component/SceneComponent/SceneComponent";
import { UInputSystem } from "../../Engine/InputSystem/InputSystem";
import { xclass } from "../../Engine/ReflectSystem/XBase";
import UGraphic from "../../Engine/UGraphic";
import { UVec2 } from "../../Engine/UMath";
import UWorld from "../../Engine/World";
import AActor from "../Actor";
import APawn from "../Pawn/Pawn";


/**
 * 基类
 */
 @xclass(AInfo)
export default class AInfo extends AActor {
    actor: AActor = null;

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




    public getSceneComponent() {
        if (this.actor) {
            return this.actor.getSceneComponent();
        } else {
            return null;
        }
    }
    public setSceneComponent(comp: USceneComponent) {
        if (this.actor) {
            this.actor.setSceneComponent(comp);
        }
    }
    public getRootComp() {
        if (this.actor) {
            return this.actor.getRootComp();
        } else {
            return null;
        }
    }


    public setRootComp(comp: UComponent) {
        if (this.actor) {
            this.actor.setRootComp(comp);
        }
    }

    public getCollision() {
        return this.collisionComponent;
    }
    public setCollision(comp: UCollisionComponent) {
        this.collisionComponent = comp;
    }


    public getSize() {
        if (this.actor) {
            return this.actor.getSize();
        } else {
            return null;
        }
    }

    public setSize(pos: UVec2) {
        if (this.actor) {
            this.actor.setSize(pos);
        }
    }


    public getPosition() {
        if (this.actor) {
            return this.actor.getPosition();
        } else {
            return null;
        }
    }

    public setPosition(pos: UVec2) {
        if (this.actor) {
            this.actor.setPosition(pos);
        }
    }


    public getScale() {
        if (this.actor) {
            return this.actor.getScale();
        } else {
            return null;
        }
    }

    public setScale(pos: UVec2) {
        if (this.actor) {
            this.actor.setScale(pos);
        }
    }
    public getRotation() {
        if (this.actor) {
            return this.actor.getRotation();
        } else {
            return null;
        }
    }

    public setRotation(angle: number) {
        if (this.actor) {
            this.actor.setRotation(angle);
        }
    }
}