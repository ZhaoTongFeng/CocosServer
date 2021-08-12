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
var Enums_1 = require("./Enums");
var GameInstance_1 = __importDefault(require("./GameInstance"));
var XBase_1 = require("./ReflectSystem/XBase");
var UGraphic_1 = __importDefault(require("./UGraphic"));
var UMath_1 = require("./UMath");
/**
 * Logic-View
 * Client Only
 * 逻辑调用View接口，在CCWorldView中进行绑定
 * 服务端没有显示，但是为了能让客户端代码直接在服务端跑起来
 * 所以这里定义了一些接口，客户端去绑定这些接口，客户端就能显示，
 * 服务端不绑定这些接口，也不会报错
 */
var UWorldView = /** @class */ (function (_super) {
    __extends(UWorldView, _super);
    function UWorldView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.graphic = new UGraphic_1.default();
        _this.fps = 60;
        _this.frameTime = 1 / 60;
        _this.gameInstance = null;
        _this.sceneComponents = [];
        _this.cameraMap = new Map();
        return _this;
    }
    UWorldView_1 = UWorldView;
    //退出和进入此场景操作
    UWorldView.prototype.onEnter = function (world, data) {
        if (data === void 0) { data = null; }
        //SEVER 服务器直接从这里开始
        this.gameInstance = new GameInstance_1.default();
        this.gameInstance.openWorld(world, data, this);
    };
    UWorldView.prototype.onExit = function () {
        this.gameInstance.closeWorld();
    };
    //VIew更新入口
    UWorldView.prototype.update = function (dt) {
        dt = UMath_1.UMath.clamp(dt, 0, this.frameTime);
        //1.处理输入 输入已经发送到GameInstance的Input中，在World中会被转发到各个Ac
        //2.处理更新
        this.gameInstance.update(dt);
        //3.处理输出 只需要更新Scene中draw方法即可
        this.drawAllSprite();
        this.graphic.begDrawDebug();
        this.gameInstance.drawDebug(this.graphic);
    };
    UWorldView.prototype.drawAllSprite = function () {
        var _this = this;
        //3.处理输出 只需要更新Scene中draw方法即可
        this.sceneComponents.forEach(function (comp) {
            if (comp.visiblity == Enums_1.Visiblity.Visible) {
                comp.draw(_this.graphic);
            }
        });
    };
    UWorldView.prototype.addSceneComponent = function (comp) { };
    UWorldView.prototype.removeSceneComponent = function (comp) { };
    UWorldView.prototype.addSpriteComponent = function (comp) { };
    UWorldView.prototype.removeSpriteComponent = function (comp) { };
    UWorldView.prototype.addUINode = function (comp) { };
    UWorldView.prototype.removeUINode = function (comp) { };
    UWorldView.prototype.onSceneCompSetVisible = function (comp) { };
    UWorldView.prototype.onSceneCompComputeTransfor = function (comp) { };
    UWorldView.prototype.onSpriteCompSetColor = function (comp) { };
    UWorldView.prototype.onDrawTexture = function (comp) { };
    UWorldView.prototype.addCameraComponent = function (comp) { };
    UWorldView.prototype.removeCameraComponent = function (comp) { };
    UWorldView.prototype.onGetSceneCameraProperty = function (comp) { };
    var UWorldView_1;
    UWorldView = UWorldView_1 = __decorate([
        XBase_1.xclass(UWorldView_1)
    ], UWorldView);
    return UWorldView;
}(XBase_1.XBase));
exports.default = UWorldView;
