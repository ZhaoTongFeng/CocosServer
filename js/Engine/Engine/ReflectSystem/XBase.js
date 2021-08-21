"use strict";
/**
 * 装饰器不生效的原因
 * 1.装饰器名字错误 xproperty写成property
 * 2.类型错误@xproperty(XXX)
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.XBase = exports.SerializeData = exports.XManager = exports.xStatusSync = exports.xclass = exports.xfunc = exports.xproperty = exports.xenum = exports.notify = void 0;
function notify(params) {
    if (params === void 0) { params = null; }
    return function (target, name) {
        Object.defineProperty(target, name, {
            get: function () {
                return this["_" + name];
            },
            set: function (value) {
                var old = this["_" + name];
                if (old !== value) {
                    this["_" + name] = value;
                    this.emit(name, value);
                }
            }
        });
    };
}
exports.notify = notify;
function objToStrMap(obj) {
    var strMap = new Map();
    for (var _i = 0, _a = Object.keys(obj); _i < _a.length; _i++) {
        var k = _a[_i];
        strMap.set(k, obj[k]);
    }
    return strMap;
}
function mapToStrObj(map) {
    var obj = new Object();
    map.forEach(function (value, key) {
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
function xenum(name, e, params) {
    if (params === void 0) { params = null; }
    var enu = objToStrMap(e);
    var titles = objToStrMap(params["titles"]);
    var len = enu.size / 2;
    var i = 0;
    enu.forEach(function (v, k) {
        if (i >= len) {
            return;
        }
        // console.log(k, titles.get(k))
        i++;
        XManager.Ins.addEnum(name, k, titles.get(k));
    });
}
exports.xenum = xenum;
/**
 * 基本属性
 * @param type 属性类型
 * @param params 参数 Object类型
 * @param target 类的构造函数(静态成员)/原型对象(实例成员)
 * @param name 属性名字
 */
function xproperty(type, params) {
    if (params === void 0) { params = null; }
    return function (target, name) {
        if (params == null) {
            params = {};
        }
        if (!params["_k_"]) {
            params["_k_"] = name;
        }
        params["_cls_"] = type; //属性类型
        params["_propName_"] = name; //属性类型
        var clsName = target.constructor.name;
        XManager.Ins.addProp(clsName, name, params);
    };
}
exports.xproperty = xproperty;
/**
 * @param params 参数 Object类型
 * @param target 类的构造函数(静态成员)/原型对象(实例成员)
 * @param name 方法的名字
 * @param desc 方法描述
 */
function xfunc(params) {
    if (params === void 0) { params = null; }
    return function (target, name, desc) {
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
        var clsName = target.constructor.name;
        XManager.Ins.addFunc(clsName, name, params);
    };
}
exports.xfunc = xfunc;
/**
 * 类装饰器
 * @param params Object
 * @param type 类型构造
 * @param target 类的构造函数(静态成员)/原型对象(实例成员)
 */
function xclass(type, params) {
    if (params === void 0) { params = null; }
    return function (target) {
        if (params == null) {
            params = {};
        }
        var clsName = target.name;
        params["_cls_"] = type; //保存Type，可以通过classname直接创建 类实例
        XManager.Ins.addClss(clsName, params);
        //确保每一个被装饰的类都有一个属性Map，即使为空
        var prop = XManager.Ins.getPropMetas(clsName);
        if (prop == undefined) {
            XManager.Ins.properties.set(clsName, new Map());
        }
        XManager.Ins.defaultClass.set(clsName, new type());
    };
}
exports.xclass = xclass;
/**
 * 网络同步 属性标识
 * ！！！属性名称必须和类中名称保持一致，只是在序列化时，还是会按照_k_进行序列化
 * 被描述的属性，将会在状态同步中被序列化
 *
 * 序列化中，会遍历原型链，在任何类中都可以标识父类的属性进行同步，以避免修改引擎基类
 */
function xStatusSync(type, params) {
    return function (target, name) {
        var clsName = target.constructor.name;
        XManager.Ins.netStatusSync.set(clsName, params);
    };
}
exports.xStatusSync = xStatusSync;
/**
 * 反射系统管理器
 */
