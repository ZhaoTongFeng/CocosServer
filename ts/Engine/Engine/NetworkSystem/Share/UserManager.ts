import Manager from "./Manager";
import User from "./User";
import { xclass, xproperty, xStatusSync } from "../../ReflectSystem/XBase";
import NetworkSystem from "./NetworkSystem";
import { NetCmd } from "./NetCmd";


@xclass(UserManager)
@xStatusSync(["userIdMap"])
export default class UserManager extends Manager {
    //连接状态用户
    @xproperty(Map)
    public userIdMap: Map<string, User> = new Map();

    public getUserById(id: string) {
        return this.userIdMap.get(id);
    }
    public init(ns: NetworkSystem) {
        super.init(ns);
        ns.register(NetCmd.USER_LIST, this.onGetList, this);
    }

    protected add(id_user) { }
    public onGetList(...args) { }

    //获取用户
    protected select(id) { }
    protected insert(user: User) { }
    protected update(user: User) { }
    protected delete(id) { }
    onConnected(...args) { }
}