import UCollisionComponent from "../Component/Collision/CollisionComponent";
import UComponent from "../Component/Component";
import USceneComponent from "../Component/SceneComponent/SceneComponent";

import { UpdateState } from "../Engine/Enums";
import { UInput } from "../Engine/InputSystem/Input";
import { XBase, xclass, xproperty } from "../Engine/ReflectSystem/XBase";
import UGraphic from "../Engine/UGraphic";
import { uu, UVec2 } from "../Engine/UMath";
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

    public world: UWorld = null;

    @xproperty(Number)
    public state: UpdateState = UpdateState.Peeding;

    @xproperty(Boolean)
    public reComputeTransform: boolean = true;

    @xproperty(XBase)
    private components: UComponent[] = [];
    
    private rootComponent: UComponent = null;
    private sceneComponent: USceneComponent = null;
    protected collisionComponent: UCollisionComponent = null;


    //Override
    public unUse() {
        super.unUse();
    }

    //Override
    public reUse() {
        super.reUse();
        this.world = null;
        this.components = [];
        this.rootComponent = null;
        this.sceneComponent = null;
        this.collisionComponent = null;
        this.reComputeTransform = true;
        this.state = UpdateState.Peeding;
    }

    //Override
    init(world: UWorld) {
        super.init(world);
        this.world = world;
        this.world.addActor(this);
    }

    //Override
    onInit() {
        this.state = UpdateState.Active;
    }

    //输入
    public processInput(input: UInput) {
        if (this.state = UpdateState.Active) {
            this.processChildrenInput(input);
            this.processSelfInput(input);
        }
    }

    //Override
    protected processSelfInput(input: UInput) { }
    protected processChildrenInput(input: UInput) {
        this.components.forEach(comp => {
            comp.processInput(input);
        });
    }



    computeWorldTransform() {
        if (this.reComputeTransform) {
            this.reComputeTransform = false;
            this.components.forEach(comp => {
                comp.onComputeTransfor();
            });
        }
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
            comp.update(dt);
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
            comp.drawDebug(graphic);
        });
    }

    //销毁
    public destory() {
        this.state = UpdateState.Dead;
    }

    //Override
    public onDestory() {
        this.components.forEach(comp => {
            comp.onDestory();

            //添加到对象池
            if (comp != null) {
                comp.unUse();
                let clsName = comp.constructor.name;
                let arr = this.world.componentPoos.get(clsName);
                arr.push(comp);
            }
        });
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
            this.reComputeTransform = true;
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
}
