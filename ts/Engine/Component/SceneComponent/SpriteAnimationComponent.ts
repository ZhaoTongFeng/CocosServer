
import { UInputSystem } from "../../Engine/InputSystem/InputSystem";
import { xclass } from "../../Engine/ReflectSystem/XBase";
import USceneComponent from "./SceneComponent";
import USpriteComponent from "./SpriteComponent";

/**
 * 精灵图片组件
 * 挂载到Actor上，以显示图片
 */
@xclass(USpriteAnimationComponent)
export default class USpriteAnimationComponent extends USpriteComponent {

    static Ani_Explostion = "explosion/explosion";
    static Ani_MuzzleFlash = "weapon/muzzleflash/muzzleflash";
    static Animations: Map<string, string[]> = new Map();
    static getTextureNames(name, size, start = 1, symbol = "") {
        let texturesNames: string[] = [];
        for (let i = start; i <= size; i++) {
            texturesNames.push(name + symbol + i);
        }
        return texturesNames;
    }

    static RegisterAllAnimation() {
        let textures = USpriteAnimationComponent.getTextureNames(USpriteAnimationComponent.Ani_Explostion, 16, 1);
        USpriteAnimationComponent.Animations.set(USpriteAnimationComponent.Ani_Explostion, textures);

        textures = USpriteAnimationComponent.getTextureNames(USpriteAnimationComponent.Ani_MuzzleFlash, 3, 1);
        USpriteAnimationComponent.Animations.set(USpriteAnimationComponent.Ani_MuzzleFlash, textures);
    }


    
    //动画ID
    private texIndex:string = null;

    private isLoop: boolean = true;
    private isFinish: boolean = true;
    private fps: number = 16;
    private frameTime: number = 1 / 16;
    private frameIndex: number = 0;
    private timer: number = 0;

    unUse() {
        super.unUse();
    }

    reUse() {
        super.reUse();
        this.texIndex = null
        this.isLoop = true;
        this.isFinish = true;
        this.fps = 16;
        this.frameTime = 1 / 16;
        this.frameIndex = 0;
        this.timer = 0;
    }


    setAnimation(name: string) {
        this.texIndex = name;
    }

    setFPS(newFps: number) {
        this.fps = newFps;
        this.frameTime = 1 / newFps;
    }

    play(isLoop: boolean = true) {
        this.isLoop = isLoop;
        this.isFinish = false;
    }

    public update(dt) {
        super.update(dt);
        if(!this.owner.world.isClient){
            return;
        }
        if (this.texIndex!=null) {
            let textures = USpriteAnimationComponent.Animations.get(this.texIndex);
            if (this.isFinish == false) {

                this.timer += dt;
                if (this.timer > this.frameTime) {
                    this.timer = 0;
                    let newFrameIndex = (this.frameIndex + 1) % textures.length;
                    this.setTexture(textures[newFrameIndex]);

                    if (newFrameIndex < this.frameIndex && this.isLoop == false) {
                        this.isFinish = true;
                    }
                    this.frameIndex = newFrameIndex;
                }
            }
        }
    }


}
