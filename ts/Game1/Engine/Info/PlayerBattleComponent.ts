import { UInputSystem } from "../../../Engine/Engine/InputSystem/InputSystem";
import { xclass } from "../../../Engine/Engine/ReflectSystem/XBase";
import UGraphic from "../../../Engine/Engine/UGraphic";
import { UColor } from "../../../Engine/Engine/UMath";
import UBattleComponent from "./BattleComponent";


/**
 * 玩家当前操控的角色的战斗系统组件
 * 显示不同
 */
@xclass(UPlayerBattleComponent)
export default class UPlayerBattleComponent extends UBattleComponent {

    public init(obj: any) {
        super.init(obj);

    }

    public processInput(input: UInputSystem) {

    }

    public update(dt: number) {

    }

    //绘制血量：红色、护盾：蓝色、充能武器？：黄色（有可能不止一种武器）
    public drawDebug(graphic: UGraphic) {

        let width = 10;
        let height = this.owner.getSize().y * this.owner.getScale().y;

        let lineWidth = 3; //线条宽度
        let paddingActor = 5 //距离Actor边框的距离
        let paddingEach = 5;//每个条的间距

        let borderColor = UColor.WHITE();
        let fillColor = UColor.RED();

        let actorSzie = this.owner.getSize().x / 2 * this.owner.getScale().x;
        let actorPos = this.owner.getPosition()
        let y = actorPos.y - height / 2;

        //左
        fillColor = UColor.RED();
        let x = actorPos.x - actorSzie - paddingActor - width;
        graphic.drawRect(x, y, width, height, borderColor, fillColor, lineWidth);


        //右
        fillColor = UColor.BLUE();
        x = actorPos.x + actorSzie + paddingActor;
        graphic.drawRect(x, y, width, height, borderColor, fillColor, lineWidth);

        //下
        fillColor = UColor.YELLOW();
        x = actorPos.x - actorSzie;
        y = actorPos.y - height / 2 - paddingActor - width;
        graphic.drawRect(x, y, height, width, borderColor, fillColor, lineWidth);

        //上
        fillColor = UColor.RED();
        width *= 2;
        height *= 2;
        x = actorPos.x - height / 2;
        y = actorPos.y + actorSzie + paddingActor
        graphic.drawRect(x, y, height, width, borderColor, fillColor, lineWidth);


    }


    public destory() {
        super.destory();
    }
}
