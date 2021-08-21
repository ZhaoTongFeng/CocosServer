import AController from "../../Actor/Controller/Controller";
import UObject from "../../Object";
import UGameInstance from "../GameInstance";
import { XBase, xclass } from "../ReflectSystem/XBase";
import { uu, UVec2 } from "../UMath";
import UWorld from "../World";

/**
 * 多个关卡管理
 * 关卡流送
 * 关卡剔除
 */
@xclass(LevelSystem)
export class LevelSystem extends UObject {
    instance: UGameInstance = null;

    init(instance: UGameInstance) {
        super.init(instance);
        this.instance = instance;

    }
}