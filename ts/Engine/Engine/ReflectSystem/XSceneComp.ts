import { UVec2 } from "../UMath";
import { notify, XBase } from "./XBase";

export default class XSceneComp extends XBase {
    @notify()
    pos: UVec2 = new UVec2();
}
