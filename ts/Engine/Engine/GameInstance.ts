
import AActor from "../Actor/Actor";
import UObject from "../Object";
import { UAudioSystem } from "./AudioSystem/AudioSystem";
import { GameState } from "./Enums";

import { UInputSystem } from "./InputSystem/InputSystem";
import { LevelSystem } from "./LevelSystem/LevelSystem";
import ServerUser from "./NetworkSystem/Server/ServerUser";
import { NetCmd } from "./NetworkSystem/Share/NetCmd";
import NetworkSystem from "./NetworkSystem/Share/NetworkSystem";
import Room from "./NetworkSystem/Share/Room";
import { xclass } from "./ReflectSystem/XBase";
import { XTestMain } from "./ReflectSystem/XTestMain";
import UGraphic from "./UGraphic";
import { UMath } from "./UMath";
import UWorldView from "./UWorldView";
import UWorld from "./World";

//GameInstance层级数据封包
export type InsGameData = {
    id: string,//ID标识
    data: object//数据内容
}


/**
 * 游戏实例 管理整个游戏生命周期
 * Client And Server 客户端和服务端都需要启动这个类
 * 生命周期：对于客户端来说，是整个APP生命周期，对于服务端来说，可以是一个游戏房间对应一个GameInstance
 */
@xclass(UGameInstance)
export default class UGameInstance extends UObject {
    /**
     * 服务端客户端标识
     * 在编写游戏逻辑时，可以选择将逻辑放到客户端或者服务端
     */
    private _isClient: boolean = false;
    getIsClient() { return this._isClient; }
    setIsClient(val: boolean) { this._isClient = val; }
    room: Room = null;

    //客户端发送队列只有操作
    private sendBuffer: InsGameData[] = [];
    private receiveBuffer: InsGameData[] = [];

    //服务端发送数据 网格，Item是消息队列
    //一个格子宽度
    gridWidth = 750;
    //列
    gridCol = 10;
    halfGridCol = this.gridCol / 2;
    //行
    gridRow = 10;
    halfGridRow = this.gridRow / 2;


    private sendBuffer2: InsGameData[][][] = [];
    /** 关卡管理 */
    initSendBuffer() {
        let gridWidth = this.gridWidth
        let gridCol = this.gridCol;
        let gridRow = this.gridRow;
        this.sendBuffer2 = [];
        for (let i = 0; i < gridRow; i++) {
            this.sendBuffer2[i] = []
            for (let j = 0; j < gridCol; j++) {
                this.sendBuffer2[i][j] = [];
            }
        }
    }

    cleanSendBuffer() {
        let gridWidth = this.gridWidth
        let gridCol = this.gridCol;
        let gridRow = this.gridRow;

        for (let i = 0; i < gridRow; i++) {
            for (let j = 0; j < gridCol; j++) {
                this.sendBuffer2[i][j] = [];
            }
        }
    }

    //以actor为单位，将数据添加到网格
    public sendGameGridData(obj: object, target: UObject, actor: AActor) {
        try {
            let out = {
                id: target.id,
                data: obj
            }
            let gridx = actor.gridx;
            let gridy = actor.gridy;
            let grid = this.sendBuffer2[gridy][gridx];
            grid.push(out);
        } catch (error) {
            console.log(error);
        }

    }

    //根据每个玩家的位置，把9宫格的数据传出
    public sendAllGridGameData() {
        try {

            let map = this.world.pUserControllerMap;
            let users = this.world.users;
            let gridCol = this.gridCol;
            let gridRow = this.gridRow;
            users.forEach(user => {
                let con = map.get(user.id_user);
                let ac = con.pawn;
                let gridx = ac.gridx;
                let gridy = ac.gridy;

                let arr = [];
                for (let m = -1; m <= 1; m++) {
                    for (let n = -1; n <= 1; n++) {
                        let tx = gridx + n;
                        let ty = gridy + m;
                        if (tx >= 0 && tx < gridCol && ty >= 0 && ty < gridRow) {
                            let grid = this.sendBuffer2[ty][tx];
                            if (grid.length != 0) {
                                arr = arr.concat(grid);
                            }
                        }
                    }
                }

                if (arr.length != 0) {
                    let out = {
                        data: arr,
                        time: new Date().getTime()
                    };
                    (user as ServerUser).sendCmd(NetCmd.GAME_SEND_SERVER, out);
                }
            });
            this.cleanSendBuffer();
        } catch (error) {
            console.log(error);
        }

    }

