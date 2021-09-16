import AActor from "../Actor/Actor";
import APlayerController from "../Actor/Controller/PlayerController";
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

import User from "./NetworkSystem/Share/User";
import { xclass, xproperty } from "./ReflectSystem/XBase";

/**
 * 一个关卡 逻辑关卡
 * 生命周期：从创建关卡到结束
 */
@xclass(UWorld)
export default class UWorld extends UObject {

    /** 接口 */
    /**
     * 1.根据玩家数量生成Controller
     * Room传入users
     * 生成控制器，并建立用户和控制器的双向绑定
     */
    public initPlayerControllers() { }

    /**
     * 2.为每一个PlayerController生成一个Actor
     */
    protected initPlayerActors() { }

    /**
     * 生成除了玩家以外的actor
     */
    protected initOtherActors() { }


    /**
     * 更新完成之后操作，比如碰撞检测
     * @param dt 
     */
    protected updateWorld(dt) { }

    /** 数据统计 */
    maxActorCount: number = 0;
    
    /** 标志位 */
    isDebug: boolean = false;
    isUpdating: boolean = false;
    usePool: boolean = false;
    gameState: GameState = GameState.Paused;
    isClient: boolean = false;

    /** 主要数据 */
    @xproperty(Array)
    actors: AActor[] = [];

    //这个世界的自增ID
    private _generateID: number = 0;
    public GenerateNewId(): string {
        let id = this._generateID;
        this._generateID++;
        return id + "";
    }
    getCurrentGenID() {
        return this._generateID;
    }
    setCurrentGenID(id: number) {
        this._generateID = id;
    }

    private _users: User[] = [];
    public get users(): User[] {
        return this.gameInstance.room.getAllUsers();
    }
    public set users(value: User[]) {
        this._users = value;
    }

    /** 缓存 */
    actors_kill: AActor[] = [];
    actors_peending: AActor[] = [];

    actorPool: Map<string, AActor[]> = new Map();
    compPool: Map<string, UComponent[]> = new Map();

    /**
     * user到controller的映射
     * 用户输入，流入成controller输入，controller输入流入World
     */
    @xproperty(Map)
    pUserControllerMap: Map<string, APlayerController> = new Map();

    /**
     * controller到user的映射
     * 结算时，controller数据带上user.id_user，发送给所有用户
     */
    @xproperty(Map)
    pControllerUserMap: Map<string, User> = new Map();

    /** 指针 */
    collisionSystem: UCollisionSystem = null;
    inputSystem: UInputSystem = null;
    debugSystem: UDebugSystem = null;
    actorSystem: UActorSystem = null;

    gameInstance: UGameInstance = null;
    gameMode: AGameModeBase = null;
    player: APawn = null;
    playerController: APlayerController = null;

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


        this.isClient = this.gameInstance.getIsClient();

        //注册自己
        this.id = this.GenerateNewId();
        this.actorSystem.registerObj(this);
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
                    this.destoryActor(this.actors[i]);
                    this.actors.splice(i, 1);
                }
            }


        }
    }

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

    destoryActor(actor: AActor) {
        actor.onDestory();
        //添加到对象池
        if (this.usePool) {
            actor.unUse();
            if (actor != null) {
                let clsName = actor.constructor.name;
                let arr = this.actorPool.get(clsName);
                arr.push(actor);
            }
        }
        this.actorSystem.unRegisterObj(actor);
    }

    spawnComponent<A extends UComponent>(actor: AActor, c: new () => A): A {
        let comp = null;
        if (this.usePool) {
            let clsName = c.name;
            if (this.compPool.has(clsName) == false) {
                this.compPool.set(clsName, []);
            }
            let arr = this.compPool.get(clsName);
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

    /**
     * 增加Actor
     * 需要考虑在更新过程中添加的情况，而删除Actor，不需要考虑，因为全部都是这一帧结束后删除
     * @param actor 
     */
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
}
