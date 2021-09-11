import { xclass, XBase, xproperty, xServer } from "../../ReflectSystem/XBase";
import User from "../Share/User";
import ServerNetworkSystem from "./ServerNetworkSystem";

@xServer("User")
@xclass(ServerUser)
export default class ServerUser extends User {
    //socket 连接
    public conn = null;


    public sendCmd(cmd: number, obj: Object | string) {
        let ns = this.mng.ns as ServerNetworkSystem;
        ns.sendCmd(this.conn, cmd, obj);
    }
}


