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
Object.defineProperty(exports, "__esModule", { value: true });
var UMath_1 = require("../../../Engine/Engine/UMath");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var CameraCtrl = /** @class */ (function (_super) {
    __extends(CameraCtrl, _super);
    function CameraCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.velocity = cc.v2();
        _this.acc = cc.v2();
        return _this;
    }
    CameraCtrl.prototype.onLoad = function () {
        // init logic
        this.camera = this.node.getComponent(cc.Camera);
        var max = 200;
        this.leng = max * max;
        this.max_acc = cc.v2(max, max);
        this.max_velocity = cc.v2(max, max);
        this.min_acc = this.max_acc.mul(-1);
        this.min_velocity = this.max_velocity.mul(-1);
        //角度转化成方向向量
        var angle = this.node.angle / 180 * Math.PI;
        var dir = cc.v2(Math.cos(angle), Math.sin(angle));
        dir.normalize();
        //方向向量转角度
        var angle2 = dir.signAngle(cc.v2(1, 0));
        var degree = angle2 / Math.PI * 180;
    };
    CameraCtrl.prototype.stop = function () {
        this.velocity = cc.Vec2.ZERO;
    };
    CameraCtrl.prototype.addAcc = function (direction) {
        this.acc.addSelf(direction);
        this.acc.x = UMath_1.UMath.clamp(this.acc.x, this.min_acc.x, this.max_acc.x);
        this.acc.y = UMath_1.UMath.clamp(this.acc.y, this.min_acc.y, this.max_acc.y);
    };
    CameraCtrl.prototype.update = function (dt) {
        //加速度增加的加速/减速运动
        //a = a0+a1t
        // this.velocity = cc.pClamp(this.velocity.addSelf(this.acc), this.min_acc, this.max_acc);
        // let offset = this.velocity.mul(dt);
        // // console.log(offset.magSqr(),this.leng/10*2*dt)
        // this.node.setPosition(offset.add(this.node.getPosition()));
        // if(this.velocity.magSqr()!=0){
        //     let direction = cc.v2(0,0);
        //     if(this.velocity.x>0){
        //         direction.x=1;
        //     }else if(this.velocity.x<0){
        //         direction.x=-1;
        //     }
        //     if(this.velocity.y>0){
        //         direction.y=1;
        //     }else if(this.velocity.y<0){
        //         direction.y=-1;
        //     }
        //     let backVec = cc.v2();
        //     backVec.x = direction.x*this.max_acc.x;
        //     backVec.y = direction.y*this.max_acc.y;
        //     this.acc = cc.pClamp(this.acc.subSelf(backVec.mul(dt)), this.min_acc, this.max_acc);
        // }
        // if(this.velocity .magSqr()<this.leng/2){
        //     this.velocity=cc.Vec2.ZERO;
        //     this.acc=cc.Vec2.ZERO;
        // }
        // if (this.acc.magSqr() > 100) {
        //     
        // }
        // if(){
        //     this.acc = cc.pClamp(this.acc.addSelf(this.max_acc.mul(dt*0.5)), this.min_acc, this.max_acc);
        //     console.log(this.acc);
        // }
        // //v=v0+at;
        // this.velocity = this.velocity.add(this.acc.mul(dt));
        // let oldVec = this.velocity;
        // //s=s0+vt
        // this.node.setPosition(this.velocity.addSelf(this.acc).mul(dt).add(this.node.getPosition()));
    };
    CameraCtrl = __decorate([
        ccclass
    ], CameraCtrl);
    return CameraCtrl;
}(cc.Component));
exports.default = CameraCtrl;
