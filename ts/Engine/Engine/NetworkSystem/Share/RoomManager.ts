import { xclass, xproperty } from "../../ReflectSystem/XBase";
import NetworkSystem from "./NetworkSystem";
import Manager from "./Manager";
import { NetCmd } from "./NetCmd";
import Room from "./Room";
import UGameInstance from "../../GameInstance";

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

    //游戏实例，外部绑定
    gameInstance: UGameInstance = null;


    @xproperty(Map)
    protected rooms: Map<string, Room> = new Map();

    public getRoomById(id: string) {
        return this.rooms.get(id);
    }

    //内部操作
    protected add(id_room) { }

    public delete(room: Room) {
        this.rooms.delete(room.id);
    }

    //0.注册回调
    public init(ns: NetworkSystem) {
        super.init(ns);
        ns.register(NetCmd.ROOM_ADD, this.onCreate, this);
        ns.register(NetCmd.ROOM_JOIN, this.onJoin, this);
        ns.register(NetCmd.ROOM_EXIT, this.onExit, this);
        ns.register(NetCmd.ROOM_DEL, this.onDel, this);
        ns.register(NetCmd.ROOM_LIST, this.onGetList, this);
        ns.register(NetCmd.SYNC_GAME, this.onSyncGame, this);
    }

    //获取房间列表
    public getList(...args) { }

    public onGetList(...args) { }

    //服务器把房间创建好
    protected onCreate(...args) { }

    //当有人加入房间(不止是自己)
    protected onJoin(...args) { }

    //当有人退出房间(不止是自己)
    protected onExit(...args) { }

    //删除房间请求来自客户端
    protected onDel(...args) { }

    protected onSyncGame(...args) { }
}