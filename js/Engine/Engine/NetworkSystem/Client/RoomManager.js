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
var Manager_1 = __importDefault(require("./Manager"));
var NetCmd_1 = require("../Share/NetCmd");
var Room_1 = __importDefault(require("./Room"));
var UserManager_1 = __importDefault(require("./UserManager"));
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
        _this.curRoom = null;
        _this.rooms = new Map();
        //请求服务器创建一个房间
        _this.optLock = false;
        return _this;
    }
    RoomManager_1 = RoomManager;
    RoomManager.prototype.getRoomById = function (id) {
        return this.rooms.get(id);
    };
    //内部操作
    RoomManager.prototype.add = function (id_room) {
        var room = new Room_1.default();
        room.id = id_room;
        this.rooms.set(id_room, room);
        return room;
    };
    RoomManager.prototype.delete = function (room) {
        this.rooms.delete(room.id);
    };
    //0.注册回调
    RoomManager.prototype.init = function (ns) {
        _super.prototype.init.call(this, ns);
        ns.register(NetCmd_1.NetCmd.ROOM_ADD, this.onCreate, this);
        ns.register(NetCmd_1.NetCmd.ROOM_JOIN, this.onJoin, this);
        ns.register(NetCmd_1.NetCmd.ROOM_EXIT, this.onExit, this);
        ns.register(NetCmd_1.NetCmd.ROOM_DEL, this.onDel, this);
        ns.register(NetCmd_1.NetCmd.ROOM_LIST, this.onGetList, this);
    };
    //获取房间列表
    RoomManager.prototype.getList = function () {
        var out = {};
        this.ns.sendCmd(NetCmd_1.NetCmd.ROOM_LIST, out);
    };
    RoomManager.prototype.onGetList = function (obj) {
        console.log(obj);
    };
    RoomManager.prototype.isCanOpt = function () {
        if (this.optLock) {
            console.warn("操作中");
            return false;
        }
        else {
            return true;
        }
    };
    RoomManager.prototype.lockOpt = function () {
        this.optLock = true;
    };
    RoomManager.prototype.unLock = function () {
        this.optLock = false;
    };
    RoomManager.prototype.create = function () {
        if (this.curRoom != null) {
            console.warn("目前已经在有一个房间");
            return;
        }
        if (this.isCanOpt()) {
            this.lockOpt();
            var out = {};
            this.ns.sendCmd(NetCmd_1.NetCmd.ROOM_ADD, out);
            console.log("Client:请求创建房间");
        }
    };
    //服务器把房间创建好
    RoomManager.prototype.onCreate = function (obj) {
        this.unLock();
        var code = obj["code"];
        if (code != 0) {
            console.warn("Client:房间创建失败", code);
            return;
        }
        var id_room = obj["id_room"];
        var room = this.add(id_room);
        this.curRoom = room;
        room.onAdd(UserManager_1.default.Ins.locUser);
        console.log("Client:房间创建成功", room);
    };
    //请求加入一个房间
    RoomManager.prototype.join = function (id_room) {
        if (this.isCanOpt()) {
            this.lockOpt();
            if (!this.curRoom) {
                var out = {
                    id_room: id_room
                };
                this.ns.sendCmd(NetCmd_1.NetCmd.ROOM_JOIN, out);
                console.log("Client:请求加入房间", id_room);
            }
            else {
                console.log("当前房间不为空");
            }
        }
    };
    //当有人加入房间(不止是自己)
    RoomManager.prototype.onJoin = function (obj) {
        var _this = this;
        this.unLock();
        var code = obj["code"];
        if (code != 0) {
            console.warn("加入失败");
            return;
        }
        var id_user = obj["id_user"];
        var id_room = obj["id_room"];
        if (UserManager_1.default.Ins.locUser.id_user == id_user) {
            //加入者检查是否需要实例化这个房间
            var room = this.getRoomById(id_room);
            if (!room) {
                room = this.add(id_room);
            }
            this.curRoom = room;
            //并获取这个房间的最新状态，这里直接返回了，所以不需要额外去获取，但理论上，应该分开
            var ids = obj["ids"];
            ids.forEach(function (id) {
                var user = _this.getUserById(id);
                if (!user) {
                    user = UserManager_1.default.Ins.add(id_user);
                }
            });
            console.log("Client:加入房间成功", this.curRoom);
        }
        else {
            //房间其他人,只需添加这一个用户
            var user = this.getUserById(id_user);
            if (!user) {
                user = UserManager_1.default.Ins.add(id_user);
            }
            this.curRoom.onJoin(user);
            console.log("Client:XXX加入房间", this.curRoom);
        }
    };
    //退出这个房间
    RoomManager.prototype.exit = function () {
        if (this.isCanOpt()) {
            this.lockOpt();
            if (this.curRoom) {
                var out = {
                    id_room: this.curRoom.id
                };
                this.ns.sendCmd(NetCmd_1.NetCmd.ROOM_EXIT, out);
            }
            else {
                console.warn("当前房间为空");
            }
        }
    };
    //当有人退出房间(不止是自己)
    RoomManager.prototype.onExit = function (obj) {
        this.unLock();
        var code = obj["code"];
        if (code != 0) {
            console.log("退出失败");
            return;
        }
        var id_user = obj["id_user"];
        var id_room = obj["id_room"];
        var room = this.getRoomById(id_room);
        //先退出房间
        var user = this.getUserById(id_user);
        room.onExit(user);
        if (UserManager_1.default.Ins.locUser.id_user == id_user) {
            //如果是退出者
            this.curRoom = null;
            console.log("Client:退出成功", this.rooms);
        }
        else {
            //其他人
            console.log("Client:XXX退出房间", user);
        }
        if (room.users.size == 0) {
            this.delete(room);
        }
        console.log(this.rooms);
    };
    //请求删除房间
    RoomManager.prototype.del = function () {
        if (this.isCanOpt()) {
            this.lockOpt();
            if (this.curRoom) {
                var out = {
                    id_room: this.curRoom.id
                };
                this.ns.sendCmd(NetCmd_1.NetCmd.ROOM_DEL, out);
            }
        }
    };
    //删除房间请求来自客户端
    RoomManager.prototype.onDel = function (obj) {
        this.unLock();
        console.log("房间被删除", obj);
        var id_room = obj["id_room"];
        var room = this.getRoomById(id_room);
        room.onDel();
        this.delete(room);
    };
    var RoomManager_1;
    RoomManager.Ins = new RoomManager_1();
    __decorate([
        XBase_1.xproperty(Map)
    ], RoomManager.prototype, "rooms", void 0);
    RoomManager = RoomManager_1 = __decorate([
        XBase_1.xclass(RoomManager_1)
    ], RoomManager);
    return RoomManager;
}(Manager_1.default));
exports.default = RoomManager;
