import { SerializeData, XBase, xclass, xproperty } from "./ReflectSystem/XBase";


export class uu {
    static v2(x: number = 0, y: number = 0) {
        let val = new UVec2();
        val.x = x;
        val.y = y;
        return val;
    }

    static matrix3() {
        let val = new UMatrix3();
        return val;
    }

    static rect(x = 0, y = 0, w = 0, h = 0) {
        let val = new URect();
        val.x = x;
        val.y = y;
        val.w = w;
        val.h = h;
        return val;
    }

    static color(r = 0, g = 0, b = 0, a = 0) {
        let val = new UColor();
        val.r = r;
        val.g = g;
        val.b = b;
        val.a = a;
        return val;
    }
}

export class UMath {
    static PI: number = 3.1415926535;
    static TwoPI: number = UMath.PI * 2;
    static PIOve2: number = UMath.PI / 2;
    static EPSILON: number = 0.000001;

    static toRadians(degrees: number) {
        return degrees * UMath.PI / 180;
    }
    static toDegrees(radians: number) {
        return radians * 180 / UMath.PI;
    }
    static nearZero(val: number, epsilon: number = 0.01) {
        return Math.abs(val) <= epsilon
    }
    static max(a: number, b: number) {
        return a < b ? b : a;
    }
    static min(a: number, b: number) {
        return a < b ? a : b;
    }

    static clamp(val: number, min: number, max: number) {
        if (min > max) {
            const temp = min;
            min = max;
            max = temp;
        }

        return val < min ? min : val > max ? max : val;
    }

    static clamp01(val: number) {
        return val < 0 ? 0 : val > 1 ? 1 : val;
    }
    static abs(val: number) {
        return Math.abs(val);
    }
    static cos(angle: number) {
        return Math.cos(angle);
    }
    static sin(angle: number) {
        return Math.sin(angle);
    }
    static tan(angle: number) {
        return Math.sin(angle);
    }
    static acos(value: number) {
        return Math.acos(value);
    }
    static atan(y: number, x: number) {
        return Math.atan2(y, x);
    }
    static cot(angle: number) {
        return 1 / Math.tan(angle);
    }
    static lerp(a: number, b: number, f: number) {
        return a + f * (b - a);
    }
    static sqrt(val: number) {
        return Math.sqrt(val);
    }
    static equals(a: number, b: number, epsilon = UMath.EPSILON) {
        return Math.abs(a - b) <= epsilon * Math.max(1.0, Math.abs(a), Math.abs(b));
    }

    // static fmod(number,denom){}
}


@xclass(UColor)
export class UColor extends XBase {
    public clone() {
        return uu.color(this.r, this.g, this.b, this.a);
    }
    static RED() {
        return uu.color(255, 0, 0, 255);
    }
    static GREEN() {
        return uu.color(0, 255, 0, 255);
    }
    static BLUE() {
        return uu.color(0, 0, 255, 255);
    }
    static BLACK() {
        return uu.color(0, 0, 0, 255);
    }
    static WHITE() {
        return uu.color(255, 255, 255, 255);
    }
    static YELLOW() {
        return uu.color(255, 255, 0, 255);
    }



    @xproperty(Number)
    r: number = 0;
    @xproperty(Number)
    g: number = 0;
    @xproperty(Number)
    b: number = 0;
    @xproperty(Number)
    a: number = 0;

    public set(r: number, g: number, b: number, a: number) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    public toJSON(serializeData: SerializeData = null): Object {
        let arr = [this.r, this.g, this.b, this.a];
        return {
            _cls_: "UColor",
            arr: arr
        };
    }
    public fromJSON(obj: Object, serializeData: SerializeData = null) {
        let arr = obj["arr"];
        this.set(arr[0], arr[1], arr[2], arr[3]);
    }

}

@xclass(URect)
export class URect extends XBase {
    public clone() {
        return uu.rect(this.x, this.y, this.w, this.h);
    }

    @xproperty(Number)
    x: number = 0;
    @xproperty(Number)
    y: number = 0;
    @xproperty(Number)
    w: number = 0;
    @xproperty(Number)
    h: number = 0;

    public set(x: number, y: number, w: number, h: number) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    public toJSON(serializeData: SerializeData = null): Object {
        let arr = [this.x, this.y, this.w, this.h];
        return {
            _cls_: "URect",
            arr: arr
        };
    }
    public fromJSON(obj: Object, serializeData: SerializeData = null) {
        let arr = obj["arr"];
        this.set(arr[0], arr[1], arr[2], arr[3]);
    }
}

@xclass(UVec2)
export class UVec2 extends XBase {
    @xproperty(Number)
    public x: number = 0;

