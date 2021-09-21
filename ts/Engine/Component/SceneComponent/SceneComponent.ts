
import AActor from "../../Actor/Actor";
import { Visiblity } from "../../Engine/Enums";
import { UInputSystem } from "../../Engine/InputSystem/InputSystem";
import { Protocol } from "../../Engine/NetworkSystem/Share/Protocol";
import { xclass, xproperty } from "../../Engine/ReflectSystem/XBase";
import UGraphic from "../../Engine/UGraphic";
import { AABB, UColor, UMath, uu, UVec2 } from "../../Engine/UMath";
import UComponent from "../Component";

export class USceneComponentProtocol extends Protocol {
    viewBuffer: Int32Array = null;
    init() {
        this.dataLength = 12;
    }
    initView() {
        this.viewBuffer = this.getInt32(this.headLength, 3);
    }

    setX(v) { this.viewBuffer[0] = v; }
    getX() { return this.viewBuffer[0]; }

    setY(v) { this.viewBuffer[1] = v; }
    getY() { return this.viewBuffer[1]; }

    setRot(v) { this.viewBuffer[2] = v; }
    getRot() { return this.viewBuffer[2]; }
}
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

    @xproperty(UVec2)
    private _absPosition: UVec2 = uu.v2();

    @xproperty(UVec2)
    private _size: UVec2 = uu.v2(64, 64);
    private _newSize: UVec2 = uu.v2(64, 64);

    @xproperty(UVec2)
    private _scale: UVec2 = uu.v2(1, 1);

    @xproperty(Number)
    private _rotation: number = 0;



    //是否需要同步，对于非Root的Comp，实际上很多情况是不需要同步的
    public needSync = true;

    private _newPos: UVec2 = uu.v2();
    private _oldPos: UVec2 = uu.v2();
    private _newRot: number = 0;
    private _oldRot: number = 0;

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
                this.owner.world.gameInstance.sendGameGridData(data, this, this.owner);
            }
            this.transformDirty = false
        }
    }

    checkTransformBinary() {
        if (this.transformDirty && this.needSync) {
            if (this._position.x != this._oldPos.x || this._position.y != this._oldPos.y || this._rotation != this._oldRot) {
                let protocol = this.getProtocol(this.id, this.owner.world.gameInstance.protocolSystem);
                protocol.requestBufferView();


                let data = [Math.floor(this._position.x), Math.floor(this._position.y), Math.floor(this._rotation)];
                this._oldPos.x = data[0];
                this._position.x = data[0];
                protocol.setX(data[0]);

                this._oldPos.y = data[1];
                this._position.y = data[1];
                protocol.setY(data[1]);

                this._oldRot = data[2];
                this._rotation = data[2];
                protocol.setRot(data[2]);

            }
            this.transformDirty = false
        }
    }

    getProtocol(id, sys) {return new USceneComponentProtocol(id, sys);}

    receiveBinary(protocol: USceneComponentProtocol) {
        let pos = uu.v2(protocol.getX(), protocol.getY());
        let rot = protocol.getRot();

        this._oldPos = this._position.clone();
        this._newPos = pos;
        this._oldRot = this._rotation;
        this._newRot = rot;
        this.computeFrameRate(this.owner.world.gameInstance.curTick);
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


    //内插值
    oldTick = 0;
    curTick = 0;
    timeFrame = 0;
    frameTimer = 0;
    frameRate = 0;
    hasNewData = false;

    //内插值 计算出两次数据包的时间步长
    private computeFrameRate(time) {

        this.frameTimer = 0;
        this.curTick = time;
        if (this.curTick != 0 && this.oldTick != 0) {
            this.timeFrame = this.curTick - this.oldTick;
        }
        this.oldTick = this.curTick;
        this.hasNewData = true;
    }

    private updateFrameTime(dt) {
        this.frameTimer += dt * 1000;
        this.frameRate = UMath.clamp01(this.frameTimer / this.timeFrame / 2);

    }

    private lerpTransform() {
        if (this.needSync) {
            if (this.timeFrame == 0) {

                // this._oldPos.x = this._position.x;
                // this._oldPos.y = this._position.y;
                // this._oldRot = this._rotation;
                return;
            }

            let rate = this.frameRate;

            //位置

            if (!this._newPos.equals(this._position)) {
                let start = this._oldPos.clone();
                let target = this._newPos;
                start.lerp(target, rate);
                if (this.isRoot()) {
                    this.owner.setPosition(start)
                } else {
                    this.setPosition(start);
                }

            }

            //旋转
            let begRot = this._oldRot;
            let newRot = begRot;
            if (this._rotation != this._newRot) {
                let endRot = this._newRot;
                if (Math.abs(begRot - endRot) > 180) {
                    endRot = endRot - 360;
                }
                newRot = Math.floor(UMath.lerp(begRot, endRot, rate));
                if (this.isRoot()) {
                    this.owner.setRotation(newRot);
                } else {
                    this.setRotation(newRot);
                }
            }
            // if (this.frameRate == 1 && this.hasNewData) {
            //     this.oldTick = 0;
            //     this.curTick = 0;
            //     this.timeFrame = 0;
            //     this.frameTimer = 0;
            //     this.frameRate = 0;
            //     console.log(1);
            // }
            // this.hasNewData = false;
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
            // this.checkTransform();
            this.checkTransformBinary();
        } else {
            //联机模式下才进行差值计算
            if (!this.owner.world.gameInstance.bStandAlone) {
                this.updateFrameTime(dt);
                this.lerpTransform();
            }
        }
    }

    public drawDebug(graphic: UGraphic) {
        super.drawDebug(graphic)

        // const pos = this.getPosition();
        // const size = this.getSize();
        // graphic.drawRect(pos.x-size.x/2, pos.y-size.y/2, size.x, size.y);

        // if (this.isRoot()) {
        //     let ownAABB = this.owner.getCatAABB();
        //     graphic.drawRect(ownAABB.min.x, ownAABB.min.y, this.owner.getSize().x, this.owner.getSize().y, UColor.BLUE());
        // }
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
        if (!pos.equals(this._position)) {
            this.owner.reComputeTransform = true;
            this.transformDirty = true;
            this._position = pos;
        }
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
