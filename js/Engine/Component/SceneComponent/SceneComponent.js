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
exports.USceneComponentProtocol = void 0;
var Enums_1 = require("../../Engine/Enums");
var Protocol_1 = require("../../Engine/NetworkSystem/Share/Protocol");
var XBase_1 = require("../../Engine/ReflectSystem/XBase");
var UMath_1 = require("../../Engine/UMath");
var Component_1 = __importDefault(require("../Component"));
var USceneComponentProtocol = /** @class */ (function (_super) {
    __extends(USceneComponentProtocol, _super);
    function USceneComponentProtocol() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.viewBuffer = null;
        return _this;
    }
    USceneComponentProtocol.prototype.init = function () {
        this.dataLength = 12;
    };
    USceneComponentProtocol.prototype.initView = function () {
        this.viewBuffer = this.getInt32(this.headLength, 3);
    };
    USceneComponentProtocol.prototype.setX = function (v) { this.viewBuffer[0] = v; };
    USceneComponentProtocol.prototype.getX = function () { return this.viewBuffer[0]; };
    USceneComponentProtocol.prototype.setY = function (v) { this.viewBuffer[1] = v; };
    USceneComponentProtocol.prototype.getY = function () { return this.viewBuffer[1]; };
    USceneComponentProtocol.prototype.setRot = function (v) { this.viewBuffer[2] = v; };
    USceneComponentProtocol.prototype.getRot = function () { return this.viewBuffer[2]; };
    return USceneComponentProtocol;
}(Protocol_1.Protocol));
exports.USceneComponentProtocol = USceneComponentProtocol;
/**
 * ?????????????????????????????????
 * ????????????
 */
