



/**
 * 装饰器不生效的原因
 * 1.装饰器名字错误 xproperty写成property
 * 2.类型错误@xproperty(XXX)
 */

export function notify(params: any = null): any {
    return function (target: any, name: string) {
        Object.defineProperty(target, name, {
            get: function () {
                return this["_" + name];
            },
            set: function (value) {
                let old = this["_" + name];
                if (old !== value) {
                    this["_" + name] = value;
                    this.emit(name, value);
                }
            }
        })
    }
}



function objToStrMap(obj) {
    let strMap = new Map();
    for (let k of Object.keys(obj)) {
        strMap.set(k, obj[k]);
    }
    return strMap;
}

function mapToStrObj(map: Map<string, any>) {
    let obj = new Object();
    map.forEach((value, key) => {
        obj[key] = value;
    });
    return obj;
}


/**
 * 
 * @param name 枚举值名称
 * @param e 枚举值
 * @param params 
 */
export function xenum(name, e, params = null): any {
    let enu: Map<string, string> = objToStrMap(e);
    let titles: Map<string, string> = objToStrMap(params["titles"]);

    let len = enu.size / 2;
    let i = 0;
    enu.forEach((v, k) => {
        if (i >= len) { return; }
        // console.log(k, titles.get(k))
        i++;
        XManager.Ins.addEnum(name, k, titles.get(k));
    });
}

/**
 * 基本属性
 * @param type 属性类型
 * @param params 参数 Object类型
 * @param target 类的构造函数(静态成员)/原型对象(实例成员)
 * @param name 属性名字
 */
export function xproperty<A extends any>(type: new () => A, params: any = null): any {
    return function (target: any, name: string): void {
        if (params == null) {
            params = {};
        }

        if (!params["_k_"]) {
            params["_k_"] = name;
        }

        params["_cls_"] = type;//属性类型
        params["_propName_"] = name;//属性类型

        const clsName = target.constructor.name;
        XManager.Ins.addProp(clsName, name, params)
    }
}





/**
 * @param params 参数 Object类型
 * @param target 类的构造函数(静态成员)/原型对象(实例成员)
 * @param name 方法的名字
 * @param desc 方法描述
 */
export function xfunc(params: any = null): any {
    return function (target: any, name: string, desc: any) {
        //保存之前的方法
        // const oldMethod = desc.value

        //注入一些操作
        // desc.value = function (...args: any) {
        //     args = args.map((item: any) => {
        //         return String(item)
        //     })
        //     oldMethod.apply(this, args)
        // }


        if (params == null) {
            params = {};
        }
        const clsName = target.constructor.name;
        XManager.Ins.addFunc(clsName, name, params);
    }
}

/**
 * 类装饰器
 * @param params Object
 * @param type 类型构造
 * @param target 类的构造函数(静态成员)/原型对象(实例成员)
 */
export function xclass<A extends XBase>(type: new () => A, params: any = null): any {
    return function (target: any) {
        if (params == null) {
            params = {};
        }
        const clsName = target.name;
        params["_cls_"] = type;//保存Type，可以通过classname直接创建 类实例
        XManager.Ins.addClss(clsName, params);

        //确保每一个被装饰的类都有一个属性Map，即使为空
        let prop = XManager.Ins.getPropMetas(clsName);
        if (prop == undefined) {
            XManager.Ins.properties.set(clsName, new Map());
        }

        XManager.Ins.defaultClass.set(clsName, new type());
    }
}


/**
 * 网络同步 属性标识
 * ！！！属性名称必须和类中名称保持一致，只是在序列化时，还是会按照_k_进行序列化
 * 被描述的属性，将会在状态同步中被序列化
 * 
 * 序列化中，会遍历原型链，在任何类中都可以标识父类的属性进行同步，以避免修改引擎基类
 */
export function xStatusSync<A extends any>(type: new () => A, params: string[]): any {
    return function (target: any, name: string): void {
        const clsName = target.constructor.name;
        XManager.Ins.netStatusSync.set(clsName, params);
    }
}



/**
 * 反射系统管理器
 */
