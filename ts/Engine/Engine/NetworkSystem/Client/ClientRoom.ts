import World1 from "../../../../Game1/World1";
import { GameState } from "../../Enums";
import UGameInstance from "../../GameInstance";
import { xclass, xClient } from "../../ReflectSystem/XBase";
import { NetCmd } from "../Share/NetCmd";
import Room from "../Share/Room";
import ClientNetworkSystem from "./ClientNetworkSystem";
import ClientUser from "./ClientUser";


@xClient("Room")
@xclass(ClientRoom)

export default class ClientRoom extends Room {


    public onAdd(user: ClientUser) {
        // this.game = new ClientGame();
        // this.owner = user.id_user;
        // this.users.set(user.id_user, user);
    }

    public onJoin(user: ClientUser) {
        // this.game = new ClientGame();
        // user.id_room = this.id;
        // this.users.set(user.id_user, user);
    }

    public onExit(user: ClientUser) {
        // this.users.delete(user.id_user);
        // user.id_room = "";
    }

    public onDel(user: ClientUser) {

    }

    //转发同步数据到GameInstance
    public onSyncGame(obj: object, gameInstance: UGameInstance) {
        // let data = obj["data"];
        // // console.log("ROOM 收到数据转发给GameInstance", data);
        // gameInstance.receiveGameData(obj["data"]);
    }

    /**
     * 准备阶段
     */
    //1.1房主开始游戏
    public sendGameBeg() {
        let ns = this.mng.ns as ClientNetworkSystem
        ns.sendCmd(NetCmd.GAME_BEGIN);
        console.log("1.1请求开始游戏")
    }

    //1.3进入游戏关卡
    public onGameBeg(obj: object) {
        console.log("1.3游戏开始，进入游戏关卡")
    }

    //初始化游戏实例
    public initGameInstance() {
        let gameInstance: UGameInstance = new UGameInstance();
        gameInstance.setIsClient(true);
        gameInstance.network = this.mng.ns as ClientNetworkSystem;
        gameInstance.room = this;
        this.gameInstance = gameInstance;
        this.sendGameReady();
        return gameInstance;
    }

    //2.1告诉服务器我已经准备好接受关卡数据
    public sendGameReady() {
        let ns = this.mng.ns as ClientNetworkSystem
        ns.sendCmd(NetCmd.GAME_READY);
        console.log("2.1告诉服务器我已经准备好接受关卡数据")
    }

    //2.3服务器成功收到我已经准备好了
    public onGameReady(obj: object) {
        console.log("2.3服务器收到我已经准备好接收数据")
    }

    //3.2客户端接收关卡数据
    public onLoadLevelData(obj: object) {
        console.log("3.2我收到了关卡数据，开始加载关卡")
        let ns = this.mng.ns as ClientNetworkSystem
        ns.sendCmd(NetCmd.GAME_LOADLEVEL);
        console.log("告诉服务器我已经接收到数据")

        let world = new World1();
        let levelData = obj["levelData"];
        this.gameInstance.openWorld(world, levelData, this);
        this.gameInstance.getWorldView().updateOnec();
    }

    //4.2开始游戏
    public onGamePlay(obj: object) {
        this.startUpdateGame();
        console.log("开始游戏，启动World，注意此时服务器已经启动了，客户端延迟启动")
    }

    /**
     * 同步阶段
     */
    /** 发送和接收游戏同步数据，两边保持一致，全部是从GameInstance中进行发送，并发送会GameInstance */
    public sendGameData(obj: Object | Array<Object>) {
        let out = {
            data: obj,
            time: new Date().getTime()
        }
        let ns = this.mng.ns;
        // console.log(out);
        ns.sendCmd(NetCmd.GAME_SEND_SERVER, out);
    }

    sendBinaryGameData(view) {
        let ns = this.mng.ns;
        ns.sendBinary(view);
    };

    //6.2接收服务器的状态，更新本地状态
    public onReceiveGameData(obj: object) {
        let data = obj["data"];
        let time = obj["time"];
        this.gameInstance.receiveGameData(data, time);
        // console.log(data);
    }

    onReceiveBinaryGameData(data) {
        this.gameInstance.receiveBinaryGameData(data);
    }

    //5.3服务器收到了客户端发送的指令（不一定有这一步，除非变量被标记为完全可靠的）
    public onGameSendInput(obj: object) { }



    /**
     * 结算阶段
     */
    //7.2服务器通知游戏结束
    public onGameFinish(obj: object) {

    }


    //8.2服务器通知游戏结果
    public onGameResult(obj: object) {

    }

    //9.2服务器通知游戏彻底结束
    public onGameEnd(obj: object) {

    }

}