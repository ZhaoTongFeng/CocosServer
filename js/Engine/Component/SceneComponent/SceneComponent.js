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
var Enums_1 = require("../../Engine/Enums");
var XBase_1 = require("../../Engine/ReflectSystem/XBase");
var UMath_1 = require("../../Engine/UMath");
var Component_1 = __importDefault(require("../Component"));
/**
 * 具有相对位置的组件基类
 * 实体组件
 */
var USceneComponent = /** @class */ (function (_super) {
    __extends(USceneComponent, _super);
    function USceneComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._visiblity = Enums_1.Visiblity.Visible;
        _this._position = UMath_1.uu.v2();
        _this._newPos = UMath_1.uu.v2();
        _this._oldPos = UMath_1.uu.v2();
        _this._absPosition = UMath_1.uu.v2();
        _this._size = UMath_1.uu.v2(64, 64);
        _this._newSize = UMath_1.uu.v2(64, 64);
        _this._scale = UMath_1.uu.v2(1, 1);
        _this._rotation = 0;
        _this._newRot = 0;
        _this._oldRot = 0;
        _this.needSync = true;
        _this.transformDirty = true;
        /** 相机剔除 */
        //是否在相机返回内
        _this.inCamera = false;
        //所占空间大小
        _this.catAABB = null;
        return _this;
    }
    USceneComponent_1 = USceneComponent;
    //服务器检查坐标的变化，以发送
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
    //客户端接收到位移坐标
    USceneComponent.prototype.receiveData = function (obj) {
        var pos = UMath_1.uu.v2(obj[0], obj[1]);
        var rot = obj[2];
        this._oldPos = this._position.clone();
        this._newPos = pos;
        this._oldRot = this._rotation;
        this._newRot = rot;
    };
    USceneComponent.prototype.lerpTransform = function () {
        if (this.needSync) {
            if (this.owner.world.gameInstance.timeFrame == 0) {
                return;
            }
            var start = this._oldPos.clone();
            var target = this._newPos;
            var rate = this.owner.world.gameInstance.frameRate;
            start.lerp(target, rate);
            var begRot = this._oldRot;
            var endRot = this._newRot;
            // if (UMath.abs(begRot - endRot) > 180) {
            //     endRot = UMath.abs(360 - endRot)
            // }
            var newRot = UMath_1.UMath.lerp(begRot, endRot, rate);
            if (this.isRoot()) {
                this.owner.setPosition(start);
                this.owner.setRotation(newRot);
            }
            else {
                this.setPosition(start);
                this.setRotation(newRot);
            }
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
        //客户端才需要注册SceneComponent，用于显示
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
        //服务器每帧和上一帧的数据进行比较，是否需要发送上一帧
        if (!this.owner.world.isClient) {
            var data = this.checkTransform();
        }
        else {
            this.lerpTransform();
        }
    };
    USceneComponent.prototype.drawDebug = function (graphic) {
        _super.prototype.drawDebug.call(this, graphic);
        // const pos = this.getPosition();
        // const size = this.getSize();
        // graphic.drawRect(pos.x-size.x/2, pos.y-size.y/2, size.x, size.y);
        if (this.isRoot()) {
            var ownAABB = this.owner.getCatAABB();
            graphic.drawRect(ownAABB.min.x, ownAABB.min.y, this.owner.getSize().x, this.owner.getSize().y, UMath_1.UColor.BLUE());
        }
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
        //更新相机剔除AABB
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
        //可见性
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
    //相对坐标
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
    //世界坐标
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