export class XManager {
    static Ins: XManager = new XManager();
    propRegistRuncs = []
    public netStatusSync: Map<string, string[]> = new Map();
    /**
     * 类名：编辑器标签
     * 1.序列化与反序列化
     * 2.编辑器 物品列表
     * 
     * obj至少包含一个对象构造器，其他标记不一定有
     */
    private classes: Map<string, object> = new Map();

    /**
     * 方法
     * 类名：<方法名,编辑器标签>
     * 1.脚本调用
     * 
     * 构造器，参数，参数类型，返回值？
     */
    private funcs: Map<string, Map<string, object>> = new Map();

    /** 
     * 属性
     * 类名：<字段名称,编辑器属性>
     * 1.序列化与反序列化
     * 2.编辑器 属性列表
     * 
     * 类型、其他标记
     */
    properties: Map<string, Map<string, object>> = new Map();
    defaultClass: Map<string, XBase> = new Map();

    /**
     * 枚举值
     * 名称 <索引,其他属性>
     */
    private enums: Map<string, Map<string, object>> = new Map();

    /**
     * 仅对装饰器公开
     * @param clsName 
     * @param obj 
     */
    public addClss(clsName: string, obj: object) {
        if (this.classes.has(clsName)) {
            console.error("重复添加", clsName);
        } else {
            this.classes.set(clsName, obj);
        }
    }

    public addFunc(clsName: string, name: string, obj: Object) {
        if (!this.funcs.has(clsName)) {
            this.funcs.set(clsName, new Map());
        }
        let map = this.funcs.get(clsName);
        map.set(name, obj);
    }
    public addProp(clsName: string, name: string, obj: Object) {
        if (!this.properties.has(clsName)) {
            this.properties.set(clsName, new Map());
        }
        let map = this.properties.get(clsName);
        map.set(name, obj);
    }
    public addEnum(clsName: string, index: string, obj: Object) {
        if (!this.enums.has(clsName)) {
            this.enums.set(clsName, new Map());
        }
        let map = this.enums.get(clsName);
        map.set(index, obj);
    }

    // 获取类全部元数据
    public getClsMetas(clsName: string) {
        return this.classes.get(clsName);
    }
    // 获取属性全部元数据
    public getPropMetas(clsName: string): Map<string, object> {
        return this.properties.get(clsName);
    }
    // 获取函数全部元数据
    public getFuncMetas(clsName: string) {
        return this.funcs.get(clsName);
    }

    // 获取全部枚举元数据
    public getEnumMetas(clsName: string) {
        return this.funcs.get(clsName);
    }


    /**
     * 获取具有某种标签对类属性
     * @param tagName 
     * @returns 
     */
    getClassMetaByTag(tagName: string) {
        let arr_meta = [];
        this.classes.forEach((meta, key) => {
            if (meta["tag"] != undefined && meta["tag"] == tagName) {
                arr_meta.push(meta);
            }
        });
        return arr_meta;
    }

    /**
     * 从Meta生成实例
     * @param meta 
     * @returns 
     */
    getInstanceByMeta(meta: object) {
        let type = meta["_cls_"];
        return new type();
    }

    /**
     * 从字符串生成实例
     * @param className 
     * @returns 
     */
    getInstanceByStr(className) {
        if (!this.classes.has(className)) { return null; }
        let item = this.classes.get(className);
        let type = item["_cls_"];
        return new type();
    }

    /**
     * 获取类所有属性
     * 没有任何筛选，获取原型链上全部继承属性
     * @returns Map<String,Map<String,Object>> Map<类名,Map<字段名,元数据>>
     */
    public getClsAllInfo(value: object | string): Array<Object> {
        let target = null;
        if (typeof value == "string") {
            let meta = this.getClsMetas(value);
            if (meta) {
                target = meta["_cls_"]
            }
        } else {
            target = value["_cls_"]
        }

        if (!target) { return; }
        let arr: Array<Object> = [];

        let ptr = target;
        while (ptr.name != undefined && ptr.name != "") {
            let clsName: string = ptr.name;

            let clsMeta = this.getClsMetas(clsName);
            let propMap = this.getPropMetas(clsName);

            if (propMap != undefined && clsMeta != undefined) {
                let obj = {};
                clsMeta["clsName"] = clsName;
                obj["cls"] = clsMeta;
                obj["prop"] = propMap;
                arr.push(obj);
            }
            ptr = ptr["__proto__"];
        }
        return arr;
    }

