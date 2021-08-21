import { XBase, xclass, xproperty } from "./Engine/ReflectSystem/XBase";
type EvtData = { call: Function, thisObj }

export class EvtBase extends XBase {
    private evtsMap = new Map<string, EvtData[]>();

    emit(evt, param1?, param2?, param3?, param4?, param5?) {
        if (!this.evtsMap) {
            return;
        }
        let list = this.evtsMap.get(evt);
        if (list) {
            for (let i = 0; i < list.length; i++) {
                let one = list[i];
                if (one.call) {
                    one.call.call(one.thisObj, param1, param2, param3, param4, param5);
                }
            }
        }
    }

    on(evt, call, thisObj) {
        let list = this.evtsMap.get(evt) || [];
        this.evtsMap.set(evt, list);
        list.push({
            call: call,
            thisObj: thisObj,
        });
    }

    off(evt, call, thisObj) {
        let list = this.evtsMap.get(evt);
        if (list) {
            let idx = list.findIndex((one) => {
                return one.call == call && one.thisObj == thisObj;
            });
            if (idx >= 0) {
                list.splice(idx, 1);
            }
        }
    }

    targetOff(thisObj) {
        this.evtsMap.forEach((list) => {
            for (let i = 0; i < list.length; i++) {
                let one = list[i];
                if (one.thisObj == thisObj) {
                    list.splice(i--, 1);
                }
            }
        });
    }
}




/**
 * 所有类基类
 * 包含一些通用接口
 * 可编写 网络同步与序列化等功能
 */
@xclass(UObject)
export default class UObject extends XBase {

    //任何东西都有一个ID
    static GLOBALID: number = 0;
    static GeneateID() {
        let id = UObject.GLOBALID;
        UObject.GLOBALID++;
        return id;
    }

    @xproperty(String)
    protected _id: string = UObject.GeneateID() + "";
    public get id(): string {
        return this._id;
    }
    public set id(value: string) {
        this._id = value;
    }

    /**
     * ！！！设置为True每帧更新
     */
    canEveryTick: boolean = true;

    /**
     * 初始化函数
     * 在生命周期内只会调用一次
     */
    public init(data: any = null) {

    }

    /**
     * 帧更新
     * @param dt 
     */
    public update(dt: number) {

    }

    /**
     * 释放时调用
     */
    public destory() {

    }


    save() {

    }

    load() {

    }

    unUse() {

    }
    reUse() {

    }

}
