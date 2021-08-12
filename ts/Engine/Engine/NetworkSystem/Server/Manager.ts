import { XBase, xclass } from "../../ReflectSystem/XBase";
import UNetworkSystem from "./NetworkSystem";

@xclass(Manager)
export default class Manager extends XBase {
    public ns: UNetworkSystem = null;

    //0.注册回调
    init(ns: UNetworkSystem) {
        this.ns = ns;

    }

    public getUserByKey(key: string) {
        return this.ns.getUserByKey(key);
    }
    public getUserById(id: string) {
        return this.ns.getUserById(id);
    }
    public getRoomById(id: string) {
        return this.ns.getRoomById(id);
    }
}