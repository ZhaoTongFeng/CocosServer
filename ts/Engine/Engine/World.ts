
import AActor from "../Actor/Actor";
import AGameModeBase from "../Actor/Info/GameModeBase";
import APawn from "../Actor/Pawn/Pawn";
import UComponent from "../Component/Component";
import UObject from "../Object";
import UActorSystem from "./ActorSystem/ActorSystem";
import UCollisionSystem from "./CollisionSystem/CollisionSystem";
import { UDebugSystem } from "./DebugSystem/DebugSystem";
import { GameState, UpdateState } from "./Enums";
import UGameInstance from "./GameInstance";
import { UInputSystem } from "./InputSystem/InputSystem";
import { xclass } from "./ReflectSystem/XBase";
import UGraphic from "./UGraphic";
import { UColor } from "./UMath";

/**
 * 一个关卡 逻辑关卡
 * 生命周期：从创建关卡到结束
 */
@xclass(UWorld)
export default class UWorld extends UObject {
    /** 关卡状态 */
    isDebug: boolean = false;
    isUpdating: boolean = false;
    gameState: GameState = GameState.Paused;

    actors: AActor[] = [];
    actors_kill: AActor[] = [];
    actors_peending: AActor[] = [];

    actorPool: Map<string, AActor[]> = new Map();
    componentPoos: Map<string, UComponent[]> = new Map();
    maxActorCount: number = 0;

    /** 系统 */
    collisionSystem: UCollisionSystem = null;

    //controller在这里注册，收到网络请求时统一进行处理
    inputSystem: UInputSystem = null;

    debugSystem: UDebugSystem = null;

    //对象管理
    actorSystem: UActorSystem = null;

    /** 指针 */
    gameInstance: UGameInstance = null;
    gameMode: AGameModeBase = null;
    player: APawn = null;

    usePool: boolean = false;
    // 被创建时 初始化关卡
    public init(data: any = null) {
        super.init(data);

        this.collisionSystem = new UCollisionSystem();
        this.collisionSystem.init(this);

        this.inputSystem = new UInputSystem();
        this.inputSystem.init(this);

        this.debugSystem = new UDebugSystem();
        this.debugSystem.init(this);

        this.actorSystem = new UActorSystem();
        this.actorSystem.init(this);

        this.gameState = GameState.Playing
    }

    //释放关卡
    public destory() {
        this.actors = [];
        this.actors_kill = [];
        this.actors_peending = [];

        this.isUpdating = false;
        this.gameState = GameState.Paused;
    }

    //更新逻辑主循环
    //帧循环，被Instance初始化之后，会被放到CC的Update下面
    public update(dt) {
        if (this.gameState == GameState.Playing) {
            //本地输入
            this.actors.forEach(ac => {
                ac.processInput(this.gameInstance.input);
            });

            //TODO 如果是单机模式则直接在这里消耗指令

            //更新
            this.isUpdating = true;
            this.actors.forEach(actor => {
                if (actor.canEveryTick) {
                    actor.update(dt)
                }
            });
            this.isUpdating = false;

            this.updateWorld(dt);

            //添加这一帧添加的AC
            for (let i = 0; i < this.actors_peending.length; i++) {
                this.actors_peending[i].onInit();
                this.actors.push(this.actors_peending[i]);
            }
            this.actors_peending = [];



            //删除这一帧删除的AC
            for (let i = this.actors.length - 1; i >= 0; i--) {
                if (this.actors[i].state == UpdateState.Dead) {
                    this.actors[i].onDestory();


                    //添加到对象池
                    this.actors[i].unUse();
                    if (this.actors[i] != null) {
                        let clsName = this.actors[i].constructor.name;
                        let arr = this.actorPool.get(clsName);
                        arr.push(this.actors[i]);
                    }

                    this.actors.splice(i, 1);
                }
            }
        }
    }

    //Override Actor 更新完成之后操作，比如碰撞检测
    public updateWorld(dt) { }


    //在程序中生成Actor，所有actor的创建，必须通过这个注册
    spawn<A extends AActor>(c: new () => A): A {
        let actor = null;

        if (this.usePool) {
            let clsName = c.name;
            if (this.actorPool.has(clsName) == false) {
                this.actorPool.set(clsName, []);
            }
            let arr = this.actorPool.get(clsName);
            if (arr.length == 0) {
                actor = new c();
            } else {
                actor = arr.pop();
                actor = actor as A;
                actor.reUse();
            }
        }


        if (actor == null) {
            actor = new c();
        }
        actor.init(this);
        return actor;
    }

    spawnComponent<A extends UComponent>(actor: AActor, c: new () => A): A {
        let comp = null;
        if(this.usePool){
            let clsName = c.name;
            if (this.componentPoos.has(clsName) == false) {
                this.componentPoos.set(clsName, []);
            }
            let arr = this.componentPoos.get(clsName);
            if (arr.length == 0) {
                // console.log("New Component", clsName);
                comp = new c();
            } else {
                comp = arr.pop();
                comp = comp as A;
                comp.reUse();
    
            }
        }

        if (comp == null) {
            comp = new c();
        }
        comp.init(actor);
        return comp;
    }

    /**增删Actor */
    public addActor(actor: AActor) {
        if (this.isUpdating) {
            this.actors_peending.push(actor);
        } else {
            actor.onInit();
            this.actors.push(actor);
        }
        if (this.actors.length > this.maxActorCount) {
            this.maxActorCount = this.actors.length;
            // console.log("最大Actor数量", this.maxActorCount);
        }
        // console.log("add actor num:",this.actors.length);
    }

    public removeActor(actor: AActor) {
        let index = this.actors.indexOf(actor);
        if (index > -1) {
            this.actors.splice(index, 1);
        }
        index = this.actors_peending.indexOf(actor);
        if (index > -1) {
            this.actors_peending.splice(index, 1);
        }
        console.log("after remove actor num:", this.actors.length);
    }
}
