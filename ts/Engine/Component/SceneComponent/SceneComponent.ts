
import AActor from "../../Actor/Actor";
import { Visiblity } from "../../Engine/Enums";
import UGameInstance from "../../Engine/GameInstance";
import { UInputSystem } from "../../Engine/InputSystem/InputSystem";
import { xclass, xproperty } from "../../Engine/ReflectSystem/XBase";
import UGraphic from "../../Engine/UGraphic";
import { UVec2, uu, AABB, UColor, UMath } from "../../Engine/UMath";
import UComponent from "../Component";

/**
 * 具有相对位置的组件基类
 * 实体组件
 */
@xclass(USceneComponent)
export default class USceneComponent extends UComponent {
    @xproperty(Number)
    private _visiblity: Visiblity = Visiblity.Visible;

    @xproperty(UVec2)
    private _position: UVec2 = uu.v2();
    private _newPos: UVec2 = uu.v2();
    private _oldPos: UVec2 = uu.v2();

    @xproperty(UVec2)
    private _absPosition: UVec2 = uu.v2();

    @xproperty(UVec2)
    private _size: UVec2 = uu.v2(64, 64);
    private _newSize: UVec2 = uu.v2(64, 64);

    @xproperty(UVec2)
    private _scale: UVec2 = uu.v2(1, 1);

    @xproperty(Number)
    private _rotation: number = 0;
    private _newRot: number = 0;
    private _oldRot: number = 0;

    needSync = true;

    //服务器检查坐标的变化，以发送
    checkTransform() {
        if (this.transformDirty && this.needSync) {
            if (this._position.x != this._oldPos.x || this._position.y != this._oldPos.y || this._rotation != this._oldRot) {
                let data = [Math.floor(this._position.x), Math.floor(this._position.y), Math.floor(this._rotation)];
                this._oldPos.x = data[0];
                this._position.x = data[0];

                this._oldPos.y = data[1];
                this._position.y = data[1];

                this._oldRot = data[2];
                this._rotation = data[2];
                this.owner.world.gameInstance.sendGameData(data, this);
            }
            this.transformDirty = false
        }
    }



    //客户端接收到位移坐标
    receiveData(obj: Object) {

        let pos = uu.v2(obj[0], obj[1]);
        let rot = obj[2];

        this._oldPos = this._position.clone();
        this._newPos = pos;
        this._oldRot = this._rotation;
        this._newRot = rot;
    }

    private lerpTransform() {
        if (this.needSync) {
            if (this.owner.world.gameInstance.timeFrame == 0) { return; }
            let start = this._oldPos.clone()
            let target = this._newPos;

            let rate = this.owner.world.gameInstance.frameRate;
            start.lerp(target, rate);

            let begRot = this._oldRot;
            let endRot = this._newRot;
            // if (UMath.abs(begRot - endRot) > 180) {
            //     endRot = UMath.abs(360 - endRot)
            // }

            let newRot = UMath.lerp(begRot, endRot, rate);
            if (this.isRoot()) {
                this.owner.setPosition(start)
                this.owner.setRotation(newRot);
            } else {
                this.setPosition(start);
                this.setRotation(newRot);
            }
        }

    }

    transformDirty: boolean = true;

    /** 相机剔除 */
    //是否在相机返回内
    inCamera: boolean = false;

    //所占空间大小
    catAABB: AABB = null;

    public init(ac: AActor, id = -1) {
        super.init(ac, id);
    }

    public onLoad(ac: AActor) {
        super.onLoad(ac);
        if (this.owner.world.isClient && this.catAABB == null) {
            this.catAABB = new AABB();
        }
        //客户端才需要注册SceneComponent，用于显示
        if (this.owner.world.isClient) {
            this.register();
        }
        if (this.owner.getSceneComponent() == null) {
            this.owner.setSceneComponent(this);
        }
    }

    public register() {
        this.owner.world.actorSystem.registerSceneComponent(this);
    }

    public unUse() {
        this.visiblity = Visiblity.Hide;
        super.unUse();
    }

    public reUse() {
        super.reUse();
        this._visiblity = Visiblity.Visible;

        this._position.x = 0;
        this._position.y = 0;
        this._absPosition.x = 0;
        this._absPosition.y = 0;
        this._size.x = 64;
        this._size.y = 64;
        this._scale.x = 1;
        this._scale.y = 1;
        this._rotation = 0;
        this.transformDirty = true;
    }

    public unRegister() {
        this.owner.world.actorSystem.unRegisterSceneComponent(this);
    }

    public processInput(input: UInputSystem) {
        super.processInput(input);

    }


    public update(dt) {
        super.update(dt);
        //服务器每帧和上一帧的数据进行比较，是否需要发送上一帧
        if (!this.owner.world.isClient) {
            let data = this.checkTransform();
        } else {
            this.lerpTransform();
        }
    }

    public drawDebug(graphic: UGraphic) {
        super.drawDebug(graphic)

        // const pos = this.getPosition();
        // const size = this.getSize();
        // graphic.drawRect(pos.x-size.x/2, pos.y-size.y/2, size.x, size.y);

        if (this.isRoot()) {
            let ownAABB = this.owner.getCatAABB();
            graphic.drawRect(ownAABB.min.x, ownAABB.min.y, this.owner.getSize().x, this.owner.getSize().y, UColor.BLUE());
        }
    }

    public draw(graphic: UGraphic) {


    }


    onDestory() {
        if (this.owner.world.isClient) {
            this.unRegister();
        }
        super.onDestory();
    }

    computeCatAABB() {
        //更新相机剔除AABB
        let pos = null;
        if (this.isRoot()) {
            pos = this.owner.getPosition()
        } else {
            pos = this.owner.getPosition().add(this._position);
        }


        let size = this._size
        let scale = this._scale
        this.catAABB.min.x = pos.x - size.x / 2 * scale.x;
        this.catAABB.min.y = pos.y - size.y / 2 * scale.y
        this.catAABB.max.x = this.catAABB.min.x + size.x * scale.x
        this.catAABB.max.y = this.catAABB.min.y + size.y * scale.y
    }

    onComputeTransfor() {
        this.visiblity = this._visiblity;
        this.transformDirty = true;
        if (this.transformDirty && this.owner.world.isClient) {
            this.computeCatAABB();
        }
    }

    //Override
    isMainScene() {
        return this == this.owner.getSceneComponent();
    }

    //可见性

    get visiblity() {
        return this._visiblity;
    }
    set visiblity(vis: Visiblity) {
        this.owner.world.gameInstance.getWorldView().onSceneCompSetVisible(this);
        this._visiblity = vis;

    }

    //相对坐标

    public getPosition() {
        return this._position;
    }
    public setPosition(pos: UVec2) {
        this.transformDirty = true;
        this._position = pos;
    }

    //世界坐标

    public setAbsPosition(value: UVec2) {
        if (this.isMainScene()) {
            this.setPosition(value);
        }
        this._absPosition = value;
    }
    public getAbsPosition() {
        return this._absPosition;
    }



    public getSize(): UVec2 {
        return this._size;
    }
    public setSize(value: UVec2) {
        this.transformDirty = true;
        this._size = value;
    }



    public getScale(): UVec2 {
        return this._scale;
    }
    public setScale(value: UVec2) {
        this.transformDirty = true;
        this._scale = value;
    }


    public getRotation() {
        return this._rotation
    }
    public setRotation(angle: number) {
        this.transformDirty = true;
        this._rotation = angle;
    }
}
