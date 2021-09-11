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
var Actor_1 = __importDefault(require("../../../Engine/Actor/Actor"));
var SceneComponent_1 = __importDefault(require("../../../Engine/Component/SceneComponent/SceneComponent"));
var SpriteComponent_1 = __importDefault(require("../../../Engine/Component/SceneComponent/SpriteComponent"));
var XBase_1 = require("../../../Engine/Engine/ReflectSystem/XBase");
var UMath_1 = require("../../../Engine/Engine/UMath");
/**
 * 角色基类
 * 包含基本的位移操作
 */
var ALand = /** @class */ (function (_super) {
    __extends(ALand, _super);
    function ALand() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.sprites = [];
        _this._size = UMath_1.uu.v2(5, 5);
        _this._width = UMath_1.uu.v2(64, 64);
        //滑动生成砖块
        _this.timer = 0;
        _this.temp = 0;
        _this.total = 0;
        return _this;
    }
    ALand_1 = ALand;
    Object.defineProperty(ALand.prototype, "size", {
        get: function () {
            return this._size;
        },
        set: function (value) {
            this._size = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ALand.prototype, "width", {
        get: function () {
            return this._width;
        },
        set: function (value) {
            this._width = value;
        },
        enumerable: false,
        configurable: true
    });
    ALand.prototype.init = function (world) {
        _super.prototype.init.call(this, world);
        this.spawnComponent(SceneComponent_1.default);
        this.startBuild();
    };
    ALand.prototype.startBuild = function () {
        this.total = this.size.x * this.size.y;
        for (var i = 0; i < this.size.y; i++) {
            this.sprites[i] = [];
            for (var j = 0; j < this.size.x; j++) {
                this.sprites[i][j] = null;
            }
        }
    };
    ALand.prototype.updateActor = function (dt) {
        // let pos = this.getPosition();
        // pos.x+=dt*100;
        // this.setPosition(pos);
        if (this.temp != this.total) {
            this.timer += dt;
            //每秒生成三个
            if (this.timer > 1 / 20) {
            }
            this.timer = 0;
            var y = Math.floor(this.temp / this.size.x);
            var x = this.temp - y * this.size.x;
            var comp = this.spawnComponent(SpriteComponent_1.default);
            comp.setTexture("dirt_0_new");
            comp.setScale(UMath_1.UVec2.ONE().mulSelf(2));
            comp.setPosition(UMath_1.uu.v2(x * this.width.x, y * this.width.y));
            this.setPosition(this.getPosition());
            this.sprites[y][x] = comp;
            this.temp++;
        }
    };
    var ALand_1;
    ALand = ALand_1 = __decorate([
        XBase_1.xclass(ALand_1)
    ], ALand);
    return ALand;
}(Actor_1.default));
exports.default = ALand;
