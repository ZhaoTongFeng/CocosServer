
import World1 from "../../../../Game1/World1";
import { GameState } from "../../Enums";
import UGameInstance from "../../GameInstance";
import { xclass, XBase, xproperty, xClient, xServer } from "../../ReflectSystem/XBase";
import UWorldView from "../../UWorldView";
import { NetCmd } from "../Share/NetCmd";
import Room from "../Share/Room";
import ServerNetworkSystem from "./ServerNetworkSystem";
import ServerUser from "./ServerUser";

@xServer("Room")
@xclass(ServerRoom)

export default class ServerRoom extends Room {
    //房间广播
    public broadcast(cmd: number, obj: object) {
        try {

            this.users.forEach(id_user => {
                let user = this.mng.getUserById(id_user);
                if (user) {
                    (user as ServerUser).sendCmd(cmd, obj);
                }
            });
        } catch (error) {
            console.log(error);
        }
    }
    public broadcastBinary(view) {
        try {

            this.users.forEach(id_user => {
                let user = this.mng.getUserById(id_user);
                if (user) {
                    (user as ServerUser).sendBinary(view);
                }
            });
        } catch (error) {
            console.log(error);
        }
    }


    public onAdd(user: ServerUser) {
        //记录房主信息，并直接将房主添加到房间
        this.owner = user.id_user;
        this.users.add(user.id_user);

        //返回房间号
        let out = {
            code: 0,
            id_room: this.id
        }
        user.sendCmd(NetCmd.ROOM_ADD, out);
    }

