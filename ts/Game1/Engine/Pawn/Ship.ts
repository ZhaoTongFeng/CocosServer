import APawn from "../../../Engine/Actor/Pawn/Pawn";
import { UInputSystem } from "../../../Engine/Engine/InputSystem/InputSystem";
import { xclass } from "../../../Engine/Engine/ReflectSystem/XBase";
import { UVec2, uu } from "../../../Engine/Engine/UMath";
import UShipItem from "../Component/ShipItem";
import UShipShield from "../Component/ShipShield";
import UBattleComponent from "../Info/BattleComponent";




/**
 * 角色基类
 * 包含基本的位移操作
 * 
 * 玩家点击一个位置，飞船朝这个方向移动，
 */
@xclass(AShip)
export default class AShip extends APawn {
    //装备插槽 尺寸
    protected itemSize: UVec2 = uu.v2(1, 3);
    //装备插槽 存储
    protected items: UShipItem[][] = [];
    //战斗属性
    protected battleComp: UBattleComponent = null;

    protected shieldComp: UShipShield = null;
    
    getShield() {
        return this.shieldComp;
    }
    setShield(shield: UShipShield) {
        this.shieldComp = shield
    }
    setItemsSize(x: number, y: number) {
        this.itemSize.y = y;
        this.itemSize.x = x;
    }
    getItemSize() {
        return this.itemSize;
    }




    public addItem(item: UShipItem) {
        let itemPos = item.getItemPosition();
        this.items[itemPos.y][itemPos.x] = item;
    }
    public removeWeapon(item: UShipItem) {
        let itemPos = item.getItemPosition();
        this.items[itemPos.y][itemPos.x] = null;
    }


    setBattleComp(battle: UBattleComponent) {
        this.battleComp = battle;
    }
    getBattleComp() {
        return this.battleComp;
    }

    unUse() {
        super.unUse();

    }

    reUse() {
        super.reUse();
        this.battleComp = null;
        this.itemSize.x = 0;
        this.itemSize.y = 0;
        this.items = [];
    }

    public init(obj: any) {
        super.init(obj);
        for (let i = 0; i < this.itemSize.y; i++) {
            this.items.push([]);
        }
    }

    protected processSelfInput(input: UInputSystem) {

    }

    protected updateActor(dt) {

    }
}