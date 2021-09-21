import APlayerController from "../../../Engine/Actor/Controller/PlayerController";
import { UInputSystem } from "../../../Engine/Engine/InputSystem/InputSystem";
import { Protocol } from "../../../Engine/Engine/NetworkSystem/Share/Protocol";
import { xclass, xproperty } from "../../../Engine/Engine/ReflectSystem/XBase";
import UGraphic from "../../../Engine/Engine/UGraphic";
import { UVec2, uu, UMath } from "../../../Engine/Engine/UMath";
import UWorld from "../../../Engine/Engine/World";

//申明一个状态同步的协议
export class APlayerShipControllerProtocol extends Protocol {
    //0.定义数据信息
    init() {
        this.dataLength = 4;
    }

    //1.定义数据访问格式，不一定只有一个，按照需要读写的数据来决定
    viewBuffer: Uint8Array = undefined;
    initView() {
        this.viewBuffer = this.getUint8(this.headLength, this.dataLength);
    }

    //读写数据，并进行自定义压缩
    setMoveForce(v) { this.viewBuffer[0] = this.zip01(v); }
    getMoveForce() { return this.unZip01(this.viewBuffer[0]); }

    setMoveX(v) { this.viewBuffer[1] = this.zip11(v); }
    getMoveX() { return this.unZip11(this.viewBuffer[1]); }

    setMoveY(v) { this.viewBuffer[2] = this.zip11(v); }
    getMoveY() { return this.unZip11(this.viewBuffer[2]); }

    setFireState(v: boolean) { this.viewBuffer[3] = this.zipBool(v); }
    getFireState() { return this.unZipBool(this.viewBuffer[3]); }
}

/**
 * 玩家控制器
 * 将玩家输入转入控制器，其它组件根据控制器获取玩家输入，进行更新
 * 注意 只记录状态，不要处理任何逻辑。因为逻辑可能在服务端更新
 */
@xclass(APlayerShipController)
export default class APlayerShipController extends APlayerController {
    //返回适配的网络协议
    getProtocol(id, sys) { return new APlayerShipControllerProtocol(id, sys); }

    //移动方向
    @xproperty(UVec2)
    moveDirection: UVec2 = uu.v2();

    @xproperty(Number)
    moveForce: number = 0;

    //开火方向
    @xproperty(UVec2)
    fireDirection: UVec2 = UVec2.ZERO();

    //是否处于开火状态
    isFire = false;

    //返回池里时主要是断开链接
    unUse() {
        super.unUse();
    }

    //从池里取出时 恢复数据为默认值
    reUse() {
        super.reUse();
        this.moveDirection.x = 0;
        this.moveDirection.y = 0;
        this.moveForce = 0;
        this.fireDirection.x = 0;
        this.fireDirection.y = 0;
        this.isFire = false;
    }

    //CLIENT
    protected processSelfInput(input: UInputSystem) {
        if (this.world.isClient && this == this.world.playerController) {
            //如果是网络同步模式，把数据传输出去
            if (!this.world.gameInstance.bStandAlone) {
                this.sendBinary(input);
            }
            //不管是不是单机模式，都要保证本地的输入及时的更新
            this.moveForce = input.leftJoyRate;
            this.moveDirection = input.leftJoyDir;
            this.isFire = input.isPassFireButton;
            // console.log(this.moveForce, this.moveDirection.x, this.moveDirection.y);
        }
    }

    //SERVER ONLY 
    //服务器接收二进制数据，用客户端的数据更新控制器状态。理论上客户端不会受到其它任何玩家（包含AI玩家）的输入。
    receiveBinary(protocol: APlayerShipControllerProtocol) {
        this.moveForce = protocol.getMoveForce();
        this.moveDirection.x = protocol.getMoveX();
        this.moveDirection.y = protocol.getMoveY()
        this.isFire = protocol.getFireState();
    }

    //注意，为了尽量减少发送的数据，需要先和上一帧的数据进行比较，然后再发送
    sendBinary(input) {
        let needSend = false;
        let protocol = this.getProtocol(this.id, this.world.gameInstance.protocolSystem);
        protocol.requestBufferView();
        
        if (this.moveForce != input.leftJoyRate) {
            needSend = true;
        }
        if (this.moveDirection.equals(input.leftJoyDir) == false) {
            needSend = true;
        }
        if (this.isFire != input.isPassFireButton) {
            needSend = true;
        }
        if (!needSend) {
            protocol.unRequestBufferView();
        }else{
            protocol.setMoveForce(input.leftJoyRate);
            protocol.setMoveX(input.leftJoyDir.x);
            protocol.setMoveY(input.leftJoyDir.y);
            protocol.setFireState(input.isPassFireButton);
        }

    }

    //暂时不要删除，后面写博客的时候，用这个JSON版本。
    // flootRate = 127;
    // sendJSON(input) {
    //     let obj = {};
    //     let needSend = false;
    //     if (this.moveForce != input.leftJoyRate) {
    //         this.moveForce = input.leftJoyRate;
    //         obj["1"] = Math.floor(this.moveForce * this.flootRate)
    //         needSend = true;
    //     }
    //     if (this.moveDirection.equals(input.leftJoyDir) == false) {
    //         obj["2"] = Math.floor(this.moveDirection.x * this.flootRate)
    //         obj["3"] = Math.floor(this.moveDirection.y * this.flootRate)
    //         this.moveDirection = input.leftJoyDir;
    //         needSend = true;
    //     }
    //     if (this.isFire != input.isPassFireButton) {
    //         this.isFire = input.isPassFireButton;
    //         obj["4"] = this.isFire;
    //         needSend = true;
    //     }
    //     if (needSend) {
    //         this.world.gameInstance.sendGameData(obj, this);
    //     }
    // }

    // //SERVER
    // receiveData(obj: Object) {
    //     if (obj["1"] != undefined) {
    //         this.moveForce = obj["1"] / this.flootRate;
    //     }
    //     if (obj["2"] != undefined && obj["3"] != undefined) {
    //         this.moveDirection.x = obj["2"] / this.flootRate;
    //         this.moveDirection.y = obj["3"] / this.flootRate;
    //     }
    //     if (obj["4"] != undefined) {
    //         this.isFire = obj["4"];
    //     }
    // }
}