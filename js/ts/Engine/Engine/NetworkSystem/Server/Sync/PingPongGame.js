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
var XBase_1 = require("../../../ReflectSystem/XBase");
var StatusSyncGame_1 = __importDefault(require("./StatusSyncGame"));
/**
 * 乒乓球游戏
 * 状态同步实现
 *
 * 游戏逻辑
 * 玩家一创建组队房间
 * 玩家二加入组队房间
 *
 * 当房间人数足够时，
 *  1.通知客户端 客户端启动加载界面， 创建游戏实例，客户端创建完实例通知服务端
 *  2.服务器执行开始游戏流程，并创建游戏实例，将组队房间升级为游戏房间
 * 当所有人以及服务器 完成游戏实例创建之后，服务器将游戏初始数据发送给所有客户端，并且通知所有客户端 正式开始游戏
 *
 * 当客户端收到正式开始游戏时，加载游戏初始数据，完成后关闭加载界面，响应输入
 *
 *
 * 游戏中
 *
 * 客户端 60帧显示，数据以30帧更新
 *
 * 如果有服务器数据（因为不一定每帧都有服务器输入），用户最新的服务器的PlayerController数据包更新本地PlayerController
 *
 * 帧同步 帧更新，用PlayerController的输入更新本地世界
 * 状态同步 帧更新， 用服务器传回的状态去更新本地世界
 *
 * 帧结束，将当前PlayerController数据包给服务器
 *
 *
 * 服务器端帧 30帧处理逻辑
 * 帧开始，处理所有客户端的输入，改变输入状态，(在游戏世界中每一个用户都有一个PlayerController与之对应，PlayerController就是用户在游戏中的代理，)
 *
 * 全量帧更新，在更新过程中，将整个世界添加到数据包
 * 增量更新 帧更新, 更新所有Actor，Actor各自按照自己的逻辑进行更新，在ActorUpdate执行完成之后，如果Actor发生变化，则需要将变化封装到数据包，

 * 帧结束，将数据包进行广播
 */
var PingPongGame = /** @class */ (function (_super) {
    __extends(PingPongGame, _super);
    function PingPongGame() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PingPongGame_1 = PingPongGame;
    var PingPongGame_1;
    PingPongGame = PingPongGame_1 = __decorate([
        XBase_1.xclass(PingPongGame_1)
    ], PingPongGame);
    return PingPongGame;
}(StatusSyncGame_1.default));
exports.default = PingPongGame;
