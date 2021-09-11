import { xclass, xproperty, xStatusSync } from "../../ReflectSystem/XBase";
import Manager from "../Share/Manager";
import { NetCmd } from "../Share/NetCmd";
import { ConnectionStatus } from "../Share/User";
import UserManager from "../Share/UserManager";
import ServerNetworkSystem from "./ServerNetworkSystem";
import ServerUser from "./ServerUser";



@xclass(ServerUserManager)
@xStatusSync(["userKeyMap","userLoseMap"])
export default class ServerUserManager extends UserManager {

    //用户信息
    @xproperty(Map)
    public userKeyMap: Map<string, ServerUser> = new Map();

    //断线用户
    @xproperty(Map)
    public userLoseMap: Map<string, ServerUser> = new Map();

    private spawnNewUser(id_user){
        let user = new ServerUser();
        user.mng = this;
        user.id_user = id_user;
        return user;
    }


    public getUserByKey(key: string) {
        return this.userKeyMap.get(key);
    }

    public onGetList(key, conn, obj) {

        let user = this.getUserByKey(key);
        if (!user) {
            console.log("未登录", key, obj)
            return;
        }

        let out = {
            data:this.toJSON()
        }        

        // let arr = [];
        // this.rooms.forEach(room => {
        //     let ids = [];
        //     room.users.forEach((user, id) => {
        //         ids.push(id);
        //     });
        //     arr.push({
        //         id: room.id,
        //         size: room.users.size,
        //         ids: ids
        //     });
        // });
        user.sendCmd(NetCmd.USER_LIST, out);
    }

    //0.注册回调
    public init(ns: ServerNetworkSystem) {
        super.init(ns);
        ns.register(NetCmd.LOGIN, this.onLogin, this);
    }

    //1.网络连接成功，发送第一个包
    public onConnected(key, conn) {
        this.hellow(key, conn);
    }

    //2.发送第一个包
    public hellow(key, conn) {
        let out = {
            opt: NetCmd.HELLOW,
            key_conn: key
        }

        //因为还没有创建User，所以只能用这种方式先发送，后面统一用user进行发送
        let str = JSON.stringify(out);
        this.ns.sendText(conn, str);
        console.log("发送首包", str);
    }

    protected login(key, conn, obj) {

        let code = 0;
        let id_user = obj["id_user"];

        //如果用户存在，则重新连接，否则创建新用户对象
        //TODO 重新连接，还要判断玩家当前状态，如果在游戏中，还要调用游戏断线重连的逻辑
        let user = this.userLoseMap.get(id_user);
        if (user) {
            console.log("用户重新连接", user.id_user);
            this.userIdMap.set(id_user, user);
            this.userLoseMap.delete(id_user);
        } else {
            user = this.userIdMap.get(id_user) as ServerUser
            if (!user) {
                user = this.spawnNewUser(id_user);
                console.log("用户首次登录", user.id_user);
            } else {
                console.log("连接状态下的用户重新登录", user.id_user);
            }
        }

        user.key_conn = key;
        user.conn = conn;
        user.conState = ConnectionStatus.CONNECTED;

        //添加到Map
        this.userIdMap.set(id_user + "", user);
        this.userKeyMap.set(key, user);

        //切换连接状态
        let ns = this.ns as ServerNetworkSystem;
        ns.connMap.set(key, user);
        ns.connPeeding.delete(key);

        //返回登录结果
        let out = {
            code: code
        }

        user.sendCmd(NetCmd.LOGIN, out);
    }

    //3.登录
    //登录之后再创建User
    public onLogin(key, conn, obj) {
        this.login(key, conn, obj);
    }


    public onClose(key, conn) {
        let user = this.userKeyMap.get(key);
        //断开连接时，用户不一定已经登录
        if (user) {
            user.conState = ConnectionStatus.LOSE;
            //不从idMap中清除，只清除连接
            // this.userIdMap.delete(user.id_user);
            this.userKeyMap.delete(user.key_conn);
            this.userIdMap.delete(user.id_user);
            this.userLoseMap.set(user.id_user, user);
            console.log("已登录用户断开连接", user.id_user);
        }
    }
}