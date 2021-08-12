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
Object.defineProperty(exports, "__esModule", { value: true });
var XBase_1 = require("../../ReflectSystem/XBase");
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
    //玩家创建房间
    Room.prototype.onAdd = function (user) {
        //记录房主信息
        this.owner = user;
        this.users.set(user.id_user, user);
    };
    //玩家加入房间
    Room.prototype.onJoin = function (user) {
        user.id_room = this.id;
        this.users.set(user.id_user, user);
    };
    //玩家退出房间
    Room.prototype.onExit = function (user) {
        this.users.delete(user.id_user);
        user.id_room = "";
    };
    //房间被删除
    Room.prototype.onDel = function () {
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
