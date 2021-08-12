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
var Manager_1 = __importDefault(require("./Manager"));
var Room_1 = __importDefault(require("./Room"));
/**
 * 房间管理器
 * 操作放在XXX里面，onXXX处理客户端请求
 * 很多操作，既有可能来自客户端又有可能来自服务端
 * 创建房间，服务器主动创建房间
 * 加入房间，可能是服务器匹配
 * 退出房间，可能是被服务器踢出
 * 删除房间，玩家主动删除房间，服务器自动删除房间
 */
var RoomManager = /** @class */ (function (_super) {
    __extends(RoomManager, _super);
    function RoomManager() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.incId = 0;
        //房间列表
        _this.rooms = new Map();
        return _this;
    }
    RoomManager_1 = RoomManager;
    RoomManager.prototype.getRoomById = function (id) {
        return this.rooms.get(id);
    };
    RoomManager.prototype.insert = function () {
        var room = new Room_1.default();
        room.id = this.incId + "";
        this.rooms.set(room.id, room);
        this.incId++;
        return room;
    };
    //直接删除或者放回房间池
    RoomManager.prototype.delete = function (room) {
        this.rooms.delete(room.id);
    };
    //0.注册回调
    RoomManager.prototype.init = function (ns) {
        _super.prototype.init.call(this, ns);
        ns.register(NetCmd_1.NetCmd.ROOM_ADD, this.onAdd, this);
        ns.register(NetCmd_1.NetCmd.ROOM_JOIN, this.onJoin, this);
        ns.register(NetCmd_1.NetCmd.ROOM_EXIT, this.onExit, this);
        ns.register(NetCmd_1.NetCmd.ROOM_DEL, this.onDel, this);
        ns.register(NetCmd_1.NetCmd.ROOM_LIST, this.onGetList, this);
    };
    //客户端请求当前房间 简要列表
    RoomManager.prototype.onGetList = function (key, conn, obj) {
        var user = this.getUserByKey(key);
        if (!user) {
            console.log("未登录", key, obj);
            return;
        }
        var arr = [];
        this.rooms.forEach(function (room) {
            var ids = [];
            room.users.forEach(function (user, id) {
                ids.push(id);
            });
            arr.push({
                id: room.id,
                size: room.users.size,
                ids: ids
            });
        });
        user.sendCmd(NetCmd_1.NetCmd.ROOM_LIST, arr);
    };
    //创建房间请求来自客户端
    RoomManager.prototype.onAdd = function (key, conn, obj) {
        var user = this.getUserByKey(key);
        if (!user) {
            console.log("未登录", key, obj);
            return;
        }
        var room = this.insert();
        room.onAdd(user);
        console.log("用户", user.id_user, "创建房间", room.id, room.getUserCount());
    };
    //加入请求来自客户端
    RoomManager.prototype.onJoin = function (key, conn, obj) {
        var user = this.getUserByKey(key);
        if (!user) {
            console.log("未登录", key, obj);
            return;
        }
        var id_room = obj['id_room'];
        var room = this.getRoomById(id_room);
        if (!room) {
            var out = {
                code: 1,
                err: "房间不存在"
            };
            user.sendCmd(NetCmd_1.NetCmd.ROOM_JOIN, out);
        }
        else {
            room.onJoin(user);
            console.log("用户", user.id_user, "加入房间", room.id, room.getUserCount());
        }
    };
    //退出请求来自客户端
    RoomManager.prototype.onExit = function (key, conn, obj) {
        var user = this.getUserByKey(key);
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
    RoomManager.prototype.onDel = function (key, conn, obj) {
        var user = this.getUserByKey(key);
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
    var RoomManager_1;
    RoomManager.Ins = new RoomManager_1();
    __decorate([
        XBase_1.xproperty(Number)
    ], RoomManager.prototype, "incId", void 0);
    __decorate([
        XBase_1.xproperty(Map)
    ], RoomManager.prototype, "rooms", void 0);
    RoomManager = RoomManager_1 = __decorate([
        XBase_1.xclass(RoomManager_1)
    ], RoomManager);
    return RoomManager;
}(Manager_1.default));
exports.default = RoomManager;
