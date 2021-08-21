import Game from "./ServerGame";
import ServerNetworkSystem from "../ServerNetworkSystem";
import { xclass, xproperty } from "../../../ReflectSystem/XBase";
import Manager from "../../Share/Manager";


/**
 * TODO 暂时不要做这个，一个游戏一个服务器，如果游戏有多个模式，则通过GameMode进行区别
 * 玩家开始一个新游戏有两种模式
 *  房间模式
 *      组队模式(英雄联盟,绝地求生)
 *      组队：1.玩家先创建一个房间，然后可以邀请好友加入（组队房间），2.玩家加入一个房间
 *      匹配：寻找两个（多个）实力相近的房间
 *      游戏准备：将所有房间全部合并到一个房间（游戏房间），编上TeamId
 *      游戏中：对房间内的游戏数据进行同步
 * 
 * 游戏管理器
 *      一个服务器上可能跑多个游戏（注意是截然不同的两个游戏，而不是相同游戏的不同模式）
 *      比如客户端有一个 吃鸡和一个英雄联盟，服务端同时在跑一个吃鸡和英雄联盟，玩家创建一个游戏房间，将根据玩家传入的游戏ID选择对应游戏，
 *      这种是概念对于游戏平台来说的，比如Stream，一个服务器运行不同游戏，一般一个服务器跑一种游戏就可以了
 *      对于一把游戏，只需要在游戏开始时创建一个类型的游戏房间即可，不需要传入什么游戏ID。
 */
@xclass(ServerGameManager)
export default class ServerGameManager extends Manager {
    @xproperty(Map)
    gameMap: Map<string, Game> = new Map();

    //0.注册回调
    init(ns: ServerNetworkSystem) {
        super.init(ns);

    }

    onAdd(key, conn, obj) {

    }

    onJoin(key, conn, obj) {

    }

    onExit(key, conn, obj) {

    }

    onDel(key, conn, obj) {

    }


    //准备阶段
    prePlay() {

    }
    onPrePlay() {

    }

    //开始游戏
    startPlay() {

    }
    onoStart() {

    }

    //游戏运行时
    playing() {

    }

    //游戏结束时
    endPlay() {

    }
    onEndPlay() {

    }
}