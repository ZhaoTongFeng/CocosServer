import UGameInstance from "../../GameInstance";
import { xclass, XBase, xproperty } from "../../ReflectSystem/XBase";
import GameSync from "./GameSync";
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

    //房主
    public owner: string = null;

    public roomManager: RoomManager = null;

    public gameSync: GameSync = null;

    public gameInstance: UGameInstance = null;

    getUserCount(): number { return this.users.size; }

    //玩家创建房间
    public onAdd(user: User) { }

    //玩家加入房间
    public onJoin(user: User) { }

    //玩家退出房间
    public onExit(user: User) { }

    //房间被删除
    public onDel(user: User) { }


    //转发同步数据到GameInstance
    public onSyncGame(...args) { }

}