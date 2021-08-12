
import { UInput } from "../../Engine/InputSystem/Input";
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
    
    private textureNames: string[] = [];
    
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
        this.textureNames = [];
        this.isLoop = true;
        this.isFinish=true;
        this.fps=16;
        this.frameTime = 1/16;
        this.frameIndex = 0;
        this.timer = 0;
    }

    setAnimation(name: string) {
        let textures = USpriteAnimationComponent.Animations.get(name);
        this.textureNames = textures || [];
    }


    //DISABLE，不要一个一个的设置名称，动画名称都是一样的，全部放到一起。
    private setTextures(textures: string[]) {
        if (textures.length != 0) {
            if (this.textureNames == null) {
                this.textureNames = [];
            }
            this.textureNames = textures;
            this.setTexture(textures[0])
        }
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
        if (this.textureNames.length != 0) {
            if (this.isFinish == false) {

                this.timer += dt;
                if (this.timer > this.frameTime) {
                    this.timer = 0;
                    let newFrameIndex = (this.frameIndex + 1) % this.textureNames.length;
                    this.setTexture(this.textureNames[newFrameIndex]);

                    if (newFrameIndex < this.frameIndex && this.isLoop == false) {
                        this.isFinish = true;
                    }
                    this.frameIndex = newFrameIndex;
                }
            }
        }


    }

}
