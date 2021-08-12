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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UMatrix3 = exports.AABB = exports.UVec2 = exports.URect = exports.UColor = exports.UMath = exports.uu = void 0;
var XBase_1 = require("./ReflectSystem/XBase");
var uu = /** @class */ (function () {
    function uu() {
    }
    uu.v2 = function (x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        var val = new UVec2();
        val.x = x;
        val.y = y;
        return val;
    };
    uu.matrix3 = function () {
        var val = new UMatrix3();
        return val;
    };
    uu.rect = function (x, y, w, h) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (w === void 0) { w = 0; }
        if (h === void 0) { h = 0; }
        var val = new URect();
        val.x = x;
        val.y = y;
        val.w = w;
        val.h = h;
        return val;
    };
    uu.color = function (r, g, b, a) {
        if (r === void 0) { r = 0; }
        if (g === void 0) { g = 0; }
        if (b === void 0) { b = 0; }
        if (a === void 0) { a = 0; }
        var val = new UColor();
        val.r = r;
        val.g = g;
        val.b = b;
        val.a = a;
        return val;
    };
    return uu;
}());
exports.uu = uu;
var UMath = /** @class */ (function () {
    function UMath() {
    }
    UMath.toRadians = function (degrees) {
        return degrees * UMath.PI / 180;
    };
    UMath.toDegrees = function (radians) {
        return radians * 180 / UMath.PI;
    };
    UMath.nearZero = function (val, epsilon) {
        if (epsilon === void 0) { epsilon = 0.01; }
        return Math.abs(val) <= epsilon;
    };
    UMath.max = function (a, b) {
        return a < b ? b : a;
    };
    UMath.min = function (a, b) {
        return a < b ? a : b;
    };
    UMath.clamp = function (val, min, max) {
        if (min > max) {
            var temp = min;
            min = max;
            max = temp;
        }
        return val < min ? min : val > max ? max : val;
    };
    UMath.clamp01 = function (val) {
        return val < 0 ? 0 : val > 1 ? 1 : val;
    };
    UMath.abs = function (val) {
        return Math.abs(val);
    };
    UMath.cos = function (angle) {
        return Math.cos(angle);
    };
    UMath.sin = function (angle) {
        return Math.sin(angle);
    };
    UMath.tan = function (angle) {
        return Math.sin(angle);
    };
    UMath.acos = function (value) {
        return Math.acos(value);
    };
    UMath.atan = function (y, x) {
        return Math.atan2(y, x);
    };
    UMath.cot = function (angle) {
        return 1 / Math.tan(angle);
    };
    UMath.lerp = function (a, b, f) {
        return a + f * (b - a);
    };
    UMath.sqrt = function (val) {
        return Math.sqrt(val);
    };
    UMath.equals = function (a, b, epsilon) {
        if (epsilon === void 0) { epsilon = UMath.EPSILON; }
        return Math.abs(a - b) <= epsilon * Math.max(1.0, Math.abs(a), Math.abs(b));
    };
    UMath.PI = 3.1415926535;
    UMath.TwoPI = UMath.PI * 2;
    UMath.PIOve2 = UMath.PI / 2;
    UMath.EPSILON = 0.000001;
    return UMath;
}());
exports.UMath = UMath;
var UColor = /** @class */ (function (_super) {
    __extends(UColor, _super);
    function UColor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.r = 0;
        _this.g = 0;
        _this.b = 0;
        _this.a = 0;
        return _this;
    }
    UColor_1 = UColor;
    UColor.prototype.clone = function () {
        return uu.color(this.r, this.g, this.b, this.a);
    };
    UColor.RED = function () {
        return uu.color(255, 0, 0, 255);
    };
    UColor.GREEN = function () {
        return uu.color(0, 255, 0, 255);
    };
    UColor.BLUE = function () {
        return uu.color(0, 0, 255, 255);
    };
    UColor.BLACK = function () {
        return uu.color(0, 0, 0, 255);
    };
    UColor.WHITE = function () {
        return uu.color(255, 255, 255, 255);
    };
    UColor.YELLOW = function () {
        return uu.color(255, 255, 0, 255);
    };
    UColor.prototype.set = function (r, g, b, a) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    };
    UColor.prototype.toJSON = function (serializeData) {
        if (serializeData === void 0) { serializeData = null; }
        var arr = [this.r, this.g, this.b, this.a];
        return {
            _cls_: "UColor",
            arr: arr
        };
    };
    UColor.prototype.fromJSON = function (obj, serializeData) {
        if (serializeData === void 0) { serializeData = null; }
        var arr = obj["arr"];
        this.set(arr[0], arr[1], arr[2], arr[3]);
    };
    var UColor_1;
    __decorate([
        XBase_1.xproperty(Number)
    ], UColor.prototype, "r", void 0);
    __decorate([
        XBase_1.xproperty(Number)
    ], UColor.prototype, "g", void 0);
    __decorate([
        XBase_1.xproperty(Number)
    ], UColor.prototype, "b", void 0);
    __decorate([
        XBase_1.xproperty(Number)
    ], UColor.prototype, "a", void 0);
    UColor = UColor_1 = __decorate([
        XBase_1.xclass(UColor_1)
    ], UColor);
    return UColor;
}(XBase_1.XBase));
exports.UColor = UColor;
var URect = /** @class */ (function (_super) {
    __extends(URect, _super);
    function URect() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.x = 0;
        _this.y = 0;
        _this.w = 0;
        _this.h = 0;
        return _this;
    }
    URect_1 = URect;
    URect.prototype.clone = function () {
        return uu.rect(this.x, this.y, this.w, this.h);
    };
    URect.prototype.set = function (x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    };
    URect.prototype.toJSON = function (serializeData) {
        if (serializeData === void 0) { serializeData = null; }
        var arr = [this.x, this.y, this.w, this.h];
        return {
            _cls_: "URect",
            arr: arr
        };
    };
    URect.prototype.fromJSON = function (obj, serializeData) {
        if (serializeData === void 0) { serializeData = null; }
        var arr = obj["arr"];
        this.set(arr[0], arr[1], arr[2], arr[3]);
    };
    var URect_1;
    __decorate([
        XBase_1.xproperty(Number)
    ], URect.prototype, "x", void 0);
    __decorate([
        XBase_1.xproperty(Number)
    ], URect.prototype, "y", void 0);
    __decorate([
        XBase_1.xproperty(Number)
    ], URect.prototype, "w", void 0);
    __decorate([
        XBase_1.xproperty(Number)
    ], URect.prototype, "h", void 0);
    URect = URect_1 = __decorate([
        XBase_1.xclass(URect_1)
    ], URect);
    return URect;
}(XBase_1.XBase));
exports.URect = URect;
var UVec2 = /** @class */ (function (_super) {
    __extends(UVec2, _super);
    function UVec2() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.x = 0;
        _this.y = 0;
        return _this;
    }
    UVec2_1 = UVec2;
    UVec2.prototype.clone = function () {
        return uu.v2(this.x, this.y);
    };
    UVec2.ZERO = function () {
        return uu.v2(0, 0);
    };
    UVec2.ONE = function () {
        return uu.v2(1, 1);
    };
    UVec2.prototype.set = function (x, y) {
        this.x = x;
        this.y = y;
    };
    UVec2.prototype.toJSON = function (serializeData) {
        if (serializeData === void 0) { serializeData = null; }
        var arr = [this.x, this.y];
        return {
            _cls_: "UVec2",
            arr: arr
        };
    };
    UVec2.prototype.fromJSON = function (obj, serializeData) {
        if (serializeData === void 0) { serializeData = null; }
        var arr = obj["arr"];
        this.set(arr[0], arr[1]);
    };
    //加
    UVec2.prototype.add = function (v) {
        var value = new UVec2_1();
        value.x = this.x + v.x;
        value.y = this.y + v.y;
        return value;
    };
    UVec2.prototype.addSelf = function (v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    };
    //减
    UVec2.prototype.sub = function (v) {
        var value = new UVec2_1();
        value.x = this.x - v.x;
        value.y = this.y - v.y;
        return value;
    };
    UVec2.prototype.subSelf = function (v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    };
    //点乘
    UVec2.prototype.mul = function (v) {
        var value = new UVec2_1();
        value.x = this.x * v;
        value.y = this.y * v;
        return value;
    };
    UVec2.prototype.mulSelf = function (v) {
        this.x *= v;
        this.y *= v;
        return this;
    };
    UVec2.prototype.mulVec2 = function (v) {
        var value = new UVec2_1();
        value.x = this.x * v.x;
        value.y = this.y * v.y;
        return value;
    };
    UVec2.prototype.mulVec2Self = function (v) {
        this.x *= v.x;
        this.y *= v.y;
        return this;
    };
    UVec2.prototype.dot = function (v) {
        return this.x * v.x + this.y * v.y;
    };
    //叉乘
    UVec2.prototype.cross = function (other) {
        return this.x * other.y - this.y * other.x;
    };
    //除
    UVec2.prototype.divide = function (other) {
        var value = new UVec2_1();
        value.x = this.x / other.x;
        value.y = this.y / other.y;
        return value;
    };
    UVec2.prototype.divideSelf = function (other) {
        this.x /= other.x;
        this.y /= other.y;
        return this;
    };
    //约等于
    UVec2.prototype.equals = function (other, epsilon) {
        if (epsilon === void 0) { epsilon = UMath.EPSILON; }
        return (Math.abs(this.x - other.x)
            <= epsilon * Math.max(1.0, Math.abs(this.x), Math.abs(other.x))
            && Math.abs(this.y - other.y)
                <= epsilon * Math.max(1.0, Math.abs(this.y), Math.abs(other.y)));
    };
    UVec2.prototype.equals2f = function (x, y, epsilon) {
        if (epsilon === void 0) { epsilon = UMath.EPSILON; }
        return (Math.abs(this.x - x)
            <= epsilon * Math.max(1.0, Math.abs(this.x), Math.abs(x))
            && Math.abs(this.y - y)
                <= epsilon * Math.max(1.0, Math.abs(this.y), Math.abs(y)));
    };
    UVec2.prototype.equalZero = function (epsilon) {
        if (epsilon === void 0) { epsilon = UMath.EPSILON; }
        return UMath.equals(this.x, 0, epsilon) && UMath.equals(this.y, 0, epsilon);
    };
    UVec2.prototype.equalsOne = function (epsilon) {
        if (epsilon === void 0) { epsilon = UMath.EPSILON; }
        return UMath.equals(this.x, 1, epsilon) && UMath.equals(this.y, 1, epsilon);
    };
    //严格等于
    UVec2.prototype.strictEquals = function (other) {
        return other && this.x === other.x && this.y === other.y;
    };
    UVec2.prototype.strictEquals2f = function (x, y) {
        return this.x === x && this.y === y;
    };
    UVec2.prototype.lengthSq = function () {
        return this.x * this.x + this.y * this.y;
    };
    UVec2.prototype.length = function () {
        return UMath.sqrt(this.lengthSq());
    };
    UVec2.prototype.normalize = function () {
        var value = new UVec2_1();
        value.x = this.x;
        value.y = this.y;
        var leng = value.length();
        value.x /= leng;
        value.y /= leng;
        return value;
    };
    UVec2.prototype.normalizeSelf = function () {
        var leng = this.length();
        this.x /= leng;
        this.y /= leng;
    };
    UVec2.prototype.lerp = function (b, f) {
        var x = this.x;
        var y = this.y;
        this.x = x + f * (b.x - x);
        this.y = y + f * (b.y - y);
        return this;
    };
    UVec2.prototype.clamp = function (minInclusive, maxInclusive) {
        this.x = UMath.clamp(this.x, minInclusive.x, maxInclusive.x);
        this.y = UMath.clamp(this.y, minInclusive.y, maxInclusive.y);
        return this;
    };
    /**
     * @en Calculates radian angle between two vectors
     * @zh 获取当前向量和指定向量之间的角度。
     * @param other specified vector
     * @return The angle between the current vector and the specified vector (in radians); if there are zero vectors in the current vector and the specified vector, 0 is returned.
     */
    UVec2.prototype.angle = function (other) {
        var magSqr1 = this.lengthSq();
        var magSqr2 = other.lengthSq();
        if (magSqr1 === 0 || magSqr2 === 0) {
            console.warn('Can\'t get angle between zero vector');
            return 0.0;
        }
        var dot = this.dot(other);
        var theta = dot / (Math.sqrt(magSqr1 * magSqr2));
        theta = UMath.clamp(theta, -1.0, 1.0);
        return Math.acos(theta);
    };
    /**
     * @en Get angle in radian between this and vector with direction.
     * @zh 获取当前向量和指定向量之间的有符号角度。<br/>
     * 有符号角度的取值范围为 (-180, 180]，当前向量可以通过逆时针旋转有符号角度与指定向量同向。<br/>
     * @param other specified vector
     * @return The signed angle between the current vector and the specified vector (in radians); if there is a zero vector in the current vector and the specified vector, 0 is returned.
     */
    UVec2.prototype.signAngle = function (other) {
        var angle = this.angle(other);
        return (this.x * other.y - this.y * other.x) < 0 ? -angle : angle;
    };
    /**
     * @en Rotates the current vector by an angle in radian value
     * @zh 将当前向量的旋转
     * @param radians radius of rotation
     */
    UVec2.prototype.rotate = function (radians) {
        var x = this.x;
        var y = this.y;
        var sin = Math.sin(radians);
        var cos = Math.cos(radians);
        this.x = cos * x - sin * y;
        this.y = sin * x + cos * y;
        return this;
    };
    /**
     * @en Projects the current vector on another one
     * @zh 计算当前向量在指定向量上的投影向量。
     * @param other specified vector
     */
    UVec2.prototype.project = function (other) {
        var scalar = this.dot(other) / other.dot(other);
        this.x = other.x * scalar;
        this.y = other.y * scalar;
        return this;
    };
    /**
     * 反射向量
     * @param normal
     * @returns
     */
    UVec2.prototype.reflect = function (normal) {
        var value = new UVec2_1();
        var dot = this.dot(normal);
        value.x = this.x - 2 * dot * normal.x;
        value.y = this.y - 2 * dot * normal.y;
        return value;
    };
    var UVec2_1;
    __decorate([
        XBase_1.xproperty(Number)
    ], UVec2.prototype, "x", void 0);
    __decorate([
        XBase_1.xproperty(Number)
    ], UVec2.prototype, "y", void 0);
    UVec2 = UVec2_1 = __decorate([
        XBase_1.xclass(UVec2_1)
    ], UVec2);
    return UVec2;
}(XBase_1.XBase));
exports.UVec2 = UVec2;
var AABB = /** @class */ (function (_super) {
    __extends(AABB, _super);
    function AABB() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.min = uu.v2();
        _this.max = uu.v2();
        return _this;
    }
    AABB_1 = AABB;
    AABB.prototype.minDistSq = function (point) {
        var dx = Math.max(this.min.x - point.x, 0);
        dx = Math.max(dx, point.x - this.max.x);
        var dy = Math.max(this.min.y - point.y, 0);
        dy = Math.max(dy, point.y - this.max.y);
        return dx * dx + dy * dy;
    };
    AABB.prototype.toJSON = function (serializeData) {
        if (serializeData === void 0) { serializeData = null; }
        var arr = [this.min.x, this.min.y, this.max.x, this.max.y];
        return {
            _cls_: "AABB",
            arr: arr
        };
    };
    AABB.prototype.fromJSON = function (obj, serializeData) {
        if (serializeData === void 0) { serializeData = null; }
        var arr = obj["arr"];
        this.min.x = arr[0];
        this.min.y = arr[1];
        this.max.x = arr[2];
        this.max.y = arr[3];
    };
    var AABB_1;
    __decorate([
        XBase_1.xproperty(XBase_1.XBase)
    ], AABB.prototype, "min", void 0);
    __decorate([
        XBase_1.xproperty(XBase_1.XBase)
    ], AABB.prototype, "max", void 0);
    AABB = AABB_1 = __decorate([
        XBase_1.xclass(AABB_1)
    ], AABB);
    return AABB;
}(XBase_1.XBase));
exports.AABB = AABB;
var UMatrix3 = /** @class */ (function (_super) {
    __extends(UMatrix3, _super);
    function UMatrix3() {
        var _this = _super.call(this) || this;
        _this.m = null;
        _this.m = [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1]
        ];
        return _this;
    }
    UMatrix3_1 = UMatrix3;
    UMatrix3.prototype.toJSON = function (serializeData) {
        if (serializeData === void 0) { serializeData = null; }
        var m = this.m;
        var arr = [];
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                arr.push(m[i][j]);
            }
        }
        return {
            _cls_: "UMatrix3",
            arr: arr
        };
    };
    UMatrix3.prototype.fromJSON = function (obj, serializeData) {
        if (serializeData === void 0) { serializeData = null; }
        var arr = obj["arr"];
        for (var n = 0; n < 9; n++) {
            var x = n % 3;
            var y = Math.floor(n / 3);
            this.m[y][x] = arr[n];
        }
    };
    UMatrix3.prototype.mul = function (right) {
        var retVal = new UMatrix3_1();
        var left = this;
        // row 0
        retVal.m[0][0] =
            left.m[0][0] * right.m[0][0] +
                left.m[0][1] * right.m[1][0] +
                left.m[0][2] * right.m[2][0];
        retVal.m[0][1] =
            left.m[0][0] * right.m[0][1] +
                left.m[0][1] * right.m[1][1] +
                left.m[0][2] * right.m[2][1];
        retVal.m[0][2] =
            left.m[0][0] * right.m[0][2] +
                left.m[0][1] * right.m[1][2] +
                left.m[0][2] * right.m[2][2];
        // row 1
        retVal.m[1][0] =
            left.m[1][0] * right.m[0][0] +
                left.m[1][1] * right.m[1][0] +
                left.m[1][2] * right.m[2][0];
        retVal.m[1][1] =
            left.m[1][0] * right.m[0][1] +
                left.m[1][1] * right.m[1][1] +
                left.m[1][2] * right.m[2][1];
        retVal.m[1][2] =
            left.m[1][0] * right.m[0][2] +
                left.m[1][1] * right.m[1][2] +
                left.m[1][2] * right.m[2][2];
        // row 2
        retVal.m[2][0] =
            left.m[2][0] * right.m[0][0] +
                left.m[2][1] * right.m[1][0] +
                left.m[2][2] * right.m[2][0];
        retVal.m[2][1] =
            left.m[2][0] * right.m[0][1] +
                left.m[2][1] * right.m[1][1] +
                left.m[2][2] * right.m[2][1];
        retVal.m[2][2] =
            left.m[2][0] * right.m[0][2] +
                left.m[2][1] * right.m[1][2] +
                left.m[2][2] * right.m[2][2];
        return retVal;
    };
    UMatrix3.createScale = function (x, y) {
        var val = new UMatrix3_1();
        val.m = [
            [x, 0, 0],
            [0, y, 0],
            [0, 0, 1]
        ];
        return val;
    };
    UMatrix3.createRotation = function (theta) {
        var val = new UMatrix3_1();
        val.m = [
            [Math.cos(theta), Math.sin(theta), 0],
            [-1 * Math.sin(theta), Math.cos(theta), 0],
            [0, 0, 1]
        ];
        return val;
    };
    UMatrix3.createTransform = function (v) {
        var val = new UMatrix3_1();
        val.m = [
            [1, 0, 0],
            [0, 1, 0],
            [v.x, v.y, 1]
        ];
        return val;
    };
    var UMatrix3_1;
    __decorate([
        XBase_1.xproperty(Array)
    ], UMatrix3.prototype, "m", void 0);
    UMatrix3 = UMatrix3_1 = __decorate([
        XBase_1.xclass(UMatrix3_1)
    ], UMatrix3);
    return UMatrix3;
}(XBase_1.XBase));
exports.UMatrix3 = UMatrix3;
