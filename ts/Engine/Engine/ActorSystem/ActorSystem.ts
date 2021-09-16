import USceneComponent from "../../Component/SceneComponent/SceneComponent";
import USpriteComponent from "../../Component/SceneComponent/SpriteComponent";
import UTextComponent from "../../Component/SceneComponent/TextComponent";
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
    //组件和actor对象映射，主要用在状态更新
    objMap: Map<string, UObject> = new Map();
    registerObj(obj: UObject) {
        this.objMap.set(obj.id, obj);
    }
    unRegisterObj(obj: UObject) {
        this.objMap.delete(obj.id);
    }

    sceneComponents: USceneComponent[] = [];
    registerSceneComponent(scene: USceneComponent) {
        this.sceneComponents.push(scene);
        
    }
    unRegisterSceneComponent(scene: USceneComponent) {
        let index = this.sceneComponents.findIndex((one) => {
            return one == scene;
        })
        if (index > -1) {
            this.sceneComponents.splice(index, 1);
            // this.world.gameInstance.getWorldView().removeSceneComponent(scene);
        }

    }

    spriteComponents: USpriteComponent[] = [];
    registerSprite(scene: USpriteComponent) {
        this.spriteComponents.push(scene);
    }
    unRegisterSprite(scene: USpriteComponent) {
        let index = this.spriteComponents.findIndex((one) => {
            return one == scene;
        })
        if (index > -1) {
            this.spriteComponents.splice(index, 1);
            // this.world.gameInstance.getWorldView().removeSpriteComponent(scene);
        }
    }
    textComponents: UTextComponent[] = [];
    registerText(scene: UTextComponent) {
        this.textComponents.push(scene);
    }
    unRegisterText(scene: UTextComponent) {
        let index = this.textComponents.findIndex((one) => {
            return one == scene;
        })
        if (index > -1) {
            this.textComponents.splice(index, 1);
            // this.world.gameInstance.getWorldView().removeSpriteComponent(scene);
        }
    }


    registerAll(){
        this.sceneComponents.forEach(comp=>{
            // this.world.gameInstance.getWorldView().addSceneComponent(comp);
        })
        this.spriteComponents.forEach(comp => {
            // this.world.gameInstance.getWorldView().addSpriteComponent(comp);
        });
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
