import { xclass, XBase, xproperty } from "../../ReflectSystem/XBase";
import UserManager from "./UserManager";




@xclass(User)
export default class User extends XBase {
    //用户ID
    @xproperty(String)
    public id_user: string = "";

    //服务端 连接标识
    @xproperty(String)
    public key_conn: string = "";



    //当前所在房间
    @xproperty(String)
    public id_room: string = "";



    protected mng:UserManager = null;

    init(mng: UserManager) {
        this.mng = mng;
    }
}