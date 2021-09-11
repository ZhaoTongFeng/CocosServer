import { UInputSystem } from "../../../Engine/Engine/InputSystem/InputSystem";
import { xclass } from "../../../Engine/Engine/ReflectSystem/XBase";
import UGraphic from "../../../Engine/Engine/UGraphic";
import { UVec2, uu } from "../../../Engine/Engine/UMath";
import UShipItem from "./ShipItem";


/**
 * 武器瞄准模式
 * 1.方向
 * 2.目标
 */
export enum WeaponCrossMode {
    DIR,
    TARGET
}

/**
 * 目标模式
 * 1.位置
 * 2.AShip
 * 3.Bullet
 */
export enum WeaponTargetMode {

}

/**
 * 子弹追踪模式
 * 不追踪
 * 追踪
 */
export enum BulletUpdate {
    SINGLE,
    FOLLOW,
}

/**
 * 子弹伤害模式
 * 单个伤害
 * 范围伤害
 */
export enum DamageMode {

}


export class WeaponFactory {
    getWeapon() {

    }
}

/**
 * 发射状态
 * 准备就绪
 * 发射中
 * 冷却中
 */
export enum FireState {
    READY,
    FIRING,
    STOP
}
/**
 * 武器基类
 * 角色挂上这个武器，就能发射武器
 */
@xclass(UShipWeapon)
export default class UShipWeapon extends UShipItem {

    //方向模式
    protected mode: WeaponCrossMode = WeaponCrossMode.DIR;

    //1.方向
    fireDirection: UVec2 = UVec2.ZERO();
    fireRate: number = 0;

    //2.目标
    protected target: UVec2 = uu.v2(0, 0);
    // protected target: AShip = null;
    // protected target: ABullet = null;


    //发射频率
    timer: number = 0;
    fequence: number = 5;

    //冷却
    ac_timer: number = 0;
    ac: number = 0;

    //过热0-1
    hot: number = 0;

    //消耗
    cost: number = 0;


    fireState: FireState = FireState.READY;



    unUse() {
        super.unUse();
    }

    reUse() {
        super.reUse();
        this.mode = WeaponCrossMode.DIR;
        this.fireDirection.y = 0;
        this.fireDirection.x = 0;
        this.fireRate = 0;

        this.target.x = 0;
        this.target.y = 0;
        this.timer = 0;
        this.fequence = 0;
        this.ac_timer = 0;
        this.ac = 0;
        this.hot = 0;
        this.cost = 0;
        this.fireState = FireState.READY;
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
    }

    public processInput(input: UInputSystem) {

    }

    public update(dt: number) {
        switch (this.fireState) {
            case FireState.READY: {
                //等待阶段
                break;
            }
            case FireState.FIRING: {
                //发射中
                this.timer += dt;
                if (this.timer > 1 / this.fequence) {
                    this.timer = 0;
                    this.onFire();
                }
                break;
            }
            case FireState.STOP: {
                //冷却阶段
                break;
            }
        }
    }

    public drawDebug(graphic: UGraphic) {

    }


    public destory() {

        super.destory();
    }
}