    /**
     * 获取类所有编辑器属性
     * 根据edit_title筛选
     * @returns Map<String,Map<String,Object>> Map<类名,Map<字段名,元数据>>
     */
    getClsEditorInfoMapArray(value: String | Object): Array<Object> {
        let target = null;
        if (typeof value == "string") {
            let meta = this.getClsMetas(value);
            if (meta) {
                target = meta["_cls_"]
            }
        } else {
            target = value["_cls_"];
        }

        if (!target) { return; }
        let arr: Array<Object> = [];

        let ptr = target;
        while (ptr.name != undefined && ptr.name != "") {
            let clsName: string = ptr.name;

            let clsMeta = this.getClsMetas(clsName);
            let propMap = this.getPropMetas(clsName);

            if (propMap != undefined && clsMeta != undefined) {

                clsMeta["clsName"] = clsName;

                let editorPropMap: Map<string, object> = new Map();

                //必须包含"edit_title"字段
                propMap.forEach((meta, propName) => {
                    if (meta["edit_title"] != undefined) {
                        editorPropMap.set(propName, meta)
                    }
                });

                arr.push({
                    cls: clsMeta,
                    prop: editorPropMap
                });
            }

            ptr = ptr["__proto__"];
        }
        return arr;
    }

    getClsEditorInfoMap(value: String | Object): Map<string, object> {
        let target = null;
        if (typeof value == "string") {
            let meta = this.getClsMetas(value);
            if (meta) {
                target = meta["_cls_"]
            }
        } else {
            target = value["_cls_"];
        }

        if (!target) { return; }
        let editorPropMap: Map<string, object> = new Map();
        let ptr = target;
        while (ptr.name != undefined && ptr.name != "") {
            let clsName: string = ptr.name;

            let clsMeta = this.getClsMetas(clsName);
            let propMap = this.getPropMetas(clsName);

            if (propMap != undefined && clsMeta != undefined) {

                clsMeta["clsName"] = clsName;



                //必须包含"edit_title"字段
                propMap.forEach((meta, propName) => {
                    if (meta["edit_title"] != undefined) {
                        editorPropMap.set(propName, meta)
                    }
                });


            }

            ptr = ptr["__proto__"];
        }
        return editorPropMap;
    }

    print() {
        this.propRegistRuncs.forEach(func => {
            Object.call(this, func);
        });
        console.warn("类", this.classes);
        console.warn("方法", this.funcs);
        console.warn("属性", this.properties);
        console.warn("枚举", this.enums);
        console.warn("默认类", this.defaultClass);

        //在生成组件列表时可用
        let gameComponents = this.getClassMetaByTag("GameComponent");
        console.warn("根据xclass中的tag获取类", gameComponents);

        let clsInfos = this.getClsEditorInfoMap("RotateComponent");
        console.warn("根据xclass中的tag获取类", clsInfos)
    }
}





export class SerializeData {
    //输出/输入
    result: Array<Object> = new Array();
    //链接
    linkMap: Map<string, XBase> = new Map();

    linkSet: Set<XBase> = new Set();
}

@xclass(XBase)
export class XBase {
    @xfunc()
    test(data) { }

    //获取类名
    public getClsName() {
        return this.constructor.name;
    }

    //根据字符串设置属性
    public setProperty(key: string, value: any): any {
        this[key] = value;
    }
    //根据字符串获取属性
    public getProperty(key: string): any {
        return this[key];
    }

    //TODO 获取所有属性，包括Parent的
    getFields() {

    }

    //TODO 获取自己的属性
    getSelfFields() {

    }

    //TODO 获取全部方法
    getMethods() {

    }

    //TODO 获取函数
    static getMethod(funcName: string) {

    }

    //TODO 获取构造函数
    static getConstructors() {

    }

    //TODO 获取一个实例
    static newInstance() {

    }

    //获取对象深拷贝
    //先转object，在反序列化。
    public getCopy<T extends XBase>(type: { new(): T }) {
        let comp = new type();
        comp.fromJSON(this.toJSON())
        return comp;
    }

    //获取类元数据
    public getClsMeta(key: string) {
        const obj = XManager.Ins.getClsMetas(this.constructor.name);
        return obj?.[key];
    }

