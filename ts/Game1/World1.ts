import APawn from "../Engine/Actor/Pawn/Pawn";
import UCollisionComponent from "../Engine/Component/Collision/CollisionComponent";
import USphereComponent from "../Engine/Component/Collision/SphereComponent";
import UCameraComponent from "../Engine/Component/SceneComponent/CameraComponent";
import USpriteAnimationComponent from "../Engine/Component/SceneComponent/SpriteAnimationComponent";
import USpriteComponent from "../Engine/Component/SceneComponent/SpriteComponent";
import UTextComponent from "../Engine/Component/SceneComponent/TextComponent";
import ClientUserManager from "../Engine/Engine/NetworkSystem/Client/ClientUserManager";
import { xclass } from "../Engine/Engine/ReflectSystem/XBase";
import { uu, UVec2 } from "../Engine/Engine/UMath";
import UWorld from "../Engine/Engine/World";
import ABulletProject from "./Engine/Actor/BulletProject";
import AExplodeActor from "./Engine/Actor/ExplodeActor";
import UCharacterMovement from "./Engine/Component/CharacterMovement";
import UShipShield from "./Engine/Component/ShipShield";
import UShipWeaponProject from "./Engine/Component/ShipWeaponProject";
import APlayerShipController from "./Engine/Controller/PlayerShipController";
import UBattleComponent from "./Engine/Info/BattleComponent";
import UPlayerBattleComponent from "./Engine/Info/PlayerBattleComponent";
import AShip from "./Engine/Pawn/Ship";



//游戏关卡一
@xclass(World1)
export default class World1 extends UWorld {
    public init(levelData: any = null) {
        super.init(levelData);
        this.isDebug = true;
        if (this.isClient) {
            USpriteAnimationComponent.RegisterAllAnimation();
            console.log("注册所有动画序列名称")

            //客户端恢复关卡数据
            this.fromJSON(levelData);

            this.actors.forEach(ac => {
                ac.onLoad(this);
                ac.components.forEach(comp => {
                    comp.onLoad(ac)
                });
            });

            this.actorSystem.registerAll();
            this.pUserControllerMap.forEach((con, id_user) => {
                con.process(this.actorSystem.objMap.get(con.id_pawn) as APawn);
            });

            this.bindLocController();
        } else {

            //服务器生成关卡数据
            this.initPlayerControllers();
            this.initPlayerActors()
            // this.initOtherActors();
        }
    }

    public updateWorld(dt) {
        if (!this.isClient) {
            // this.checkCollections();
        }
    }


    public initPlayerControllers() {
        let users = this.users
        users.forEach(user => {
            let userName = user.id_user;
            let con = this.spawn(APlayerShipController);
            user.id_controller = con.id;
            con.id_user = userName;

            this.pUserControllerMap.set(user.id_user, con);
            this.pControllerUserMap.set(con.id, user);
        });
        console.log("初始化玩家控制器，玩家数量：", users.length);
    }

    protected initPlayerActors() {
        let i = 0;
        this.pUserControllerMap.forEach((con, id_user) => {
            let ac = this.spawn(AShip);
            // 输入

            con.id_pawn = ac.id;
            con.process(ac);

            //输出
            let spriteComp = ac.spawnComponent(USpriteComponent);
            spriteComp.setTexture("ship/character");

            let textComp = ac.spawnComponent(UTextComponent);
            textComp.setText(id_user+"");
            textComp.setPosition(uu.v2(0,64));

            //更新
            ac.spawnComponent(UCharacterMovement);
            ac.spawnComponent(USphereComponent);

            //战斗属性
            let battle = ac.spawnComponent(UPlayerBattleComponent);
            let teamId = i;
            battle.setTeamId(teamId + "");
            let shield = ac.spawnComponent(UShipShield);
            let weapon2 = ac.spawnComponent(UShipWeaponProject);
            weapon2.setItemPosition(0, 1);
            ac.addItem(weapon2);


            //设置位置
            ac.setPosition(uu.v2(i * 200, 0));

            i++;
        });
        console.log("初始化玩家Actor");
    }

    /**
     * 正常开始||重新连接
     * 加载好服务器传回的关卡数据之后，用这个绑定当前控制器
     */
    public bindLocController() {
        let userMng = this.gameInstance.network.userManager as ClientUserManager;
        let con = this.pUserControllerMap.get(userMng.id_loc);
        this.playerController = con;
        this.player = con.pawn;
        let cameraComp = this.player.spawnComponent(UCameraComponent);
        cameraComp.zoomRatio = 0.2;
        console.log("本地AC", con.id_user);
    }


