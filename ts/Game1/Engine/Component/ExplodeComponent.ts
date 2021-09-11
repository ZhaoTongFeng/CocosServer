import USceneComponent from "../../../Engine/Component/SceneComponent/SceneComponent";
import { xclass } from "../../../Engine/Engine/ReflectSystem/XBase";
import UGraphic from "../../../Engine/Engine/UGraphic";
import { UVec2, uu, UColor } from "../../../Engine/Engine/UMath";

@xclass(UExplodeComponent)
export default class UExplodeComponent extends USceneComponent {

    private _offset: UVec2 = uu.v2();
    timer: number = 0;
    deadTime: number = 1;

    public get offset(): UVec2 {
        return this._offset;
    }

    public set offset(value: UVec2) {
        //将绝对坐标转换成相对坐标

        let dir = this.owner.getPosition().normalize();
        dir.mulSelf(16);
        this._offset = value.sub(this.owner.getPosition()).mul(0.5);
    }



    unUse() {
        super.unUse();
    }

    reUse() {
        super.reUse();
        this._offset.x = 0;
        this._offset.y = 0;
        this.timer = 0;
        this.deadTime = 1;
    }



    public update(dt: number) {
        super.update(dt);

        this.timer += dt;
        if (this.timer > this.deadTime) {
            this.destory();
        }
    }


    public drawDebug(graphic: UGraphic) {
        super.drawDebug(graphic);

        let center = this.owner.getPosition().add(this.offset);
        let start = center.clone();
        let end = center.clone();

        let length = 20;
        let half = 10;

        start.x -= half;
        end.x += half;
        graphic.drawLine(start, end, UColor.WHITE());

        start.x += half;
        end.x -= half;
        start.y += half;
        end.y -= half;
        graphic.drawLine(start, end, UColor.WHITE());
        // graphic.drawCircle(center.x, center.y, 10);
    }

}
