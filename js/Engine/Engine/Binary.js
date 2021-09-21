"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UBinary = void 0;
var UBinary = /** @class */ (function () {
    function UBinary() {
    }
    //ArrayBuffer 偏移位置 偏移量（Byte）
    // var idView = new Uint32Array(buffer, 0, 1);
    UBinary.prototype.toArray = function (typedArray) {
        return Array.apply([], typedArray);
    };
    return UBinary;
}());
exports.UBinary = UBinary;
