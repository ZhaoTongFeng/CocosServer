
import { xclass, XBase } from "../../ReflectSystem/XBase";
import { NetCmd } from "../Share/NetCmd";
import RoomManager from "./RoomManager";
import UserManager from "./UserManager";

@xclass(UNetworkSystem)
export default class UNetworkSystem extends XBase {
    //连接<stirng,conn>
    public connMap: Map<any, any> = new Map();
    public connPeeding: Map<any, any> = new Map();

    private ws: any = null;

    public isDebug: boolean = true;

    /************************************************
     * 访问Manager数据
     ************************************************/
    public getUserByKey(key: string) {
        return UserManager.Ins.getUserByKey(key);
    }
    public getUserById(id: string) {
        return UserManager.Ins.getUserById(id);
    }
    public getRoomById(id: string) {
        return RoomManager.Ins.getRoomById(id);
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
    public sendCmd(conn, cmd: number, obj: Object | string) {
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
        UserManager.Ins.init(this);
        RoomManager.Ins.init(this);
        this.register(NetCmd.HEART, this.onHeart, this);
    }

    //回调注册
    private events: Map<number, [Function, Object]> = new Map();
    register(cmd: number, callback: Function, caller: Object) { this.events.set(cmd, [callback, caller]); }
    unRegister(cmd: number) { this.events.delete(cmd); }

    /************************************************
     * 生命周期
     ************************************************/
    //新连接
    onNewClient(conn: any) {
        let key = this.getKey(conn);
        this.connPeeding.set(key, conn);
        UserManager.Ins.newConnected(key, conn)
        console.log("新连接", key);
        this.printInfo();
    }

    //心跳包
    onHeart(key, conn, obj) {
        this.sendCmd(conn, NetCmd.HEART, {});
    }

    //连接断开
    onClose(conn: any, code: any, reason: any) {
        let key = this.getKey(conn);
        this.connPeeding.delete(key);
        this.connMap.delete(key);
        UserManager.Ins.onClose(key, conn);

        console.log("连接断开", conn["key"], code, reason)
        this.printInfo();
    }


    //TODO 连接超时，清除peeding
    onTimeOut() {

    }






    printInfo() {
        console.log(
            "ped", this.connPeeding.size,
            "es", this.connMap.size,
            "uk", UserManager.Ins.userKeyMap.size,
            "uid", UserManager.Ins.userIdMap.size,
            "ulose", UserManager.Ins.userLoseMap.size,
            "rooms", RoomManager.Ins.rooms.size
        );
    }
}
