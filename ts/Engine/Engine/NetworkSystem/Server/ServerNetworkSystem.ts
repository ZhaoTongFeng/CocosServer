
import { xclass } from "../../ReflectSystem/XBase";
import { NetCmd } from "../Share/NetCmd";
import NetworkSystem from "../Share/NetworkSystem";
import ServerRoomManager from "./ServerRoomManager";
import ServerUserManager from "./ServerUserManager";

@xclass(ServerNetworkSystem)
export default class ServerNetworkSystem extends NetworkSystem {
    //连接<stirng,conn>
    public connMap: Map<any, any> = new Map();
    public connPeeding: Map<any, any> = new Map();

    protected ws: any = null;



    /************************************************
     * 访问Manager数据
     ************************************************/
    public getUserByKey(key: string) {
        let userMng = this.userManager as ServerUserManager;
        return userMng.getUserByKey(key);
    }

    public getKey(conn: any) { return conn["key"]; }

    /************************************************
     * 发送
     ************************************************/
    //发送接口，需要在外部Main.js中进行绑定
    public sendText(conn: any, msg: string) { }

    //广播接口，需要在外部Main.js中进行绑定
    public _broadcast(ws: any, msg: string) { }

    public broadcast(msg: string) {
        this._broadcast(this.ws, msg);
    }
    public sendCmd(conn, cmd: number, obj: Object | string = {}) {
        try {
            obj["opt"] = cmd;
            let str = null;
            if (typeof obj == "string") {
                str = obj;
            } else {
                str = JSON.stringify(obj);
            }
            this.sendText(conn, str);
        } catch (error) {
            console.log(error);
        }
    }
    /************************************************
     * 接收
     ************************************************/
    onReceive(conn: any, str: string) {
        let data = JSON.parse(str);
        let tuple = this.events.get(Number(data["opt"]));
        if (tuple) {
            let func: Function = tuple[0];
            let caller = tuple[1];
            let key = this.getKey(conn);
            func.call(caller, key, conn, data);
        }
        this.printInfo();
    }

    /************************************************
     * 指令 和 系统 注册
     ************************************************/
    init() {
        this.userManager = new ServerUserManager();
        this.userManager.init(this);
        this.roomManager = new ServerRoomManager();
        this.roomManager.init(this);
        this.register(NetCmd.DEV_SERVER_STATUS, this.onServerInfo, this);
        this.register(NetCmd.HEART, this.onHeart, this);
    }


    /************************************************
     * 生命周期
     ************************************************/
    //新连接
    onNewClient(conn: any) {
        let key = this.getKey(conn);
        this.connPeeding.set(key, conn);
        this.userManager.onConnected(key, conn)
        console.log("新连接", key);
        this.printInfo();
    }

    //心跳包
    onHeart(key, conn, obj) {
        let user = this.getUserByKey(key);
        let out = {}
        let data = obj["data"];
        if (user) {


            let sendTime = data[0];//这帧发送时刻
            let curTime = this.getCurrentTime();//当前时刻

            let serverTick = user.serverHartTick;//上一帧发送时刻
            let receiveTime = data[1];//上一帧接收时刻


            user.delay_clientToServer = (curTime - sendTime);
            user.delay_serverToClient = receiveTime - serverTick;

            user.serverHartTick = curTime;
        }

        this.sendCmd(conn, NetCmd.HEART, out);
    }

    //连接断开
    onClose(conn: any, code: any, reason: any) {
        let key = this.getKey(conn);
        this.connPeeding.delete(key);
        this.connMap.delete(key);

        let userMng = this.userManager as ServerUserManager;
        userMng.onClose(key, conn);

        console.log("连接断开", conn["key"], code, reason)
        this.printInfo();
    }


    //TODO 连接超时，清除peeding
    onTimeOut() {

    }


    onServerInfo(key, conn, obj) {
        let userManger = this.userManager as ServerUserManager;
        let roomManager = this.roomManager as ServerRoomManager;

        let out = {
            "ped": this.connPeeding.size,
            "es": this.connMap.size,
            "uk": userManger.userKeyMap.size,
            "uid": userManger.userIdMap.size,
            "ulose": userManger.userLoseMap.size,
            "rooms": roomManager.rooms.size
        }
        this.sendCmd(conn, NetCmd.DEV_SERVER_STATUS, out);
    }



    printInfo() {
        // console.log(
        //     "ped", this.connPeeding.size,
        //     "es", this.connMap.size,
        //     "uk", UserManager.Ins.userKeyMap.size,
        //     "uid", UserManager.Ins.userIdMap.size,
        //     "ulose", UserManager.Ins.userLoseMap.size,
        //     "rooms", RoomManager.Ins.rooms.size
        // );
    }
}
