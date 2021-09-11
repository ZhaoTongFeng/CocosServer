import UComponent from "../../../Engine/Component/Component";
import USpriteComponent from "../../../Engine/Component/SceneComponent/SpriteComponent";
import { xclass } from "../../../Engine/Engine/ReflectSystem/XBase";
import UGraphic from "../../../Engine/Engine/UGraphic";
import { UColor, UMath, uu } from "../../../Engine/Engine/UMath";
import AShip from "../Pawn/Ship";



/**
 * 护盾
 */
@xclass(UShipShield)
export default class UShipShield extends UComponent {

    private spriteComp: USpriteComponent = null;

    private timer: number = 0;
    private hitTime: number = 0.5;//恢复原始颜色
    private hitColor: UColor = UColor.RED()
    private oldColor: UColor = UColor.WHITE();

    public onHit() {
        this.timer = this.hitTime;
    }

    unUse() {
        super.unUse();
    }

    reUse() {
        super.reUse();
        this.timer = 0;
        this.hitTime = 0.5;
    }

    public init(obj: any) {
        super.init(obj);
        this.spriteComp = this.owner.spawnComponent(USpriteComponent);
        this.spriteComp.setTexture("shield_cover");
        if (this.owner instanceof AShip) {
            this.owner.setShield(this);
        }
    }


    public update(dt: number) {
        if (this.spriteComp) {
            if (this.timer > 0) {
                this.timer -= dt;
                this.timer = UMath.clamp(this.timer, 0, this.hitTime);
                let rate = this.timer / this.hitTime;//0 old 1 hit;
                let r = UMath.lerp(this.oldColor.r, this.hitColor.r, rate);
                let g = UMath.lerp(this.oldColor.g, this.hitColor.g, rate);
                let b = UMath.lerp(this.oldColor.b, this.hitColor.b, rate);
                let a = UMath.lerp(this.oldColor.a, this.hitColor.a, rate);
                this.spriteComp.color = uu.color(r, g, b, a)
            }
        }
    }

    public drawDebug(graphic: UGraphic) {

    }

    public destory() {
        if (this.spriteComp) {
            this.spriteComp.destory();
        }
        this.spriteComp = null;
        if (this.owner instanceof AShip) {
            this.owner.setShield(null);
        }
        super.destory();
    }
}
