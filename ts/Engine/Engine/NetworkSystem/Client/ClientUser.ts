import { xclass, XBase, xproperty, xClient } from "../../ReflectSystem/XBase";
import User from "../Share/User";

@xClient("User")
@xclass(ClientUser)

export default class ClientUser extends User {

}