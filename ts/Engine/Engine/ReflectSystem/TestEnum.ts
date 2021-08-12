import { xenum } from "./XBase";

export enum TestEnum {
    A = 1,
    B = 3,
    C = 2
}
xenum("TestEnum", TestEnum, {
    titles: {
        1: "选项一",
        2: "选项二",
        3: "选项三"
    }
});