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
var XBase_1 = require("../../Engine/ReflectSystem/XBase");
var Actor_1 = __importDefault(require("../Actor"));
/**
 * 控制器
 * 主要控制输入
 */
var AController = /** @class */ (function (_super) {
    __extends(AController, _super);
    function AController() {
        /** 这个指针是中间手动设置的，所以需要跟随世界一起传输 */
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.pawn = null;
        _this.id_pawn = "";
        return _this;
    }
    AController_1 = AController;
    AController.prototype.unUse = function () {
        _super.prototype.unUse.call(this);
    };
    AController.prototype.reUse = function () {
        _super.prototype.reUse.call(this);
        this.pawn = null;
    };
    AController.prototype.sendData = function (obj) {
        var out = [this.id, obj];
        this.world.gameInstance.sendGameData(out, this);
    };
    AController.prototype.init = function (world) {
        _super.prototype.init.call(this, world);
    };
    AController.prototype.onLoad = function (world) {
        _super.prototype.onLoad.call(this, world);
    };
    AController.prototype.processSelfInput = function (input) {
    };
    AController.prototype.updateActor = function (dt) {
    };
    AController.prototype.drawDebugActor = function (graphic) {
    };
    AController.prototype.destory = function () {
        _super.prototype.destory.call(this);
    };
    AController.prototype.process = function (pawn) {
        if (pawn.controller != null) {
            pawn.controller.pawn = null;
        }
        this.pawn = pawn;
        pawn.controller = this;
    };
    AController.prototype.unProcess = function () {
        this.pawn = null;
    };
    AController.prototype.getSceneComponent = function () {
        if (this.pawn) {
            return this.pawn.getSceneComponent();
        }
        else {
            return null;
        }
    };
    AController.prototype.setSceneComponent = function (comp) {
        if (this.pawn) {
            this.pawn.setSceneComponent(comp);
        }
    };
    AController.prototype.getRootComp = function () {
        if (this.pawn) {
            return this.pawn.getRootComp();
        }
        else {
            return null;
        }
    };
    AController.prototype.setRootComp = function (comp) {
        if (this.pawn) {
            this.pawn.setRootComp(comp);
        }
    };
    AController.prototype.getCollision = function () {
        return this.collisionComponent;
    };
    AController.prototype.setCollision = function (comp) {
        this.collisionComponent = comp;
    };
    AController.prototype.getSize = function () {
        if (this.pawn) {
            return this.pawn.getSize();
        }
        else {
            return null;
        }
    };
    AController.prototype.setSize = function (pos) {
        if (this.pawn) {
            this.pawn.setSize(pos);
        }
    };
    AController.prototype.getPosition = function () {
        if (this.pawn) {
            return this.pawn.getPosition();
        }
        else {
            return null;
        }
    };
    AController.prototype.setPosition = function (pos) {
        if (this.pawn) {
            this.pawn.setPosition(pos);
        }
    };
    AController.prototype.getScale = function () {
        if (this.pawn) {
            return this.pawn.getScale();
        }
        else {
            return null;
        }
    };
    AController.prototype.setScale = function (pos) {
        if (this.pawn) {
            this.pawn.setScale(pos);
        }
    };
    AController.prototype.getRotation = function () {
        if (this.pawn) {
            return this.pawn.getRotation();
        }
        else {
            return null;
        }
    };
    AController.prototype.setRotation = function (angle) {
        if (this.pawn) {
            this.pawn.setRotation(angle);
        }
    };
    var AController_1;
    __decorate([
        XBase_1.xproperty(String)
    ], AController.prototype, "id_pawn", void 0);
    AController = AController_1 = __decorate([
        XBase_1.xclass(AController_1)
    ], AController);
    return AController;
}(Actor_1.default));
exports.default = AController;
