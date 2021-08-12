
import UBoxComponent from "../../Component/Collision/BoxComponent";
import { xclass } from "../ReflectSystem/XBase";
import UCollisionSystem from "./CollisionSystem";

/**
 * 独立的立方体碰撞检测
 */
@xclass(UBoxCollisionSystem)
export default class UBoxCollisionSystem extends UCollisionSystem {

    // 如果不是在四周的情况，那么肯定就在里面
    intersect(c1: UBoxComponent, c2: UBoxComponent): boolean {
        return this.intersectBoxBox(c1, c2);
    }
    public test(func: Function) {
        this.sort();
        this.testCount = 0;
        for (let i = 0; i < this.collisions.length; i++) {
            //TODO 需要将Index保存到每个Box里面，然后直接用下面的方法去比较即可，如果发生变化，更新Box的Index
            let a: UBoxComponent = this.collisions[i] as UBoxComponent;
            const max = a.getMaxX();
            for (let j = i + 1; j < this.collisions.length; j++) {
                const b: UBoxComponent = this.collisions[j] as UBoxComponent;
                if (b.getMinX() > max) {
                    break; 1
                } else if (this.intersect(a, b)) {
                    func(a, b);
                }
                this.testCount++;
            }
        }
        if (this.testCount > this.maxTestCount) {
            this.maxTestCount = this.testCount;
        }
        this.print();
    }

}
