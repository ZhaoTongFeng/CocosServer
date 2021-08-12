import { UColor, UMatrix3, URect, uu, UVec2 } from "../UMath";
import { xclass, XBase, xproperty } from "./XBase";
import XTest2 from "./XTest2";


/**
 * 类装饰器
 * 基础写法：@xclass(类名)
 * 不能写成@xclass
 */






@xclass(XTest1, { title: "英雄" })
export default class XTest1 extends XBase {

    @xproperty(XBase)
    parent: XBase = null;


    @xproperty(Number, { _k_: "num_clas1", n: 1, tyoe: "input", min: 0, max: 10 })
    num: number = 2;

    @xproperty(String, { title: "名字", type: "label" })
    name1: string = "";

    abc: number = 0;

    //cc属性
    @xproperty(UVec2)
    pos: UVec2 = uu.v2(1, 2);

    @xproperty(UColor)
    color: UColor = uu.color(1, 2, 3, 4);

    @xproperty(URect)
    rect: URect = uu.rect(1, 2, 3, 4);

    @xproperty(UMatrix3)
    matrix: UMatrix3 = uu.matrix3();



    onToJSON(obj) {
        obj["abc"] = "456";
    }

    onFromJSON(obj) {
        this.abc = obj['abc'];

    }
}
