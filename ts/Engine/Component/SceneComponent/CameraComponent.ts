
import UGameInstance from "../../Engine/GameInstance";
import { UInput } from "../../Engine/InputSystem/Input";
import { xclass, xproperty } from "../../Engine/ReflectSystem/XBase";
import { URect, uu } from "../../Engine/UMath";
import USceneComponent from "./SceneComponent";

/**
 * 精灵图片组件
 * 挂载到Actor上，以显示图片
 */

@xclass(UCameraComponent)
export default class UCameraComponent extends USceneComponent {

    //摄像机缩放比率
    @xproperty(Number)
    private _zoomRatio: number;
    public get zoomRatio(): number {
        this.owner.world.gameInstance.getWorldView().onGetSceneCameraProperty(this);
        return this._zoomRatio;
    }
    public set zoomRatio(value: number) {
        this._zoomRatio = value;
    }

    //摄像机在正交投影模式下的视窗大小
    @xproperty(Number)
    private _orthoSize: number;
    public get orthoSize(): number {
        this.owner.world.gameInstance.getWorldView().onGetSceneCameraProperty(this);
        return this._orthoSize;
    }
    public set orthoSize(value: number) {
        this._orthoSize = value;
    }

    //1.
    public init(data: any) {
        super.init(data);
    }

    register() {
        this.owner.world.gameInstance.getWorldView().addCameraComponent(this);
    }
    unUse() {
        super.unUse();

    }
    reUse() {
        super.reUse();
    }
    unRegister() {
        this.owner.world.gameInstance.getWorldView().removeCameraComponent(this);
    }

    //5.
    public destory() {
        super.destory();
    }
}
