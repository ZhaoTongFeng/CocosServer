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
var CCWorldViewBase_1 = __importDefault(require("../../Engine/Engine/Cocos/CCWorldViewBase"));
var ClientNetworkSystem_1 = __importDefault(require("../../Engine/Engine/NetworkSystem/Client/ClientNetworkSystem"));
var NetCmd_1 = require("../../Engine/Engine/NetworkSystem/Share/NetCmd");
var FireButton_1 = __importDefault(require("./Other/FireButton"));
/**
 * 负责将Logic-View适配
 */
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var CCWorldView = /** @class */ (function (_super) {
    __extends(CCWorldView, _super);
    function CCWorldView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.loadingLabel = null;
        _this.fireButton = null;
        _this.time = 0;
        _this.handle = -1;
        return _this;
    }
    CCWorldView.prototype.onLoad = function () {
        _super.prototype.onLoad.call(this);
        var network = ClientNetworkSystem_1.default.Ins;
        network.on(NetCmd_1.NetCmd.GAME_READY + "", this.onGameReady, this);
        network.on(NetCmd_1.NetCmd.GAME_LOADLEVEL + "", this.onGameLoadLevel, this);
        network.on(NetCmd_1.NetCmd.GAME_PLAY + "", this.onGamePlay, this);
        network.on(NetCmd_1.NetCmd.GAME_SEND_CLIENT + "", this.onGameSendClient, this);
        network.on(NetCmd_1.NetCmd.GAME_SEND_SERVER + "", this.onGameSendServer, this);
        network.on(NetCmd_1.NetCmd.GAME_FINISH + "", this.onGameFinish, this);
        network.on(NetCmd_1.NetCmd.GAME_RESULT + "", this.onGameResult, this);
        network.on(NetCmd_1.NetCmd.GAME_END + "", this.onGameEnd, this);
        this.initGameInstance();
    };
    CCWorldView.prototype.initGameInstance = function () {
        var network = ClientNetworkSystem_1.default.Ins;
        var roomManager = network.roomManager;
        var room = roomManager.getLocRoom();
        var gameInstance = room.initGameInstance();
        gameInstance.setWorldView(this.worldView);
    };
    CCWorldView.prototype.onGameReady = function (obj) {
    };
    CCWorldView.prototype.onGameLoadLevel = function (obj) {
        this.loadingLabel.string = "加载关卡中";
    };
    CCWorldView.prototype.onGamePlay = function (obj) {
        var _this = this;
        console.log("开始游戏，关掉Loading");
        this.time = 1;
        this.handle = setInterval(function () {
            _this.time -= 1;
            _this.loadingLabel.string = _this.time + "秒后开始游戏";
        }, 1000);
        setTimeout(function () {
            clearInterval(_this.handle);
            _this.loadingLabel.node.destroy();
        }, this.timer * 1000);
    };
    CCWorldView.prototype.updateInput = function () {
        _super.prototype.updateInput.call(this);
        if (this.fireButton) {
            this.worldView.gameInstance.input.isPassFireButton = this.fireButton.isPass;
        }
    };
    CCWorldView.prototype.onGameSendClient = function (obj) {
    };
    CCWorldView.prototype.onGameSendServer = function (obj) {
    };
    CCWorldView.prototype.onGameFinish = function (obj) {
    };
    CCWorldView.prototype.onGameResult = function (obj) {
    };
    CCWorldView.prototype.onGameEnd = function (obj) {
    };
    __decorate([
        property(cc.Label)
    ], CCWorldView.prototype, "loadingLabel", void 0);
    __decorate([
        property(FireButton_1.default)
    ], CCWorldView.prototype, "fireButton", void 0);
    CCWorldView = __decorate([
        ccclass
    ], CCWorldView);
    return CCWorldView;
}(CCWorldViewBase_1.default));
exports.default = CCWorldView;
