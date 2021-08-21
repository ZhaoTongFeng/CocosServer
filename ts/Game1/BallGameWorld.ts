import { xclass } from "../Engine/Engine/ReflectSystem/XBase";
import { uu } from "../Engine/Engine/UMath";
import UWorld from "../Engine/Engine/World";
import ARacketController from "./Engine/Actor/Controller/RacketController";
import ARacket from "./Engine/Actor/Racket";
import RacketMovement from "./Engine/Component/RacketMovement";

//游戏关卡二
@xclass(BallGameWorld)
export default class BallGameWorld extends UWorld {

    movement: RacketMovement = null;
    public init(data: any = null) {
        super.init(data);
        console.log("BallGameWorld")

        let racket1 = this.spawn(ARacket);

        let movement = racket1.spawnComponent(RacketMovement);
        this.movement = movement;

        let controller1 = this.spawn(ARacketController);
        controller1.process(racket1);
        controller1.racketMovement = movement;
    }

}