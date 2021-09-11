
import UGameInstance from "../../Engine/GameInstance";
import { UInputSystem } from "../../Engine/InputSystem/InputSystem";
import { xclass } from "../../Engine/ReflectSystem/XBase";

import USceneComponent from "./SceneComponent";

/**
 * 网格图片
 */

@xclass(UGridViewComponent)
export default class UGridViewComponent extends USceneComponent {

    // gridViewComp: GraphicGridView = null;
    
    register() {

        // let node = UGameInstance.Ins.getWorldView().addGridViewComponent(this)
        // this.gridViewComp = node.getComponent("GraphicGridView");
        // this.gridViewComp.setGridData(GraphicGridPanel.gridData);
        
        // console.log(this.gridViewComp);
    }

}
