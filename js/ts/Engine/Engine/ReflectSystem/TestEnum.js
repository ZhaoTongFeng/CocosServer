"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestEnum = void 0;
var XBase_1 = require("./XBase");
var TestEnum;
(function (TestEnum) {
    TestEnum[TestEnum["A"] = 1] = "A";
    TestEnum[TestEnum["B"] = 3] = "B";
    TestEnum[TestEnum["C"] = 2] = "C";
})(TestEnum = exports.TestEnum || (exports.TestEnum = {}));
XBase_1.xenum("TestEnum", TestEnum, {
    titles: {
        1: "选项一",
        2: "选项二",
        3: "选项三"
    }
});
