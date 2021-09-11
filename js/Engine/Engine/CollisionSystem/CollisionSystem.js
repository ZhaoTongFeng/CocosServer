"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var BoxComponent_1 = __importDefault(require("../../Component/Collision/BoxComponent"));
var SphereComponent_1 = __importDefault(require("../../Component/Collision/SphereComponent"));
var Object_1 = __importDefault(require("../../Object"));
var Enums_1 = require("../Enums");
var XBase_1 = require("../ReflectSystem/XBase");
/**
 * 碰撞系统
 * 对碰撞体进行统一优化处理
 *
 */
var UCollisionSystem = /** @class */ (function (_super) {
    __extends(UCollisionSystem, _super);
    function UCollisionSystem() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.world = null;
        //性能分析
        _this.maxCount = 0;
        _this.totalCount = 0;
        _this.avgCount = 0;
        _this.maxSortCount = 0;
        _this.sortCount = 0;
        _this.sortTotalCount = 0;
        _this.sortAvgCount = 0;
        _this.maxTestCount = 0;
        _this.testCount = 0;
        _this.testTotalCount = 0;
        _this.testAvgCount = 0;
        _this.collisions = [];
        _this.frameCount = 0;
        return _this;
    }
    UCollisionSystem_1 = UCollisionSystem;
    UCollisionSystem.prototype.init = function (world) {
        _super.prototype.init.call(this, world);
        this.world = world;
    };
    //数据结构，后面可以考虑使用索引，方便快速取出和删除，key就是obj.id
    // collisions:Map<string,UCollisionComponent> = new Map();
    // indexes:number[];//一帧中排序结果
    UCollisionSystem.prototype.insert = function (comp) {
        this.collisions.push(comp);
        if (this.collisions.length > this.maxCount) {
            this.maxCount = this.collisions.length;
        }
        this.totalCount += this.collisions.length;
    };
    UCollisionSystem.prototype.delete = function (comp) {
        var index = this.collisions.indexOf(comp);
        if (index >= 0) {
            this.collisions.splice(index, 1);
        }
        // console.log("Delete Collision",index)
    };
    //2.在首帧先排序，然后再让各自进行比较
    //这里排序算法，选择一个对几乎有序的数组进行排序的算法，后面可以比较各个算法的好坏，碰撞体形状就是正方形，和圆形，不要整复杂的
    UCollisionSystem.prototype.sort = function () {
        this.sortCount = 0;
        var arr = this.collisions;
        for (var i = 1; i < arr.length; i++) { // 给出当前插入的元素索引
            for (var j = i; j > 0; j--) { // 用j记录下插入元素索引
                if (arr[j].getMinX() < arr[j - 1].getMinX()) { // 用当前插入元素和前一位比，小就互换位置，要插入值就移动到了j-1
                    var temp = arr[j - 1];
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
    };
    // 如果不是在四周的情况，那么肯定就在里面
    UCollisionSystem.prototype.intersect = function (c1, c2) {
        return false;
    };
    UCollisionSystem.prototype.intersectBoxBox = function (c1, c2) {
        var a = c1.worldAabb;
        var b = c2.worldAabb;
        var no = a.max.x < b.min.x || a.max.y < b.min.y || b.max.x < a.min.x || b.max.y < a.min.y;
        return !no;
    };
    UCollisionSystem.prototype.intersectSphereSphere = function (a, b) {
        var distence = a.center.sub(b.center).lengthSq();
        var radiusSum = a.radius + b.radius;
        return distence <= radiusSum * radiusSum;
    };
    UCollisionSystem.prototype.IntersectSphereBox = function (s, b) {
        var box = b.worldAabb;
        var distSq = box.minDistSq(s.center);
        return distSq <= (s.radius * s.radius);
    };
    //用最小的去和最大的比
    UCollisionSystem.prototype.test = function (func) {
        this.sort();
        this.testCount = 0;
        for (var i = 0; i < this.collisions.length; i++) {
            if (this.collisions[i].state == Enums_1.UpdateState.Dead ||
                this.collisions[i].owner.state == Enums_1.UpdateState.Dead) {
                continue;
            }
            //TODO 需要将Index保存到每个Box里面，然后直接用下面的方法去比较即可，如果发生变化，更新Box的Index
            var a = this.collisions[i];
            var max = a.getMaxX();
            for (var j = i + 1; j < this.collisions.length; j++) {
                if (this.collisions[j].state == Enums_1.UpdateState.Active &&
                    this.collisions[j].owner.state == Enums_1.UpdateState.Active) {
                    var b = this.collisions[j];
                    if (b.getMinX() > max) {
                        break;
                        1;
                    }
                    if (a instanceof BoxComponent_1.default && b instanceof BoxComponent_1.default) {
                        if (this.intersectBoxBox(a, b)) {
                            func(a, b);
                        }
                    }
                    else if (a instanceof SphereComponent_1.default && b instanceof SphereComponent_1.default) {
                        if (this.intersectSphereSphere(a, b)) {
                            func(a, b);
                        }
                    }
                    else if (a instanceof SphereComponent_1.default && b instanceof BoxComponent_1.default) {
                        if (this.IntersectSphereBox(a, b)) {
                            func(a, b);
                        }
                    }
                    else if (a instanceof BoxComponent_1.default && b instanceof SphereComponent_1.default) {
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
    };
    UCollisionSystem.prototype.print = function () {
        this.avgCount = (this.totalCount / this.frameCount);
        this.sortAvgCount = this.sortTotalCount / this.frameCount;
        this.testAvgCount = this.testTotalCount / this.frameCount;
        console.warn("maxCount", this.maxCount, "Sort Count", this.sortCount, "Sort Rate", (this.sortCount / (this.collisions.length * this.collisions.length) * 100).toFixed(3), "Test Count", this.testCount, "TestRate", (this.testCount / (this.collisions.length * this.collisions.length) * 100).toFixed(3));
        console.warn("Cur", this.collisions.length, "Avg", this.avgCount.toFixed(0), "Sort Avg", this.sortAvgCount.toFixed(0), "Test Avg", this.testAvgCount.toFixed(0), "Actors", this.world.actors.length);
        console.warn("ac pool", this.world.actorPool, "cp pool", this.world.compPool);
    };
    var UCollisionSystem_1;
    UCollisionSystem = UCollisionSystem_1 = __decorate([
        XBase_1.xclass(UCollisionSystem_1)
    ], UCollisionSystem);
    return UCollisionSystem;
}(Object_1.default));
exports.default = UCollisionSystem;
