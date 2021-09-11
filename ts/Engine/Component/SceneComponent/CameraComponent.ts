
import UGameInstance from "../../Engine/GameInstance";
import { UInputSystem } from "../../Engine/InputSystem/InputSystem";
import { xclass, xproperty } from "../../Engine/ReflectSystem/XBase";
import UGraphic from "../../Engine/UGraphic";
import { UColor, URect, uu } from "../../Engine/UMath";
import USceneComponent from "./SceneComponent";

/**
 * 精灵图片组件
 * 挂载到Actor上，以显示图片
 */

@xclass(UCameraComponent)
export default class UCameraComponent extends USceneComponent {

    //摄像机缩放比率
    private _zoomRatio: number;
    public get zoomRatio(): number {
        this.owner.world.gameInstance.getWorldView().onGetSceneCameraProperty(this);
        return this._zoomRatio;
    }
    public set zoomRatio(value: number) {
        this._zoomRatio = value;
    }

    //摄像机在正交投影模式下的视窗大小
    private _orthoSize: number;
    public get orthoSize(): number {
        this.owner.world.gameInstance.getWorldView().onGetSceneCameraProperty(this);
        return this._orthoSize;
    }
    public set orthoSize(value: number) {
        this._orthoSize = value;
    }

    public getPosition() {
        if (this.isRoot()) {
            return super.getPosition();
        } else {
            return this.owner.getPosition();
        }
    }

    onComputeTransfor() {
        if (this.owner.world.isClient) {
            this.computeCatAABB();
        }
    }
    computeCatAABB() {
        //更新相机剔除AABB
        let pos = this.getPosition();
        let size = this.owner.world.gameInstance.getWorldView().winSize;

        // this.catAABB.min.x = pos.x - size.x
        // this.catAABB.min.y = pos.y - size.y
        // this.catAABB.max.x = pos.x + size.x
        // this.catAABB.max.y = pos.x + size.x

        this.catAABB.min.x = pos.x - size.x / 2
        this.catAABB.min.y = pos.y - size.y / 2
        this.catAABB.max.x = pos.x + size.x / 2
        this.catAABB.max.y = pos.y + size.y / 2
    }
    public update(dt) {

    }

    public drawDebug(graphic: UGraphic) {
        let size = this.owner.world.gameInstance.getWorldView().winSize;
        // let width = size.x*2;
        // let height = size.y*2;
        let width = size.x;
        let height = size.y;


        graphic.drawRect(this.catAABB.min.x, this.catAABB.min.y, width, height, UColor.YELLOW());
        

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
