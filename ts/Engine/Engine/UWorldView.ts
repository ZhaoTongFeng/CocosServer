
import UCameraComponent from "../Component/SceneComponent/CameraComponent";
import USceneComponent from "../Component/SceneComponent/SceneComponent";
import USpriteComponent from "../Component/SceneComponent/SpriteComponent";
import { Visiblity } from "./Enums";
import UGameInstance from "./GameInstance";
import { XBase, xclass } from "./ReflectSystem/XBase";
import UGraphic from "./UGraphic";
import { UMath, UVec2 } from "./UMath";
import UWorld from "./World";



/**
 * Logic-View
 * Client Only
 * 逻辑调用View接口，在CCWorldView中进行绑定
 * 服务端没有显示，但是为了能让客户端代码直接在服务端跑起来
 * 所以这里定义了一些接口，客户端去绑定这些接口，客户端就能显示，
 * 服务端不绑定这些接口，也不会报错
 */
@xclass(UWorldView)
export default class UWorldView extends XBase {
    graphic: UGraphic = new UGraphic();

    //屏幕大小
    winSize: UVec2;

    fps: number = 60;
    frameTime: number = 1 / 60;

    gameInstance: UGameInstance = null;


    //退出和进入此场景操作
    public onEnter(world: UWorld, data = null) {

        //SEVER 服务器直接从这里开始        
        this.gameInstance.openWorld(world, data, this);
    }

    public onExit() {
        this.gameInstance.closeWorld();
    }


    //VIew更新入口
    public update(dt) {
        if (this.gameInstance) {
            dt = UMath.clamp(dt, 0, this.frameTime);
            //1.处理输入 输入已经发送到GameInstance的Input中，在World中会被转发到各个Ac

            //2.处理更新
            this.gameInstance.update(dt);


            //3.输出图像
            this.updateView();

            this.graphic.begDrawDebug();
            this.gameInstance.drawDebug(this.graphic);
        }

    }


    sceneComponents: USceneComponent[] = [];
    
    updateView() {
        //3.处理输出 只需要更新Scene中draw方法即可
        this.sceneComponents.forEach(comp => {
            if (comp.visiblity == Visiblity.Visible) {
                comp.draw(this.graphic);
            }
        });
    }

    addSceneComponent(comp: USceneComponent) { }
    removeSceneComponent(comp: USceneComponent) { }
    addSpriteComponent(comp: USpriteComponent) { }
    removeSpriteComponent(comp: USpriteComponent) { }
    addUINode(comp: any) { }
    removeUINode(comp: any) { }

    onSceneCompSetVisible(comp: USceneComponent) { }
    onSceneCompComputeTransfor(comp: USceneComponent) { }

    onSpriteCompSetColor(comp: USpriteComponent) { }
    onDrawTexture(comp: USpriteComponent) { }

    cameraMap: Map<string, UCameraComponent> = new Map();
    addCameraComponent(comp: UCameraComponent) { }
    removeCameraComponent(comp: UCameraComponent) { }
    onGetSceneCameraProperty(comp: UCameraComponent) { }
}