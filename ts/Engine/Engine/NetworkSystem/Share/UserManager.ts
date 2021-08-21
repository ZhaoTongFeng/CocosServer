import Manager from "./Manager";
import User from "./User";
import { xclass } from "../../ReflectSystem/XBase";


@xclass(UserManager)
export default class UserManager extends Manager {
    //连接状态用户
    public userIdMap: Map<string, User> = new Map();

    public getUserById(id: string) {
        return this.userIdMap.get(id);
    }

    protected add(id_user) { }

    //获取用户
    protected select(id) { }
    protected insert(user: User) { }
    protected update(user: User) { }
    protected delete(id) { }
    onConnected(...args) { }
}