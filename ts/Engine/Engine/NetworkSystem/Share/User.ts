import { xclass, XBase, xproperty } from "../../ReflectSystem/XBase";
import UserManager from "./UserManager";


export enum ConnectionStatus {
    CONNECTING, //连接中
    CONNECTED,  //已连接
    LOSE,       //断线
}

@xclass(User)
export default class User extends XBase {
    //用户ID
    @xproperty(String)
    public id_user: string = "";

    //服务端 连接标识
    @xproperty(String)
    public key_conn: string = "";

    //当前所在房间
    @xproperty(String)
    public id_room: string = "";

    //连接状态
    @xproperty(Number)
    public conState: ConnectionStatus = ConnectionStatus.CONNECTING;

    //客户端是否准备就绪
    @xproperty(Number)
    public game_ready = 0;

    //关卡是否加载
    @xproperty(Number)
    public game_loaded = 0;

    //游戏运行时，对应的控制器ID
    public id_controller: string = "";
    
    //总延迟
    getTotalDelay() { return this.delay_serverToClient + this.delay_clientToServer; }
    //客户端到服务器延迟
    @xproperty(Number)
    delay_clientToServer: number = 0;
    //服务器到客户端延迟
    @xproperty(Number)
    delay_serverToClient: number = 0;


    //心跳计时器
    serverHartTick: number = 0;
    public mng: UserManager = null;
    init(mng: UserManager) { this.mng = mng; }
}