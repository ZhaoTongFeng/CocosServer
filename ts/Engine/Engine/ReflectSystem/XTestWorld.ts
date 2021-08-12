import { xclass, XBase, xproperty } from "./XBase";


@xclass(XTestWorld)
export default class XTestWorld extends XBase {

    @xproperty(Array)
    objects: XBase[] = [];
}
