import UObject from "../../../Object";
import { xclass } from "../../ReflectSystem/XBase";
import { NetCmd } from "./NetCmd";
import RoomManager from "./RoomManager";
import UserManager from "./UserManager";


/**
 * 网络管理器
 * 客户端只有一个，服务端也只有一个
 * 
 */
@xclass(NetworkSystem)
export default class NetworkSystem extends UObject {


    public isDebug: boolean = true;
    public delay: number = 0;




    /************************************************
     * 访问Manager数据
     ************************************************/
    public getUserById(id: string) {
        return this.userManager.getUserById(id);
    }
    public getRoomById(id: string) {
        return this.roomManager.getRoomById(id);
    }

    /************************************************
     * 发送
     ************************************************/
    /** 普通请求指令 */
    //1.1.发送命令
    // 直接发送即可
    public sendCmd(...args) { }
    public sendText(...args) { }
    /************************************************
     * 接收
     ************************************************/

    protected onReceive(...args) { }

    /************************************************
     * 指令 和 系统 注册
     ************************************************/
    //回调注册
    public events: Map<number, [Function, Object]> = new Map();
    public register(cmd: number, callback: Function, caller: Object) { this.events.set(cmd, [callback, caller]); }
    public unRegister(cmd: number) { this.events.delete(cmd); }

    userManager: UserManager = null;
    roomManager: RoomManager = null;
    //初始化网络相关系统
    public init() {
        this.register(NetCmd.HEART, this.onHeart, this);
    }

    /************************************************
     * 生命周期
     * 处理基本事务，断线重连，心跳包，网络信息维护
     ************************************************/

    protected onClose(...args) { }
    protected onHeart(...args) { }
    public login(...args){}
}
