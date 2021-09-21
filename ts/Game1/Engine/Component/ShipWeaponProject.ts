import APawn from "../../../Engine/Actor/Pawn/Pawn";
import USphereComponent from "../../../Engine/Component/Collision/SphereComponent";
import USpriteComponent from "../../../Engine/Component/SceneComponent/SpriteComponent";
import { UInputSystem } from "../../../Engine/Engine/InputSystem/InputSystem";
import { Protocol } from "../../../Engine/Engine/NetworkSystem/Share/Protocol";
import { xclass } from "../../../Engine/Engine/ReflectSystem/XBase";
import UGraphic from "../../../Engine/Engine/UGraphic";
import { UMath, uu } from "../../../Engine/Engine/UMath";
import ABulletProject from "../Actor/BulletProject";
import APlayerShipController from "../Controller/PlayerShipController";
import UBulletMovement from "./BulletMovement";
import UShipWeapon, { FireState } from "./ShipWeapon";



export class UShipWeaponProjectProtocol extends Protocol {
    init() {
        this.dataLength = 4 + 4 * 4 + 4 * 4;
    }

    //1.定义数据访问格式，不一定只有一个，按照需要读写的数据来决定
    viewBuffer1: Uint8Array = undefined;
    viewBuffer2: Uint32Array = undefined;
    viewBuffer3: Int32Array = undefined;

    initView() {
        let offset = this.headLength
        this.viewBuffer1 = this.getUint8(offset, 4);
        offset += 4;


        this.viewBuffer2 = this.getUint32(offset, 4);
        offset += 4 * 4;

        this.viewBuffer3 = this.getInt32(offset, 4);
    }


    setOpt(v) { this.viewBuffer1[0] = v; }
    getOpt() { return this.viewBuffer1[0]; }

    setRand(v) { this.viewBuffer1[1] = v; }
    getRand() { return this.viewBuffer1[1]; }


    setId(v) { this.viewBuffer2[0] = v; }
    getId() { return this.viewBuffer2[0]; }

    setSId(v) { this.viewBuffer2[1] = v; }
    getSId() { return this.viewBuffer2[1]; }

    setMId(v) { this.viewBuffer2[2] = v; }
    getMId() { return this.viewBuffer2[2]; }

    setWId(v) { this.viewBuffer2[3] = v; }
    getWId() { return this.viewBuffer2[3]; }


    setX(v) { this.viewBuffer3[0] = v; }
    getX() { return this.viewBuffer3[0]; }

    setY(v) { this.viewBuffer3[1] = v; }
    getY() { return this.viewBuffer3[1]; }

    setVx(v) { this.viewBuffer3[2] = v; }
    getVx() { return this.viewBuffer3[2]; }

    setVy(v) { this.viewBuffer3[3] = v; }
    getVy() { return this.viewBuffer3[3]; }
}


@xclass(UShipWeaponProject)
export default class UShipWeaponProject extends UShipWeapon {
    getProtocol(id, sys) { return new UShipWeaponProjectProtocol(id, sys); }


    textureName: string = "weapon/proj/proj";

    firing = false;

    unUse() {
        super.unUse();
    }

    reUse() {
        super.reUse();
        this.textureName = "weapon/proj/proj";
    }

    public init(obj: any) {
        super.init(obj);
    }

    public drawDebug(graphic: UGraphic) {

    }

    public destory() {

        super.destory();
    }

