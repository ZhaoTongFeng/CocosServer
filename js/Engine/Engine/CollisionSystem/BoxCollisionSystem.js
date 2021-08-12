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
var XBase_1 = require("../ReflectSystem/XBase");
var CollisionSystem_1 = __importDefault(require("./CollisionSystem"));
/**
 * 独立的立方体碰撞检测
 */
var UBoxCollisionSystem = /** @class */ (function (_super) {
    __extends(UBoxCollisionSystem, _super);
    function UBoxCollisionSystem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UBoxCollisionSystem_1 = UBoxCollisionSystem;
    // 如果不是在四周的情况，那么肯定就在里面
    UBoxCollisionSystem.prototype.intersect = function (c1, c2) {
        return this.intersectBoxBox(c1, c2);
    };
    UBoxCollisionSystem.prototype.test = function (func) {
        this.sort();
        this.testCount = 0;
        for (var i = 0; i < this.collisions.length; i++) {
            //TODO 需要将Index保存到每个Box里面，然后直接用下面的方法去比较即可，如果发生变化，更新Box的Index
            var a = this.collisions[i];
            var max = a.getMaxX();
            for (var j = i + 1; j < this.collisions.length; j++) {
                var b = this.collisions[j];
                if (b.getMinX() > max) {
                    break;
                    1;
                }
                else if (this.intersect(a, b)) {
                    func(a, b);
                }
                this.testCount++;
            }
        }
        if (this.testCount > this.maxTestCount) {
            this.maxTestCount = this.testCount;
        }
        this.print();
    };
    var UBoxCollisionSystem_1;
    UBoxCollisionSystem = UBoxCollisionSystem_1 = __decorate([
        XBase_1.xclass(UBoxCollisionSystem_1)
    ], UBoxCollisionSystem);
    return UBoxCollisionSystem;
}(CollisionSystem_1.default));
exports.default = UBoxCollisionSystem;
