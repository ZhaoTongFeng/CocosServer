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
 * 基类
 */
var AInfo = /** @class */ (function (_super) {
    __extends(AInfo, _super);
    function AInfo() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.actor = null;
        return _this;
    }
    AInfo_1 = AInfo;
    AInfo.prototype.init = function (world) {
        _super.prototype.init.call(this, world);
    };
    AInfo.prototype.processSelfInput = function (input) {
    };
    AInfo.prototype.updateActor = function (dt) {
    };
    AInfo.prototype.drawDebugActor = function (graphic) {
    };
    AInfo.prototype.destory = function () {
        _super.prototype.destory.call(this);
    };
    AInfo.prototype.getSceneComponent = function () {
        if (this.actor) {
            return this.actor.getSceneComponent();
        }
        else {
            return null;
        }
    };
    AInfo.prototype.setSceneComponent = function (comp) {
        if (this.actor) {
            this.actor.setSceneComponent(comp);
        }
    };
    AInfo.prototype.getRootComp = function () {
        if (this.actor) {
            return this.actor.getRootComp();
        }
        else {
            return null;
        }
    };
    AInfo.prototype.setRootComp = function (comp) {
        if (this.actor) {
            this.actor.setRootComp(comp);
        }
    };
    AInfo.prototype.getCollision = function () {
        return this.collisionComponent;
    };
    AInfo.prototype.setCollision = function (comp) {
        this.collisionComponent = comp;
    };
    AInfo.prototype.getSize = function () {
        if (this.actor) {
            return this.actor.getSize();
        }
        else {
            return null;
        }
    };
    AInfo.prototype.setSize = function (pos) {
        if (this.actor) {
            this.actor.setSize(pos);
        }
    };
    AInfo.prototype.getPosition = function () {
        if (this.actor) {
            return this.actor.getPosition();
        }
        else {
            return null;
        }
    };
    AInfo.prototype.setPosition = function (pos) {
        if (this.actor) {
            this.actor.setPosition(pos);
        }
    };
    AInfo.prototype.getScale = function () {
        if (this.actor) {
            return this.actor.getScale();
        }
        else {
            return null;
        }
    };
    AInfo.prototype.setScale = function (pos) {
        if (this.actor) {
            this.actor.setScale(pos);
        }
    };
    AInfo.prototype.getRotation = function () {
        if (this.actor) {
            return this.actor.getRotation();
        }
        else {
            return null;
        }
    };
    AInfo.prototype.setRotation = function (angle) {
        if (this.actor) {
            this.actor.setRotation(angle);
        }
    };
    var AInfo_1;
    AInfo = AInfo_1 = __decorate([
        XBase_1.xclass(AInfo_1)
    ], AInfo);
    return AInfo;
}(Actor_1.default));
exports.default = AInfo;
