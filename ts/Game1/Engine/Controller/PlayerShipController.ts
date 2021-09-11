import APlayerController from "../../../Engine/Actor/Controller/PlayerController";
import { UInputSystem } from "../../../Engine/Engine/InputSystem/InputSystem";
import { xclass, xproperty } from "../../../Engine/Engine/ReflectSystem/XBase";
import UGraphic from "../../../Engine/Engine/UGraphic";
import { UVec2, uu, UMath } from "../../../Engine/Engine/UMath";
import UWorld from "../../../Engine/Engine/World";


/**
 * 玩家控制器
 * 响应玩家输入
 */
@xclass(APlayerShipController)
export default class APlayerShipController extends APlayerController {

    protected target: UVec2 = uu.v2(0, 0);

    timer: number = 0;
    fequence: number = 5;

    //移动方向
    @xproperty(UVec2)
    moveDirection: UVec2 = uu.v2();

    @xproperty(Number)
    moveForce: number = 0;

    //开火方向
    @xproperty(UVec2)
    fireDirection: UVec2 = UVec2.ZERO();

    @xproperty(Number)
    fireRate: number = 0;

    flootRate = 1000;

    isFire = false;
    unUse() {
        super.unUse();
    }

    reUse() {
        super.reUse();
        this.target.x = 0;
        this.target.y = 0;
        this.fireDirection.x = 0;
        this.fireDirection.y = 0;

        this.timer = 0;
        this.fequence = 5;
        this.fireRate = 0;
        this.isFire = false;
    }

    init(world: UWorld) {
        super.init(world);
    }

    //SERVER
    receiveData(obj: Object) {

        if (obj["1"] != undefined) {
            this.moveForce = obj["1"] / this.flootRate;
        }

        if (obj["2"] != undefined && obj["3"] != undefined) {
            this.moveDirection.x = obj["2"] / this.flootRate;
            this.moveDirection.y = obj["3"] / this.flootRate;
        }

        if (obj["4"] != undefined) {
            this.isFire = obj["4"];
        }
    }

    //CLIENT
    protected processSelfInput(input: UInputSystem) {

        if (this.world.isClient && this == this.world.playerController) {
            let obj = {};
            let needSend = false;
            if (this.moveForce != input.leftJoyRate) {
                this.moveForce = input.leftJoyRate;
                obj["1"] = Math.floor(this.moveForce * this.flootRate)

                needSend = true;
            }
            if (this.moveDirection.equals(input.leftJoyDir) == false) {
                obj["2"] = Math.floor(this.moveDirection.x * this.flootRate)
                obj["3"] = Math.floor(this.moveDirection.y * this.flootRate)
                this.moveDirection = input.leftJoyDir;
                needSend = true;
            }

            if (this.isFire != input.isPassFireButton) {
                this.isFire = input.isPassFireButton;
                obj["4"] = this.isFire;
                needSend = true;
                
            }

            if (needSend) {
                this.world.gameInstance.sendGameData(obj, this);
            }
        }





        //2.用点击位置设置目标方向
        // let pos = this.getPosition();
        // let dir = this.target.sub(pos).normalize();
        // if (input.clickPos != null) {
        //     this.target = input.clickPos;
        //     // console.log(input.clickPos.x, input.clickPos.y, pos.x, pos.y);
        // }
        // this.movementComponent.force.x += dir.x * this.movementComponent.max_force;
        // this.movementComponent.force.y += dir.y * this.movementComponent.max_force;
        // this.fireRate = input.rightJoyRate;
        // this.fireDirection = input.rightJoyDir;
    }


    protected updateActor(dt) {
        if (this.fireRate != 0) {
            this.timer += dt;
            if (this.timer > 1 / this.fequence) {
                this.timer = 0;
                this.fire();
            }
        } else {
            this.timer = 0;
        }
    }

    protected drawDebugActor(graphic: UGraphic) {

    }

    public destory() {

        super.destory();
    }



    fire() {

        // let bullet = this.world.spawn(ABullet);
        // let spriteComp = bullet.spawnComponent(USpriteComponent);
        // spriteComp.setTexture("bullet_1");

        // bullet.movementComponent = bullet.spawnComponent(UBulletMovement);
        // bullet.spawnComponent(USphereComponent);
        // bullet.setScale(uu.v2(0.5, 0.5));
        // bullet.setPosition(this.getPosition().clone());
        // bullet.owner = this;

        // // //1.摇杆方向发射子弹
        // // let direction = this.fireDirection;
        // // //2.朝target方向发射
        // // // let direction = this.target.sub(bullet.getPosition())
        // // // direction.normalizeSelf();
        // // let speed = 500;
        // // bullet.movementComponent.velocity.x = direction.x * speed
        // // bullet.movementComponent.velocity.y = direction.y * speed
    }
}
