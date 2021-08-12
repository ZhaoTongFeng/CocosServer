import USphereComponent from "../../Component/Collision/SphereComponent";
import USpriteComponent from "../../Component/SceneComponent/SpriteComponent";
import { xclass } from "../ReflectSystem/XBase";
import UCollisionSystem from "./CollisionSystem";

/**
 * 碰撞系统
 * 对碰撞体进行统一优化处理
 * 
 */
@xclass(USphereCollisionSystem)
export default class USphereCollisionSystem extends UCollisionSystem {

    //距离和半径比
    intersect(a: USphereComponent, b: USphereComponent): boolean {
        return this.intersectSphereSphere(a, b);
    }
    public test(func: Function) {
        this.sort();
        this.testCount = 0;
        for (let i = 0; i < this.collisions.length; i++) {
            //TODO 需要将Index保存到每个Box里面，然后直接用下面的方法去比较即可，如果发生变化，更新Box的Index
            let a: USphereComponent = this.collisions[i] as USphereComponent;
            const max = a.getMaxX();
            for (let j = i + 1; j < this.collisions.length; j++) {
                const b: USphereComponent = this.collisions[j] as USphereComponent;
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
