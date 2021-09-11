import AActor from "../../../Engine/Actor/Actor";
import UComponent from "../../../Engine/Component/Component";
import { UInputSystem } from "../../../Engine/Engine/InputSystem/InputSystem";
import { xclass } from "../../../Engine/Engine/ReflectSystem/XBase";
import UGraphic from "../../../Engine/Engine/UGraphic";
import { UColor, uu } from "../../../Engine/Engine/UMath";
import AShip from "../Pawn/Ship";


/**
 * 战斗系统组件
 * 生命血量等数据、UI
 */
@xclass(UBattleComponent)
export default class UBattleComponent extends UComponent {

    //队伍
    static TeamColor: UColor[] = [];
    static Teams: Map<String, AActor[]> = new Map();
    protected teamId: string = "";

    unUse() {
        super.unUse();
    }

    reUse() {
        super.reUse();
        this.teamId = "";
    }

    setTeamId(id: string) {
        if (id != "") {
            if (this.owner instanceof AShip) {
                //从老的Team中删除
                let oldBattle = this.owner.getBattleComp();
                if (oldBattle) {
                    let oldArr = UBattleComponent.Teams.get(oldBattle.teamId);
                    if (oldArr) {
                        let index = oldArr.indexOf(this.owner);
                        if (index >= 0) {
                            oldArr.splice(index, 1);
                        }
                    }
                }
                //添加到新的Team
                let newArr = UBattleComponent.Teams.get(id);
                if (newArr == null || newArr == undefined) {
                    newArr = [];
                    UBattleComponent.Teams.set(id, newArr);
                    UBattleComponent.TeamColor.push(uu.color(Math.random() * 255, Math.random() * 255, Math.random() * 255))
                }
                newArr.push(this.owner);
                this.teamId = id;
            }
        }
    }

    getTreamId(): string {
        return this.teamId;
    }

    public init(obj: any) {
        super.init(obj);
        if (obj instanceof AShip) {
            obj.setBattleComp(this);

        }
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

        // //左
        // fillColor = UColor.RED;
        let x = actorPos.x - actorSzie - paddingActor - width;

        // graphic.drawRect(x, y, width, height, borderColor, fillColor, lineWidth);


        // //右
        // fillColor = UColor.BLUE;
        // x = actorPos.x + actorSzie + paddingActor;
        // graphic.drawRect(x, y, width, height, borderColor, fillColor, lineWidth);

        // //下
        // fillColor = UColor.YELLOW;
        // x = actorPos.x - actorSzie;
        // y = actorPos.y - height / 2 - paddingActor - width;
        // graphic.drawRect(x, y, height, width, borderColor, fillColor, lineWidth);

        // 上
        fillColor = UColor.YELLOW();
        x = actorPos.x - actorSzie;
        y = actorPos.y + height / 2 + paddingActor
        graphic.drawRect(x, y, height, width, borderColor, UBattleComponent.TeamColor[this.teamId], lineWidth);
    }

    onDestory() {
        if (this.owner instanceof AShip) {
            this.owner.setBattleComp(null);
        }
        super.onDestory();
    }
}
