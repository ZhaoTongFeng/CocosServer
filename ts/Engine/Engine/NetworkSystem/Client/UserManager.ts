import { NetCmd } from "../Share/NetCmd";
import UNetworkSystem from "./NetworkSystem";

import Manager from "./Manager";
import User from "./User";


export default class UserManager extends Manager {

    public locUser: User = null
    public userIdMap: Map<string, User> = new Map();

    isLogin:boolean = false;


    public getUserById(id: string) {
        return this.userIdMap.get(id);
    }

    public add(id_user) {
        let user = new User();
        user.id_user = id_user;
        this.userIdMap.set(id_user, user);
        return user;
    }

    select(id) {

    }
    insert() {

    }
    update() {

    }
    delete(id) {

    }

    //注册本机用户
    register(id_user) {
        if (this.locUser == null) {
            this.locUser = this.add(id_user);
        } else {
            this.locUser.id_user = id_user
        }

        this.locUser.key_conn = this.key_conn;
        this.login();
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
    key_conn: string = "";

    onHellow(obj: object) {
        let key_conn = obj["key_conn"];
        this.key_conn = key_conn;

        console.log("收到的第一个包：", obj);
    }

    //3.登录
    //发送账号和密码
    public login() {
        if(this.locUser){
            let out = {
                id_user: this.locUser.id_user
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
            this.isLogin=true;
            console.log(this.locUser);
        } else {
            console.log("登录失败");
        }
        this.onLogin();
    }


}