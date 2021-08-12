
import { UVec2 } from "../UMath";
import { XBase, xclass, xproperty } from "./XBase";
import XTest1 from "./XTest1";







@xclass(XTest2, { title: "物品" })
export default class XTest2 extends XTest1 {



    @xproperty(Number, { _k_: "num_clas2", n: 1, tyoe: "input", min: 0, max: 10 })
    num: number = 3;


    @xproperty(XTest1)
    pointer: XTest1 = null;



    //不序列化的属性
    @xproperty(String)
    qwds: string;


    //属性继承
    /**
     * _k_:属性别名
     * 如果设置类_key，则name2可以随意改名，不影响存档文件
     */
    @xproperty(String, { _k_: "ergfdsg" })
    name425: string; //普通属性

    //类作为属性
    //普通属性
    @xproperty(XTest1, { _k_: "hrthtrdh" })
    cls1: XTest1;

    /**
     * __item__:容器元素类型
     */
    @xproperty(Array)
    poss: UVec2[];

    //普通属性数组
    @xproperty(Array, {})
    arr1: number[];

    //特殊类数组
    @xproperty(Array)
    arr2: XTest1[];

    //MapKey只能是字符串
    //特殊Map
    @xproperty(Map)
    mp1: Map<string, XTest1>;

    @xproperty(Map, {})
    mp2: Map<string, number>;


    // //特殊Set
    @xproperty(Set)
    st1: Set<XTest1>;

    @xproperty(Set, {})
    st2: Set<string>;

    @xproperty(Set, {})
    st3: Set<number>;

    @xproperty(XTest1)
    nul: XTest1 = null;


    @xproperty(XTest1)
    defclss: XTest1 = new XTest1();

    //序列化接口
    onToJSON(obj) {
        obj["abc"] = "123";
    }

    onFromJSON(obj) {
        this.abc = obj['abc'];
    }
}