    /** 发送方只管发 */
    //先将发送数据存到缓存
    public sendGameData(obj: object, target: UObject) {
        let out = {
            id: target.id,
            data: obj
        }
        this.sendBuffer.push(out);
    }

    //通过ROOM，全部发送，并清空
    private sendAllGameData() {
        if (this.sendBuffer.length != 0) {
            this.room.sendGameData(this.sendBuffer);
            this.sendBuffer = [];
        }
    }


    /** 接收方，根据是服务器还是客户端，分别进行处理，如果是服务端则收到的是输入，客户端收到的是输出 */
    oldTick = 0;
    curTick = 0;
    timeFrame = 0;

    //内插值计时器
    frameTimer = 0;
    frameRate = 0;

    //只负责接受数据，至于数据怎么处理，由关卡里面去实现
    public receiveGameData(obj, time) {

        this.receiveBuffer = obj;

        this.frameTimer = 0;
        //计算出两次数据包的时间步长
        this.curTick = time;
        if (this.curTick != 0 && this.oldTick != 0) {
            this.timeFrame = this.curTick - this.oldTick;
        }
        this.oldTick = this.curTick;

        //服务器立即处理请求更新状态，而不是等到更新时再处理
        if (!this._isClient) {
            this.processSyncData();
        }
    }


    //处理网络数据
    private processSyncData() {
        if (this.receiveBuffer.length != 0) {
            // console.log(this.receiveBuffer);
        }

        this.receiveBuffer.forEach(buffer => {
            //从哪儿来到哪儿去
            let id = buffer.id;
            let obj: UObject = this.world.actorSystem.objMap.get(id)
            if (obj) {
                obj.receiveData(buffer.data);

            }
        });
        this.receiveBuffer = [];
    }


    //当前关卡 网络处理+逻辑处理+本地输入循环
    private debugTimer = 0;
    private debugDelay = 5;
    public update(dt: number) {
        if (this.world == null) { return; }
        if (this.world.gameState != GameState.Playing) { return; }

        this.debugTimer += dt;
        if (this.debugTimer > this.debugDelay) {
            this.debugTimer = 0;
        }


        this.frameTimer += dt * 1000;
        this.frameRate = UMath.clamp01(this.frameTimer / this.timeFrame / 2);

        this.deltaTime = dt;
        this.passTime += dt;

        //1.处理输入
        if (this._isClient) {
            this.processSyncData();
        }

        //2.用输入或状态更新世界，并且将本机的操作添加到发送队列
        this.world.update(dt);

        //3.发送输出
        if (this._isClient) {
            this.sendAllGameData();
        } else {
            this.sendAllGridGameData();
        }


        this.passTime = 0;
    }



    /** 共享系统 */
    //本地输入系统
    public input: UInputSystem = new UInputSystem();

    //音频系统
    public audio: UAudioSystem = null;

    //关卡系统
    public levelSystem: LevelSystem = null;

    /** 游戏同步系统 */

    /** 网络数据系统 */
    public network: NetworkSystem = null;


    //当前游戏世界指针
    private view: UWorldView = null;
    private world: UWorld = null;
    getWorld(): UWorld { return this.world; }
    getWorldView(): UWorldView { return this.view; }
    setWorldView(view: UWorldView) {
        this.view = view;
    }

    //全局共享的时间步长
    public deltaTime: number = 0;

    //从游戏实例启动 到现在的时间 
    public passTime: number = 0;



    //打开一个关卡
    public openWorld(world: UWorld, data: any = null, view) {



        // XTestMain();
        // this.view = view;
        if (this.world != null) {
            console.warn("WARN: currentWorld not null,");
            this.closeWorld();
        }
        this.initSendBuffer();
        this.canEveryTick = true
        this.passTime = 0;
        this.world = world;
        this.world.gameInstance = this;
        this.world.init(data);
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
        if (this._isClient && this.world && this.world.debugSystem) {
            this.world.debugSystem.debugAll(graphic);
        }
    }
}