    protected initOtherActors() {
        let count = 1;

        for (let i = 0; i < count; i++) {
            let ac2 = this.spawn(AShip);

            // let aiController = this.spawn(AAIShipController);
            // aiController.process(ac2);


            let spriteComp = ac2.spawnComponent(USpriteComponent);;
            spriteComp.setTexture("ship/character");

            // let shield = ac2.spawnComponent(UShipShield);
            // let movement = ac2.spawnComponent(UCharacterMovement);
            let collision = ac2.spawnComponent(USphereComponent);

            let battle = ac2.spawnComponent(UBattleComponent);
            let teamId = i;
            battle.setTeamId(teamId + "");


            // let weapon = ac2.spawnComponent(UShipWeaponLaser);
            // weapon.setItemPosition(0, 0);
            // ac2.addItem(weapon);
            // weapon.startFire();

            let weapon2 = ac2.spawnComponent(UShipWeaponProject);
            weapon2.setItemPosition(0, 1);
            ac2.addItem(weapon2);
            weapon2.startFire();

            let winSize = this.gameInstance.getWorldView().winSize;
            ac2.setPosition(uu.v2(winSize.x * (Math.random() - 0.5) * 2, winSize.y * (Math.random() - 0.5) * 2));
        }
        // console.log(UBattleComponent.Teams);
    }




    //执行碰撞检测
    //TODO 这部分代码还可以优化，用掩码去判断是否需要碰撞，以及检测
    checkCollections() {
        this.collisionSystem.test((a: UCollisionComponent, b: UCollisionComponent) => {

            let actor1 = a.owner;
            let actor2 = b.owner;

            if (actor1 instanceof APawn && actor2 instanceof APawn) {
                // this.onPawnCollected(actor1, actor2);
            }
            else if (actor1 instanceof ABulletProject && actor2 instanceof ABulletProject) {
                this.onBulletCollected(actor1, actor2);
            }
            else if (actor1 instanceof APawn && actor2 instanceof ABulletProject) {
                this.onBulletCollectedPawn(actor2, actor1);
            }
            else if (actor1 instanceof ABulletProject && actor2 instanceof APawn) {
                this.onBulletCollectedPawn(actor1, actor2);
            }
        })
    }

    onPawnCollected(actor1: APawn, actor2: APawn) {
        let dir = actor1.getPosition().sub(actor2.getPosition()).normalize();
        actor1.getMovement().velocity = dir.mul(100);
        actor2.getMovement().velocity = dir.mul(-100);
    }

    onBulletCollected(actor1: ABulletProject, actor2: ABulletProject) {
        if (actor1 == actor2) { return; }

        let ship1 = actor1.getOwner();
        let ship2 = actor2.getOwner();
        if (ship1 == ship2) { return; }

        if (ship1 instanceof AShip && ship2 instanceof AShip) {
            let battle1 = ship1.getBattleComp();
            let battle2 = ship2.getBattleComp();
            if (battle1.getTreamId() == battle2.getTreamId()) {
                return;
            }

            // //爆炸动画
            let pos = actor1.getPosition().add(actor2.getPosition()).mul(0.5)

            this.spawnExplode(pos);

            actor2.destory();
            actor1.destory();
        }
    }

    //球打到敌人
    onBulletCollectedPawn(actor1: ABulletProject, actor2: APawn) {
        if (actor1.getOwner() != actor2) {
            // let dir = actor1.movementComponent.velocity.normalize();
            // actor2.getMovement().velocity = dir.mul(1000);


            // let comp = actor2.spawnComponent(UExplodeComponent);
            // comp.offset = actor1.getPosition().clone();



            this.spawnExplode(actor1.getPosition());

            if (actor2 instanceof AShip) {
                let shield = actor2.getShield();
                if (shield) {
                    shield.onHit();
                }
            }

            actor1.destory();
        }
    }

    spawnExplode(pos: UVec2) {
        //爆炸动画
        let ac = this.spawn(AExplodeActor);
        ac.deadTime = 1;
        // ac.spawnComponent(UExplodeComponent);


        let spriteAniComp = ac.spawnComponent(USpriteAnimationComponent);
        if (spriteAniComp) {
            spriteAniComp.setAnimation(USpriteAnimationComponent.Ani_Explostion);
            spriteAniComp.setScale(uu.v2(2, 2));
            // spriteAniComp.setFPS(16);
            spriteAniComp.play(true);
        }

        ac.setPosition(pos.clone());
    }
}