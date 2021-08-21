import UGameInstance from "../../GameInstance";
import { xclass } from "../../ReflectSystem/XBase";
import Room from "../Share/Room";

import ClientUser from "./ClientUser";
import ClientGame from "./Sync/ClientGame";


@xclass(ClientRoom)
export default class ClientRoom extends Room {
    public onAdd(user: ClientUser) {
        this.gameSync = new ClientGame();
        this.owner = user.id_user;
        this.users.set(user.id_user, user);
    }
    
    public onJoin(user: ClientUser) {
        user.id_room = this.id;
        this.users.set(user.id_user, user);
    }

    public onExit(user: ClientUser) {
        this.users.delete(user.id_user);
        user.id_room = "";
    }

    public onDel(user: ClientUser) {

    }

    //转发同步数据到GameInstance
    public onSyncGame(obj: object, gameInstance: UGameInstance) {
        let data = obj["data"];
        // console.log("ROOM 收到数据转发给GameInstance", data);
        gameInstance.receiveGameData(obj["data"]);
    }

}