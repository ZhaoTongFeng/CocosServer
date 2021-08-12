"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetCmd = void 0;
var NetCmd;
(function (NetCmd) {
    NetCmd[NetCmd["HELLOW"] = 0] = "HELLOW";
    NetCmd[NetCmd["LOGIN"] = 1] = "LOGIN";
    NetCmd[NetCmd["HEART"] = 2] = "HEART";
    NetCmd[NetCmd["ROOM_ADD"] = 3] = "ROOM_ADD";
    NetCmd[NetCmd["ROOM_JOIN"] = 4] = "ROOM_JOIN";
    NetCmd[NetCmd["ROOM_EXIT"] = 5] = "ROOM_EXIT";
    NetCmd[NetCmd["ROOM_DEL"] = 6] = "ROOM_DEL";
    NetCmd[NetCmd["ROOM_LIST"] = 7] = "ROOM_LIST";
    NetCmd[NetCmd["SYNC_GAME"] = 8] = "SYNC_GAME";
})(NetCmd = exports.NetCmd || (exports.NetCmd = {}));