    @xproperty(Number)
    public y: number = 0;

    public clone() {
        return uu.v2(this.x, this.y);
    }
    static ZERO() {
        return uu.v2(0, 0);
    }
    static ONE() {
        return uu.v2(1, 1);
    }

    public set(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    public toJSON(serializeData: SerializeData = null): Object {
        let arr = [this.x, this.y];
        return {
            _cls_: "UVec2",
            arr: arr
        };
    }
    public fromJSON(obj: Object, serializeData: SerializeData = null) {
        if(obj instanceof Array){
            obj = obj[0];
        }
        let arr = obj["arr"];
        this.set(arr[0], arr[1]);
    }

    //加
    public add(v: UVec2) {
        let value = new UVec2();
        value.x = this.x + v.x;
        value.y = this.y + v.y;
        return value;
    }
    public addSelf(v: UVec2) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }
    //减
    public sub(v: UVec2) {
        let value = new UVec2();
        value.x = this.x - v.x;
        value.y = this.y - v.y;
        return value;
    }
    public subSelf(v: UVec2) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }

    //点乘
    public mul(v: number) {
        let value = new UVec2();
        value.x = this.x * v;
        value.y = this.y * v;
        return value;
    }
    public mulSelf(v: number) {
        this.x *= v;
        this.y *= v;
        return this;
    }
    public mulVec2(v: UVec2) {
        let value = new UVec2();
        value.x = this.x * v.x;
        value.y = this.y * v.y;
        return value;
    }
    public mulVec2Self(v: UVec2) {
        this.x *= v.x;
        this.y *= v.y;
        return this;
    }

    public dot(v: UVec2) {
        return this.x * v.x + this.y * v.y;
    }
    //叉乘
    public cross(other: UVec2) {
        return this.x * other.y - this.y * other.x;
    }
    //除
    public divide(other: UVec2) {
        let value = new UVec2();
        value.x = this.x / other.x;
        value.y = this.y / other.y;
        return value;
    }
    public divideSelf(other: UVec2) {
        this.x /= other.x;
        this.y /= other.y;
        return this;
    }

    //约等于
    public equals(other: UVec2, epsilon = UMath.EPSILON) {
        return (
            Math.abs(this.x - other.x)
            <= epsilon * Math.max(1.0, Math.abs(this.x), Math.abs(other.x))
            && Math.abs(this.y - other.y)
            <= epsilon * Math.max(1.0, Math.abs(this.y), Math.abs(other.y))
        );
    }
    public equals2f(x: number, y: number, epsilon = UMath.EPSILON) {
        return (
            Math.abs(this.x - x)
            <= epsilon * Math.max(1.0, Math.abs(this.x), Math.abs(x))
            && Math.abs(this.y - y)
            <= epsilon * Math.max(1.0, Math.abs(this.y), Math.abs(y))
        );
    }
    public equalZero(epsilon = UMath.EPSILON) {
        return UMath.equals(this.x, 0, epsilon) && UMath.equals(this.y, 0, epsilon)
    }
    public equalsOne(epsilon = UMath.EPSILON) {
        return UMath.equals(this.x, 1, epsilon) && UMath.equals(this.y, 1, epsilon)
    }

    //严格等于
    public strictEquals(other: UVec2) {
        return other && this.x === other.x && this.y === other.y;
    }
    public strictEquals2f(x: number, y: number) {
        return this.x === x && this.y === y;
    }


    public lengthSq() {
        return this.x * this.x + this.y * this.y;
    }
    public length() {
        return UMath.sqrt(this.lengthSq());
    }
    public normalize() {
        let value = new UVec2();
        value.x = this.x;
        value.y = this.y;

        const leng = value.length();
        value.x /= leng;
        value.y /= leng;
        return value;
    }
    public normalizeSelf() {
        const leng = this.length();
        this.x /= leng;
        this.y /= leng;
    }

    public lerp(b: UVec2, f: number) {
        const x = this.x;
        const y = this.y;
        this.x = x + f * (b.x - x);
        this.y = y + f * (b.y - y);
        return this;
    }
    public clamp(minInclusive: UVec2, maxInclusive: UVec2) {
        this.x = UMath.clamp(this.x, minInclusive.x, maxInclusive.x);
        this.y = UMath.clamp(this.y, minInclusive.y, maxInclusive.y);
        return this;
    }

    /**
     * @en Calculates radian angle between two vectors
     * @zh 获取当前向量和指定向量之间的角度。
     * @param other specified vector
     * @return The angle between the current vector and the specified vector (in radians); if there are zero vectors in the current vector and the specified vector, 0 is returned.
     */
    public angle(other: UVec2) {
        const magSqr1 = this.lengthSq();
        const magSqr2 = other.lengthSq();

        if (magSqr1 === 0 || magSqr2 === 0) {
            console.warn('Can\'t get angle between zero vector');
            return 0.0;
        }

        const dot = this.dot(other);
        let theta = dot / (Math.sqrt(magSqr1 * magSqr2));
        theta = UMath.clamp(theta, -1.0, 1.0);
        return Math.acos(theta);
    }

    /**
     * @en Get angle in radian between this and vector with direction.
     * @zh 获取当前向量和指定向量之间的有符号角度。<br/>
     * 有符号角度的取值范围为 (-180, 180]，当前向量可以通过逆时针旋转有符号角度与指定向量同向。<br/>
     * @param other specified vector
     * @return The signed angle between the current vector and the specified vector (in radians); if there is a zero vector in the current vector and the specified vector, 0 is returned.
     */
    public signAngle(other: UVec2) {
        const angle = this.angle(other);
        return (this.x * other.y - this.y * other.x) < 0 ? -angle : angle;
    }

    /**
     * @en Rotates the current vector by an angle in radian value
     * @zh 将当前向量的旋转
     * @param radians radius of rotation
     */
    public rotate(radians: number) {
        const x = this.x;
        const y = this.y;

        const sin = Math.sin(radians);
        const cos = Math.cos(radians);
        this.x = cos * x - sin * y;
        this.y = sin * x + cos * y;
        return this;
    }

    /**
     * @en Projects the current vector on another one
     * @zh 计算当前向量在指定向量上的投影向量。
     * @param other specified vector
     */
    public project(other: UVec2) {
        const scalar = this.dot(other) / other.dot(other);
        this.x = other.x * scalar;
        this.y = other.y * scalar;
        return this;
    }
    /**
     * 反射向量
     * @param normal 
     * @returns 
     */
    public reflect(normal: UVec2) {
        let value = new UVec2();
        let dot = this.dot(normal);
        value.x = this.x - 2 * dot * normal.x;
        value.y = this.y - 2 * dot * normal.y;
        return value;
    }
}

