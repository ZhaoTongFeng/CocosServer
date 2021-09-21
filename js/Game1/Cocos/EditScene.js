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
var GraphicGridPanel_1 = __importDefault(require("./Other/GraphicGridPanel"));
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var EditScene = /** @class */ (function (_super) {
    __extends(EditScene, _super);
    function EditScene() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.startBtn = null;
        _this.goToEditDetialBtn = null;
        _this.goToEditWorldBtn = null;
        _this.editWorldNode = null;
        _this.editDetialNode = null;
        _this.curIndex = 0; //World
        _this.aniTime = 0.25;
        _this.pintPanel = null;
        return _this;
        //不要用这种移动场景节点的方式，一个是不够灵活，另外性能也不行
        // this.goToEditDetialBtn.node.on("click", this.goToDetial, this);
        // this.goToEditWorldBtn.node.on("click", this.goToWorld, this);
        // goToWorld() {
        //     cc.tween(this.editWorldNode)
        //         .to(this.aniTime, { position: { value: cc.v2(0, 0), easing: 'smooth' } })
        //         .call(() => { console.log('This is a callback') })
        //         .start()
        // }
        // goToDetial() {
        //     cc.tween(this.editWorldNode)
        //         .to(this.aniTime, { position: { value: cc.v2(0, 750), easing: 'smooth' } })
        //         .call(() => { console.log('This is a callback') })
        //         .start()
        // }
    }
    EditScene.prototype.onLoad = function () {
        // cc.game.addPersistRootNode(this.node);
        this.startBtn.node.on("click", function () {
            cc.director.loadScene("Game2");
        }, this);
    };
    __decorate([
        property(cc.Button)
    ], EditScene.prototype, "startBtn", void 0);
    __decorate([
        property(cc.Button)
    ], EditScene.prototype, "goToEditDetialBtn", void 0);
    __decorate([
        property(cc.Button)
    ], EditScene.prototype, "goToEditWorldBtn", void 0);
    __decorate([
        property(cc.Node)
    ], EditScene.prototype, "editWorldNode", void 0);
    __decorate([
        property(cc.Node)
    ], EditScene.prototype, "editDetialNode", void 0);
    __decorate([
        property(GraphicGridPanel_1.default)
    ], EditScene.prototype, "pintPanel", void 0);
    EditScene = __decorate([
        ccclass
    ], EditScene);
    return EditScene;
}(cc.Component));
exports.default = EditScene;
