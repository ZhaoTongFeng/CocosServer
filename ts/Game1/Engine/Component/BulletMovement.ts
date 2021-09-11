import UProjectComponent from "../../../Engine/Component/Movement/ProjectComponent";
import { UInputSystem } from "../../../Engine/Engine/InputSystem/InputSystem";
import { xclass } from "../../../Engine/Engine/ReflectSystem/XBase";
import UGraphic from "../../../Engine/Engine/UGraphic";
import { UVec2 } from "../../../Engine/Engine/UMath";


@xclass(UBulletMovement)
export default class UBulletMovement extends UProjectComponent {

    target: UVec2 = UVec2.ZERO()

    unUse() {
        super.unUse();
    }

    reUse() {
        super.reUse();
        this.target.x = 0;
        this.target.y = 0;
    }

    public init(obj: any) {
        super.init(obj);

    }

    //TODO 应该让Controller提供输入
    public processInput(input: UInputSystem) {

        if (!this.target.equals(UVec2.ZERO())) {
            //1.目标方向恒力
            let pos = this.owner.getPosition();
            let dir = this.target.sub(pos).normalize();
            this.force.x += dir.x * this.max_force;
            this.force.y += dir.y * this.max_force;
        }
    }

    public update(dt: number) {

        //是否更新一次
        if (this.target.equalZero()) {

        }
        // //找到最近的Ac
        // let start = this.owner.getPosition();
        // let min = 9999999999;
        // let target: AActor = null;
        // this.owner.world.actors.forEach(actor => {
        //     let leng = start.sub(actor.getPosition()).lengthSqr();
        //     if (this.owner != actor && actor != this.owner && (actor instanceof ABullet) == false && leng < min) {
        //         target = actor;
        //         min = leng
        //     }
        // });
        // if (target) {
        //     this.target = target.getPosition()
        // }


        //更新输入
        super.update(dt);
    }


    public drawDebug(graphic: UGraphic) {
        if (this.owner.world.isDebug) {
            //当前位置->目标位置
            let start = this.owner.getPosition();
            let end = this.target;
            graphic.drawLine(start, end);
        }
    }


}
