import UObject from "../../Object";
import UGameInstance from "../GameInstance";
import { xclass } from "../ReflectSystem/XBase";



@xclass(UAudioSystem)
export class UAudioSystem extends UObject {
    instance: UGameInstance = null;

    init(instance: UGameInstance) {
        super.init(instance);
        this.instance = instance;

    }
}