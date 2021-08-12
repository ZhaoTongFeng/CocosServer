"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UMath_1 = require("./UMath");
/**
 * TODO 后面得自己整个随机数算法
 */
var URandom = /** @class */ (function () {
    function URandom() {
    }
    URandom.randomVec = function () {
        var scale = 1.0;
        var r = Math.random() * 2.0 * UMath_1.UMath.PI;
        var vec = new UMath_1.UVec2();
        vec.x = UMath_1.UMath.cos(r) * scale;
        vec.y = UMath_1.UMath.sin(r) * scale;
        return vec;
    };
    URandom.randomf = function () {
        return Math.random();
    };
    return URandom;
}());
exports.default = URandom;
