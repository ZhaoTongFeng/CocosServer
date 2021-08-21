import { xclass, XBase } from "../../ReflectSystem/XBase";
import NetworkSystem from "./NetworkSystem";


@xclass(Manager)
export default class Manager extends XBase {
    public ns: NetworkSystem = null;

    //0.注册回调
    init(ns: NetworkSystem) {
        this.ns = ns;
    }


    public getUserById(id: string) {
        return this.ns.getUserById(id);
    }
    public getRoomById(id: string) {
        return this.ns.getRoomById(id);
    }
}