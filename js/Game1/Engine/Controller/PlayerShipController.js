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
exports.APlayerShipControllerProtocol = void 0;
var PlayerController_1 = __importDefault(require("../../../Engine/Actor/Controller/PlayerController"));
var Protocol_1 = require("../../../Engine/Engine/NetworkSystem/Share/Protocol");
var XBase_1 = require("../../../Engine/Engine/ReflectSystem/XBase");
var UMath_1 = require("../../../Engine/Engine/UMath");
//申明一个状态同步的协议
var APlayerShipControllerProtocol = /** @class */ (function (_super) {
    __extends(APlayerShipControllerProtocol, _super);
    function APlayerShipControllerProtocol() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //1.定义数据访问格式，不一定只有一个，按照需要读写的数据来决定
        _this.viewBuffer = undefined;
        return _this;
    }
    //0.定义数据信息
    APlayerShipControllerProtocol.prototype.init = function () {
        this.dataLength = 4;
    };
    APlayerShipControllerProtocol.prototype.initView = function () {
        this.viewBuffer = this.getUint8(this.headLength, this.dataLength);
    };
    //读写数据，并进行自定义压缩
    APlayerShipControllerProtocol.prototype.setMoveForce = function (v) { this.viewBuffer[0] = this.zip01(v); };
    APlayerShipControllerProtocol.prototype.getMoveForce = function () { return this.unZip01(this.viewBuffer[0]); };
    APlayerShipControllerProtocol.prototype.setMoveX = function (v) { this.viewBuffer[1] = this.zip11(v); };
    APlayerShipControllerProtocol.prototype.getMoveX = function () { return this.unZip11(this.viewBuffer[1]); };
    APlayerShipControllerProtocol.prototype.setMoveY = function (v) { this.viewBuffer[2] = this.zip11(v); };
    APlayerShipControllerProtocol.prototype.getMoveY = function () { return this.unZip11(this.viewBuffer[2]); };
    APlayerShipControllerProtocol.prototype.setFireState = function (v) { this.viewBuffer[3] = this.zipBool(v); };
    APlayerShipControllerProtocol.prototype.getFireState = function () { return this.unZipBool(this.viewBuffer[3]); };
    return APlayerShipControllerProtocol;
}(Protocol_1.Protocol));
exports.APlayerShipControllerProtocol = APlayerShipControllerProtocol;
/**
 * 玩家控制器
 * 将玩家输入转入控制器，其它组件根据控制器获取玩家输入，进行更新
 * 注意 只记录状态，不要处理任何逻辑。因为逻辑可能在服务端更新
 */
