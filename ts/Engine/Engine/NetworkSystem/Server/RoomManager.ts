import { xclass, xproperty } from "../../ReflectSystem/XBase";
import { NetCmd } from "../Share/NetCmd";
import Manager from "./Manager";
import UNetworkSystem from "./NetworkSystem";
import Room from "./Room";



/**
 * 房间管理器
 * 操作放在XXX里面，onXXX处理客户端请求
 * 很多操作，既有可能来自客户端又有可能来自服务端
 * 创建房间，服务器主动创建房间
 * 加入房间，可能是服务器匹配
 * 退出房间，可能是被服务器踢出
 * 删除房间，玩家主动删除房间，服务器自动删除房间
 */
@xclass(RoomManager)
export default class RoomManager extends Manager {
    static Ins = new RoomManager();
    @xproperty(Number)
    private incId: number = 0;

    //房间列表
    @xproperty(Map)
    public rooms: Map<string, Room> = new Map();

    public getRoomById(id: string) {
        return this.rooms.get(id);
    }
    public insert() {
        let room = new Room();
        room.id = this.incId + "";
        this.rooms.set(room.id, room);
        this.incId++;
        return room;
    }

    //直接删除或者放回房间池
    public delete(room: Room) {
        this.rooms.delete(room.id);
    }

    //0.注册回调
    public init(ns: UNetworkSystem) {
        super.init(ns);
        ns.register(NetCmd.ROOM_ADD, this.onAdd, this);
        ns.register(NetCmd.ROOM_JOIN, this.onJoin, this);
        ns.register(NetCmd.ROOM_EXIT, this.onExit, this);
        ns.register(NetCmd.ROOM_DEL, this.onDel, this);
        ns.register(NetCmd.ROOM_LIST, this.onGetList, this);
    }

    //客户端请求当前房间 简要列表
    public onGetList(key, conn, obj) {
        let user = this.getUserByKey(key);
        if (!user) {
            console.log("未登录", key, obj)
            return;
        }
        let arr = [];
        this.rooms.forEach(room => {
            let ids = [];
            room.users.forEach((user, id) => {
                ids.push(id);
            });
            arr.push({
                id: room.id,
                size: room.users.size,
                ids: ids
            });
        });
        user.sendCmd(NetCmd.ROOM_LIST, arr);
    }




    //创建房间请求来自客户端
    private onAdd(key, conn, obj) {
        let user = this.getUserByKey(key);
        if (!user) {
            console.log("未登录", key, obj)
            return;
        }
        let room = this.insert();
        room.onAdd(user);
        console.log("用户", user.id_user, "创建房间", room.id, room.getUserCount());
    }

    //加入请求来自客户端
    private onJoin(key, conn, obj) {
        let user = this.getUserByKey(key);
        if (!user) {
            console.log("未登录", key, obj)
            return;
        }

        let id_room = obj['id_room'];
        let room = this.getRoomById(id_room);
        if (!room) {
            let out = {
                code: 1,
                err: "房间不存在"
            }
            user.sendCmd(NetCmd.ROOM_JOIN, out);
        } else {
            room.onJoin(user);
            console.log("用户", user.id_user, "加入房间", room.id, room.getUserCount());
        }

    }

    //退出请求来自客户端
    private onExit(key, conn, obj) {
        let user = this.getUserByKey(key);
        if (!user) {
            console.log("未登录", key, obj)
            return;
        }
        let id_room = user.id_room;
        let room = this.getRoomById(id_room);
        if (!room) {
            let out = {
                code: 1,
                err: "房间不存在"
            }
            user.sendCmd(NetCmd.ROOM_EXIT, out);
        } else {
            room.onExit(user);
            console.log("用户", user.id_user, "退出房间", room.id, room.getUserCount());
        }

    }

    //删除房间请求来自客户端
    private onDel(key, conn, obj) {
        let user = this.getUserByKey(key);
        if (!user) {
            console.log("未登录", key, obj)
            return;
        }
        let id_room = user.id_room;
        let room = this.getRoomById(id_room);
        if (!room) {
            let out = {
                code: 1,
                err: "房间不存在"
            }
            user.sendCmd(NetCmd.ROOM_DEL, out);
        } else {
            room.onDel(user);
            this.rooms.delete(id_room);
            console.log("用户", user.id_user, "退出房间", room.id, room.getUserCount());
        }
    }

}