import AController from "../../Actor/Controller/Controller";
import UObject from "../../Object";
import { XBase, xclass } from "../ReflectSystem/XBase";
import UGraphic from "../UGraphic";
import { UColor, uu, UVec2 } from "../UMath";
import UWorld from "../World";

@xclass(UDebugSystem)
export class UDebugSystem extends UObject {
    world: UWorld = null;

    debugAll(graphic: UGraphic){
        let winSize = this.world.gameInstance.getWorldView().winSize;
        graphic.drawRect(winSize.x * -1, winSize.y * -1, winSize.x * 2, winSize.y * 2, UColor.BLUE());
        this.world.actors.forEach(actor => {
            actor.drawDebug(graphic);
        });
    }

    init(world: UWorld) {
        super.init(world);
        this.world = world;
    }
}