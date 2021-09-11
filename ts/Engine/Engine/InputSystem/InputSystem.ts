import UObject from "../../Object";
import { XBase, xclass } from "../ReflectSystem/XBase";
import { uu, UVec2 } from "../UMath";
import UWorld from "../World";



export class TouchState {
    delta: UVec2;
    pos: UVec2;
}

@xclass(UInputSystem)
export class UInputSystem extends UObject {
    world: UWorld = null;
    
    //触摸状态
    isTouch: boolean = false;
    isTouchMove: boolean = false;


    //屏幕点击操作
    clickPos: UVec2 = uu.v2();

    //虚拟摇杆输出
    leftJoyDir: UVec2 = UVec2.ZERO();
    leftJoyRate: number = 0;

    rightJoyDir: UVec2 = UVec2.ZERO();
    rightJoyRate: number = 0;

    isPassFireButton = false;




    init(world: UWorld) {
        super.init(world);
        this.world = world;

    }
}