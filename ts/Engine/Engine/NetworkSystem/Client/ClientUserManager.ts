import { NetCmd } from "../Share/NetCmd";
import UNetworkSystem from "./ClientNetworkSystem";

import Manager from "../Share/Manager";
import User from "./ClientUser";
import UserManager from "../Share/UserManager";
import { xclass } from "../../ReflectSystem/XBase";
import ClientUser from "./ClientUser";

@xclass(ClientUserManager)
export default class ClientUserManager extends UserManager {
    
    public id_loc: string = null

    isLogin: boolean = false;

    //服务端socket
    key_conn: string = "";

    public add(id_user) {
        let user = new ClientUser();
        user.id_user = id_user;
        this.userIdMap.set(id_user, user);
        return user;
    }

    protected select(id) {
        let user = this.userIdMap.get(id)
        if (user) {
            return user;
        }
    }
    protected insert(user: User) { }
    protected update(user: User) { }
    protected delete(id) {
        this.userIdMap.delete(id);
    }

    //获取房间列表
    public getList() {
        this.ns.sendCmd(NetCmd.USER_LIST);
    }


    //0.注册回调
    init(ns: UNetworkSystem) {
        super.init(ns);
        this.ns.register(NetCmd.HELLOW, this.onHellow, this);
        this.ns.register(NetCmd.LOGIN, this._onLogin, this);
    }


    //1.网络连接成功，立即登录
    public onConnected() {

    }

    //2.第一个包
    onHellow(obj: object) {
        let key_conn = obj["key_conn"];
        this.key_conn = key_conn;

        console.log("收到的第一个包：", obj);
    }

    //注册
    register(id_user) {
        this.id_loc = id_user
        this.login();
    }

    //3.登录
    //发送账号和密码
    public login() {
        if (this.id_loc) {
            let out = {
                id_user: this.id_loc
            }
            this.ns.sendCmd(NetCmd.LOGIN, out);
        }
    }

    //4.登录回调
    //执行下一步操作
    public onLogin() { }
    private _onLogin(obj: object) {
        let code = Number(obj["code"]);
        if (code == 0) {
            console.log("登录成功")
            this.isLogin = true;
            let user = this.add(this.id_loc);
            user.mng = this;
            user.key_conn = this.key_conn;
            console.log(this.id_loc);
        } else {
            console.log("登录失败");
        }
    }
}