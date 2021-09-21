
import { xclass, xproperty } from "../../Engine/ReflectSystem/XBase";
import UGraphic from "../../Engine/UGraphic";
import { UColor } from "../../Engine/UMath";
import USceneComponent from "./SceneComponent";

/**
 * 精灵图片组件
 * 挂载到Actor上，以显示图片
 */

@xclass(USpriteComponent)
export default class USpriteComponent extends USceneComponent {

    @xproperty(String)
    private textureName: string = "";
    public needUpdateTexture: boolean = true;

    @xproperty(UColor)
    private _color: UColor = UColor.WHITE();
    public get color(): UColor {
        return this._color;
    }
    public set color(value: UColor) {
        this._color = value;
        if(this.owner.world.isClient){
            this.owner.world.gameInstance.getWorldView().onSpriteCompSetColor(this);
        }
    }

    unUse() {
        super.unUse();
    }

    reUse() {
        super.reUse();
        this._color = UColor.WHITE();
        this.needUpdateTexture = true;
        this.textureName = "";
    }

    register() {
        this.owner.world.actorSystem.registerSprite(this);
    }
    unRegister() {
        this.owner.world.actorSystem.unRegisterSprite(this);
    }


    private markTextureDirty() {
        this.needUpdateTexture = true;
    }

    onComputeTransfor() {
        super.onComputeTransfor();
    }

    getTexture() {
        return this.textureName;
    }

    setTexture(tex: string) {
        this.textureName = tex;
        this.markTextureDirty();
    }

    //4.
    public draw(graphic: UGraphic) {
        super.draw(graphic);
        if (this.needUpdateTexture) {
            this.owner.world.gameInstance.getWorldView().onDrawTexture(this);
            this.needUpdateTexture = false;
        }
    }

    //5.
    public destory() {

        super.destory();
    }
}
