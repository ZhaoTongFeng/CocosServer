import USceneComponent from "../../Component/SceneComponent/SceneComponent";
import USpriteComponent from "../../Component/SceneComponent/SpriteComponent";
import UObject from "../../Object";
import { xclass } from "../ReflectSystem/XBase";
import UWorld from "../World";

/**
 * 对象管理器
 * 对象查询
 * 对象池
 */
@xclass(UActorSystem)
export default class UActorSystem extends UObject {
    sceneComponents: USceneComponent[] = [];
    registerSceneComponent(scene: USceneComponent) {
        this.sceneComponents.push(scene);
        this.world.gameInstance.getWorldView().addSceneComponent(scene);
    }
    unRegisterSceneComponent(scene: USceneComponent) {
        let index = this.sceneComponents.findIndex((one) => {
            return one == scene;
        })
        if (index > -1) {
            this.sceneComponents.splice(index, 1);
        }
        this.world.gameInstance.getWorldView().removeSceneComponent(scene);
    }

    spriteComponents: USpriteComponent[] = [];
    registerSprite(scene: USpriteComponent) {
        this.spriteComponents.push(scene);
        this.world.gameInstance.getWorldView().addSpriteComponent(scene);
    }
    unRegisterSprite(scene: USpriteComponent) {
        let index = this.spriteComponents.findIndex((one) => {
            return one == scene;
        })
        if (index > -1) {
            this.spriteComponents.splice(index, 1);
            this.world.gameInstance.getWorldView().removeSpriteComponent(scene);
        }
    }


    world: UWorld = null;
    init(world: UWorld) {
        super.init(world);
        this.world = world;

    }



    public destory() {
        super.destory();
    }
}
