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
var ClientNetworkSystem_1 = __importDefault(require("../../../Engine/Engine/NetworkSystem/Client/ClientNetworkSystem"));
var NetCmd_1 = require("../../../Engine/Engine/NetworkSystem/Share/NetCmd");
var NetworkSystem_1 = __importDefault(require("../../../Engine/Engine/NetworkSystem/Share/NetworkSystem"));
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
/**
 * 启动页，网络连接成功之后，跳转目标场景
 */
var Home = /** @class */ (function (_super) {
    __extends(Home, _super);
    function Home() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.label = null;
        return _this;
    }
    Home.prototype.onLoad = function () {
        var _this = this;
        NetworkSystem_1.default.isServer = false;
        ClientNetworkSystem_1.default.Ins = new ClientNetworkSystem_1.default();
        // cc.game.addPersistRootNode(this.node);
        this.label.string = "正在连接服务器";
        setTimeout(function () {
            //1.连接网络
            var network = ClientNetworkSystem_1.default.Ins;
            network.init();
            network.on(NetCmd_1.NetCmd.HELLOW + "", _this.onConnect, _this);
            network.connect();
        }, 1000);
    };
    Home.prototype.onConnect = function (obj) {
        var _this = this;
        //2.跳转场景
        this.label.string = "连接成功，正在进入房间";
        setTimeout(function () {
            var network = ClientNetworkSystem_1.default.Ins;
            network.targetOff(_this);
            cc.director.loadScene("Room1");
        }, 1000);
    };
    __decorate([
        property(cc.Label)
    ], Home.prototype, "label", void 0);
    Home = __decorate([
        ccclass
    ], Home);
    return Home;
}(cc.Component));
exports.default = Home;
