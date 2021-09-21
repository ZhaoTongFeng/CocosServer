
import AActor from "../Actor/Actor";
import UObject from "../Object";
import { UAudioSystem } from "./AudioSystem/AudioSystem";
import { GameState } from "./Enums";
import { UInputSystem } from "./InputSystem/InputSystem";
import { LevelSystem } from "./LevelSystem/LevelSystem";
import ServerUser from "./NetworkSystem/Server/ServerUser";
import { NetCmd } from "./NetworkSystem/Share/NetCmd";
import NetworkSystem from "./NetworkSystem/Share/NetworkSystem";
import { ProtocolSystem } from "./NetworkSystem/Share/Protocol";
import Room from "./NetworkSystem/Share/Room";
import { xclass } from "./ReflectSystem/XBase";
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
 * 网络同步
 * 
 * 发送和接收接口统一
 * GameInstance同时会在客户端和服务器运行，两者调用的发送和接收方法不同，无论发送JSON还是Binary，都需要上层进行抽象。
 * 具体来说就是，ROOM定义发送和接收接口，然后在ClientRoom和ServerRoom不同的实现
 * 
 * 发送
 * 无论是客户端还是服务端，Component只管把数据添加到缓冲区，统一发送
 * TODO，如果数据过于庞大，可能需要拆分为几个部分进行 分批发送
 * 
 * 接收
 * 服务端立即处理客户端数据，对World进行修改
 * 客户端接收到服务端数据，首先需要进行缓存，因为服务器以低于客户端的帧率进行更新，客户端比服务端慢了很多帧，需要进行补帧
 * 
 * 统一接口设计
 * 1.UObject 中调用的发送数据方法，收集待发送数据
 * 2.发送缓冲区数据
 * 3.接收数据
 * 4.处理数据
 * 
 * 
 * 上面说的是，服务端和客户端跑一套代码，现在两端都能跑起来，但是，如何只在单机上跑起来（服务器或者客户端单独运行都叫单机运行）
 * 游戏主循环由三个部分组成
 *                                              单机      多人
 * 输入 键盘、触摸 更新输入标志位                  处理     客户端输入数据=》服务器，服务器处理
 * 更新 根据输入标志更新游戏逻辑，更新游戏状态      处理     服务端处理
 * 输出 根据游戏状态输出视频、音频 、网络数据       处理     游戏状态=》客户端 客户端处理
 * 
 * 其实很简单，首先我们定义一个是否为单机的标志位，定义处理数据的接口
 * 输入 客户端，如果是单机，那么我们直接调用接口处理数据，否则我们将数据发送出去，服务端接收到调用相同的接口进行处理
 * 更新 如果是单机，则直接进行更新，否则检查当前是否为服务器，在服务器上进行更新
 * 输出 
 *      1.客户端需要视频，服务端不需要视频，所以需要为输出定义接口，在客户端去实现接口，服务端不用实现。
 *      2.如果是单机，不需要产生网络数据输出（也不一定，服务器运行观战游戏，同步给客户端），
 *          否则需要将输出数据（客户端是输入操作，服务端发送的是世界状态）全部发送
 *          待发送的数据是在输入或更新阶段产生的，所以在添加发送数据时，也要检测，是否为单机状态
 */


export enum SyncMode {
    ONLINE,
    OFFLINE
}
/**
 * 游戏实例 管理整个游戏生命周期
 * Client And Server 客户端和服务端都需要启动这个类
 * 生命周期：对于客户端来说，是整个APP生命周期，对于服务端来说，可以是一个游戏房间对应一个GameInstance
 */
@xclass(UGameInstance)
export default class UGameInstance extends UObject {

    //是否为单机模式
    private _bStandAlone: boolean = false;
    public get bStandAlone(): boolean { return this._bStandAlone; }
    public set bStandAlone(value: boolean) { this._bStandAlone = value; }

    /**
     * 服务端客户端标识
     * 在编写游戏逻辑时，可以选择将逻辑放到客户端或者服务端
    */
    private _isClient: boolean = false;
    getIsClient() { return this._isClient; }
    setIsClient(val: boolean) { this._isClient = val; }

    //游戏房间
    room: Room = null;


    //客户端发送队列只有操作
    protocolSystem: ProtocolSystem = null;
    receiveProtocolSystem: ProtocolSystem = null;

    private sendBuffer: InsGameData[] = [];
    private receiveBuffer: InsGameData[] = [];




    //服务器分区发送数据
    //服务端发送数据 网格，Item是消息队列
    gridWidth = 750;
    gridCol = 10;
    halfGridCol = this.gridCol / 2;
    gridRow = 10;
    halfGridRow = this.gridRow / 2;

