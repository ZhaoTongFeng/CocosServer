import { xclass, xproperty } from "../../ReflectSystem/XBase";
import UNetworkSystem from "./ClientNetworkSystem";
import Manager from "../Share/Manager";
import { NetCmd } from "../Share/NetCmd";
import Room from "./ClientRoom";

import UserManager from "./ClientUserManager";
import UGameInstance from "../../GameInstance";
import RoomManager from "../Share/RoomManager";
import ClientUserManager from "./ClientUserManager";
import ClientNetworkSystem from "./ClientNetworkSystem";
import ClientRoom from "./ClientRoom";

/**
 * 房间管理器
 * 操作放在XXX里面，onXXX处理客户端请求
 * 很多操作，既有可能来自客户端又有可能来自服务端
 * 创建房间，服务器主动创建房间
 * 加入房间，可能是服务器匹配
 * 退出房间，可能是被服务器踢出
 * 删除房间，玩家主动删除房间，服务器自动删除房间
 */
@xclass(ClientRoomManager)
export default class ClientRoomManager extends RoomManager {

    protected curRoom: ClientRoom = null;

    //内部操作
    protected add(id_room) {
        let room = new ClientRoom();
        room.id = id_room;
        this.rooms.set(id_room, room);
        room.roomManager = this;
        return room;
    }


    //0.注册回调
    public init(ns: UNetworkSystem) {
        super.init(ns);

    }

    //获取房间列表
    public getList() {
        let out = {}
        this.ns.sendCmd(NetCmd.ROOM_LIST, out);
    }

    public onGetList(obj: object) {
        console.log(obj)
    }


    //请求服务器创建一个房间
    optLock: boolean = false;

    protected isCanOpt() {
        if (this.optLock) {
            console.warn("操作中")
            return false;
        } else {
            return true;
        }
    }

    protected lockOpt() {
        this.optLock = true;
    }

    protected unLock() {
        this.optLock = false
    }

    public create() {
        if (this.curRoom != null) {
            console.warn("目前已经在有一个房间");
            return;
        }
        if (this.isCanOpt()) {
            this.lockOpt();
            let out = {}
            this.ns.sendCmd(NetCmd.ROOM_ADD, out);
            console.log("Client:请求创建房间");
        }
    }

    //服务器把房间创建好
    protected onCreate(obj: object) {
        this.unLock();
        let code = obj["code"];
        if (code != 0) {
            console.warn("Client:房间创建失败", code);
            return;
        }
        let id_room = obj["id_room"];

        let room = this.add(id_room);
        this.curRoom = room;

        let userMng = this.ns.userManager as ClientUserManager;
        room.onAdd(userMng.locUser);



        console.log("Client:房间创建成功", room);
    }

    //请求加入一个房间
    public join(id_room) {

        if (this.isCanOpt()) {
            this.lockOpt();
            if (!this.curRoom) {
                let out = {
                    id_room: id_room
                }
                this.ns.sendCmd(NetCmd.ROOM_JOIN, out);
                console.log("Client:请求加入房间", id_room);
            } else {
                console.log("当前房间不为空");
            }
        }


    }

    //当有人加入房间(不止是自己)
    protected onJoin(obj: object) {
        this.unLock();
        let code = obj["code"];
        if (code != 0) {
            console.warn("加入失败")
            return;
        }
        let id_user = obj["id_user"];
        let id_room = obj["id_room"];
        let userMng = this.ns.userManager as ClientUserManager;
        let ns = this.ns as ClientNetworkSystem;

        if (ns.isThisUser(id_user)) {
            //加入者检查是否需要实例化这个房间
            let room = this.getRoomById(id_room);
            if (!room) {
                room = this.add(id_room);
            }
            this.curRoom = room;

            //并获取这个房间的最新状态，这里直接返回了，所以不需要额外去获取，但理论上，应该分开
            let ids = obj["ids"];
            ids.forEach(id => {
                let user = this.getUserById(id);
                if (!user) {
                    user = userMng.add(id_user);
                }
            });
            console.log("Client:加入房间成功", this.curRoom);
        } else {
            //房间其他人,只需添加这一个用户
            let user = this.getUserById(id_user)
            if (!user) {
                user = userMng.add(id_user);
            }
            this.curRoom.onJoin(user);
            console.log("Client:XXX加入房间", this.curRoom);
        }
    }


    //退出这个房间
    public exit() {
        if (this.isCanOpt()) {
            this.lockOpt();
            if (this.curRoom) {
                let out = {
                    id_room: this.curRoom.id
                }
                this.ns.sendCmd(NetCmd.ROOM_EXIT, out);
            } else {
                console.warn("当前房间为空");
            }
        }
    }

    //当有人退出房间(不止是自己)
    protected onExit(obj: object) {
        this.unLock();
        let code = obj["code"];
        if (code != 0) {
            console.log("退出失败");
            return;
        }
        let id_user = obj["id_user"];
        let id_room = obj["id_room"];

        let room = this.getRoomById(id_room);

        //先退出房间
        let user = this.getUserById(id_user);
        room.onExit(user);
        let userMng = this.ns.userManager as ClientUserManager;
        let ns = this.ns as ClientNetworkSystem;
        if (ns.isThisUser(id_user)) {
            //如果是退出者
            this.curRoom = null;
            console.log("Client:退出成功", this.rooms);
        } else {
            //其他人
            console.log("Client:XXX退出房间", user);
        }

        if (room.users.size == 0) {
            this.delete(room);
        }
        console.log(this.rooms);
    }



    //请求删除房间
    public del() {
        if (this.isCanOpt()) {
            this.lockOpt();
            if (this.curRoom) {
                let out = {
                    id_room: this.curRoom.id
                }
                this.ns.sendCmd(NetCmd.ROOM_DEL, out);
            }
        }

    }

    //删除房间请求来自客户端
    protected onDel(obj: object) {
        this.unLock();
        console.log("房间被删除", obj);
        let id_room = obj["id_room"];
        let room = this.getRoomById(id_room);
        
        room.onDel(null);
        this.delete(room);
    }


    //客户端一个只有一个游戏实例，所以可以直接在Manager中进行处理
    //但是服务器，必须在房间中进行处理

    public syncGame(obj: Object | Array<Object>) {
        let out = {
            data: obj
        }
        this.ns.sendCmd(NetCmd.SYNC_GAME, out);
        // console.log("发送全部消息", out);
    }

    protected onSyncGame(obj: object) {
        this.curRoom.onSyncGame(obj, this.gameInstance);
    }
}