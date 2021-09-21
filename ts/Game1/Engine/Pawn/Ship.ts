import APawn from "../../../Engine/Actor/Pawn/Pawn";
import { UInputSystem } from "../../../Engine/Engine/InputSystem/InputSystem";
import { xclass } from "../../../Engine/Engine/ReflectSystem/XBase";
import { UVec2, uu } from "../../../Engine/Engine/UMath";
import UShipEngine from "../Component/ShipEngine";
import UShipItem from "../Component/ShipItem";
import UShipShield from "../Component/ShipShield";
import UShipWeapon from "../Component/ShipWeapon";
import UBattleComponent from "../Info/BattleComponent";




/**
 * 飞船
 * 包含一个网格插槽，能插上各种ShipItem
 */
@xclass(AShip)
export default class AShip extends APawn {

    //战斗属性
    protected battleComp: UBattleComponent = null;

    //装备插槽 尺寸
    protected itemSize: UVec2 = uu.v2(1, 3);
    //装备插槽 存储
    protected items: UShipItem[][] = [];

    //护盾
    protected shieldComp: UShipShield = null;

    //主武器
    protected weaponComp: UShipWeapon = null;

    //引擎
    protected engineComp: UShipEngine = null;


    public setBattleComp(comp: UBattleComponent) { this.battleComp = comp; }
    public getBattleComp() { return this.battleComp; }

    public setShield(comp: UShipShield) { this.shieldComp = comp }
    public getShield() { return this.shieldComp; }

    public setWeapon(comp: UShipWeapon) { this.weaponComp = comp; }
    public getWeapon() { return this.weaponComp; }

    public setEngine(comp: UShipEngine) { this.engineComp = comp; }
    public getEngine() { return this.engineComp; }




    public setItemsSize(x: number, y: number) {
        this.itemSize.y = y;
        this.itemSize.x = x;
    }
    public getItemSize() {
        return this.itemSize;
    }

    public addItem(item: UShipItem) {
        let itemPos = item.getItemPosition();
        this.items[itemPos.y][itemPos.x] = item;
    }
    public removeItem(item: UShipItem) {
        let itemPos = item.getItemPosition();
        this.items[itemPos.y][itemPos.x] = null;
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