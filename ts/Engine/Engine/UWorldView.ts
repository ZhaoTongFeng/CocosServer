
import UCameraComponent from "../Component/SceneComponent/CameraComponent";
import USceneComponent from "../Component/SceneComponent/SceneComponent";
import USpriteComponent from "../Component/SceneComponent/SpriteComponent";
import UTextComponent from "../Component/SceneComponent/TextComponent";
import { Visiblity } from "./Enums";
import UGameInstance from "./GameInstance";
import ClientNetworkSystem from "./NetworkSystem/Client/ClientNetworkSystem";
import ClientRoomManager from "./NetworkSystem/Client/ClientRoomManager";
import { XBase, xclass } from "./ReflectSystem/XBase";
import UGraphic from "./UGraphic";
import { UMath, uu, UVec2 } from "./UMath";
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
    //调试工具
    graphic: UGraphic = new UGraphic();

    //屏幕大小
    winSize: UVec2 = uu.v2(2000, 2000);

    //默认从当前房间拿游戏实例
    private _gameInstance: UGameInstance = null;
    public get gameInstance(): UGameInstance {
        return (ClientNetworkSystem.Ins.roomManager as ClientRoomManager).getLocRoom().gameInstance;
    }

    public set gameInstance(value: UGameInstance) {
        // this._gameInstance = value;
    }



    //退出和进入此场景操作
    //SEVER 服务器直接从这里开始 
    public onEnter(world: UWorld, data = null) {
        this.gameInstance.openWorld(world, data, this);
        return world;
    }

    public onExit() {
        this.gameInstance.closeWorld();
    }

    updateOnec(dt = 0) {}


    addSceneComponent(comp: USceneComponent) { }
    removeSceneComponent(comp: USceneComponent) { }

    addSpriteComponent(comp: USpriteComponent) { }
    removeSpriteComponent(comp: USpriteComponent) { }

    addTextComponent(comp: UTextComponent) { }
    removeTextComponent(comp: UTextComponent) { }

    addCameraComponent(comp: UCameraComponent) { }
    removeCameraComponent(comp: UCameraComponent) { }

    addUINode(comp: any) { }
    removeUINode(comp: any) { }

    onSceneCompSetVisible(comp: USceneComponent) { }
    onSceneCompComputeTransfor(comp: USceneComponent) { }
    onSpriteCompSetColor(comp: USpriteComponent) { }
    onDrawTexture(comp: USpriteComponent) { }
    onDrawText(comp: UTextComponent) { }
    onGetSceneCameraProperty(comp: UCameraComponent) { }
}