    //获取属性元数据
    public getPropMeta(key: string) {
        const obj = XManager.Ins.getPropMetas(this.constructor.name);
        return obj?.[key];
    }

    //获取函数元数据
    public getFuncMeta(key: string) {
        const obj = XManager.Ins.getFuncMetas(this.constructor.name);
        return obj?.[key];
    }


    // 序列化接口Interface
    onToJSON(obj) { }
    onFromJSON(obj) { }

    /**
     * 序列化
     * @param idMap 
     * @returns 
     */
    public toJSON(serializeData: SerializeData = null): Object {

        let root = false;
        if (serializeData == null) {
            serializeData = new SerializeData();
            root = true;
        }

        let obj: Object = {};

        //生成ID
        if (serializeData.linkSet.has(this) == false) {
            this["_id_"] = serializeData.linkSet.size + "";
            serializeData.linkSet.add(this);
        }

        obj["_id_"] = this["_id_"];

        //如果已经被序列化，则返回链接数据
        if (serializeData.linkMap.has(this["_id_"])) {
            return obj;
        }
        //否则注册到链表
        this["_id_"] = serializeData.result.length + "";
        obj["_cls_"] = this.getClsName();
        serializeData.linkMap.set(this["_id_"], this);
        serializeData.result.push(obj);


        //遍历继承关系
        let ptr = this.constructor;
        while (ptr.name != undefined && ptr.name != "") {
            let name: string = ptr.name;
            let meta = XManager.Ins.getPropMetas(name);
            let defaultClass = XManager.Ins.defaultClass.get(name);

            if (meta && defaultClass) {
                meta.forEach((value, key) => {
                    //将高频数据类型放到前面
                    if (this[key] == null) { return; }

                    const _k_ = value["_k_"] || key;
                    if (typeof this[key] == "string" || typeof this[key] == "number" || typeof this[key] == "boolean" || this[key] instanceof Number || this[key] instanceof Boolean || this[key] instanceof String) {
                        if (this[key] != defaultClass[key]) {
                            obj[_k_] = this.__setPropertyToJson(this[key], serializeData);
                        }
                    }

                    else if (this[key] instanceof Array) {
                        if (this[key].length != 0) {
                            obj[_k_] = this.__setPropertyToJson(this[key], serializeData);

                        }
                    } else if (this[key] instanceof Map) {
                        if (this[key].size != 0) {
                            obj[_k_] = this.__setPropertyToJson(this[key], serializeData);
                        }
                    } else if (this[key] instanceof Set) {
                        if (this[key].size != 0) {
                            obj[_k_] = this.__setPropertyToJson(this[key], serializeData);
                        }
                    }

                    else {
                        obj[_k_] = this.__setPropertyToJson(this[key], serializeData);
                    }
                });
            }
            ptr = ptr["__proto__"];
        }

        this.onToJSON(obj);

        if (root) {
            // console.warn(serializeData.result)
            return serializeData.result
        } else {
            let outObj: Object = {};

            outObj["_id_"] = this["_id_"];
            return outObj;
        }
    }

    private __setPropertyToJson(obj: any, serializeData: SerializeData = null): Object {
        if (obj != null && obj != undefined) {

            //将高频数据类型放到前面
            if (typeof obj == "string" || typeof obj == "number" || typeof obj == "boolean" || obj instanceof Number || obj instanceof Boolean || obj instanceof String) {
                return obj;
            }
            else if (obj instanceof XBase) {
                //处理引用类型

                return obj.toJSON(serializeData);
            }
            else if (obj instanceof Array || obj instanceof Set) {
                let childObj = [];
                obj.forEach(item => {
                    childObj.push(this.__setPropertyToJson(item, serializeData));
                });
                return childObj;
            }
            else if (obj instanceof Map) {
                let childObj = [];
                obj.forEach((value, key) => {
                    let item = [];
                    item[0] = key;
                    item[1] = this.__setPropertyToJson(value, serializeData);
                    childObj.push(item)
                });
                return childObj
            }

            else {
                console.error("TOJSON 属性类型不在序列化解析范围", obj)
                return null;
            }
        }
    }

