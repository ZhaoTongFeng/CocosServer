import AActor from "../../../Engine/Actor/Actor";
import USceneComponent from "../../../Engine/Component/SceneComponent/SceneComponent";
import USpriteComponent from "../../../Engine/Component/SceneComponent/SpriteComponent";
import { xclass } from "../../../Engine/Engine/ReflectSystem/XBase";
import { UVec2, uu } from "../../../Engine/Engine/UMath";
import UWorld from "../../../Engine/Engine/World";


/**
 * 角色基类
 * 包含基本的位移操作
 */
@xclass(ALand)
export default class ALand extends AActor {
    sprites: USpriteComponent[][] = []



    private _size: UVec2 = uu.v2(5, 5);
    public get size(): UVec2 {
        return this._size;
    }
    public set size(value: UVec2) {
        this._size = value;
    }

    private _width: UVec2 = uu.v2(64, 64);
    public get width(): UVec2 {
        return this._width;
    }
    public set width(value: UVec2) {
        this._width = value;
    }

    init(world: UWorld) {
        super.init(world);
        this.spawnComponent(USceneComponent);

        this.startBuild();
    }

    //滑动生成砖块
    timer: number = 0;
    temp: number = 0;
    total: number = 0;

    startBuild() {
        this.total = this.size.x * this.size.y;
        for (let i = 0; i < this.size.y; i++) {
            this.sprites[i] = [];
            for (let j = 0; j < this.size.x; j++) {
                this.sprites[i][j] = null;

            }
        }
    }

    protected updateActor(dt) {

        // let pos = this.getPosition();
        // pos.x+=dt*100;
        // this.setPosition(pos);

        if (this.temp != this.total) {
            this.timer += dt;
            //每秒生成三个
            if (this.timer > 1 / 20) {

            }
            this.timer = 0;
            let y = Math.floor(this.temp / this.size.x);
            let x = this.temp - y * this.size.x;
            let comp = this.spawnComponent(USpriteComponent);
            comp.setTexture("dirt_0_new");

            comp.setScale(UVec2.ONE().mulSelf(2))
            comp.setPosition(uu.v2(x * this.width.x, y * this.width.y));
            this.setPosition(this.getPosition());
            this.sprites[y][x] = comp;
            this.temp++;
        }
    }
}
