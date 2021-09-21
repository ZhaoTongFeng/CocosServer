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
exports.UDebugSystem = void 0;
var Object_1 = __importDefault(require("../../Object"));
var XBase_1 = require("../ReflectSystem/XBase");
var UMath_1 = require("../UMath");
var UDebugSystem = /** @class */ (function (_super) {
    __extends(UDebugSystem, _super);
    function UDebugSystem() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.world = null;
        //一个格子宽度
        _this.gridWidth = 750;
        //列
        _this.gridCol = 10;
        //行
        _this.gridRow = 10;
        return _this;
    }
    UDebugSystem_1 = UDebugSystem;
    UDebugSystem.prototype.debugAll = function (graphic) {
        // this.drawGrid(graphic);
        // this.drawScreen(graphic);
        if (this.world.isDebug) {
            this.world.actors.forEach(function (actor) { actor.drawDebug(graphic); });
        }
    };
    UDebugSystem.prototype.drawGrid = function (graphic) {
        var userMng = this.world.gameInstance.network.userManager;
        var con = this.world.pUserControllerMap.get(userMng.id_loc);
        var pawn = null;
        if (con) {
            pawn = con.pawn;
        }
        var gridWidth = this.gridWidth;
        var gridCol = this.gridCol;
        var gridRow = this.gridRow;
        var offsetCol = gridCol / 2;
        var offsetRow = gridRow / 2;
        for (var i = 0; i < gridRow; i++) {
            for (var j = 0; j < gridCol; j++) {
                if (pawn) {
                    var pos = pawn.getPosition();
                    var x = Math.floor(pos.x / gridWidth) + offsetCol;
                    var y = Math.floor(pos.y / gridWidth) + offsetRow;
                    if (x == j && y == i) {
                        for (var m = -1; m <= 1; m++) {
                            for (var n = -1; n <= 1; n++) {
                                var tx = x + n;
                                var ty = y + m;
                                if (tx >= 0 && tx < gridCol && ty >= 0 && ty < gridRow) {
                                    if (m == 0 && n == 0) {
                                        graphic.drawRect((tx - offsetCol) * gridWidth, (ty - offsetRow) * gridWidth, gridWidth, gridWidth, UMath_1.UColor.WHITE(), UMath_1.UColor.RED(), 10);
                                    }
                                    else {
                                        graphic.drawRect((tx - offsetCol) * gridWidth, (ty - offsetRow) * gridWidth, gridWidth, gridWidth, UMath_1.UColor.WHITE(), UMath_1.UColor.BLUE(), 10);
                                    }
                                }
                            }
                        }
                    }
                    else {
                        graphic.drawRect((j - offsetCol) * gridWidth, (i - offsetRow) * gridWidth, gridWidth, gridWidth, UMath_1.UColor.WHITE(), UMath_1.UColor.BLACK(), 10);
                    }
                }
                else {
                    graphic.drawRect((j - offsetCol) * gridWidth, (i - offsetRow) * gridWidth, gridWidth, gridWidth, UMath_1.UColor.WHITE(), UMath_1.UColor.BLACK(), 10);
                }
            }
        }
    };
    UDebugSystem.prototype.drawScreen = function (graphic) {
        var winSize = this.world.gameInstance.getWorldView().winSize;
        graphic.drawRect(winSize.x * -1, winSize.y * -1, winSize.x * 2, winSize.y * 2, UMath_1.UColor.BLUE());
    };
    UDebugSystem.prototype.init = function (world) {
        _super.prototype.init.call(this, world);
        this.world = world;
    };
    var UDebugSystem_1;
    UDebugSystem = UDebugSystem_1 = __decorate([
        XBase_1.xclass(UDebugSystem_1)
    ], UDebugSystem);
    return UDebugSystem;
}(Object_1.default));
exports.UDebugSystem = UDebugSystem;
