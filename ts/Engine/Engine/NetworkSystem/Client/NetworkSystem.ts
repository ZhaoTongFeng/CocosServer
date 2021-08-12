import UObject from "../../../Object";
import { xclass } from "../../ReflectSystem/XBase";
import { NetCmd } from "../Share/NetCmd";
import RoomManager from "./RoomManager";
import UserManager from "./UserManager";

export enum ConnectionStatus {
    NO,
    CONNECTING,
    CONNECTED,
    RECONNECT,
}
/**
 * 网络管理器
 * 客户端只有一个，服务端也只有一个
 * 
 */
@xclass(UNetworkSystem)
export default class UNetworkSystem extends UObject {

    //TODO 为了测试方便直接在这儿发消
    //发送这一frame全部数据
    sendAllGameInput(obj) {
        if (this.userManager.isLogin) {
            this.roomManager.syncGame(obj);
        }

    }

    //网络连接状态
    public conState: ConnectionStatus = ConnectionStatus.NO;

    public delay: number = 0;
    // private url = "wss://www.llag.net/game/id=123";
    private url = "ws://localhost:52312";
    private ws: WebSocket = null;
    public events: Map<number, [Function, Object]> = new Map();

    /************************************************
     * 访问Manager数据
     ************************************************/
    public getUserById(id: string) {
        return this.userManager.getUserById(id);
    }
    public getRoomById(id: string) {
        return this.roomManager.getRoomById(id);
    }
    public getLocId() {
        return this.userManager.locUser.id_user;
    }
    public isThisUser(id_user) {
        return this.userManager.locUser.id_user == id_user
    }

    /************************************************
     * 发送
     ************************************************/
    /** 普通请求指令 */
    //1.1.发送命令
    // 直接发送即可
    public sendCmd(cmd: number, obj: object) {
        obj["opt"] = cmd;
        let str = JSON.stringify(obj);
        this.ws.send(str);

        console.log("Client", obj);
    }

    /************************************************
     * 接收
     ************************************************/

    private onReceiveData(e) {

        let str = e.data;
        let obj = JSON.parse(str);
        let opt = Number(obj["opt"]);
        console.log("Server:" + str);
        //发送回调
        let tuple = this.events.get(opt);
        if (tuple) {
            let func: Function = tuple[0];
            let caller = tuple[1];
            func.call(caller, obj);
        }
    }

    /************************************************
     * 指令 和 系统 注册
     ************************************************/

    public register(cmd: number, callback: Function, caller: Object) { this.events.set(cmd, [callback, caller]); }
    public unRegister(cmd: number) { this.events.delete(cmd); }

    userManager: UserManager = null;
    roomManager: RoomManager = null;
    //初始化网络相关系统
    public init() {
        this.userManager = new UserManager();
        this.userManager.init(this);
        this.roomManager = new RoomManager();
        this.roomManager.init(this);


        this.register(NetCmd.HEART, this.onHeart, this);
        this.connect();
    }

    /************************************************
     * 生命周期
     * 处理基本事务，断线重连，心跳包，网络信息维护
     ************************************************/

    //连接
    private connect(data: any = null) {
        console.log("正在连接", this.url)
        this.conState = ConnectionStatus.CONNECTING;

        this.ws = new WebSocket(this.url);
        this.ws.onopen = (e) => {
            this.onConnected(e);
        };
        this.ws.onmessage = (e) => {
            this.onReceiveData(e);
        }
        this.ws.onerror = (e) => {
            this.onError(e);
        }
        this.ws.onclose = (e) => {
            this.onClose(e);
        };
    }

    //连接成功，转发给UserManager
    private onConnected(e) {
        this.conState = ConnectionStatus.CONNECTED;
        console.log("UNetworkSystem Opened");
        this.userManager.onConnected();

        //开启心跳
        // this.startHeart();
        this.endReConnect();
    }

    private onError(e) {
        // console.log("Send Text fired an error");
        // this.conState = ConnectionStatus.RECONNECT;
    }

    private onClose(e) {
        console.log("WebSocket instance closed.");
        this.conState = ConnectionStatus.RECONNECT;
        //关闭心跳
        this.endHeart();
        this.startReConnect();
    }


    //重连
    public reConFlag: boolean = false;
    private reConDelay: number = 1000;
    private reConHandle: number = -1;
    private startReConnect() {
        if (!this.reConFlag) {
            this.reConFlag = true;
            this.reConHandle = setTimeout(() => {
                console.log("尝试重连");
                this.connect();
                this.reConFlag = false
            }, this.reConDelay);
        }
    }
    private endReConnect() {
        if (this.reConFlag) {
            console.log("重连成功")
            this.reConFlag = false;
            clearInterval(this.reConHandle)
            console.log("重新登录");
            this.userManager.login();
        }
    }

    //心跳包
    private heartFlag: boolean = false;
    private heartHandle: number = -1;
    private heartDelay: number = 5000;
    private sendTime: number = 0;

    private startHeart() {
        if (!this.heartFlag) {
            this.heartFlag = true;
            this.heartHandle = setInterval(() => {
                this.sendHeart();
            }, this.heartDelay);
        }

    }
    private endHeart() {
        if (this.heartFlag) {
            this.heartFlag = false;
            clearTimeout(this.heartHandle);
        }
    }
    public getCurrentTime() {
        return new Date().getTime();
    }
    private sendHeart() {
        this.sendTime = this.getCurrentTime();
        this.sendCmd(NetCmd.HEART, {});
    }
    private onHeart() {
        //TODO 计算延迟
        let curTime = this.getCurrentTime();

        this.delay = curTime - this.sendTime;
        console.log("延迟", this.delay)
    }



}
