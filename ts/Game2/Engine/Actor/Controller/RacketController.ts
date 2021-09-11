import APlayerController from "../../../../Engine/Actor/Controller/PlayerController";
import { UInputSystem } from "../../../../Engine/Engine/InputSystem/InputSystem";
import { xclass } from "../../../../Engine/Engine/ReflectSystem/XBase";
import UGraphic from "../../../../Engine/Engine/UGraphic";
import { uu } from "../../../../Engine/Engine/UMath";
import UWorld from "../../../../Engine/Engine/World";
import RacketMovement from "../../Component/RacketMovement";

@xclass(ARacketController)

export default class ARacketController extends APlayerController {

    racketMovement: RacketMovement = null;

    //将本地操作发送
    protected processSelfInput(input: UInputSystem) {
        if (input.isTouch) {
            let pos = input.clickPos;
            this.sendData(pos.toJSON());
        }
    }

    //处理网络输入
    receiveData(obj: Object) {
        let pos = uu.v2();
        pos.fromJSON(obj);
        this.racketMovement.targetPos = pos;
    }
}
