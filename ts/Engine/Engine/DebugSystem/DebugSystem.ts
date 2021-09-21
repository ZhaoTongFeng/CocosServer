import AController from "../../Actor/Controller/Controller";
import APawn from "../../Actor/Pawn/Pawn";
import UObject from "../../Object";
import ClientUserManager from "../NetworkSystem/Client/ClientUserManager";
import { XBase, xclass } from "../ReflectSystem/XBase";
import UGraphic from "../UGraphic";
import { UColor, uu, UVec2 } from "../UMath";
import UWorld from "../World";

@xclass(UDebugSystem)
export class UDebugSystem extends UObject {
    world: UWorld = null;

    debugAll(graphic: UGraphic) {
        // this.drawGrid(graphic);
        // this.drawScreen(graphic);
        if (this.world.isDebug) {
            this.world.actors.forEach(actor => { actor.drawDebug(graphic); });
        }

    }

    //一个格子宽度
    gridWidth = 750;
    //列
    gridCol = 10;
    //行
    gridRow = 10;
    drawGrid(graphic: UGraphic) {
        let userMng = this.world.gameInstance.network.userManager as ClientUserManager;
        let con = this.world.pUserControllerMap.get(userMng.id_loc);
        let pawn: APawn = null;
        if (con) {
            pawn = con.pawn;
        }
        let gridWidth = this.gridWidth
        let gridCol = this.gridCol;
        let gridRow = this.gridRow;
        let offsetCol = gridCol / 2;
        let offsetRow = gridRow / 2;
        for (let i = 0; i < gridRow; i++) {
            for (let j = 0; j < gridCol; j++) {
                if (pawn) {
                    let pos = pawn.getPosition();
                    let x = Math.floor(pos.x / gridWidth) + offsetCol;
                    let y = Math.floor(pos.y / gridWidth) + offsetRow;
                    if (x == j && y == i) {

                        for (let m = -1; m <= 1; m++) {
                            for (let n = -1; n <= 1; n++) {
                                let tx = x + n;
                                let ty = y + m;
                                if (tx >= 0 && tx < gridCol && ty >= 0 && ty < gridRow) {
                                    if (m == 0 && n == 0) {
                                        graphic.drawRect((tx - offsetCol) * gridWidth, (ty - offsetRow) * gridWidth, gridWidth, gridWidth, UColor.WHITE(), UColor.RED(), 10);
                                    } else {
                                        graphic.drawRect((tx - offsetCol) * gridWidth, (ty - offsetRow) * gridWidth, gridWidth, gridWidth, UColor.WHITE(), UColor.BLUE(), 10);
                                    }
                                }

                            }
                        }
                    } else {
                        graphic.drawRect((j - offsetCol) * gridWidth, (i - offsetRow) * gridWidth, gridWidth, gridWidth, UColor.WHITE(), UColor.BLACK(), 10);
                    }

                } else {
                    graphic.drawRect((j - offsetCol) * gridWidth, (i - offsetRow) * gridWidth, gridWidth, gridWidth, UColor.WHITE(), UColor.BLACK(), 10);
                }

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