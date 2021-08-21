import { xclass, XBase, xproperty } from "../../ReflectSystem/XBase";
import User from "../Share/User";
import UserManager from "./ServerUserManager";

export enum ConnectionStatus {
    CONNECTING, //连接中
    CONNECTED,  //已连接
    LOSE,       //断线
}

@xclass(ServerUser)
export default class ServerUser extends User {
    //socket 连接
    public conn = null;
    //连接状态
    @xproperty(Number)
    public conState: ConnectionStatus = ConnectionStatus.CONNECTING;
    
    public sendCmd(cmd: number, obj: Object | string) {
        this.mng.ns.sendCmd(this.conn, cmd, obj);
    }

    public onClose() {

    }
}


