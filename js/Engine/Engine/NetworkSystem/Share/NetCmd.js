"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetCmd = void 0;
var NetCmd;
(function (NetCmd) {
    //连接、用户效验
    NetCmd[NetCmd["HELLOW"] = 0] = "HELLOW";
    NetCmd[NetCmd["LOGIN"] = 1] = "LOGIN";
    NetCmd[NetCmd["HEART"] = 2] = "HEART";
    //游戏房间
    NetCmd[NetCmd["ROOM_ADD"] = 3] = "ROOM_ADD";
    NetCmd[NetCmd["ROOM_JOIN"] = 4] = "ROOM_JOIN";
    NetCmd[NetCmd["ROOM_EXIT"] = 5] = "ROOM_EXIT";
    NetCmd[NetCmd["ROOM_DEL"] = 6] = "ROOM_DEL";
    NetCmd[NetCmd["ROOM_LIST"] = 7] = "ROOM_LIST";
    NetCmd[NetCmd["USER_LIST"] = 20] = "USER_LIST";
    //游戏场景内
    //对于玩家操控的东西，采用状态同步
    //玩家移动，转向，每一帧同步到所有玩家，
    //对于子弹这样自动的东西，采用RPC同步
    //当玩家发射子弹时，发送一条发射指令，包含发射物信息，服务器广播给所有客户端，客户端收到指令，再创建子弹
    //子弹移动过程，完全由两边同时模拟，服务端不用发送子弹的运动轨迹，碰撞检测，放在服务器，子弹只有两条指令，生成和销毁
    //如果发生碰撞，则在服务器上，对伤害进行处理，并通知客户端，这个子弹被销毁，并在碰撞点产生爆炸效果
    NetCmd[NetCmd["GAME_BEGIN"] = 100] = "GAME_BEGIN";
    NetCmd[NetCmd["GAME_READY"] = 101] = "GAME_READY";
    NetCmd[NetCmd["GAME_LOADLEVEL"] = 102] = "GAME_LOADLEVEL";
    NetCmd[NetCmd["GAME_ALREADYLOADLEVEL"] = 103] = "GAME_ALREADYLOADLEVEL";
    NetCmd[NetCmd["GAME_PLAY"] = 104] = "GAME_PLAY";
    NetCmd[NetCmd["GAME_SEND_CLIENT"] = 105] = "GAME_SEND_CLIENT";
    NetCmd[NetCmd["GAME_SEND_SERVER"] = 106] = "GAME_SEND_SERVER";
    NetCmd[NetCmd["GAME_FINISH"] = 107] = "GAME_FINISH";
    NetCmd[NetCmd["GAME_RESULT"] = 108] = "GAME_RESULT";
    NetCmd[NetCmd["GAME_END"] = 109] = "GAME_END";
    NetCmd[NetCmd["GAME_SEND_BINARY"] = 110] = "GAME_SEND_BINARY";
    //开发者接口
    NetCmd[NetCmd["DEV_SERVER_STATUS"] = 500] = "DEV_SERVER_STATUS";
})(NetCmd = exports.NetCmd || (exports.NetCmd = {}));