var APlayerShipController = /** @class */ (function (_super) {
    __extends(APlayerShipController, _super);
    function APlayerShipController() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //移动方向
        _this.moveDirection = UMath_1.uu.v2();
        _this.moveForce = 0;
        //开火方向
        _this.fireDirection = UMath_1.UVec2.ZERO();
        //是否处于开火状态
        _this.isFire = false;
        return _this;
        //暂时不要删除，后面写博客的时候，用这个JSON版本。
        // flootRate = 127;
        // sendJSON(input) {
        //     let obj = {};
        //     let needSend = false;
        //     if (this.moveForce != input.leftJoyRate) {
        //         this.moveForce = input.leftJoyRate;
        //         obj["1"] = Math.floor(this.moveForce * this.flootRate)
        //         needSend = true;
        //     }
        //     if (this.moveDirection.equals(input.leftJoyDir) == false) {
        //         obj["2"] = Math.floor(this.moveDirection.x * this.flootRate)
        //         obj["3"] = Math.floor(this.moveDirection.y * this.flootRate)
        //         this.moveDirection = input.leftJoyDir;
        //         needSend = true;
        //     }
        //     if (this.isFire != input.isPassFireButton) {
        //         this.isFire = input.isPassFireButton;
        //         obj["4"] = this.isFire;
        //         needSend = true;
        //     }
        //     if (needSend) {
        //         this.world.gameInstance.sendGameData(obj, this);
        //     }
        // }
        // //SERVER
        // receiveData(obj: Object) {
        //     if (obj["1"] != undefined) {
        //         this.moveForce = obj["1"] / this.flootRate;
        //     }
        //     if (obj["2"] != undefined && obj["3"] != undefined) {
        //         this.moveDirection.x = obj["2"] / this.flootRate;
        //         this.moveDirection.y = obj["3"] / this.flootRate;
        //     }
        //     if (obj["4"] != undefined) {
        //         this.isFire = obj["4"];
        //     }
        // }
    }
    APlayerShipController_1 = APlayerShipController;
    //返回适配的网络协议
    APlayerShipController.prototype.getProtocol = function (id, sys) { return new APlayerShipControllerProtocol(id, sys); };
    //返回池里时主要是断开链接
    APlayerShipController.prototype.unUse = function () {
        _super.prototype.unUse.call(this);
    };
    //从池里取出时 恢复数据为默认值
    APlayerShipController.prototype.reUse = function () {
        _super.prototype.reUse.call(this);
        this.moveDirection.x = 0;
        this.moveDirection.y = 0;
        this.moveForce = 0;
        this.fireDirection.x = 0;
        this.fireDirection.y = 0;
        this.isFire = false;
    };
    //CLIENT
    APlayerShipController.prototype.processSelfInput = function (input) {
        if (this.world.isClient && this == this.world.playerController) {
            //如果是网络同步模式，把数据传输出去
            if (!this.world.gameInstance.bStandAlone) {
                this.sendBinary(input);
            }
            //不管是不是单机模式，都要保证本地的输入及时的更新
            this.moveForce = input.leftJoyRate;
            this.moveDirection = input.leftJoyDir;
            this.isFire = input.isPassFireButton;
            // console.log(this.moveForce, this.moveDirection.x, this.moveDirection.y);
        }
    };
    //SERVER ONLY 
    //服务器接收二进制数据，用客户端的数据更新控制器状态。理论上客户端不会受到其它任何玩家（包含AI玩家）的输入。
    APlayerShipController.prototype.receiveBinary = function (protocol) {
        this.moveForce = protocol.getMoveForce();
        this.moveDirection.x = protocol.getMoveX();
        this.moveDirection.y = protocol.getMoveY();
        this.isFire = protocol.getFireState();
    };
    //注意，为了尽量减少发送的数据，需要先和上一帧的数据进行比较，然后再发送
    APlayerShipController.prototype.sendBinary = function (input) {
        var needSend = false;
        var protocol = this.getProtocol(this.id, this.world.gameInstance.protocolSystem);
        protocol.requestBufferView();
        if (this.moveForce != input.leftJoyRate) {
            needSend = true;
        }
        if (this.moveDirection.equals(input.leftJoyDir) == false) {
            needSend = true;
        }
        if (this.isFire != input.isPassFireButton) {
            needSend = true;
        }
        if (!needSend) {
            protocol.unRequestBufferView();
        }
        else {
            protocol.setMoveForce(input.leftJoyRate);
            protocol.setMoveX(input.leftJoyDir.x);
            protocol.setMoveY(input.leftJoyDir.y);
            protocol.setFireState(input.isPassFireButton);
        }
    };
    var APlayerShipController_1;
    __decorate([
        XBase_1.xproperty(UMath_1.UVec2)
    ], APlayerShipController.prototype, "moveDirection", void 0);
    __decorate([
        XBase_1.xproperty(Number)
    ], APlayerShipController.prototype, "moveForce", void 0);
    __decorate([
        XBase_1.xproperty(UMath_1.UVec2)
    ], APlayerShipController.prototype, "fireDirection", void 0);
    APlayerShipController = APlayerShipController_1 = __decorate([
        XBase_1.xclass(APlayerShipController_1)
    ], APlayerShipController);
    return APlayerShipController;
}(PlayerController_1.default));
exports.default = APlayerShipController;
