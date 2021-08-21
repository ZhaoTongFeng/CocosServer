
import { Visiblity } from "../../Engine/Enums";
import UGameInstance from "../../Engine/GameInstance";
import { UInput } from "../../Engine/InputSystem/Input";
import { xclass, xproperty } from "../../Engine/ReflectSystem/XBase";
import UGraphic from "../../Engine/UGraphic";
import { UVec2, uu } from "../../Engine/UMath";
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

    @xproperty(UVec2)
    private _absPosition: UVec2 = uu.v2();

    @xproperty(UVec2)
    private _size: UVec2 = uu.v2(64, 64);

    @xproperty(UVec2)
    private _scale: UVec2 = uu.v2(1, 1);

    @xproperty(Number)
    private _rotation: number = 0;


    public init(data: any) {
        super.init(data);
        if (this.owner.getSceneComponent() == null) {
            this.owner.setSceneComponent(this);
        }

        //客户端才需要注册SceneComponent，用于显示
        if (this.owner.world.isClient) {
            this.register();
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
    }
    
    public unRegister() {
        this.owner.world.actorSystem.unRegisterSceneComponent(this);
    }

    public processInput(input: UInput) {
        super.processInput(input);

    }

    public update(dt) {
        super.update(dt);

    }

    public drawDebug(graphic: UGraphic) {
        super.drawDebug(graphic)

        // const pos = this.getPosition();
        // const size = this.getSize();
        // graphic.drawRect(pos.x-size.x/2, pos.y-size.y/2, size.x, size.y);
    }

    public draw(graphic: UGraphic) {


    }


    onDestory() {
        if (this.owner.world.isClient) {
            this.unRegister();
        }
        super.onDestory();
    }

    transformDirty: boolean = true;
    onComputeTransfor() {
        this.visiblity = this._visiblity;
        this.transformDirty = true;
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
        this._size = value;
    }


    public getScale(): UVec2 {
        return this._scale;
    }
    public setScale(value: UVec2) {
        this._scale = value;
    }


    public getRotation() {
        return this._rotation
    }
    public setRotation(angle: number) {
        this._rotation = angle;
    }
}
