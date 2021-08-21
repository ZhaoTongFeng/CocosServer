
import UObject from "../Object";
import UActorSystem from "./ActorSystem/ActorSystem";
import { UAudioSystem } from "./AudioSystem/AudioSystem";

import { UInput } from "./InputSystem/Input";
import { LevelSystem } from "./LevelSystem/LevelSystem";
import UNetworkSystem from "./NetworkSystem/Client/ClientNetworkSystem";
import { xclass } from "./ReflectSystem/XBase";
import UGraphic from "./UGraphic";
import UWorldView from "./UWorldView";
import UWorld from "./World";

/**
 * 游戏实例 管理整个游戏生命周期
 * Client And Server 客户端和服务端都需要启动这个类
 * 生命周期：对于客户端来说，是整个APP生命周期，对于服务端来说，可以是一个游戏房间对应一个GameInstance
 */
@xclass(UGameInstance)
export default class UGameInstance extends UObject {

    /** 共享系统 */
    //本地输入系统
    public input: UInput = new UInput();

    //音频系统
    public audio: UAudioSystem = null;

    //关卡系统
    public levelSystem: LevelSystem = null;

    /** 游戏同步系统 */

    /** 网络数据系统 */
    public network: UNetworkSystem = null;


    /**
     * 服务端客户端标识
     * 在编写游戏逻辑时，可以选择将逻辑放到客户端或者服务端
     */
    private _isClient: boolean = false;
    getIsClient() { return this._isClient; }
    setIsClient(val: boolean) { this._isClient = val; }




    private sendBuffer: object[] = [];
    private receiveBuffer: object[] = [];
    private receiveBufferTemp: object[] = [];//防止在处理数据时，接收新数据
    private receiveFlag: boolean = false;

    //每一帧调用这个去发送，但不是立即发送，这结束之后才会被全部发送
    public sendGameData(obj: Object | Array<Object>) {
        this.sendBuffer.push(obj);
    }

    //只负责接受数据，至于数据怎么处理，由关卡里面去实现
    public receiveGameData(obj) {
        if (this.receiveFlag) {
            //如果正在处理数据，则添加到临时容器
            this.receiveBufferTemp.push(obj);
        } else {
            this.receiveBuffer.push(obj);
        }
    }

    //全部发送，并清空
    private sendAllGameData() {
        if (this.sendBuffer.length != 0) {
            this.network.sendAllGameInput(this.sendBuffer);
            this.sendBuffer = [];
        }
    }

    //处理所有网络输入
    private startProcessSyncData() {
        this.receiveFlag = true;
        //上一帧的多个数据包
        this.receiveBuffer.forEach(buffer => {
            this.world.inputSystem.processNetInput(buffer as object[]);
        });
    }

    //结束处理网络输入
    //清空已处理数据 并交换未处理数据，等待下一帧处理
    private endProcessSyncData() {
        this.receiveBuffer = [];
        this.receiveBuffer.concat(this.receiveBufferTemp);
        this.receiveBufferTemp = [];
        this.receiveFlag = false;
    }

    private processSyncData() {
        this.startProcessSyncData();
        this.endProcessSyncData();
    }




    //当前游戏世界指针
    private view: UWorldView = null;
    private world: UWorld = null;
    getWorld() { return this.world; }
    getWorldView() { return this.view; }

    //全局共享的时间步长
    public deltaTime: number = 0;

    //从游戏实例启动 到现在的时间 
    public passTime: number = 0;


    fps: number = 60;
    frameTime: number = 0;
    frameTimer: number = 0;

    /** 关卡管理 */
    //打开一个关卡
    public openWorld(world: UWorld, data: any = null, view) {
        this.frameTime = 1 / this.fps;

        this.view = view;
        if (this.world != null) {
            console.warn("WARN: currentWorld not null,");
            this.closeWorld();
        }
        this.canEveryTick = true
        this.passTime = 0;
        this.world = world;
        this.world.gameInstance = this;
        this.world.init(data);

    }




    //当前关卡 网络处理+逻辑处理+本地输入循环
    public update(dt: number) {
        this.deltaTime = dt;
        this.passTime += dt;
        //TODO 锁定逻辑针，不受到操作卡住逻辑。
        this.frameTimer += dt;
        if (this.frameTimer > this.frameTime) {
            this.frameTimer = 0;

            if (this.world != null) {

                //1.处理网络输入
                this.processSyncData();

                //2.用输入或状态更新世界，并且将本机的操作添加到发送队列
                this.world.update(dt);

                //清除当前本地输入
                this.input.Clear();

                //3.发送当前帧输入
                this.sendAllGameData();
            }
            this.passTime=0;
        }

    }

    //TODO 切换关卡
    public switchWorld(oldWorldData) {

    }

    //关闭关卡
    public closeWorld() {
        this.world.destory();
        this.canEveryTick = false;
    }

    //调试关卡
    public drawDebug(graphic: UGraphic) {
        this.world.debugSystem.debugAll(graphic);
    }
}