    //网格分区数据
    private sendBuffer2: InsGameData[][][] = [];
    private initSendBuffer() {
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
    private cleanSendBuffer() {
        let gridWidth = this.gridWidth
        let gridCol = this.gridCol;
        let gridRow = this.gridRow;

        for (let i = 0; i < gridRow; i++) {
            for (let j = 0; j < gridCol; j++) {
                this.sendBuffer2[i][j] = [];
            }
        }
    }









    /**
     * 客户端内插值优化
     * 废弃，每一个具有Position的显示组件，都必须在组件进行差值，否则会因为rate的刷新而抖动
     */
    oldTick = 0;
    curTick = 0;
    timeFrame = 0;
    frameTimer = 0;
    frameRate = 0;

    //内插值 计算出两次数据包的时间步长
    private computeFrameRate(time) {
        this.frameTimer = 0;
        this.curTick = time;
        if (this.curTick != 0 && this.oldTick != 0) {
            this.timeFrame = this.curTick - this.oldTick;
        }
        this.oldTick = this.curTick;
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

    //分区发送数据 根据每个玩家的位置，把9宫格的数据传出
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

    //接收JSON数据 只负责接受数据，至于数据怎么处理，由关卡里面去实现
    public receiveGameData(obj, time) {
        this.receiveBuffer = obj;
        if (!this._isClient) {
            //服务器立即处理请求更新状态，而不是等到更新时再处理
            this.processSyncData();
        } else {
            //客户端处理时间戳
            this.computeFrameRate(time);
        }
    }
    //处理JSON数据
    private processSyncData() {
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

    //发送二进制数据
    public sendBinaryGameData() {
        if (this.protocolSystem.hasData()) {
            this.protocolSystem.opt = NetCmd.GAME_SEND_BINARY;
            this.room.sendBinaryGameData(this.protocolSystem.getAll());
            this.protocolSystem.clear();
        }
    }


    //接收二进制数据
    public receiveBinaryGameData(data) {
        this.receiveProtocolSystem.bSetResponse = true;
        this.receiveProtocolSystem.binBufferView = data;
        if (!this._isClient) {
            this.receiveProtocolSystem.responseBufferView();
        } else {
            let time = data[2];
            this.computeFrameRate(time);
        }
    }

    //处理二进制数据
    public processSyncDataBinary() {
        this.receiveProtocolSystem.responseBufferView();
    }




    /**
     * 游戏主循环
     * 处理输入 本地|网络处理
     * 更新世界
     * 处理输出
     */
    public deltaTime: number = 0;//全局共享的时间步长
    public passTime: number = 0;//从游戏实例启动 到现在的时间
    private debugTimer = 0;
    private debugDelay = 5;
    public update(dt: number) {
        if (this.world == null) { return; }
        if (this.world.gameState != GameState.Playing) { return; }

        this.debugTimer += dt;
        if (this.debugTimer > this.debugDelay) {
            this.debugTimer = 0;
        }
        this.deltaTime = dt;
        this.passTime += dt;

        //1.处理输入
        if (this._isClient) {

            this.processSyncData();
            this.processSyncDataBinary();

            this.frameTimer += dt * 1000;
            this.frameRate = UMath.clamp01(this.frameTimer / this.timeFrame / 2);
        }

        this.protocolSystem.clear();
        //2.用输入或状态更新世界，并且将本机的操作添加到发送队列
        this.world.update(dt);


        //3.发送输出，单机模式暂时，不发送任何数据
        if (!this.bStandAlone) {
            if (this._isClient) {
                this.sendAllGameData();
            } else {
                this.sendAllGridGameData();
            }
            this.sendBinaryGameData();
        }
    }




    /**
     * 客户端服务端共享系统
     */

    //本地输入系统
    public input: UInputSystem = new UInputSystem();

    //音频系统
    public audioSystem: UAudioSystem = null;

    //关卡系统
    public levelSystem: LevelSystem = null;

    /** 游戏同步系统 */
    public network: NetworkSystem = null;


    /**
     * 关卡
     */



    //World和WorldView适配器
    private view: UWorldView = null;
    private world: UWorld = null;
    getWorld(): UWorld { return this.world; }
    getWorldView(): UWorldView { return this.view; }
    setWorldView(view: UWorldView) { this.view = view; }

    //打开一个关卡
    public openWorld(world: UWorld, data: any = null, view) {
        if (this.world != null) {
            console.warn("WARN: currentWorld not null,");
            this.closeWorld();
        }
        this.initSendBuffer();
        this.protocolSystem = new ProtocolSystem(this);
        this.receiveProtocolSystem = new ProtocolSystem(this);
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
