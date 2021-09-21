import { xclass } from "../../ReflectSystem/XBase";
import { NetCmd } from "../Share/NetCmd";
import NetworkSystem from "../Share/NetworkSystem";
import { ProtocolSystem } from "../Share/Protocol";
import RoomManager from "../Share/RoomManager";
import ClientRoomManager from "./ClientRoomManager";
import ClientUserManager from "./ClientUserManager";

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
@xclass(ClientNetworkSystem)
export default class ClientNetworkSystem extends NetworkSystem {
    // protected url = "wss://www.llag.net/game/id=123";
    protected url = "ws://localhost:52312";
    static Ins: ClientNetworkSystem = null

    //TODO 为了测试方便直接在这儿发，实际上还是房间内进行发送，服务器和客户端保持一致
    //发送这一frame全部数据
    sendAllGameInput(obj) {
        let userMng = this.userManager as ClientUserManager;
        if (userMng.isLogin) {
            let roomMng = this.roomManager as ClientRoomManager;
            roomMng.syncGame(obj);
        }

    }

    //网络连接状态
    public conState: ConnectionStatus = ConnectionStatus.NO;

    public delay: number = 0;


    protected ws: WebSocket = null;



    /************************************************
     * 访问Manager数据
     ************************************************/

    public getLocId() {
        let userMng = this.userManager as ClientUserManager;
        return userMng.id_loc;
    }
    public isThisUser(id_user) {
        let userMng = this.userManager as ClientUserManager;
        return userMng.id_loc == id_user
    }

    /************************************************
     * 发送
     ************************************************/
    public sendCmd(cmd: number, obj: object = {}) {
        obj["opt"] = cmd;
        let str = JSON.stringify(obj);
        this.ws.send(str);
        if (cmd != NetCmd.HEART) {
            // console.log("Client", obj);
        }
    }

    public sendBinary(binBuffer) {
        this.ws.send(binBuffer);
    }
    /************************************************
     * 接收
     ************************************************/
    protected onReceive(str) {
        let obj = JSON.parse(str);
        this.processReceive(Number(obj["opt"]), obj);
    }
    protected onReceiveBinary(bin) {
        let view = new Uint32Array(bin);
        this.processReceive(view[0], view);
    }
    protected processReceive(opt, data) {
        //发送回调
        //稳定回调，百分之百对应接口
        let tuple = this.events.get(opt);
        if (tuple) {
            let func: Function = tuple[0];
            let caller = tuple[1];
            func.call(caller, data);
        }
        //外部回调，外面用on注册
        this.emit(opt + "", data);
    }
    /************************************************
     * 指令 和 系统 注册
     ************************************************/
    //初始化网络相关系统
    public init() {
        super.init();
        this.userManager = new ClientUserManager();
        this.userManager.init(this);
        this.roomManager = new ClientRoomManager();
        this.roomManager.init(this);
        this.register(NetCmd.HEART, this.onHeart, this);

    }

    /************************************************
     * 生命周期
     * 处理基本事务，断线重连，心跳包，网络信息维护
     ************************************************/

    //连接
    public connect(data: any = null) {
        console.log("正在连接", this.url)
        this.conState = ConnectionStatus.CONNECTING;

        this.ws = new WebSocket(this.url);
        this.ws.binaryType = "arraybuffer";
        this.ws.onopen = (e) => {

            this.onConnected(e);
        };
        this.ws.onmessage = (e) => {
            if (e.data instanceof ArrayBuffer) {
                this.onReceiveBinary(e.data);
            } else {
                this.onReceive(e.data);
            }
        }
        this.ws.onerror = (e) => {
            this.onError(e);
        }
        this.ws.onclose = (e) => {
            this.onClose(e);
        };
    }

    //连接成功，转发给UserManager
    protected onConnected(e) {
        let array = [1.1, 1.2, 1.3];
        let bufferView = new Uint8Array(array);
        this.ws.send(bufferView);

        this.conState = ConnectionStatus.CONNECTED;
        console.log("UNetworkSystem Opened");
        this.userManager.onConnected();

        //开启心跳
        this.startHeart();
        this.endReConnect();
    }

    protected onError(e) {
        // console.log("Send Text fired an error");
        // this.conState = ConnectionStatus.RECONNECT;
    }

    protected onClose(e) {
        console.log("WebSocket instance closed.");
        this.conState = ConnectionStatus.RECONNECT;
        //关闭心跳
        this.endHeart();
        this.startReConnect();
    }


    //重连
    public reConFlag: boolean = false;
    protected reConDelay: number = 1000;
    protected reConHandle: number = -1;
    protected startReConnect() {
        if (!this.reConFlag) {
            this.reConFlag = true;
            this.reConHandle = setTimeout(() => {
                console.log("尝试重连");
                this.connect();
                this.reConFlag = false
            }, this.reConDelay);
        }
    }

    protected endReConnect() {
        if (this.reConFlag) {
            console.log("重连成功")
            this.reConFlag = false;
            clearInterval(this.reConHandle)
            console.log("重新登录");
            let userMngq = this.userManager as ClientUserManager;
            userMngq.login();
        }
    }

    //心跳包
    protected heartFlag: boolean = false;
    protected heartHandle: number = -1;
    protected heartDelay: number = 10 * 1000;

    protected sendTime: number = 0;
    protected receiveTime: number = 0;

    protected startHeart() {
        if (!this.heartFlag) {
            this.heartFlag = true;
            this.heartHandle = setInterval(() => {
                this.sendHeart();
            }, this.heartDelay);
        }

    }
    protected endHeart() {
        if (this.heartFlag) {
            this.heartFlag = false;
            clearTimeout(this.heartHandle);
        }
    }

    //客户端发送
    //服务器接收
    //客户端接收

    //客户端发送时刻 接收时刻
    //服务器 计算三者延迟，接收时刻
    protected sendHeart() {
        this.sendTime = this.getCurrentTime();//发送时刻
        this.sendCmd(NetCmd.HEART, {
            data: [this.sendTime, this.receiveTime]
        });

    }

    protected onHeart(obj: object) {
        this.receiveTime = this.getCurrentTime();//接收时刻
    }


    public getServerInfo() {
        this.sendCmd(NetCmd.DEV_SERVER_STATUS);
    }
}