    public update(dt: number) {
        if (this.owner.world.isClient) {
            return;
        }

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
                this.fireState = FireState.READY;
                break;
            }
        }
    }

    /**
     * 开始发射
     * 开始计时
     */
    public startFire() {
        if (this.fireState == FireState.READY) {
            this.fireState = FireState.FIRING;
            console.log("开火");
        }
    }

    /**
     * 结束开火
     */
    public finishFire() {
        if (this.fireState == FireState.FIRING) {
            this.fireState = FireState.STOP;
            console.log("停火");
        }
    }

    receiveBinary(protocol: UShipWeaponProjectProtocol) {
        let opt = protocol.getOpt();

        if (opt == 0) {

            let wId = protocol.getWId();
            let id = protocol.getId();
            let rand = protocol.getRand();

            let px = protocol.getX();
            let py = protocol.getY();
            let vx = protocol.getVx();
            let vy = protocol.getVy();
            let mId = protocol.getMId();
            let sId = protocol.getSId();

            this.owner.world.setCurrentGenID(Number(wId));

            let bullet = new ABulletProject();
            bullet.init(this.owner.world, id);

            //显示
            let spriteComp = new USpriteComponent();
            spriteComp.init(bullet, sId);
            spriteComp.setTexture(this.textureName + rand);
            spriteComp.needSync = false;

            //碰撞
            let collision = bullet.spawnComponent(USphereComponent);
            // collision.setPadding(8);

            //基本属性
            bullet.setScale(uu.v2(0.5, 0.5));
            bullet.setPosition(uu.v2(px, py));
            bullet.setOwner(this.owner);

            //移动
            bullet.movementComponent = new UBulletMovement();
            bullet.movementComponent.init(bullet, mId)
            bullet.movementComponent.velocity.x = vx
            bullet.movementComponent.velocity.y = vy
        }
    }

    //CLIENT
    receiveData(obj: Object) {
        let opt = obj["opt"];
        if (opt == 0) {
            let wId = obj["wId"]
            let id = obj["id"];
            let rand = obj["rand"];
            let px = obj["px"];
            let py = obj["py"];
            let vx = obj["vx"];
            let vy = obj['vy'];
            let mId = obj["mId"];
            let sId = obj["sId"];

            this.owner.world.setCurrentGenID(Number(wId));
            let bullet = new ABulletProject();
            bullet.init(this.owner.world, id);

            //显示
            let spriteComp = new USpriteComponent();
            spriteComp.init(bullet, sId);
            spriteComp.setTexture(this.textureName + rand);
            spriteComp.needSync = false;

            //碰撞
            // let collision = bullet.spawnComponent(USphereComponent);
            // collision.setPadding(8);

            //基本属性
            bullet.setScale(uu.v2(0.5, 0.5));
            bullet.setPosition(uu.v2(px, py));
            bullet.setOwner(this.owner);

            //移动
            bullet.movementComponent = new UBulletMovement();
            bullet.movementComponent.init(bullet, mId)
            bullet.movementComponent.velocity.x = vx
            bullet.movementComponent.velocity.y = vy
        }
    }


    /**
     * 每次发射
     * 开火=生成子弹+挂载移动组件
     */
    public onFire() {

        let bullet = this.owner.world.spawn(ABulletProject);
        let id = bullet.id;

        //显示
        let spriteComp = bullet.spawnComponent(USpriteComponent);

        // let rand = 1 + Math.floor(Math.random() * 2.9);

        let rand = 3;
        spriteComp.setTexture(this.textureName + rand);
        spriteComp.needSync = false;

        //碰撞
        let collision = bullet.spawnComponent(USphereComponent);

        // collision.setPadding(8);

        //基本属性
        bullet.setScale(uu.v2(0.5, 0.5));
        let pos = this.owner.getPosition().clone()
        bullet.setPosition(pos);

        bullet.setOwner(this.owner);


        //移动
        bullet.movementComponent = bullet.spawnComponent(UBulletMovement);

        // //1.摇杆方向发射子弹
        // let direction = this.fireDirection;

        //2.朝target方向发射

        let direction = uu.v2(0, 1);
        direction = direction.rotate(UMath.toRadians(this.owner.getRotation()));

        let speed = 1000;
        let vx = direction.x * speed
        let vy = direction.y * speed
        bullet.movementComponent.velocity.x = vx;
        bullet.movementComponent.velocity.y = vy;


        let wid = this.owner.world.getCurrentGenID();
        let sid = spriteComp.id;
        let mid = bullet.movementComponent.id;
        let opt = 0;

        // let obj = {
        //     wId: this.owner.world.getCurrentGenID(),

        //     opt: opt,
        //     rand: rand,

        //     id: id,
        //     sId:sid,
        //     mId: mid,

        //     px: pos.x,
        //     py: pos.y,
        //     vx: vx,
        //     vy: vy
        // };
        // this.owner.world.gameInstance.sendGameData(obj, this);


        let protocol = this.getProtocol(this.id, this.owner.world.gameInstance.protocolSystem);
        protocol.requestBufferView();

        protocol.setOpt(opt);
        protocol.setRand(rand);

        protocol.setId(id);
        protocol.setWId(wid);
        protocol.setSId(sid);
        protocol.setMId(mid);

        protocol.setX(pos.x);
        protocol.setY(pos.y);
        protocol.setVx(vx);
        protocol.setVy(vy);
    }



    //SERVER
    public processInput(input: UInputSystem) {
        if (!this.owner.world.isClient) {
            let con = (this.owner as APawn).controller as APlayerShipController;
            if (con) {
                this.firing = con.isFire;
                if (this.firing) {
                    this.startFire();
                } else {
                    this.finishFire();
                }
            }
        }
    }



}