var USceneComponent = /** @class */ (function (_super) {
    __extends(USceneComponent, _super);
    function USceneComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._visiblity = Enums_1.Visiblity.Visible;
        _this._position = UMath_1.uu.v2();
        _this._absPosition = UMath_1.uu.v2();
        _this._size = UMath_1.uu.v2(64, 64);
        _this._newSize = UMath_1.uu.v2(64, 64);
        _this._scale = UMath_1.uu.v2(1, 1);
        _this._rotation = 0;
        //??????????????????????????????Root???Comp?????????????????????????????????????????????
        _this.needSync = true;
        _this._newPos = UMath_1.uu.v2();
        _this._oldPos = UMath_1.uu.v2();
        _this._newRot = 0;
        _this._oldRot = 0;
        //?????????
        _this.oldTick = 0;
        _this.curTick = 0;
        _this.timeFrame = 0;
        _this.frameTimer = 0;
        _this.frameRate = 0;
        _this.hasNewData = false;
        _this.transformDirty = true;
        /** ???????????? */
        //????????????????????????
        _this.inCamera = false;
        //??????????????????
        _this.catAABB = null;
        return _this;
    }
    USceneComponent_1 = USceneComponent;
    //??????????????????????????????????????????
    USceneComponent.prototype.checkTransform = function () {
        if (this.transformDirty && this.needSync) {
            if (this._position.x != this._oldPos.x || this._position.y != this._oldPos.y || this._rotation != this._oldRot) {
                var data = [Math.floor(this._position.x), Math.floor(this._position.y), Math.floor(this._rotation)];
                this._oldPos.x = data[0];
                this._position.x = data[0];
                this._oldPos.y = data[1];
                this._position.y = data[1];
                this._oldRot = data[2];
                this._rotation = data[2];
                this.owner.world.gameInstance.sendGameGridData(data, this, this.owner);
            }
            this.transformDirty = false;
        }
    };
    USceneComponent.prototype.checkTransformBinary = function () {
        if (this.transformDirty && this.needSync) {
            if (this._position.x != this._oldPos.x || this._position.y != this._oldPos.y || this._rotation != this._oldRot) {
                var protocol = this.getProtocol(this.id, this.owner.world.gameInstance.protocolSystem);
                protocol.requestBufferView();
                var data = [Math.floor(this._position.x), Math.floor(this._position.y), Math.floor(this._rotation)];
                this._oldPos.x = data[0];
                this._position.x = data[0];
                protocol.setX(data[0]);
                this._oldPos.y = data[1];
                this._position.y = data[1];
                protocol.setY(data[1]);
                this._oldRot = data[2];
                this._rotation = data[2];
                protocol.setRot(data[2]);
            }
            this.transformDirty = false;
        }
    };
    USceneComponent.prototype.getProtocol = function (id, sys) { return new USceneComponentProtocol(id, sys); };
    USceneComponent.prototype.receiveBinary = function (protocol) {
        var pos = UMath_1.uu.v2(protocol.getX(), protocol.getY());
        var rot = protocol.getRot();
        this._oldPos = this._position.clone();
        this._newPos = pos;
        this._oldRot = this._rotation;
        this._newRot = rot;
        this.computeFrameRate(this.owner.world.gameInstance.curTick);
    };
    //??????????????????????????????
    USceneComponent.prototype.receiveData = function (obj) {
        var pos = UMath_1.uu.v2(obj[0], obj[1]);
        var rot = obj[2];
        this._oldPos = this._position.clone();
        this._newPos = pos;
        this._oldRot = this._rotation;
        this._newRot = rot;
    };
    //????????? ???????????????????????????????????????
    USceneComponent.prototype.computeFrameRate = function (time) {
        this.frameTimer = 0;
        this.curTick = time;
        if (this.curTick != 0 && this.oldTick != 0) {
            this.timeFrame = this.curTick - this.oldTick;
        }
        this.oldTick = this.curTick;
        this.hasNewData = true;
    };
    USceneComponent.prototype.updateFrameTime = function (dt) {
        this.frameTimer += dt * 1000;
        this.frameRate = UMath_1.UMath.clamp01(this.frameTimer / this.timeFrame / 2);
    };
    USceneComponent.prototype.lerpTransform = function () {
        if (this.needSync) {
            if (this.timeFrame == 0) {
                // this._oldPos.x = this._position.x;
                // this._oldPos.y = this._position.y;
                // this._oldRot = this._rotation;
                return;
            }
            var rate = this.frameRate;
            //??????
            if (!this._newPos.equals(this._position)) {
                var start = this._oldPos.clone();
                var target = this._newPos;
                start.lerp(target, rate);
                if (this.isRoot()) {
                    this.owner.setPosition(start);
                }
                else {
                    this.setPosition(start);
                }
            }
            //??????
            var begRot = this._oldRot;
            var newRot = begRot;
            if (this._rotation != this._newRot) {
                var endRot = this._newRot;
                if (Math.abs(begRot - endRot) > 180) {
                    endRot = endRot - 360;
                }
                newRot = Math.floor(UMath_1.UMath.lerp(begRot, endRot, rate));
                if (this.isRoot()) {
                    this.owner.setRotation(newRot);
                }
                else {
                    this.setRotation(newRot);
                }
            }
            // if (this.frameRate == 1 && this.hasNewData) {
            //     this.oldTick = 0;
            //     this.curTick = 0;
            //     this.timeFrame = 0;
            //     this.frameTimer = 0;
            //     this.frameRate = 0;
            //     console.log(1);
            // }
            // this.hasNewData = false;
        }
    };
    USceneComponent.prototype.init = function (ac, id) {
        if (id === void 0) { id = -1; }
        _super.prototype.init.call(this, ac, id);
    };
    USceneComponent.prototype.onLoad = function (ac) {
        _super.prototype.onLoad.call(this, ac);
        if (this.owner.world.isClient && this.catAABB == null) {
            this.catAABB = new UMath_1.AABB();
        }
        //????????????????????????SceneComponent???????????????
        if (this.owner.world.isClient) {
            this.register();
        }
        if (this.owner.getSceneComponent() == null) {
            this.owner.setSceneComponent(this);
        }
    };
    USceneComponent.prototype.register = function () {
        this.owner.world.actorSystem.registerSceneComponent(this);
    };
    USceneComponent.prototype.unUse = function () {
        this.visiblity = Enums_1.Visiblity.Hide;
        _super.prototype.unUse.call(this);
    };
    USceneComponent.prototype.reUse = function () {
        _super.prototype.reUse.call(this);
        this._visiblity = Enums_1.Visiblity.Visible;
        this._position.x = 0;
        this._position.y = 0;
        this._absPosition.x = 0;
        this._absPosition.y = 0;
        this._size.x = 64;
        this._size.y = 64;
        this._scale.x = 1;
        this._scale.y = 1;
        this._rotation = 0;
        this.transformDirty = true;
    };
    USceneComponent.prototype.unRegister = function () {
        this.owner.world.actorSystem.unRegisterSceneComponent(this);
    };
    USceneComponent.prototype.processInput = function (input) {
        _super.prototype.processInput.call(this, input);
    };
    USceneComponent.prototype.update = function (dt) {
        _super.prototype.update.call(this, dt);
        //??????????????????????????????????????????????????????????????????????????????
        if (!this.owner.world.isClient) {
            // this.checkTransform();
            this.checkTransformBinary();
        }
        else {
            //????????????????????????????????????
            if (!this.owner.world.gameInstance.bStandAlone) {
                this.updateFrameTime(dt);
                this.lerpTransform();
            }
        }
    };
    USceneComponent.prototype.drawDebug = function (graphic) {
        _super.prototype.drawDebug.call(this, graphic);
        // const pos = this.getPosition();
        // const size = this.getSize();
        // graphic.drawRect(pos.x-size.x/2, pos.y-size.y/2, size.x, size.y);
        // if (this.isRoot()) {
        //     let ownAABB = this.owner.getCatAABB();
        //     graphic.drawRect(ownAABB.min.x, ownAABB.min.y, this.owner.getSize().x, this.owner.getSize().y, UColor.BLUE());
        // }
    };
    USceneComponent.prototype.draw = function (graphic) {
    };
    USceneComponent.prototype.onDestory = function () {
        if (this.owner.world.isClient) {
            this.unRegister();
        }
        _super.prototype.onDestory.call(this);
    };
    USceneComponent.prototype.computeCatAABB = function () {
        //??????????????????AABB
        var pos = null;
        if (this.isRoot()) {
            pos = this.owner.getPosition();
        }
        else {
            pos = this.owner.getPosition().add(this._position);
        }
        var size = this._size;
        var scale = this._scale;
        this.catAABB.min.x = pos.x - size.x / 2 * scale.x;
        this.catAABB.min.y = pos.y - size.y / 2 * scale.y;
        this.catAABB.max.x = this.catAABB.min.x + size.x * scale.x;
        this.catAABB.max.y = this.catAABB.min.y + size.y * scale.y;
    };
    USceneComponent.prototype.onComputeTransfor = function () {
        this.visiblity = this._visiblity;
        this.transformDirty = true;
        if (this.transformDirty && this.owner.world.isClient) {
            this.computeCatAABB();
        }
    };
    //Override
    USceneComponent.prototype.isMainScene = function () {
        return this == this.owner.getSceneComponent();
    };
    Object.defineProperty(USceneComponent.prototype, "visiblity", {
        //?????????
        get: function () {
            return this._visiblity;
        },
        set: function (vis) {
            this.owner.world.gameInstance.getWorldView().onSceneCompSetVisible(this);
            this._visiblity = vis;
        },
        enumerable: false,
        configurable: true
    });
    //????????????
    USceneComponent.prototype.getPosition = function () {
        return this._position;
    };
    USceneComponent.prototype.setPosition = function (pos) {
        if (!pos.equals(this._position)) {
            this.owner.reComputeTransform = true;
            this.transformDirty = true;
            this._position = pos;
        }
    };
    //????????????
    USceneComponent.prototype.setAbsPosition = function (value) {
        if (this.isMainScene()) {
            this.setPosition(value);
        }
        this._absPosition = value;
    };
    USceneComponent.prototype.getAbsPosition = function () {
        return this._absPosition;
    };
    USceneComponent.prototype.getSize = function () {
        return this._size;
    };
    USceneComponent.prototype.setSize = function (value) {
        this.transformDirty = true;
        this._size = value;
    };
    USceneComponent.prototype.getScale = function () {
        return this._scale;
    };
    USceneComponent.prototype.setScale = function (value) {
        this.transformDirty = true;
        this._scale = value;
    };
    USceneComponent.prototype.getRotation = function () {
        return this._rotation;
    };
    USceneComponent.prototype.setRotation = function (angle) {
        this.transformDirty = true;
        this._rotation = angle;
    };
    var USceneComponent_1;
    __decorate([
        XBase_1.xproperty(Number)
    ], USceneComponent.prototype, "_visiblity", void 0);
    __decorate([
        XBase_1.xproperty(UMath_1.UVec2)
    ], USceneComponent.prototype, "_position", void 0);
    __decorate([
        XBase_1.xproperty(UMath_1.UVec2)
    ], USceneComponent.prototype, "_absPosition", void 0);
    __decorate([
        XBase_1.xproperty(UMath_1.UVec2)
    ], USceneComponent.prototype, "_size", void 0);
    __decorate([
        XBase_1.xproperty(UMath_1.UVec2)
    ], USceneComponent.prototype, "_scale", void 0);
    __decorate([
        XBase_1.xproperty(Number)
    ], USceneComponent.prototype, "_rotation", void 0);
    USceneComponent = USceneComponent_1 = __decorate([
        XBase_1.xclass(USceneComponent_1)
    ], USceneComponent);
    return USceneComponent;
}(Component_1.default));
exports.default = USceneComponent;
