import { GameState } from "../../Enums";
import UGameInstance from "../../GameInstance";
import { xclass, XBase, xproperty } from "../../ReflectSystem/XBase";
import { NetCmd } from "./NetCmd";
import RoomManager from "./RoomManager";
import Game from "./Sync/Game";
import User from "./User";


@xclass(Room)
export default class Room extends XBase {
    //房间ID
    @xproperty(String)
    public id: string = "";

    //用户列表
    @xproperty(Set)
    public users: Set<string> = new Set();

    //房主
    @xproperty(String)
    public owner: string = null;

    //倒计时
    @xproperty(Number)
    time = 0;

    handle: number = -1;


    public mng: RoomManager = null;

    public game: Game = null;

    public gameInstance: UGameInstance = null;

    //更新句柄
    handle_game: number = -1;
    fps: number = 60;
    clientFps = 60;
    serverFps = 10;
    frameTime: number = 0;
    frameTimer: number = 0;

    time_cur: number = 0;
    time_last: number = 0;


    /**
     * 开始更新游戏
     * 客户端晚于服务端开始游戏
     */
    startUpdateGame() {
        if (this.gameInstance.getIsClient()) {
            this.fps = this.clientFps;
        } else {
            this.fps = this.serverFps;
        }

        let world = this.gameInstance.getWorld();
        world.gameState = GameState.Playing;

        this.frameTime = 1 / this.fps;
        this.time_cur = this.time_last = this.mng.ns.getCurrentTime();


        this.handle_game = setInterval(() => {
            //计算更新频率
            this.time_cur = new Date().getTime();
            let offset = this.time_cur - this.time_last

            if (offset > this.frameTime * 1000) {

                let dt = offset / 1000;
                this.updateGame(dt);
                this.time_last = this.time_cur;
            }
            // console.log(offset);

        }, 16);
    }


    sendGameData(...args) { };
    sendBinaryGameData(...args) { };


    updateGame(dt) {
        this.gameInstance.update(dt);
    }

    endUpdateGame() {
        clearInterval(this.handle_game);
    }


    getAllUsers() {
        let users = [];
        this.users.forEach(id => {
            let user = this.mng.getUserById(id)
            users.push(user);
        });
        return users;
    }

    initGameInstance() { }

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
    onBeginGame(...args) { }
}