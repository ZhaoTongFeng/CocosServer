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
var RoomManager_1 = __importDefault(require("./RoomManager"));
var Room = /** @class */ (function (_super) {
    __extends(Room, _super);
    function Room() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //房间ID
        _this.id = "";
        //用户列表
        _this.users = new Map();
        //房主
        _this.owner = null;
        return _this;
    }
    Room_1 = Room;
    Room.prototype.getUserCount = function () {
        return this.users.size;
    };
    //房间广播
    Room.prototype.broadcast = function (cmd, obj) {
        try {
            this.users.forEach(function (user) {
                user.sendCmd(cmd, obj);
            });
        }
        catch (error) {
            console.log(error);
        }
    };
    //玩家创建房间
    Room.prototype.onAdd = function (user) {
        //记录房主信息，并直接将房主添加到房间
        this.owner = user.id_user;
        this.users.set(user.id_user, user);
        //返回房间号
        var out = {
            code: 0,
            id_room: this.id
        };
        user.sendCmd(NetCmd_1.NetCmd.ROOM_ADD, out);
    };
    //玩家加入房间
    Room.prototype.onJoin = function (user) {
        if (user.id_room == this.id) {
            var out_1 = {
                code: 2,
                err: "已加入该房间"
            };
            user.sendCmd(NetCmd_1.NetCmd.ROOM_JOIN, out_1);
            return;
        }
        //先通知已经在房间内的用户,有新玩家进，房间内的用户，只需要去获取这个新用户数据即可
        var out = {
            code: 0,
            id_user: user.id_user,
            id_room: this.id
        };
        this.broadcast(NetCmd_1.NetCmd.ROOM_JOIN, out);
        //注意，这里是广播之后再添加的
        user.id_room = this.id;
        this.users.set(user.id_user, user);
        //然后通知加入者，将房间信息发送给它
        var ids = [];
        this.users.forEach(function (user, id) {
            ids.push(id);
        });
        out["ids"] = ids;
        user.sendCmd(NetCmd_1.NetCmd.ROOM_JOIN, out);
    };
    //玩家退出房间
    Room.prototype.onExit = function (user) {
        //如果是房主寻找下一继承人
        var _this = this;
        if (user.id_user == this.owner && this.users.size > 0) {
            this.owner = "";
            this.users.forEach(function (user, id) {
                _this.owner = user.id_user;
                console.log("房主更换为", _this.id, _this.owner);
                return;
            });
        }
        user.id_room = "";
        var out = {
            code: 0,
            id_user: user.id_user,
            id_room: this.id,
            owner: this.owner
        };
        this.broadcast(NetCmd_1.NetCmd.ROOM_EXIT, out);
        //广播之后再删除
        this.users.delete(user.id_user);
        //如果房间一个人都没有了，则删除这个房间（或者放回房间池里）
        if (this.users.size == 0) {
            RoomManager_1.default.Ins.delete(this);
        }
    };
    //房间被删除
    Room.prototype.onDel = function (user) {
        this.users.forEach(function (user, id) {
            user.id_room = "";
        });
        var out = {
            id_room: this.id
        };
        this.broadcast(NetCmd_1.NetCmd.ROOM_DEL, out);
        this.users.clear();
        RoomManager_1.default.Ins.delete(this);
    };
    var Room_1;
    __decorate([
        XBase_1.xproperty(String)
    ], Room.prototype, "id", void 0);
    __decorate([
        XBase_1.xproperty(Map)
    ], Room.prototype, "users", void 0);
    Room = Room_1 = __decorate([
        XBase_1.xclass(Room_1)
    ], Room);
    return Room;
}(XBase_1.XBase));
exports.default = Room;