    //反序列化
    public fromJSON(obj: Object, serializeData: SerializeData = null) {
        let root = false;
        if (serializeData == null) {
            root = true;

            if (obj instanceof Array == false) {
                return;
            }

            serializeData = new SerializeData();
            serializeData.result = obj as Array<Object>;
            serializeData.result.forEach(jsonObj => {

                const _id_ = jsonObj["_id_"];
                const _cls_ = jsonObj["_cls_"];

                let itemMeta = XManager.Ins.getClsMetas(_cls_);

                let ins: XBase = null;
                //先创建所有Instance
                if (_id_ == "0") {
                    ins = this;
                } else {
                    ins = XManager.Ins.getInstanceByMeta(itemMeta);
                }
                serializeData.linkMap.set(_id_, ins);

                ins.__loopFromJson(jsonObj, serializeData);

            });

            serializeData.linkMap.forEach((instance, id) => {
                instance.__linkFromJson(serializeData);
            });



            serializeData.linkMap.forEach((instance, id) => {
                instance.__linkFromJson(serializeData);
            });

            serializeData.result.forEach(jsonObj => {
                const _id_ = jsonObj["_id_"];
                let ins: XBase = serializeData.linkMap.get(_id_)
                ins.onFromJSON(jsonObj)
            });
            //删掉所有不必要属性
            serializeData.linkMap.forEach((value, key) => {
                delete value["_id_"];
                delete value["_cls_"];
            });
        }

    }

    public __loopFromJson(obj: Object, serializeData: SerializeData = null): void {
        if (!obj) { return; }
        let ptr = this.constructor;
        while (ptr.name != undefined && ptr.name != "") {
            let clsName: string = ptr.name;
            let map = XManager.Ins.getPropMetas(clsName);
            let defaultClass = XManager.Ins.defaultClass.get(clsName);

            if (map) {
                //1.如果是继承自XBase的类，遍历所有被装饰的属性
                map.forEach((value, key) => {
                    const type = value["_cls_"];//属性类型
                    const _k_ = value["_k_"] || key;//属性名称
                    if (obj[_k_] != undefined) {
                        this[key] = this.__setPropertyFromJson(type, obj[_k_], serializeData);
                    }
                });
            } else {
                if (clsName != "EvtBase") {
                    console.error("该类不在序列化范围", clsName);
                }
            }
            ptr = ptr["__proto__"];
        }
    }

    private __setPropertyFromJson(type, obj, serializeData: SerializeData = null) {
        let childItem = new type();
        if (obj == null || obj == undefined) {
            return null;
        }
        if (childItem instanceof Number || childItem instanceof String || childItem instanceof Boolean) {
            childItem = obj;
        }

        else if (childItem instanceof XBase) {
            if (obj["_id_"] == undefined) {
                childItem.fromJSON(obj, serializeData);
            } else {
                childItem = obj;//先不对其做处理，链接时生成实例，
            }
        }
        else if (childItem instanceof Array) {
            if (obj.size != 0) {
                obj.forEach(item => {
                    let itemType = this.__getElementClsFromJson(item);
                    if (itemType) {
                        childItem.push(this.__setPropertyFromJson(itemType, item, serializeData));
                    } else {
                        childItem.push(item);
                    }

                });

            }
        }
        else if (childItem instanceof Map) {
            if (obj.size != 0) {
                obj.forEach(item => {
                    let itemType = this.__getElementClsFromJson(item[1]);
                    if (itemType) {
                        childItem.set(item[0], this.__setPropertyFromJson(itemType, item[1], serializeData));
                    } else {
                        childItem.set(item[0], item[1])
                    }

                });
            }
        }
        else if (childItem instanceof Set) {
            if (obj.size != 0) {
                obj.forEach(item => {
                    let itemType = this.__getElementClsFromJson(item);
                    if (itemType) {
                        childItem.add(this.__setPropertyFromJson(itemType, item, serializeData));
                    } else {
                        childItem.add(item);
                    }
                });
            }
        }
        else {
            console.error("属性类型不在反序列化解析范围", childItem);
        }
        return childItem;
    }

