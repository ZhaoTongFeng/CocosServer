
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

    private textureName: string = "";
    private needUpdateTexture: boolean = true;

    @xproperty(UColor)
    private color: UColor = UColor.WHITE();

    getColor() {
        return this.color;
    }
    setColor(val: UColor) {
        this.color = val;
        this.owner.world.gameInstance.getWorldView().onSpriteCompSetColor(this);
    }

    unUse() {
        super.unUse();
    }

    reUse() {
        super.reUse();
        this.setColor(UColor.WHITE())
        this.needUpdateTexture = true;
        this.textureName = "";
    }

    register() {
        this.owner.world.gameInstance.getWorldView().addSpriteComponent(this);
    }
    unRegister() {
        this.owner.world.gameInstance.getWorldView().removeSpriteComponent(this);
    }
    //1.
    public init(data: any) {
        super.init(data);

    }

    private markTextureDirty() {
        this.needUpdateTexture = true;
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
