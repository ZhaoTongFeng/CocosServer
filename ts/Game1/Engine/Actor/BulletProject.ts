import MovementComponent from "../../../Engine/Component/Movement/MovementComponent";
import { xclass } from "../../../Engine/Engine/ReflectSystem/XBase";
import ABullet from "./Bullet";


/**
 * 弹道子弹
 * 需要一张图片进行显示
 */
@xclass(ABulletProject)
export default class ABulletProject extends ABullet {


    //移动组件
    movementComponent: MovementComponent = null;

    unUse() {
        super.unUse();

    }

    reUse() {
        super.reUse();
        this.movementComponent = null;
    }

}