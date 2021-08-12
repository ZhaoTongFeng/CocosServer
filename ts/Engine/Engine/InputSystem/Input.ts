import UObject from "../../Object";
import { XBase, xclass } from "../ReflectSystem/XBase";
import { uu, UVec2 } from "../UMath";



export class TouchState{
    delta: UVec2;
    pos: UVec2;
}

@xclass(UInput)
export class UInput extends UObject {
    //触摸状态
    isTouch: boolean = false;
    isTouchMove: boolean = false;


    //屏幕点击操作
    clickPos: UVec2 = uu.v2();

    //虚拟摇杆输出
    leftJoyDir: UVec2 = UVec2.ZERO();
    rightJoyDir: UVec2 = UVec2.ZERO();
    leftJoyRate: number = 0;
    rightJoyRate: number = 0;

    Clear() {



        if (this.leftJoyRate == 0) {
            this.leftJoyDir = UVec2.ZERO()
        }
        if (this.rightJoyRate == 0) {
            this.rightJoyDir = UVec2.ZERO();
        }
        this.isTouchMove = false;

    }


}