var XManager = /** @class */ (function () {
    function XManager() {
        this.propRegistRuncs = [];
        this.netStatusSync = new Map();
        /**
         * 类名：编辑器标签
         * 1.序列化与反序列化
         * 2.编辑器 物品列表
         *
         * obj至少包含一个对象构造器，其他标记不一定有
         */
        this.classes = new Map();
        /**
         * 方法
         * 类名：<方法名,编辑器标签>
         * 1.脚本调用
         *
         * 构造器，参数，参数类型，返回值？
         */
        this.funcs = new Map();
        /**
         * 属性
         * 类名：<字段名称,编辑器属性>
         * 1.序列化与反序列化
         * 2.编辑器 属性列表
         *
         * 类型、其他标记
         */
        this.properties = new Map();
        this.defaultClass = new Map();
        /**
         * 枚举值
         * 名称 <索引,其他属性>
         */
        this.enums = new Map();
    }
    /**
     * 仅对装饰器公开
     * @param clsName
     * @param obj
     */
    XManager.prototype.addClss = function (clsName, obj) {
        if (this.classes.has(clsName)) {
            console.error("重复添加", clsName);
        }
        else {
            this.classes.set(clsName, obj);
        }
    };
    XManager.prototype.addFunc = function (clsName, name, obj) {
        if (!this.funcs.has(clsName)) {
            this.funcs.set(clsName, new Map());
        }
        var map = this.funcs.get(clsName);
        map.set(name, obj);
    };
    XManager.prototype.addProp = function (clsName, name, obj) {
        if (!this.properties.has(clsName)) {
            this.properties.set(clsName, new Map());
        }
        var map = this.properties.get(clsName);
        map.set(name, obj);
    };
    XManager.prototype.addEnum = function (clsName, index, obj) {
        if (!this.enums.has(clsName)) {
            this.enums.set(clsName, new Map());
        }
        var map = this.enums.get(clsName);
        map.set(index, obj);
    };
    // 获取类全部元数据
    XManager.prototype.getClsMetas = function (clsName) {
        return this.classes.get(clsName);
    };
    // 获取属性全部元数据
    XManager.prototype.getPropMetas = function (clsName) {
        return this.properties.get(clsName);
    };
    // 获取函数全部元数据
    XManager.prototype.getFuncMetas = function (clsName) {
        return this.funcs.get(clsName);
    };
    // 获取全部枚举元数据
    XManager.prototype.getEnumMetas = function (clsName) {
        return this.funcs.get(clsName);
    };
    /**
     * 获取具有某种标签对类属性
     * @param tagName
     * @returns
     */
    XManager.prototype.getClassMetaByTag = function (tagName) {
        var arr_meta = [];
        this.classes.forEach(function (meta, key) {
            if (meta["tag"] != undefined && meta["tag"] == tagName) {
                arr_meta.push(meta);
            }
        });
        return arr_meta;
    };
    /**
     * 从Meta生成实例
     * @param meta
     * @returns
     */
    XManager.prototype.getInstanceByMeta = function (meta) {
        var type = meta["_cls_"];
        return new type();
    };
    /**
     * 从字符串生成实例
     * @param className
     * @returns
     */
    XManager.prototype.getInstanceByStr = function (className) {
        if (!this.classes.has(className)) {
            return null;
        }
        var item = this.classes.get(className);
        var type = item["_cls_"];
        return new type();
    };
    /**
     * 获取类所有属性
     * 没有任何筛选，获取原型链上全部继承属性
     * @returns Map<String,Map<String,Object>> Map<类名,Map<字段名,元数据>>
     */
    XManager.prototype.getClsAllInfo = function (value) {
        var target = null;
        if (typeof value == "string") {
            var meta = this.getClsMetas(value);
            if (meta) {
                target = meta["_cls_"];
            }
        }
        else {
            target = value["_cls_"];
        }
        if (!target) {
            return;
        }
        var arr = [];
        var ptr = target;
        while (ptr.name != undefined && ptr.name != "") {
            var clsName = ptr.name;
            var clsMeta = this.getClsMetas(clsName);
            var propMap = this.getPropMetas(clsName);
            if (propMap != undefined && clsMeta != undefined) {
                var obj = {};
                clsMeta["clsName"] = clsName;
                obj["cls"] = clsMeta;
                obj["prop"] = propMap;
                arr.push(obj);
            }
            ptr = ptr["__proto__"];
        }
        return arr;
    };
    /**
     * 获取类所有编辑器属性
     * 根据edit_title筛选
     * @returns Map<String,Map<String,Object>> Map<类名,Map<字段名,元数据>>
     */
    XManager.prototype.getClsEditorInfoMapArray = function (value) {
        var target = null;
        if (typeof value == "string") {
            var meta = this.getClsMetas(value);
            if (meta) {
                target = meta["_cls_"];
            }
        }
        else {
            target = value["_cls_"];
        }
        if (!target) {
            return;
        }
        var arr = [];
        var ptr = target;
        var _loop_1 = function () {
            var clsName = ptr.name;
            var clsMeta = this_1.getClsMetas(clsName);
            var propMap = this_1.getPropMetas(clsName);
            if (propMap != undefined && clsMeta != undefined) {
                clsMeta["clsName"] = clsName;
                var editorPropMap_1 = new Map();
                //必须包含"edit_title"字段
                propMap.forEach(function (meta, propName) {
                    if (meta["edit_title"] != undefined) {
                        editorPropMap_1.set(propName, meta);
                    }
                });
                arr.push({
                    cls: clsMeta,
                    prop: editorPropMap_1
                });
            }
            ptr = ptr["__proto__"];
        };
        var this_1 = this;
        while (ptr.name != undefined && ptr.name != "") {
            _loop_1();
        }
        return arr;
    };
    XManager.prototype.getClsEditorInfoMap = function (value) {
        var target = null;
        if (typeof value == "string") {
            var meta = this.getClsMetas(value);
            if (meta) {
                target = meta["_cls_"];
            }
        }
        else {
            target = value["_cls_"];
        }
        if (!target) {
            return;
        }
        var editorPropMap = new Map();
        var ptr = target;
        while (ptr.name != undefined && ptr.name != "") {
            var clsName = ptr.name;
            var clsMeta = this.getClsMetas(clsName);
            var propMap = this.getPropMetas(clsName);
            if (propMap != undefined && clsMeta != undefined) {
                clsMeta["clsName"] = clsName;
                //必须包含"edit_title"字段
                propMap.forEach(function (meta, propName) {
                    if (meta["edit_title"] != undefined) {
                        editorPropMap.set(propName, meta);
                    }
                });
            }
            ptr = ptr["__proto__"];
        }
        return editorPropMap;
    };
    XManager.prototype.print = function () {
        var _this = this;
        this.propRegistRuncs.forEach(function (func) {
            Object.call(_this, func);
        });
        console.warn("类", this.classes);
        console.warn("方法", this.funcs);
        console.warn("属性", this.properties);
        console.warn("枚举", this.enums);
        console.warn("默认类", this.defaultClass);
        //在生成组件列表时可用
        var gameComponents = this.getClassMetaByTag("GameComponent");
        console.warn("根据xclass中的tag获取类", gameComponents);
        var clsInfos = this.getClsEditorInfoMap("RotateComponent");
        console.warn("根据xclass中的tag获取类", clsInfos);
    };
    XManager.Ins = new XManager();
    return XManager;
}());
exports.XManager = XManager;
var SerializeData = /** @class */ (function () {
    function SerializeData() {
        //输出/输入
        this.result = new Array();
        //链接
        this.linkMap = new Map();
        this.linkSet = new Set();
    }
    return SerializeData;
}());
exports.SerializeData = SerializeData;
var XBase = /** @class */ (function () {
    function XBase() {
    }
    XBase_1 = XBase;
    XBase.prototype.test = function (data) { };
    //获取类名
    XBase.prototype.getClsName = function () {
        return this.constructor.name;
    };
    //根据字符串设置属性
    XBase.prototype.setProperty = function (key, value) {
        this[key] = value;
    };
    //根据字符串获取属性
    XBase.prototype.getProperty = function (key) {
        return this[key];
    };
    //TODO 获取所有属性，包括Parent的
    XBase.prototype.getFields = function () {
    };
    //TODO 获取自己的属性
    XBase.prototype.getSelfFields = function () {
    };
    //TODO 获取全部方法
    XBase.prototype.getMethods = function () {
    };
    //TODO 获取函数
    XBase.getMethod = function (funcName) {
    };
    //TODO 获取构造函数
    XBase.getConstructors = function () {
    };
    //TODO 获取一个实例
    XBase.newInstance = function () {
    };
    //获取对象深拷贝
    //先转object，在反序列化。
    XBase.prototype.getCopy = function (type) {
        var comp = new type();
        comp.fromJSON(this.toJSON());
        return comp;
    };
    //获取类元数据
    XBase.prototype.getClsMeta = function (key) {
        var obj = XManager.Ins.getClsMetas(this.constructor.name);
        return obj === null || obj === void 0 ? void 0 : obj[key];
    };
    //获取属性元数据
    XBase.prototype.getPropMeta = function (key) {
        var obj = XManager.Ins.getPropMetas(this.constructor.name);
        return obj === null || obj === void 0 ? void 0 : obj[key];
    };
    //获取函数元数据
    XBase.prototype.getFuncMeta = function (key) {
        var obj = XManager.Ins.getFuncMetas(this.constructor.name);
        return obj === null || obj === void 0 ? void 0 : obj[key];
    };
    // 序列化接口Interface
    XBase.prototype.onToJSON = function (obj) { };
    XBase.prototype.onFromJSON = function (obj) { };
    /**
     * 序列化
     * @param idMap
     * @returns
     */
    XBase.prototype.toJSON = function (serializeData) {
        var _this = this;
        if (serializeData === void 0) { serializeData = null; }
        var root = false;
        if (serializeData == null) {
            serializeData = new SerializeData();
            root = true;
        }
        var obj = {};
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
        var ptr = this.constructor;
        var _loop_2 = function () {
            var name_1 = ptr.name;
            var meta = XManager.Ins.getPropMetas(name_1);
            var defaultClass = XManager.Ins.defaultClass.get(name_1);
            if (meta && defaultClass) {
                meta.forEach(function (value, key) {
                    //将高频数据类型放到前面
                    if (_this[key] == null) {
                        return;
                    }
                    var _k_ = value["_k_"] || key;
                    if (typeof _this[key] == "string" || typeof _this[key] == "number" || typeof _this[key] == "boolean" || _this[key] instanceof Number || _this[key] instanceof Boolean || _this[key] instanceof String) {
                        if (_this[key] != defaultClass[key]) {
                            obj[_k_] = _this.__setPropertyToJson(_this[key], serializeData);
                        }
                    }
                    else if (_this[key] instanceof Array) {
                        if (_this[key].length != 0) {
                            obj[_k_] = _this.__setPropertyToJson(_this[key], serializeData);
                        }
                    }
                    else if (_this[key] instanceof Map) {
                        if (_this[key].size != 0) {
                            obj[_k_] = _this.__setPropertyToJson(_this[key], serializeData);
                        }
                    }
                    else if (_this[key] instanceof Set) {
                        if (_this[key].size != 0) {
                            obj[_k_] = _this.__setPropertyToJson(_this[key], serializeData);
                        }
                    }
                    else {
                        obj[_k_] = _this.__setPropertyToJson(_this[key], serializeData);
                    }
                });
            }
            ptr = ptr["__proto__"];
        };
        while (ptr.name != undefined && ptr.name != "") {
            _loop_2();
        }
        this.onToJSON(obj);
        if (root) {
            // console.warn(serializeData.result)
            return serializeData.result;
        }
        else {
            var outObj = {};
            outObj["_id_"] = this["_id_"];
            return outObj;
        }
    };
    XBase.prototype.__setPropertyToJson = function (obj, serializeData) {
        var _this = this;
        if (serializeData === void 0) { serializeData = null; }
        if (obj != null && obj != undefined) {
            //将高频数据类型放到前面
            if (typeof obj == "string" || typeof obj == "number" || typeof obj == "boolean" || obj instanceof Number || obj instanceof Boolean || obj instanceof String) {
                return obj;
            }
            else if (obj instanceof XBase_1) {
                //处理引用类型
                return obj.toJSON(serializeData);
            }
            else if (obj instanceof Array || obj instanceof Set) {
                var childObj_1 = [];
                obj.forEach(function (item) {
                    childObj_1.push(_this.__setPropertyToJson(item, serializeData));
                });
                return childObj_1;
            }
            else if (obj instanceof Map) {
                var childObj_2 = [];
                obj.forEach(function (value, key) {
                    var item = [];
                    item[0] = key;
                    item[1] = _this.__setPropertyToJson(value, serializeData);
                    childObj_2.push(item);
                });
                return childObj_2;
            }
            else {
                console.error("TOJSON 属性类型不在序列化解析范围", obj);
                return null;
            }
        }
    };
    //反序列化
    XBase.prototype.fromJSON = function (obj, serializeData) {
        var _this = this;
        if (serializeData === void 0) { serializeData = null; }
        var root = false;
        if (serializeData == null) {
            root = true;
            if (obj instanceof Array == false) {
                return;
            }
            serializeData = new SerializeData();
            serializeData.result = obj;
            serializeData.result.forEach(function (jsonObj) {
                var _id_ = jsonObj["_id_"];
                var _cls_ = jsonObj["_cls_"];
                var itemMeta = XManager.Ins.getClsMetas(_cls_);
                var ins = null;
                //先创建所有Instance
                if (_id_ == "0") {
                    ins = _this;
                }
                else {
                    ins = XManager.Ins.getInstanceByMeta(itemMeta);
                }
                serializeData.linkMap.set(_id_, ins);
                ins.__loopFromJson(jsonObj, serializeData);
            });
            serializeData.linkMap.forEach(function (instance, id) {
                instance.__linkFromJson(serializeData);
            });
            serializeData.linkMap.forEach(function (instance, id) {
                instance.__linkFromJson(serializeData);
            });
            serializeData.result.forEach(function (jsonObj) {
                var _id_ = jsonObj["_id_"];
                var ins = serializeData.linkMap.get(_id_);
                ins.onFromJSON(jsonObj);
            });
            //删掉所有不必要属性
            serializeData.linkMap.forEach(function (value, key) {
                delete value["_id_"];
                delete value["_cls_"];
            });
        }
    };
    XBase.prototype.__loopFromJson = function (obj, serializeData) {
        var _this = this;
        if (serializeData === void 0) { serializeData = null; }
        if (!obj) {
            return;
        }
        var ptr = this.constructor;
        while (ptr.name != undefined && ptr.name != "") {
            var clsName = ptr.name;
            var map = XManager.Ins.getPropMetas(clsName);
            var defaultClass = XManager.Ins.defaultClass.get(clsName);
            if (map) {
                //1.如果是继承自XBase的类，遍历所有被装饰的属性
                map.forEach(function (value, key) {
                    var type = value["_cls_"]; //属性类型
                    var _k_ = value["_k_"] || key; //属性名称
                    if (obj[_k_] != undefined) {
                        _this[key] = _this.__setPropertyFromJson(type, obj[_k_], serializeData);
                    }
                });
            }
            else {
                if (clsName != "EvtBase") {
                    console.error("该类不在序列化范围", clsName);
                }
            }
            ptr = ptr["__proto__"];
        }
    };
    XBase.prototype.__setPropertyFromJson = function (type, obj, serializeData) {
        var _this = this;
        if (serializeData === void 0) { serializeData = null; }
        var childItem = new type();
        if (obj == null || obj == undefined) {
            return null;
        }
        if (childItem instanceof Number || childItem instanceof String || childItem instanceof Boolean) {
            childItem = obj;
        }
        else if (childItem instanceof XBase_1) {
            if (obj["_id_"] == undefined) {
                childItem.fromJSON(obj, serializeData);
            }
            else {
                childItem = obj; //先不对其做处理，链接时生成实例，
            }
        }
        else if (childItem instanceof Array) {
            if (obj.size != 0) {
                obj.forEach(function (item) {
                    var itemType = _this.__getElementClsFromJson(item);
                    if (itemType) {
                        childItem.push(_this.__setPropertyFromJson(itemType, item, serializeData));
                    }
                    else {
                        childItem.push(item);
                    }
                });
            }
        }
        else if (childItem instanceof Map) {
            if (obj.size != 0) {
                obj.forEach(function (item) {
                    var itemType = _this.__getElementClsFromJson(item[1]);
                    if (itemType) {
                        childItem.set(item[0], _this.__setPropertyFromJson(itemType, item[1], serializeData));
                    }
                    else {
                        childItem.set(item[0], item[1]);
                    }
                });
            }
        }
        else if (childItem instanceof Set) {
            if (obj.size != 0) {
                obj.forEach(function (item) {
                    var itemType = _this.__getElementClsFromJson(item);
                    if (itemType) {
                        childItem.add(_this.__setPropertyFromJson(itemType, item, serializeData));
                    }
                    else {
                        childItem.add(item);
                    }
                });
            }
        }
        else {
            console.error("属性类型不在反序列化解析范围", childItem);
        }
        return childItem;
    };
    XBase.prototype.__linkFromJson = function (serializeData) {
        var _this = this;
        if (serializeData === void 0) { serializeData = null; }
        var target = null;
        var meta = XManager.Ins.getClsMetas(this.getClsName());
        if (!meta) {
            return;
        }
        target = meta["_cls_"];
        if (!target) {
            return;
        }
        var ptr = target;
        while (ptr.name != undefined && ptr.name != "") {
            var clsName = ptr.name;
            var clsMeta = XManager.Ins.getClsMetas(clsName);
            var propMap = XManager.Ins.getPropMetas(clsName);
            if (propMap != undefined && clsMeta != undefined) {
                propMap.forEach(function (meta, propName) {
                    var jsonObj = _this.getProperty(propName); //当前
                    if (jsonObj != null && jsonObj != undefined) {
                        var type = meta["_cls_"];
                        if (type != undefined) {
                            //处理之前没有处理过的类
                            var bean = new type();
                            _this.__makeLinkFromJson(bean, propName, jsonObj, serializeData);
                        }
                    }
                });
            }
            ptr = ptr["__proto__"];
        }
    };
    XBase.prototype.__makeLinkFromJson = function (bean, propName, jsonObj, serializeData) {
        if (serializeData === void 0) { serializeData = null; }
        if (bean instanceof XBase_1) {
            if (jsonObj["_id_"] == undefined) {
                // console.error("_id_不存在", jsonObj);
                return;
            }
            var ref = serializeData.linkMap.get(jsonObj["_id_"] + "");
            this.setProperty(propName, ref);
        }
        else if (bean instanceof Array) {
            var isRef_1 = false;
            jsonObj.forEach(function (item) {
                var id = item["_id_"];
                if (!id) {
                    return;
                }
                var ref = serializeData.linkMap.get(id + "");
                bean.push(ref);
                isRef_1 = true;
            });
            if (isRef_1) {
                this.setProperty(propName, bean);
            }
        }
        else if (bean instanceof Set) {
            var isRef_2 = false;
            jsonObj.forEach(function (item) {
                var id = item["_id_"];
                if (!id) {
                    return;
                }
                var ref = serializeData.linkMap.get(id + "");
                bean.add(ref);
                isRef_2 = true;
            });
            if (isRef_2) {
                this.setProperty(propName, bean);
            }
        }
        else if (bean instanceof Map) {
            var isRef_3 = false;
            jsonObj.forEach(function (value, key) {
                var id = value["_id_"];
                if (!id) {
                    return;
                }
                var ref = serializeData.linkMap.get(id + "");
                bean.set(key, ref);
                isRef_3 = true;
            });
            if (isRef_3) {
                this.setProperty(propName, bean);
            }
        }
    };
    //根据子元素标签，返回构造函数
    XBase.prototype.__getElementClsFromJson = function (obj) {
        var itemType = null;
        if (obj != null && obj["_cls_"] != undefined) {
            var cls = XManager.Ins.getClsMetas(obj["_cls_"]);
            itemType = cls["_cls_"];
        }
        else {
            if (itemType != null) {
                console.error("没使用装饰器", itemType, obj);
            }
        }
        return itemType;
    };
    XBase.prototype.toNetStatusJson = function (serializeData) {
        var _this = this;
        if (serializeData === void 0) { serializeData = null; }
        var root = false;
        if (serializeData == null) {
            serializeData = new SerializeData();
            root = true;
        }
        var obj = {};
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
        var ptr = this.constructor;
        var _loop_3 = function () {
            var clsName = ptr.name;
            var meta = XManager.Ins.getPropMetas(clsName);
            var defaultClass = XManager.Ins.defaultClass.get(clsName);
            var netSyncMeta = XManager.Ins.netStatusSync.get(clsName);
            if (meta && netSyncMeta) {
                netSyncMeta.forEach(function (key) {
                    var value = meta.get(key);
                    var _k_ = value["_k_"] || key;
                    obj[_k_] = _this.__setPropertyToJson(_this[key], serializeData);
                });
            }
            ptr = ptr["__proto__"];
        };
        while (ptr.name != undefined && ptr.name != "") {
            _loop_3();
        }
        this.onToJSON(obj);
        if (root) {
            return serializeData.result;
        }
        else {
            var outObj = {};
            outObj["_id_"] = this["_id_"];
            return outObj;
        }
    };
    var XBase_1;
    __decorate([
        xfunc()
    ], XBase.prototype, "test", null);
    XBase = XBase_1 = __decorate([
        xclass(XBase_1)
    ], XBase);
    return XBase;
}());
exports.XBase = XBase;
