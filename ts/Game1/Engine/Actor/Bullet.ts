import AActor from "../../../Engine/Actor/Actor";
import { xclass } from "../../../Engine/Engine/ReflectSystem/XBase";


/**
 * 飞行类子弹
 */
@xclass(ABullet)
export default class ABullet extends AActor {

    //攻击力
    attack: number = 0;
    //自动销毁
    timer: number = 0;
    deadTime: number = 3;

    //发射者
    protected owner: AActor = null;

    unUse() {
        super.unUse();

    }

    reUse() {
        super.reUse();
        this.owner = null;
        this.attack = 0;
        this.timer = 0;
        this.deadTime = 3;
    }


    setOwner(pawn: AActor) {
        this.owner = pawn;
    }

    getOwner() {
        return this.owner;
    }

    protected updateActor(dt) {

        this.timer += dt;
        let pos = this.getPosition();
        if (this.timer > this.deadTime) {
            this.destory();
            return;
        }
        
        // let winSize = this.world.gameInstance.getWorldView().winSize;
        // if (pos.x < winSize.x * -1 || pos.x > winSize.x || pos.y > winSize.y || pos.y < winSize.y * -1) {
        //     this.destory();
        //     return;
        // }
    }
}