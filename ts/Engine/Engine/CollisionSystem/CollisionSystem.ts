
import UBoxComponent from "../../Component/Collision/BoxComponent";
import UCollisionComponent from "../../Component/Collision/CollisionComponent";
import USphereComponent from "../../Component/Collision/SphereComponent";
import UObject from "../../Object";
import { UpdateState } from "../Enums";
import UGameInstance from "../GameInstance";
import { xclass } from "../ReflectSystem/XBase";
import UWorld from "../World";

/**
 * 碰撞系统
 * 对碰撞体进行统一优化处理
 * 
 */
@xclass(UCollisionSystem)
export default class UCollisionSystem extends UObject {
    world: UWorld = null;
    init(world: UWorld) {
        super.init(world);
        this.world = world;

    }
    //性能分析
    maxCount: number = 0;
    totalCount: number = 0;
    avgCount: number = 0;

    maxSortCount: number = 0;
    sortCount: number = 0;
    sortTotalCount: number = 0;
    sortAvgCount: number = 0;

    maxTestCount: number = 0
    testCount: number = 0
    testTotalCount: number = 0;
    testAvgCount: number = 0;

    collisions: UCollisionComponent[] = [];

    frameCount = 0;

    //数据结构，后面可以考虑使用索引，方便快速取出和删除，key就是obj.id
    // collisions:Map<string,UCollisionComponent> = new Map();
    // indexes:number[];//一帧中排序结果

    public insert(comp: UCollisionComponent) {

        this.collisions.push(comp);

        if (this.collisions.length > this.maxCount) {
            this.maxCount = this.collisions.length;
        }
        this.totalCount += this.collisions.length;
    }


    public delete(comp: UCollisionComponent) {

        let index = this.collisions.indexOf(comp);
        if (index >= 0) {
            this.collisions.splice(index, 1);

        }
        // console.log("Delete Collision",index)
    }


    //2.在首帧先排序，然后再让各自进行比较
    //这里排序算法，选择一个对几乎有序的数组进行排序的算法，后面可以比较各个算法的好坏，碰撞体形状就是正方形，和圆形，不要整复杂的
    protected sort() {

        this.sortCount = 0;
        let arr = this.collisions;
        for (let i = 1; i < arr.length; i++) {		// 给出当前插入的元素索引
            for (let j = i; j > 0; j--) {			// 用j记录下插入元素索引
                if (arr[j].getMinX() < arr[j - 1].getMinX()) {		// 用当前插入元素和前一位比，小就互换位置，要插入值就移动到了j-1
                    let temp = arr[j - 1];
                    arr[j - 1] = arr[j];
                    arr[j] = temp;
                    this.sortCount++;
                }
            }
        }
        if (this.sortCount > this.maxSortCount) {
            this.maxSortCount = this.sortCount;
        }
        this.sortTotalCount += this.sortCount;
    }

    // 如果不是在四周的情况，那么肯定就在里面
    protected intersect(c1: UCollisionComponent, c2: UCollisionComponent): boolean {
        return false;
    }

    protected intersectBoxBox(c1: UBoxComponent, c2: UBoxComponent): boolean {
        const a = c1.worldAabb;
        const b = c2.worldAabb;
        const no = a.max.x < b.min.x || a.max.y < b.min.y || b.max.x < a.min.x || b.max.y < a.min.y
        return !no;
    }


    protected intersectSphereSphere(a: USphereComponent, b: USphereComponent): boolean {
        let distence = a.center.sub(b.center).lengthSq();
        let radiusSum = a.radius + b.radius;
        return distence <= radiusSum * radiusSum;
    }

    protected IntersectSphereBox(s: USphereComponent, b: UBoxComponent) {
        let box = b.worldAabb;
        let distSq = box.minDistSq(s.center);
        return distSq <= (s.radius * s.radius);
    }

    //用最小的去和最大的比

    public test(func: Function) {
        this.sort();
        this.testCount = 0;
        for (let i = 0; i < this.collisions.length; i++) {
            if (this.collisions[i].state == UpdateState.Dead ||
                this.collisions[i].owner.state == UpdateState.Dead) {
                continue;
            }
            //TODO 需要将Index保存到每个Box里面，然后直接用下面的方法去比较即可，如果发生变化，更新Box的Index
            let a: UCollisionComponent = this.collisions[i];
            const max = a.getMaxX();
            for (let j = i + 1; j < this.collisions.length; j++) {
                if (this.collisions[j].state == UpdateState.Active &&
                    this.collisions[j].owner.state == UpdateState.Active) {
                    const b: UCollisionComponent = this.collisions[j];
                    if (b.getMinX() > max) {
                        break; 1
                    }

                    if (a instanceof UBoxComponent && b instanceof UBoxComponent) {
                        if (this.intersectBoxBox(a, b)) {
                            func(a, b);
                        }
                    } else if (a instanceof USphereComponent && b instanceof USphereComponent) {
                        if (this.intersectSphereSphere(a, b)) {
                            func(a, b);
                        }
                    } else if (a instanceof USphereComponent && b instanceof UBoxComponent) {
                        if (this.IntersectSphereBox(a, b)) {
                            func(a, b);
                        }
                    } else if (a instanceof UBoxComponent && b instanceof USphereComponent) {
                        if (this.IntersectSphereBox(b, a)) {
                            func(a, b);
                        }
                    }
                }

                this.testCount++;
            }
        }
        if (this.testCount > this.maxTestCount) {
            this.maxTestCount = this.testCount;
        }
        this.testTotalCount += this.testCount;

        // this.frameCount++;
        // if (this.frameCount % 60 == 0) {
        //     this.print();
        // }
    }

    protected print() {
        this.avgCount = (this.totalCount / this.frameCount);
        this.sortAvgCount = this.sortTotalCount / this.frameCount;
        this.testAvgCount = this.testTotalCount / this.frameCount;
        console.warn(
            "maxCount", this.maxCount,
            "Sort Count", this.sortCount,
            "Sort Rate", (this.sortCount / (this.collisions.length * this.collisions.length) * 100).toFixed(3),
            "Test Count", this.testCount,
            "TestRate", (this.testCount / (this.collisions.length * this.collisions.length) * 100).toFixed(3),

        );
        console.warn(
            "Cur", this.collisions.length,
            "Avg", this.avgCount.toFixed(0),
            "Sort Avg", this.sortAvgCount.toFixed(0),
            "Test Avg", this.testAvgCount.toFixed(0),
            "Actors", this.world.actors.length,
        )
        console.warn(
            "ac pool", this.world.actorPool,
            "cp pool", this.world.componentPoos,
        )
    }
}
