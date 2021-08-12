"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.XTestMain = void 0;
var UMath_1 = require("../UMath");
var XBase_1 = require("./XBase");
var XTest2_1 = __importDefault(require("./XTest2"));
var XTestWorld_1 = __importDefault(require("./XTestWorld"));
function XTestMain() {
    XBase_1.XManager.Ins.print();
    var a = new XTest2_1.default();
    //指向自身的指针
    a.parent = a;
    //根据类名创建实例
    var c1 = XBase_1.XManager.Ins.getInstanceByStr("XTest1");
    var c2 = XBase_1.XManager.Ins.getInstanceByStr("XTest1");
    //设置简单属性
    a.name1 = "name1";
    a.num = 10;
    a.setProperty("pos", UMath_1.uu.v2(1213, 123));
    c1.abc = 12;
    c1.num = 1;
    c2.num = 2;
    c1.name1 = "1";
    c2.name1 = "2";
    a.pos.x = 3;
    a.pos.y = 4;
    //相互指向的指针
    c1.parent = a;
    c2.parent = null;
    a.pointer = c1;
    a.cls1 = c2;
    //普通数组
    a.arr1 = [1, 2, 3, 4, 5];
    //对象数组
    a.arr2 = [c1, c2];
    a.poss = [a.pos, a.pos];
    //对象映射
    a.mp1 = new Map();
    a.mp1.set("1", c1);
    a.mp1.set("2", c2);
    //普通映射
    a.mp2 = new Map();
    a.mp2.set("1", 1);
    a.mp2.set("2", 2);
    a.mp2.set("3", 3);
    //对象集合
    a.st1 = new Set();
    a.st1.add(c1);
    a.st1.add(c2);
    //普通集合
    a.st2 = new Set();
    a.st2.add("a");
    a.st2.add("b");
    a.st2.add("c");
    a.st3 = new Set();
    a.st3.add(1);
    a.st3.add(2);
    a.st3.add(3);
    console.log("还原前", a);
    //复制粘贴一个
    // let jsonStr2 = JSON.stringify(a.toJSON());
    // console.log(jsonStr2);
    // let jsonArr: Array<Object> = JSON.parse(jsonStr2);
    // console.log(jsonArr);
    var d = new XTest2_1.default();
    // d.fromJSON(jsonArr)
    d.fromJSON(a.toJSON());
    d.pointer.num = 99;
    console.log("新对象", d);
    console.log("老对象", a);
    //模拟游戏世界
    var world = new XTestWorld_1.default();
    for (var i = 0; i < 10; i++) {
        var copy = a.getCopy(XTest2_1.default);
        world.objects.push(copy);
    }
    console.log("老世界", world);
    var worldCopy = world.getCopy(XTestWorld_1.default);
    console.log("新世界", worldCopy);
    console.log(worldCopy.toJSON());
}
exports.XTestMain = XTestMain;
// //属性变化监听装饰器
// function testNotify() {
//     let sceneComp = new XSceneComp();
//     sceneComp.on("pos", (value) => {
//         console.log("pos发生变化,新值为", value)
//     }, sceneComp);
//     sceneComp.pos = new UVec2();
//     console.log(sceneComp.pos);
//     console.log("设置之后", sceneComp);
// }
