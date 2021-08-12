import { UMath, UVec2 } from "./UMath";

/**
 * TODO 后面得自己整个随机数算法
 */

export default class URandom {
    static randomVec() {
        const scale = 1.0;
        const r = Math.random() * 2.0 * UMath.PI;
        let vec = new UVec2();
        vec.x = UMath.cos(r) * scale;
        vec.y = UMath.sin(r) * scale;
        return vec;
    }

    static randomf() {
        return Math.random();
    }
}