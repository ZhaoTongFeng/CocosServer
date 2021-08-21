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
var Room_1 = __importDefault(require("../Share/Room"));
var ClientGame_1 = __importDefault(require("./Sync/ClientGame"));
var ClientRoom = /** @class */ (function (_super) {
    __extends(ClientRoom, _super);
    function ClientRoom() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ClientRoom_1 = ClientRoom;
    ClientRoom.prototype.onAdd = function (user) {
        this.gameSync = new ClientGame_1.default();
        this.owner = user.id_user;
        this.users.set(user.id_user, user);
    };
    ClientRoom.prototype.onJoin = function (user) {
        user.id_room = this.id;
        this.users.set(user.id_user, user);
    };
    ClientRoom.prototype.onExit = function (user) {
        this.users.delete(user.id_user);
        user.id_room = "";
    };
    ClientRoom.prototype.onDel = function (user) {
    };
    //转发同步数据到GameInstance
    ClientRoom.prototype.onSyncGame = function (obj, gameInstance) {
        var data = obj["data"];
        // console.log("ROOM 收到数据转发给GameInstance", data);
        gameInstance.receiveGameData(obj["data"]);
    };
    var ClientRoom_1;
    ClientRoom = ClientRoom_1 = __decorate([
        XBase_1.xclass(ClientRoom_1)
    ], ClientRoom);
    return ClientRoom;
}(Room_1.default));
exports.default = ClientRoom;