    public onJoin(user: ServerUser) {
        if (this.users.has(this.id)) {
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
        this.users.add(user.id_user);
        //然后通知加入者，将房间信息发送给它
        let ids = [];
        this.users.forEach((user, id) => {
            ids.push(id);
        });
        out["ids"] = ids;
        user.sendCmd(NetCmd.ROOM_JOIN, out);
    }


    //玩家退出房间
    public onExit(user: ServerUser) {
        //如果是房主寻找下一继承人

        if (user.id_user == this.owner && this.users.size > 0) {
            this.owner = "";
            this.users.forEach(id => {
                this.owner = id
                console.log("房主更换为", this.id, this.owner);
                return;
            });
        }

        user.id_room = "";
        let out = {
            code: 0,
            id_user: user.id_user,
            id_room: this.id,
            owner: this.owner
        }
        this.broadcast(NetCmd.ROOM_EXIT, out);

        //广播之后再删除
        this.users.delete(user.id_user);
        //如果房间一个人都没有了，则删除这个房间（或者放回房间池里）
        if (this.users.size == 0) {
            this.mng.delete(this);
        }
    }


    //房间被删除
    public onDel(user: ServerUser) {
        this.users.forEach(id_user => {
            let user = this.mng.getUserById(id_user);
            if (user) {
                user.id_room = null;
            }
        });

        let out = {
            id_room: this.id
        }
        this.broadcast(NetCmd.ROOM_DEL, out);
        this.users.clear();

        this.mng.delete(this);
    }


    /**
     * 准备阶段
     */
    //1.2客户端要求开始游戏
    onGameBeg(user: ServerUser) {
        console.log("1.2客户端请求开始游戏")
        if (user.id_user != this.owner) { return; }
        //1.通知所有客户端进入游戏Scene
        this.broadcast(NetCmd.GAME_BEGIN, {});

        //2.启动游戏实例，加载初始关卡，开启一个倒计时，倒计时结束后向所有客户端发送关卡数据
        this.initGameInstance();
    }

    public initGameInstance() {
        if (this.gameInstance != null) {
            this.endUpdateGame();
            this.gameInstance = null;
        }

        console.log("启动游戏实例，并进入关卡")
        let gameInstance: UGameInstance = new UGameInstance();
        gameInstance.setIsClient(false);
        gameInstance.network = this.mng.ns as ServerNetworkSystem;
        gameInstance.room = this;

        //服务器和客户端更新的精髓，worldview只具备接口
        //但是任然存在函数的无用调用
        gameInstance.setWorldView(new UWorldView());
        this.gameInstance = gameInstance;

        console.log("初始化世界，生成关卡数据")
        let world = new World1();

        this.gameInstance.openWorld(world, {}, this);


        this.time = 1;
        this.handle = setInterval(() => {
            this.time -= 1;
            console.log(this.time, "秒后发送关卡数据");
        }, 1000)

        setTimeout(() => {
            clearInterval(this.handle);
            this.sendGameLevel()
        }, this.time * 1000);

        return gameInstance;
    }


    //2.2客户端进入游戏场景，准备接受关卡数据
    onGameReady(user: ServerUser) {
        console.log("2.2客户端已进入游戏场景并初始化好引擎")
        //改变玩家是否准备就绪标志位
        user.game_ready = 1;
        console.log(user.id_user, "准备接受关卡数据")
        user.sendCmd(NetCmd.GAME_READY, {});
    }




    //3.1向准备就绪的玩家发送关卡初始数据
    sendGameLevel() {
        console.log("向所有玩家发送关卡数据")
        let levelData = this.gameInstance.getWorld().toJSON();
        let out = {
            levelData: levelData
        }
        this.broadcast(NetCmd.GAME_LOADLEVEL, out);

        this.time = 1;
        this.handle = setInterval(() => {
            this.time -= 1;
            console.log(this.time, "秒后发送开始游戏");
        }, 1000)
        //设置一个开始游戏倒计时
        setTimeout(() => {
            clearInterval(this.handle);
            this.sendGamePlay()
        }, this.time * 1000);
    }

    //3.3客户端接收关卡数据完成，当所有客户端都接收到数据时，提前开始游戏
    onLoadLevelData(user: ServerUser) {
        console.log("3.3客户端加载关卡数据完毕")
        user.game_loaded = 1;
        console.log(user.id_user, "客户端加载数据成功")
    }



    //4.1正式开始游戏
    sendGamePlay() {
        //服务器以30帧更新
        // this.fps = 30;
        this.startUpdateGame();
        console.log("正式开始游戏")
        let out = {

        }
        this.broadcast(NetCmd.GAME_PLAY, out);
    }



    //4.3客户端开始游戏
    onGamePlay(user: ServerUser) {
        console.log("4.3客户端开始游戏")
        console.log(user.id_user, "正式开始游戏")
    }

    /**
     * 同步阶段
     */
    public sendGameData(obj: Object | Array<Object>) {
        let out = {
            data: obj,
            time: new Date().getTime()
        }
        this.broadcast(NetCmd.GAME_SEND_SERVER, out)
    }

    sendBinaryGameData(view) {

        this.broadcastBinary(view)
    }


    //6.3服务器收到客户端输入，更新Controller状态
    public onReceiveGameData(user: ServerUser, obj: Object) {
        let data = obj["data"];
        let time = obj["time"];
        this.gameInstance.receiveGameData(data, time);
    }

    onReceiveBinaryGameData(user: ServerUser, data) {
        this.gameInstance.receiveBinaryGameData(data);
    }


    /**
     * 结算阶段
     */
    //7.1服务端，通知所有玩家，游戏结束
    sendGameFinish(obj: object) {
        console.log("发送游戏结束")
        let out = {

        }
        this.broadcast(NetCmd.GAME_FINISH, out);
    }
    //7.3
    onSendGameFinish(user: ServerUser) {

    }

    //8.1服务端，告诉每一个客户端游戏结果
    sendGameResult(obj: object) {
        console.log("发送游戏结果")
        let out = {

        }
        this.broadcast(NetCmd.GAME_RESULT, out);
    }
    //8.3
    onSendGameResult(user: ServerUser) {

    }
    //9.1服务端，告诉客户端游戏已经彻底结束
    sendGameEnd(obj: object) {
        console.log("发送游戏彻底结束")
        let out = {

        }
        this.broadcast(NetCmd.GAME_END, out);
    }
    //9.3
    onSendGameEnd(user: ServerUser) {

    }
}