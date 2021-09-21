import AActor from "../../Actor/Actor";
import APawn from "../../Actor/Pawn/Pawn";
import { UInputSystem } from "../../Engine/InputSystem/InputSystem";
import { xclass, xproperty } from "../../Engine/ReflectSystem/XBase";
import { UVec2, uu, UMath } from "../../Engine/UMath";
import UComponent from "../Component";

@xclass(UMovementComponent)
export default class UMovementComponent extends UComponent {
    @xproperty(Number)
    public mg: number = 10;//质量

    //动力
    @xproperty(Number)
    public max_force: number = 1000;

    //阻力
    @xproperty(Number)
    public max_backForce: number = 1000;

    @xproperty(Number)
    public max_acc: number = 500;

    @xproperty(Number)
    public max_vel: number = 200;



    @xproperty(UVec2)
    public force: UVec2 = uu.v2(0, 0);//力 F = MA

    @xproperty(UVec2)
    public acc: UVec2 = uu.v2(0, 0);//加速度 A = F/M

    @xproperty(UVec2)
    public velocity: UVec2 = uu.v2(0, 0);//速度 V = V0 + A*T/2

    //前进方向
    @xproperty(UVec2)
    protected direction: UVec2 = uu.v2(0, 0);

    unUse() {
        super.unUse();

    }

    reUse() {
        super.reUse();

        this.mg = 10;
        this.max_force = 1000;
        this.max_acc = 500;
        this.max_vel = 200;

        this.force.x = 0;
        this.force.y = 0;

        this.acc.x = 0;
        this.acc.y = 0;

        this.velocity.x = 0;
        this.velocity.y = 0;

        this.direction.x = 0;
        this.direction.y = 0;
    }


    onLoad(ac: AActor) {
        super.onLoad(ac);
        if (ac instanceof APawn) {
            ac.setMovement(this);
        }
        this.owner.world.actorSystem.registerMovement(this);
    }


    clear() {
        this.force.x = 0;
        this.force.y = 0;

        this.acc.x = 0;
        this.acc.y = 0;
    }


    //累加，一直加到限制
    public addMoveForce(value: UVec2) {
        this.force.addSelf(value);
        let forceRate = this.force.length();
        let forceDir = this.force.normalize();
        this.force = forceDir.mul(UMath.clamp(forceRate, -this.max_force, this.max_force));
    }

    public setMoveForce(value: UVec2) {
        this.force = value.mulSelf(this.max_force);
    }

    public processInput(input: UInputSystem) {

    }

    public update(dt: number) {

    }

    public draw() {

    }

    onDestory() {
        if (this.owner instanceof APawn) {
            this.owner.setMovement(null);
        }
        this.owner.world.actorSystem.unRegisterMovement(this);
        super.onDestory();
    }
}
