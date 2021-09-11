import AController from "../../Actor/Controller/Controller";
import UObject from "../../Object";
import { XBase, xclass } from "../ReflectSystem/XBase";
import UGraphic from "../UGraphic";
import { UColor, uu, UVec2 } from "../UMath";
import UWorld from "../World";

@xclass(UDebugSystem)
export class UDebugSystem extends UObject {
    world: UWorld = null;

    debugAll(graphic: UGraphic) {
        this.drawGrid(graphic);
        // this.drawScreen(graphic);
        this.world.actors.forEach(actor => { actor.drawDebug(graphic); });
    }

    //一个格子宽度
    gridWidth = 1500;
    //列
    gridCol = 10;
    //行
    gridRow = 10;
    drawGrid(graphic: UGraphic) {
        let gridWidth = this.gridWidth
        let gridCol = this.gridCol;
        let gridRow = this.gridRow;
        for (let i = 0; i < gridRow; i++) {
            for (let j = 0; j < gridCol; j++) {

                graphic.drawRect(j * gridWidth, i * gridWidth, gridWidth, gridWidth, UColor.WHITE());
            }
        }
    }
    drawScreen(graphic: UGraphic) {
        let winSize = this.world.gameInstance.getWorldView().winSize;
        graphic.drawRect(winSize.x * -1, winSize.y * -1, winSize.x * 2, winSize.y * 2, UColor.BLUE());
    }

    init(world: UWorld) {
        super.init(world);
        this.world = world;
    }
}