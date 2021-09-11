import { NetCmd } from "../../Share/NetCmd";
import { xclass } from "../../../ReflectSystem/XBase";
import Manager from "../Manager";
import NetworkSystem from "../NetworkSystem";
import Room from "../Room";



/**
 * 游戏状态
 */
export enum GameStatus {
    PREPLAY,
    STARTPLAY,
    PLAYING,
    ENDPlay,
}

/**
 * 游戏基类
 */
@xclass(Game)
export default class Game extends Manager {

    public gameStatus: GameStatus = GameStatus.PREPLAY;

    public room: Room = null;

    //0.注册回调
    init(ns: NetworkSystem) {
        super.init(ns);

    }


    //准备阶段
    prePlay() {

    }
    onPrePlay() {

    }

    //开始游戏
    startPlay() {

    }
    onoStart() {

    }

    //游戏运行时
    playing() {

    }

    //游戏结束时
    endPlay() {

    }
    onEndPlay() {

    }

    /************************************************
     * 游戏场景同步
     ************************************************/
    public sendBuffer: string[] = [];
    public receiveBuffer: string[] = [];
    public receiveBufferTemp: string[] = [];//防止在处理数据时，接收新数据
    public receiveFlag: boolean = false;

    /************************************************
     * 发送
     ************************************************/
    // //  先添加到容器，调用SendAll发送
    // //  例子：一帧里面，把消息添加到队列
    // public send(obj: Object | Array<Object>) {
    //     //TODO 处理成二进制

    //     //处理成JSON
    //     let str = JSON.stringify(obj);
    //     console.log("Client", str);
    //     //TODO 加上meta
    //     this.sendBuffer.push(str);
    // }

    // public sendAll() {
    //     this.sendBuffer.forEach(str => {
    //         this.ws.send(str);
    //     });
    //     this.sendBuffer = [];
    // }
    /************************************************
     * 接收
     ************************************************/
    // private onReceiveData(e) {
    //     if (this.receiveFlag) {
    //         //如果正在处理数据，则添加到临时容器
    //         this.receiveBufferTemp.push(obj);
    //     } else {
    //         this.receiveBuffer.push(obj);
    //     }
    // }
}