@xclass(AABB)
export class AABB extends XBase {
    @xproperty(XBase)
    min: UVec2 = uu.v2();
    @xproperty(XBase)
    max: UVec2 = uu.v2();

    minDistSq(point: UVec2) {
        let dx = Math.max(this.min.x - point.x, 0);
        dx = Math.max(dx, point.x - this.max.x);
        let dy = Math.max(this.min.y - point.y, 0);
        dy = Math.max(dy, point.y - this.max.y);
        return dx * dx + dy * dy;
    }

    public toJSON(serializeData: SerializeData = null): Object {
        let arr = [this.min.x, this.min.y, this.max.x, this.max.y];
        return {
            _cls_: "AABB",
            arr: arr
        };
    }

    public fromJSON(obj: Object, serializeData: SerializeData = null) {
        let arr = obj["arr"];
        this.min.x = arr[0];
        this.min.y = arr[1];
        this.max.x = arr[2];
        this.max.y = arr[3];
    }
}


@xclass(UMatrix3)
export class UMatrix3 extends XBase {
    @xproperty(Array)
    public m: number[][] = null;
    public toJSON(serializeData: SerializeData = null): Object {
        const m = this.m;
        let arr = [];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                arr.push(m[i][j]);
            }
        }
        return {
            _cls_: "UMatrix3",
            arr: arr
        };
    }
    public fromJSON(obj: Object, serializeData: SerializeData = null) {
        let arr = obj["arr"];
        for (let n = 0; n < 9; n++) {
            let x = n % 3;
            let y = Math.floor(n / 3);
            this.m[y][x] = arr[n];
        }
    }

    constructor() {
        super();
        this.m = [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1]
        ]
    }

    mul(right: UMatrix3) {
        let retVal = new UMatrix3();
        let left = this;
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
    }

    static createScale(x: number, y: number) {
        let val = new UMatrix3();
        val.m = [
            [x, 0, 0],
            [0, y, 0],
            [0, 0, 1]
        ]
        return val;
    }

    static createRotation(theta: number) {
        let val = new UMatrix3();
        val.m = [
            [Math.cos(theta), Math.sin(theta), 0],
            [-1 * Math.sin(theta), Math.cos(theta), 0],
            [0, 0, 1]
        ]
        return val;
    }

    static createTransform(v: UVec2) {
        let val = new UMatrix3();
        val.m = [
            [1, 0, 0],
            [0, 1, 0],
            [v.x, v.y, 1]
        ]
        return val;
    }

}