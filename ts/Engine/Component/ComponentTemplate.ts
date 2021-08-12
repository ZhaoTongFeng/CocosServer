
import { UInput } from "../Engine/InputSystem/Input";
import { xclass } from "../Engine/ReflectSystem/XBase";
import UGraphic from "../Engine/UGraphic";
import UObject from "../Object";

/**
 * TODO Component 基本生命周期模板，直接复制粘贴
 */
 @xclass(ComponentTemplate)
export default class ComponentTemplate extends UObject {

    public init(obj: any) {
        super.init(obj);
    }

    public processInput(input: UInput) {

    }

    public update(dt: number) {
        
    }

    public drawDebug(graphic: UGraphic) {

    }

    public destory() {

        super.destory();
    }
}
