"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var XBase_1 = require("../../ReflectSystem/XBase");
var NetCmd_1 = require("../Share/NetCmd");
var RoomManager_1 = __importDefault(require("../Share/RoomManager"));
var ServerRoom_1 = __importDefault(require("./ServerRoom"));
/**
 * 房间管理器
 * 操作放在XXX里面，onXXX处理客户端请求
 * 很多操作，既有可能来自客户端又有可能来自服务端
 * 创建房间，服务器主动创建房间
 * 加入房间，可能是服务器匹配
 * 退出房间，可能是被服务器踢出
 * 删除房间，玩家主动删除房间，服务器自动删除房间
 */
var ServerRoomManager = /** @class */ (function (_super) {
    __extends(ServerRoomManager, _super);
    function ServerRoomManager() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.incId = 0;
        return _this;
    }
    ServerRoomManager_1 = ServerRoomManager;
    ServerRoomManager.prototype.getRoomById = function (id) {
        return this.rooms.get(id);
    };
    ServerRoomManager.prototype.insert = function (id_room) {
        var room = new ServerRoom_1.default();
        room.id = id_room;
        room.mng = this;
        this.rooms.set(room.id, room);
        // this.incId++;
        return room;
    };
    //直接删除或者放回房间池
    ServerRoomManager.prototype.delete = function (room) {
        this.rooms.delete(room.id);
    };
    //0.注册回调
    ServerRoomManager.prototype.init = function (ns) {
        _super.prototype.init.call(this, ns);
    };
    //客户端请求当前房间 简要列表
    ServerRoomManager.prototype.onGetList = function (key, conn, obj) {
        var userMng = this.ns.userManager;
        var user = userMng.getUserByKey(key);
        if (!user) {
            console.log("未登录", key, obj);
            return;
        }
        var out = {
            data: this.toJSON()
        };
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
        user.sendCmd(NetCmd_1.NetCmd.ROOM_LIST, out);
    };
    ServerRoomManager.prototype.onGetRoomInfo = function (key, conn, obj) {
    };
    //创建房间请求来自客户端
    ServerRoomManager.prototype.onCreate = function (key, conn, obj) {
        var userMng = this.ns.userManager;
        var user = userMng.getUserByKey(key);
        if (!user) {
            console.log("未登录", key, obj);
            return;
        }
        var id_room = "abc";
        var room = this.insert(id_room);
        room.onAdd(user);
        console.log("用户", user.id_user, "创建房间", room.id, room.getUserCount());
    };
    //加入请求来自客户端
    ServerRoomManager.prototype.onJoin = function (key, conn, obj) {
        var userMng = this.ns.userManager;
        var user = userMng.getUserByKey(key);
        if (!user) {
            console.log("未登录", key, obj);
            return;
        }
        var id_room = obj['id_room'];
        var room = this.getRoomById(id_room);
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
        }
        else {
        }
        room.onJoin(user);
        console.log("用户", user.id_user, "加入房间", room.id, room.getUserCount());
    };
    //退出请求来自客户端
    ServerRoomManager.prototype.onExit = function (key, conn, obj) {
        var userMng = this.ns.userManager;
        var user = userMng.getUserByKey(key);
        if (!user) {
            console.log("未登录", key, obj);
            return;
        }
        var id_room = user.id_room;
        var room = this.getRoomById(id_room);
        if (!room) {
            var out = {
                code: 1,
                err: "房间不存在"
            };
            user.sendCmd(NetCmd_1.NetCmd.ROOM_EXIT, out);
        }
        else {
            room.onExit(user);
            console.log("用户", user.id_user, "退出房间", room.id, room.getUserCount());
        }
    };
    //删除房间请求来自客户端
    ServerRoomManager.prototype.onDel = function (key, conn, obj) {
        var userMng = this.ns.userManager;
        var user = userMng.getUserByKey(key);
        if (!user) {
            console.log("未登录", key, obj);
            return;
        }
        var id_room = user.id_room;
        var room = this.getRoomById(id_room);
        if (!room) {
            var out = {
                code: 1,
                err: "房间不存在"
            };
            user.sendCmd(NetCmd_1.NetCmd.ROOM_DEL, out);
        }
        else {
            room.onDel(user);
            this.rooms.delete(id_room);
            console.log("用户", user.id_user, "退出房间", room.id, room.getUserCount());
        }
    };
    /**
     * 准备阶段
     */
    //1.2客户端要求开始游戏
    ServerRoomManager.prototype.onGameBeg = function (key, conn, obj) {
        var userMng = this.ns.userManager;
        var user = userMng.getUserByKey(key);
        if (!user) {
            console.log("未登录", key, obj);
            return;
        }
        var id_room = "abc";
        var room = this.getRoomById(id_room);
        room.onGameBeg(user);
    };
    //2.2客户端进入游戏场景，准备接受关卡数据
    ServerRoomManager.prototype.onGameReady = function (key, conn, obj) {
        var userMng = this.ns.userManager;
        var user = userMng.getUserByKey(key);
        if (!user) {
            console.log("未登录", key, obj);
            return;
        }
        var id_room = "abc";
        var room = this.getRoomById(id_room);
        room.onGameReady(user);
    };
    //3.3客户端接收关卡数据完成
    ServerRoomManager.prototype.onLoadLevelData = function (key, conn, obj) {
        var userMng = this.ns.userManager;
        var user = userMng.getUserByKey(key);
        if (!user) {
            console.log("未登录", key, obj);
            return;
        }
        var id_room = "abc";
        var room = this.getRoomById(id_room);
        room.onLoadLevelData(user);
    };
    //4.3客户端开始游戏
    ServerRoomManager.prototype.onGamePlay = function (key, conn, obj) {
        var userMng = this.ns.userManager;
        var user = userMng.getUserByKey(key);
        if (!user) {
            console.log("未登录", key, obj);
            return;
        }
        var id_room = "abc";
        var room = this.getRoomById(id_room);
        room.onGamePlay(user);
    };
    /**
     * 同步阶段
     */
    //5.2客户端发送操作指令
    ServerRoomManager.prototype.onReceiveGameData = function (key, conn, obj) {
        // console.log("客户端发送指令")
        var userMng = this.ns.userManager;
        var user = userMng.getUserByKey(key);
        if (!user) {
            console.log("未登录", key, obj);
            return;
        }
        var id_room = "abc";
        var room = this.getRoomById(id_room);
        room.onReceiveGameData(user, obj);
    };
    /**
     * 结算阶段
     */
    //7.3
    ServerRoomManager.prototype.onSendGameFinish = function (key, conn, obj) {
        console.log("客户端收到游戏结束");
        var userMng = this.ns.userManager;
        var user = userMng.getUserByKey(key);
        if (!user) {
            console.log("未登录", key, obj);
            return;
        }
        var id_room = "abc";
        var room = this.getRoomById(id_room);
        room.onSendGameFinish(user);
    };
    //8.3
    ServerRoomManager.prototype.onSendGameResult = function (key, conn, obj) {
        console.log("客户端收到游戏结果");
        var userMng = this.ns.userManager;
        var user = userMng.getUserByKey(key);
        if (!user) {
            console.log("未登录", key, obj);
            return;
        }
        var id_room = "abc";
        var room = this.getRoomById(id_room);
        room.onSendGameResult(user);
    };
    //9.3
    ServerRoomManager.prototype.onSendGameEnd = function (key, conn, obj) {
        console.log("客户端收到游戏彻底结束");
        var userMng = this.ns.userManager;
        var user = userMng.getUserByKey(key);
        if (!user) {
            console.log("未登录", key, obj);
            return;
        }
        var id_room = "abc";
        var room = this.getRoomById(id_room);
        room.onSendGameEnd(user);
    };
    ServerRoomManager.prototype.onSyncGame = function (key, conn, obj) {
        // this.curRoom.onSyncGame(obj, this.gameInstance);
    };
    var ServerRoomManager_1;
    ServerRoomManager = ServerRoomManager_1 = __decorate([
        XBase_1.xclass(ServerRoomManager_1)
    ], ServerRoomManager);
    return ServerRoomManager;
}(RoomManager_1.default));
exports.default = ServerRoomManager;
