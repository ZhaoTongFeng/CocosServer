
import { xclass, XBase, xproperty } from "../../ReflectSystem/XBase";
import { NetCmd } from "../Share/NetCmd";
import RoomManager from "./RoomManager";
import User from "./User";


@xclass(Room)
export default class Room extends XBase {
    //房间ID
    @xproperty(String)
    public id: string = "";

    //用户列表
    @xproperty(Map)
    public users: Map<string, User> = new Map();
    public getUserCount() {
        return this.users.size;
    }
    //房主
    private owner: string = null;

    //房间广播
    public broadcast(cmd: number, obj: object) {
        try {
            this.users.forEach(user => {
                user.sendCmd(cmd, obj);
            });
        } catch (error) {
            console.log(error);
        }
    }

    //玩家创建房间
    public onAdd(user: User) {
        //记录房主信息，并直接将房主添加到房间
        this.owner = user.id_user;
        this.users.set(user.id_user, user);

        //返回房间号
        let out = {
            code: 0,
            id_room: this.id
        }
        user.sendCmd(NetCmd.ROOM_ADD, out);
    }

    //玩家加入房间
    public onJoin(user: User) {
        if (user.id_room == this.id) {
            let out = {
                code: 2,
                err: "已加入该房间"
            }
            user.sendCmd(NetCmd.ROOM_JOIN, out);
            return;
        }


        //先通知已经在房间内的用户,有新玩家进，房间内的用户，只需要去获取这个新用户数据即可
        let out = {
            code: 0,
            id_user: user.id_user, //加入者信息
            id_room: this.id
        }
        this.broadcast(NetCmd.ROOM_JOIN, out);

        //注意，这里是广播之后再添加的
        user.id_room = this.id;
        this.users.set(user.id_user, user);
        //然后通知加入者，将房间信息发送给它
        let ids = [];
        this.users.forEach((user, id) => {
            ids.push(id);
        });
        out["ids"] = ids;
        user.sendCmd(NetCmd.ROOM_JOIN, out);
    }

    //玩家退出房间
    public onExit(user: User) {
        //如果是房主寻找下一继承人

        if (user.id_user == this.owner && this.users.size > 0) {
            this.owner = "";
            this.users.forEach((user, id) => {
                this.owner = user.id_user
                console.log("房主更换为", this.id, this.owner);
                return;
            });
        }

        user.id_room = "";
        let out = {
            code: 0,
            id_user: user.id_user,
            id_room: this.id,
            owner:this.owner
        }
        this.broadcast(NetCmd.ROOM_EXIT, out);

        //广播之后再删除
        this.users.delete(user.id_user);
        //如果房间一个人都没有了，则删除这个房间（或者放回房间池里）
        if (this.users.size == 0) {
            RoomManager.Ins.delete(this);
        }
    }

    //房间被删除
    public onDel(user: User) {
        this.users.forEach((user, id) => {
            user.id_room = "";
        });

        let out = {
            id_room: this.id
        }
        this.broadcast(NetCmd.ROOM_DEL, out);
        this.users.clear();

        RoomManager.Ins.delete(this);
    }

}