    private __linkFromJson(serializeData: SerializeData = null) {
        let target = null;
        let meta = XManager.Ins.getClsMetas(this.getClsName());
        if (!meta) { return; }
        target = meta["_cls_"]
        if (!target) { return; }
        let ptr = target;
        while (ptr.name != undefined && ptr.name != "") {
            let clsName: string = ptr.name;
            let clsMeta = XManager.Ins.getClsMetas(clsName);
            let propMap = XManager.Ins.getPropMetas(clsName);
            if (propMap != undefined && clsMeta != undefined) {

                propMap.forEach((meta, propName) => {
                    let jsonObj = this.getProperty(propName);//当前
                    if (jsonObj != null && jsonObj != undefined) {
                        let type = meta["_cls_"];
                        if (type != undefined) {
                            //处理之前没有处理过的类
                            let bean = new type();
                            this.__makeLinkFromJson(bean, propName, jsonObj, serializeData);
                        }
                    }
                });
            }

            ptr = ptr["__proto__"];
        }
    }

    private __makeLinkFromJson(bean, propName, jsonObj, serializeData: SerializeData = null) {
        if (bean instanceof XBase) {
            if (jsonObj["_id_"] == undefined) {
                // console.error("_id_不存在", jsonObj);
                return;
            }
            let ref = serializeData.linkMap.get(jsonObj["_id_"] + "");
            this.setProperty(propName, ref);
        }

        else if (bean instanceof Array) {
            let isRef = false;
            jsonObj.forEach(item => {
                let id = item["_id_"];
                if (!id) { return; }
                let ref = serializeData.linkMap.get(id + "");
                bean.push(ref);
                isRef = true;
            });
            if (isRef) {
                this.setProperty(propName, bean);
            }
        }

        else if (bean instanceof Set) {
            let isRef = false;
            jsonObj.forEach(item => {
                let id = item["_id_"];
                if (!id) { return; }
                let ref = serializeData.linkMap.get(id + "");
                bean.add(ref);
                isRef = true;
            });
            if (isRef) {
                this.setProperty(propName, bean);
            }
        }

        else if (bean instanceof Map) {
            let isRef = false;
            jsonObj.forEach((value, key) => {
                let id = value["_id_"];
                if (!id) { return; }
                let ref = serializeData.linkMap.get(id + "");
                bean.set(key, ref);
                isRef = true;
            });
            if (isRef) {
                this.setProperty(propName, bean);
            }
        }
    }

    //根据子元素标签，返回构造函数
    private __getElementClsFromJson(obj) {
        let itemType = null;
        if (obj != null && obj["_cls_"] != undefined) {
            let cls = XManager.Ins.getClsMetas(obj["_cls_"])
            itemType = cls["_cls_"]
        } else {
            if (itemType != null) {
                console.error("没使用装饰器", itemType, obj);
            }
        }
        return itemType;
    }




    public toNetStatusJson(serializeData: SerializeData = null): Object {

        let root = false;
        if (serializeData == null) {
            serializeData = new SerializeData();
            root = true;
        }

        let obj: Object = {};

        //生成ID
        if (serializeData.linkSet.has(this) == false) {
            this["_id_"] = serializeData.linkSet.size + "";
            serializeData.linkSet.add(this);
        }

        obj["_id_"] = this["_id_"];

        //如果已经被序列化，则返回链接数据
        if (serializeData.linkMap.has(this["_id_"])) {
            return obj;
        }
        //否则注册到链表
        this["_id_"] = serializeData.result.length + "";
        obj["_cls_"] = this.getClsName();
        serializeData.linkMap.set(this["_id_"], this);
        serializeData.result.push(obj);


        //遍历继承关系
        let ptr = this.constructor;
        while (ptr.name != undefined && ptr.name != "") {
            let clsName: string = ptr.name;
            let meta = XManager.Ins.getPropMetas(clsName);
            let defaultClass = XManager.Ins.defaultClass.get(clsName);
            let netSyncMeta: string[] = XManager.Ins.netStatusSync.get(clsName);
            if (meta && netSyncMeta) {
                netSyncMeta.forEach(key => {
                    let value = meta.get(key);
                    const _k_ = value["_k_"] || key;
                    obj[_k_] = this.__setPropertyToJson(this[key], serializeData);
                });
            }
            ptr = ptr["__proto__"];
        }

        this.onToJSON(obj);

        if (root) {
            return serializeData.result
        } else {
            let outObj: Object = {};
            outObj["_id_"] = this["_id_"];
            return outObj;
        }
    }
}



