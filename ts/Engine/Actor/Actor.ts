import UCollisionComponent from "../Component/Collision/CollisionComponent";
import UComponent from "../Component/Component";
import USceneComponent from "../Component/SceneComponent/SceneComponent";
import { UpdateState } from "../Engine/Enums";
import { UInputSystem } from "../Engine/InputSystem/InputSystem";
import { xclass, xproperty } from "../Engine/ReflectSystem/XBase";
import UGraphic from "../Engine/UGraphic";
import { AABB, uu, UVec2 } from "../Engine/UMath";
import UWorld from "../Engine/World";
import UObject from "../Object";

/**
 * 角色（演员）
 * 游戏场景中 真实存在 的 东西
 * 拥有一个组件列表，可挂载任何组件
 * 创建角色，调用World中Spawn函数，传入变换信息，即可创建角色
 */
@xclass(AActor)
export default class AActor extends UObject {
    /** 特有数据，一般需要传输的类型 */
    @xproperty(Array)
    public components: UComponent[] = [];

    /** 标志位类型，按需使用装饰器 */
    public state: UpdateState = UpdateState.Peeding;
    public reComputeTransform: boolean = true;

    /** 引用类型，不要使用装饰器进行修饰，在init中进行恢复 */
    public world: UWorld = null;
    private rootComponent: UComponent = null;
    private sceneComponent: USceneComponent = null;
    protected collisionComponent: UCollisionComponent = null;

    gridx = 0;
    gridy = 0;

    //Override
    public unUse() {
        super.unUse();
    }

    //Override
    public reUse() {
        super.reUse();
        // this.world = null;
        this.components = [];
        this.rootComponent = null;
        this.sceneComponent = null;
        this.collisionComponent = null;
        this.reComputeTransform = true;
        this.state = UpdateState.Peeding;
    }

    //Override
    //被创建时 立即调用
    //建立引用
    init(world: UWorld, id = -1) {
        super.init(world);
        this.world = world;
        world.addActor(this);
        if (id == -1) {
            id = Number(this.world.GenerateNewId());
        }
        this.id = id + "";
        this.onLoad(world);
    }

    //反序列化之后恢复引用，并注册到动态表中
    onLoad(world: UWorld) {
        this.world = world;
        this.world.actorSystem.registerObj(this);
    }

    //Override
    //真正被加入场景中调用
    onInit() {
        this.state = UpdateState.Active;
    }

    //输入
    public processInput(input: UInputSystem) {
        if (this.state = UpdateState.Active) {
            this.processChildrenInput(input);
            this.processSelfInput(input);
        }
    }

    //Override
    protected processSelfInput(input: UInputSystem) { }
    protected processChildrenInput(input: UInputSystem) {
        this.components.forEach(comp => {
            if (comp.state == UpdateState.Active) {
                comp.processInput(input);
            }
        });
    }



    computeWorldTransform() {
        if (this.reComputeTransform) {
            this.computeGridPos();
            this.reComputeTransform = false;
            this.components.forEach(comp => {
                if (comp.state == UpdateState.Active) {
                    comp.onComputeTransfor();
                }
            });
        }
    }
    //重新计算ac所在网格
    computeGridPos() {
        let gridWidth = this.world.gameInstance.gridWidth
        let gridCol = this.world.gameInstance.gridCol;
        let gridRow = this.world.gameInstance.gridRow;
        let halfGridCol = this.world.gameInstance.halfGridCol;
        let halfGridRow = this.world.gameInstance.halfGridRow;
        let pos = this.getPosition();
        let x = Math.floor(pos.x / gridWidth) + halfGridCol;
        let y = Math.floor(pos.y / gridWidth) + halfGridRow;

        this.gridx = x;
        this.gridy = y;
        //console.log(this.gridx, this.gridy);
    }

    //更新
    public update(dt) {
        if (this.state == UpdateState.Active) {
            this.computeWorldTransform();
            this.updateComponents(dt);
            this.updateActor(dt);
            this.computeWorldTransform();
        }
    }

