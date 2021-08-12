import UGameInstance from "../../GameInstance";
import { xclass, XBase, xproperty } from "../../ReflectSystem/XBase";
import { NetCmd } from "../Share/NetCmd";
import GameSync from "./Game";
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
    public owner: User = null;

    public roomManager: RoomManager = null;

    public gameSync: GameSync = null;


    //玩家创建房间
    public onAdd(user: User) {
        this.gameSync = new GameSync();


        //记录房主信息
        this.owner = user;
        this.users.set(user.id_user, user);
    }

    //玩家加入房间
    public onJoin(user: User) {
        user.id_room = this.id;
        this.users.set(user.id_user, user);

    }

    //玩家退出房间
    public onExit(user: User) {
        this.users.delete(user.id_user);
        user.id_room = "";
    }

    //房间被删除
    public onDel() {

    }

    //转发同步数据到GameInstance
    public onSyncGame(obj: object, gameInstance: UGameInstance) {
        let data = obj["data"];
        // console.log("ROOM 收到数据转发给GameInstance", data);
        gameInstance.receiveGameData(obj["data"]);
    }

}