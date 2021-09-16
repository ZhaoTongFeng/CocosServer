
import { xclass, xproperty } from "../../Engine/ReflectSystem/XBase";
import UGraphic from "../../Engine/UGraphic";
import { UColor } from "../../Engine/UMath";
import USceneComponent from "./SceneComponent";

/**
 * 精灵图片组件
 * 挂载到Actor上，以显示图片
 */

@xclass(UTextComponent)
export default class UTextComponent extends USceneComponent {

    @xproperty(String)
    private text: string = "";
    private textDirty: boolean = true;

    @xproperty(UColor)
    private _color: UColor = UColor.WHITE();
    public get color(): UColor {
        return this._color;
    }

    public set color(value: UColor) {
        this._color = value;
        // if(this.owner.world.isClient){
        //     this.owner.world.gameInstance.getWorldView().onSpriteCompSetColor(this);
        // }
    }

    unUse() {
        super.unUse();
    }

    reUse() {
        super.reUse();
        this._color = UColor.WHITE();
        this.textDirty = true;
        this.text = "";
    }

    register() {
        this.owner.world.actorSystem.registerText(this);
    }

    unRegister() {
        this.owner.world.actorSystem.unRegisterText(this);
    }


    private markDirty() {
        this.textDirty = true;
    }

    getText() {
        return this.text;
    }

    setText(tex: string) {
        this.text = tex;
        this.markDirty();
    }

    //4.
    public draw(graphic: UGraphic) {
        super.draw(graphic);
        if (this.textDirty) {
            this.owner.world.gameInstance.getWorldView().onDrawText(this);
            this.textDirty = false;
        }
    }

    //5.
    public destory() {

        super.destory();
    }
}