    //Override
    protected updateActor(dt) { }
    protected updateComponents(dt) {
        this.components.forEach(comp => {
            if (comp.state == UpdateState.Active) {
                comp.update(dt);
            }
        });
    }

    //输出，实际上是更新CC的Node去输出
    public drawDebug(graphic: UGraphic) {
        this.drawDebugComponents(graphic);
        this.drawDebugActor(graphic);
    }
    //Override
    protected drawDebugActor(graphic: UGraphic) { }
    protected drawDebugComponents(graphic: UGraphic) {
        this.components.forEach(comp => {
            if (comp.state == UpdateState.Active) {
                comp.drawDebug(graphic);
            }
        });
    }

    //销毁
    public destory() {
        this.state = UpdateState.Dead;
        this.world.actorSystem.unRegisterObj(this);
        this.components.forEach(comp => {
            comp.state = UpdateState.Dead;
            this.world.actorSystem.unRegisterObj(comp);
        });
    }

    //Override
    public onDestory() {
        this.components.forEach(comp => {
            comp.onDestory();
            this.checkComponentPool(comp);

        });
    }

    private checkComponentPool(comp: UComponent) {
        //添加到对象池
        if (comp != null && this.world.usePool) {
            comp.unUse();
            let clsName = comp.constructor.name;
            let arr = this.world.compPool.get(clsName);
            arr.push(comp);
        }
    }

    /**增删Component */
    public spawnComponent<A extends UComponent>(c: new () => A): A {
        return this.world.spawnComponent(this, c);
    }

    public addComponent(comp: UComponent) {
        this.components.push(comp);
        // console.log("add comp num:",this.components.length);
    }

    //单独删除
    public removeComponent(comp: UComponent) {
        let index = this.components.indexOf(comp);
        if (index > -1) {
            this.components[index].onDestory();
            this.checkComponentPool(comp);
            this.components.splice(index, 1);
        }
        // console.log("remove comp num:",this.components.length);
    }

    public getSceneComponent() {
        return this.sceneComponent;
    }

    public getRootComp() {
        return this.rootComponent;
    }

    public setSceneComponent(comp: USceneComponent) {
        this.sceneComponent = comp;
    }

    public setRootComp(comp: UComponent) {
        this.rootComponent = comp;
    }

    public getCollision() {
        return this.collisionComponent;
    }

    public setCollision(comp: UCollisionComponent) {
        this.collisionComponent = comp;
    }

    public getSize() {
        if (!this.sceneComponent) {
            return uu.v2(0, 0);
        } else {
            return this.sceneComponent.getSize();
        }
    }

    public setSize(pos: UVec2) {
        if (!this.sceneComponent) {
            return;
        } else {
            this.sceneComponent.setSize(pos);
        }
    }

    public getPosition() {
        if (!this.sceneComponent) {
            return uu.v2(0, 0);
        } else {
            return this.sceneComponent.getPosition();
        }
    }

    public setPosition(pos: UVec2) {
        if (!this.sceneComponent) {
            return;
        } else {
            this.sceneComponent.setPosition(pos);
            
        }
    }

    public getScale() {
        if (!this.sceneComponent) {
            return uu.v2(0, 0);
        } else {
            return this.sceneComponent.getScale();

        }
    }

    public setScale(pos: UVec2) {
        if (!this.sceneComponent) {
            return;
        } else {
            this.sceneComponent.setScale(pos);
            this.reComputeTransform = true;
        }
    }

    public getRotation() {
        if (!this.sceneComponent) {
            return 0;
        } else {
            return this.sceneComponent.getRotation();

        }
    }

    public setRotation(angle: number) {
        if (!this.sceneComponent) {
            return;
        } else {
            this.sceneComponent.setRotation(angle);
            this.reComputeTransform = true;
        }
    }

    public getCatAABB(): AABB {
        if (!this.sceneComponent) {
            return null;
        } else {
            return this.sceneComponent.catAABB;
        }
    }



}
