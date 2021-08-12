import AController from "../../Actor/Controller/Controller";
import UObject from "../../Object";
import { XBase, xclass } from "../ReflectSystem/XBase";
import { uu, UVec2 } from "../UMath";
import UWorld from "../World";

@xclass(UInputSystem)
export class UInputSystem extends UObject {
    world: UWorld = null;
    controllers: Map<string, AController> = new Map();

    register(controller: AController) {
        this.controllers.set(controller.id, controller);
    }
    unRegister(controller: AController) {
        this.controllers.delete(controller.id);
    }

    processNetInput(datas: object[]) {
        datas.forEach(data => {
            let id = data[0];
            let controller = this.controllers.get(id);
            if (controller) {
                controller.receiveData(data[1]);
            }
        });
    }


    init(world: UWorld) {
        super.init(world);
        this.world = world;

    }
}