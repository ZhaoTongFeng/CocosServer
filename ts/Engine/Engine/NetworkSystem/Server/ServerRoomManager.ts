import { xclass, xproperty, xStatusSync } from "../../ReflectSystem/XBase";
import { NetCmd } from "../Share/NetCmd";
import RoomManager from "../Share/RoomManager";
import ServerNetworkSystem from "./ServerNetworkSystem";
import ServerRoom from "./ServerRoom";

import ServerUserManager from "./ServerUserManager";




/**
 * 房间管理器
 * 操作放在XXX里面，onXXX处理客户端请求
 * 很多操作，既有可能来自客户端又有可能来自服务端
 * 创建房间，服务器主动创建房间
 * 加入房间，可能是服务器匹配
 * 退出房间，可能是被服务器踢出
 * 删除房间，玩家主动删除房间，服务器自动删除房间
 */
@xclass(ServerRoomManager)
export default class ServerRoomManager extends RoomManager {
    protected incId: number = 0;

    public getRoomById(id: string) {
        return this.rooms.get(id);
    }
    public insert(id_room) {
        let room = new ServerRoom();
        room.id = id_room;
        room.mng = this;
        this.rooms.set(room.id, room);

        // this.incId++;
        return room;
    }

    //直接删除或者放回房间池
    public delete(room: ServerRoom) {
        this.rooms.delete(room.id);
    }

    //0.注册回调
    public init(ns: ServerNetworkSystem) {
        super.init(ns);
        
    }

    //客户端请求当前房间 简要列表
    public onGetList(key, conn, obj) {
        let userMng = this.ns.userManager as ServerUserManager;
        let user = userMng.getUserByKey(key);
        if (!user) {
            console.log("未登录", key, obj)
            return;
        }

        let out = {
            data: this.toJSON()
        }

        // let arr = [];
        // this.rooms.forEach(room => {
        //     let ids = [];
        //     room.users.forEach((user, id) => {
        //         ids.push(id);
        //     });
        //     arr.push({
        //         id: room.id,
        //         size: room.users.size,
        //         ids: ids
        //     });
        // });
        user.sendCmd(NetCmd.ROOM_LIST, out);
    }


    public onGetRoomInfo(key, conn, obj) {

    }



    //创建房间请求来自客户端
    protected onCreate(key, conn, obj) {
        let userMng = this.ns.userManager as ServerUserManager;
        let user = userMng.getUserByKey(key);
        if (!user) {
            console.log("未登录", key, obj)
            return;
        }
        let id_room = "abc";
        let room = this.insert(id_room);
        room.onAdd(user);
        console.log("用户", user.id_user, "创建房间", room.id, room.getUserCount());
    }

    //加入请求来自客户端
    protected onJoin(key, conn, obj) {
        let userMng = this.ns.userManager as ServerUserManager;
        let user = userMng.getUserByKey(key);
        if (!user) {
            console.log("未登录", key, obj)
            return;
        }

        let id_room = obj['id_room'];
        let room = this.getRoomById(id_room);
        if (!room) {
            //房间不存在，创建房间
            room = this.insert(id_room);
            room.onAdd(user);
            console.log("用户", user.id_user, "创建房间", room.id, room.getUserCount());
            // let out = {
            //     code: 1,
            //     err: "房间不存在"
            // }
            // user.sendCmd(NetCmd.ROOM_JOIN, out);
        } else {

        }
        room.onJoin(user);
        console.log("用户", user.id_user, "加入房间", room.id, room.getUserCount());
    }

    //退出请求来自客户端
    protected onExit(key, conn, obj) {
        let userMng = this.ns.userManager as ServerUserManager;
        let user = userMng.getUserByKey(key);
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
    protected onDel(key, conn, obj) {
        let userMng = this.ns.userManager as ServerUserManager;
        let user = userMng.getUserByKey(key);
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

    /**
     * 准备阶段
     */
    //1.2客户端要求开始游戏
    protected onGameBeg(key, conn, obj) {
        
        let userMng = this.ns.userManager as ServerUserManager;
        let user = userMng.getUserByKey(key);
        if (!user) {
            console.log("未登录", key, obj)
            return;
        }
        let id_room = "abc";
        let room = this.getRoomById(id_room) as ServerRoom;
        room.onGameBeg(user);
    }

    //2.2客户端进入游戏场景，准备接受关卡数据
    protected onGameReady(key, conn, obj) {
        
        let userMng = this.ns.userManager as ServerUserManager;
        let user = userMng.getUserByKey(key);
        if (!user) {
            console.log("未登录", key, obj)
            return;
        }
        let id_room = "abc";
        let room = this.getRoomById(id_room) as ServerRoom;
        room.onGameReady(user);
    }

    //3.3客户端接收关卡数据完成
    protected onLoadLevelData(key, conn, obj) {
        let userMng = this.ns.userManager as ServerUserManager;
        let user = userMng.getUserByKey(key);
        if (!user) {
            console.log("未登录", key, obj)
            return;
        }
        let id_room = "abc";
        let room = this.getRoomById(id_room) as ServerRoom;
        room.onLoadLevelData(user);
    }
    
    //4.3客户端开始游戏
    protected onGamePlay(key, conn, obj) {
       
        let userMng = this.ns.userManager as ServerUserManager;
        let user = userMng.getUserByKey(key);
        if (!user) {
            console.log("未登录", key, obj)
            return;
        }
        let id_room = "abc";
        let room = this.getRoomById(id_room) as ServerRoom;
        room.onGamePlay(user);
    }

    /**
     * 同步阶段
     */
    //5.2客户端发送操作指令
    protected onReceiveGameData(key, conn, obj) {
        // console.log("客户端发送指令")
        let userMng = this.ns.userManager as ServerUserManager;
        let user = userMng.getUserByKey(key);
        if (!user) {
            console.log("未登录", key, obj)
            return;
        }
        let id_room = "abc";
        let room = this.getRoomById(id_room) as ServerRoom;
        room.onReceiveGameData(user,obj);
    }



    /**
     * 结算阶段
     */
    //7.3
    protected onSendGameFinish(key, conn, obj) {
        console.log("客户端收到游戏结束")
        let userMng = this.ns.userManager as ServerUserManager;
        let user = userMng.getUserByKey(key);
        if (!user) {
            console.log("未登录", key, obj)
            return;
        }
        let id_room = "abc";
        let room = this.getRoomById(id_room) as ServerRoom;
        room.onSendGameFinish(user);
    }

    //8.3
    protected onSendGameResult(key, conn, obj) {
        console.log("客户端收到游戏结果")
        let userMng = this.ns.userManager as ServerUserManager;
        let user = userMng.getUserByKey(key);
        if (!user) {
            console.log("未登录", key, obj)
            return;
        }
        let id_room = "abc";
        let room = this.getRoomById(id_room) as ServerRoom;
        room.onSendGameResult(user);
    }

    //9.3
    protected onSendGameEnd(key, conn, obj) {
        console.log("客户端收到游戏彻底结束")
        let userMng = this.ns.userManager as ServerUserManager;
        let user = userMng.getUserByKey(key);
        if (!user) {
            console.log("未登录", key, obj)
            return;
        }
        let id_room = "abc";
        let room = this.getRoomById(id_room) as ServerRoom;
        room.onSendGameEnd(user);
    }




    protected onSyncGame(key, conn, obj) {
        // this.curRoom.onSyncGame(obj, this.gameInstance);
    }

}