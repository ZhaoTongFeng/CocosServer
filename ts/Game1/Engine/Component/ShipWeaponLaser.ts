import { UInputSystem } from "../../../Engine/Engine/InputSystem/InputSystem";
import { xclass } from "../../../Engine/Engine/ReflectSystem/XBase";
import UGraphic from "../../../Engine/Engine/UGraphic";
import { UColor } from "../../../Engine/Engine/UMath";
import UShipWeapon, { FireState } from "./ShipWeapon";


@xclass(UShipWeaponLaser)
export default class UShipWeaponLaser extends UShipWeapon {


    holdTime: number = 10;
    holdTimer: number = 0;

    stopTime: number = 0.5;
    stopTimer: number = 0;


    unUse() {
        super.unUse();
    }

    reUse() {
        super.reUse();
        this.holdTime = 10;
        this.holdTimer = 0;

        this.stopTime = 0.5;
        this.stopTimer = 0;
    }


    /**
     * 开始发射
     * 开始计时
     */
    public startFire() {
        if (this.fireState == FireState.READY) {
            this.fireState = FireState.FIRING;
        }
    }

    /**
     * 每次发射
     * 开火=生成子弹+挂载移动组件
     */
    public onFire() {

    }

    /**
     * 结束开火
     */
    public finishFire() {
        this.fireState = FireState.STOP;
    }

    public init(obj: any) {
        super.init(obj);
        this.fequence = 50;
    }

    public processInput(input: UInputSystem) {

    }





    public update(dt: number) {

        switch (this.fireState) {
            case FireState.READY: {
                //等待阶段
                this.fireState = FireState.FIRING
                // this.holdTimer += dt;
                // if (this.holdTimer > this.holdTime) {
                //     this.holdTimer = 0;
                //     this.fireState = FireState.FIRING
                // }
                break;
            }
            case FireState.FIRING: {
                //发射中
                this.timer += dt;
                if (this.timer > this.holdTime) {
                    this.timer = 0;
                    this.fireState = FireState.STOP
                }
                break;
            }
            case FireState.STOP: {
                //冷却阶段
                this.stopTimer += dt;
                if (this.stopTimer > this.stopTime) {
                    this.stopTimer = 0;
                    this.fireState = FireState.READY
                }
                break;
            }
        }
    }

    public drawDebug(graphic: UGraphic) {
        if (this.fireState == FireState.FIRING) {
            let start = this.owner.getPosition();
            let end = this.target;
            graphic.drawLine(start, end, UColor.WHITE(), 10);
        }
    }


    public destory() {

        super.destory();
    }
}
