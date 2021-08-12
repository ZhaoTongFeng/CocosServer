import { xclass, XBase, xproperty } from "../../ReflectSystem/XBase";
import UserManager from "./UserManager";


export enum ConnectionStatus {
    CONNECTING, //连接中
    CONNECTED,  //已连接
    LOSE,       //断线
}
@xclass(User)
export default class User extends XBase {
    //用户ID
    @xproperty(String)
    public id_user: string = "";

    //服务端 连接标识
    @xproperty(String)
    public key_conn: string = "";

    //socket 连接
    public conn = null;

    //连接状态
    @xproperty(Number)
    public conState: ConnectionStatus = ConnectionStatus.CONNECTING;

    //当前所在房间
    @xproperty(String)
    public id_room: string = "";

    /** 普通请求指令 */
    //1.1.发送命令
    // 直接发送即可
    public sendCmd(cmd: number, obj: Object | string) {
        UserManager.Ins.ns.sendCmd(this.conn, cmd, obj);
    }

    public onClose() {

    }
}


