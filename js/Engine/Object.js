"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvtBase = void 0;
var XBase_1 = require("./Engine/ReflectSystem/XBase");
var EvtBase = /** @class */ (function (_super) {
    __extends(EvtBase, _super);
    function EvtBase() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.evtsMap = new Map();
        return _this;
    }
    EvtBase.prototype.emit = function (evt, param1, param2, param3, param4, param5) {
        if (!this.evtsMap) {
            return;
        }
        var list = this.evtsMap.get(evt);
        if (list) {
            for (var i = 0; i < list.length; i++) {
                var one = list[i];
                if (one.call) {
                    one.call.call(one.thisObj, param1, param2, param3, param4, param5);
                }
            }
        }
    };
    EvtBase.prototype.on = function (evt, call, thisObj) {
        var list = this.evtsMap.get(evt) || [];
        this.evtsMap.set(evt, list);
        list.push({
            call: call,
            thisObj: thisObj,
        });
    };
    EvtBase.prototype.off = function (evt, call, thisObj) {
        var list = this.evtsMap.get(evt);
        if (list) {
            var idx = list.findIndex(function (one) {
                return one.call == call && one.thisObj == thisObj;
            });
            if (idx >= 0) {
                list.splice(idx, 1);
            }
        }
    };
    EvtBase.prototype.targetOff = function (thisObj) {
        this.evtsMap.forEach(function (list) {
            for (var i = 0; i < list.length; i++) {
                var one = list[i];
                if (one.thisObj == thisObj) {
                    list.splice(i--, 1);
                }
            }
        });
    };
    return EvtBase;
}(XBase_1.XBase));
exports.EvtBase = EvtBase;
/**
 * 所有类基类
 * 包含一些通用接口
 * 可编写 网络同步与序列化等功能
 */
var UObject = /** @class */ (function (_super) {
    __extends(UObject, _super);
    function UObject() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._id = UObject_1.GeneateID() + "";
        /**
         * ！！！设置为True每帧更新
         */
        _this.canEveryTick = true;
        return _this;
    }
    UObject_1 = UObject;
    UObject.prototype.getProtocol = function (id, sys) {
        return null;
    };
    UObject.prototype.receiveBinary = function (protocol) {
    };
    UObject.GeneateID = function () {
        var id = UObject_1.GLOBALID;
        UObject_1.GLOBALID++;
        return id;
    };
    //接收网络数据
    UObject.prototype.receiveData = function (obj) {
    };
    Object.defineProperty(UObject.prototype, "id", {
        get: function () { return this._id; },
        set: function (value) { this._id = value; },
        enumerable: false,
        configurable: true
    });
    /**
     * 初始化函数
     * 在生命周期内只会调用一次
     */
    UObject.prototype.init = function (data) {
        if (data === void 0) { data = null; }
    };
    /**
     * 帧更新
     * @param dt
     */
    UObject.prototype.update = function (dt) {
    };
    /**
     * 释放时调用
     */
    UObject.prototype.destory = function () {
    };
    UObject.prototype.save = function () {
    };
    UObject.prototype.load = function () {
    };
    UObject.prototype.unUse = function () {
    };
    UObject.prototype.reUse = function () {
    };
    var UObject_1;
    //任何东西都有一个ID
    UObject.GLOBALID = 0;
    __decorate([
        XBase_1.xproperty(String)
    ], UObject.prototype, "_id", void 0);
    UObject = UObject_1 = __decorate([
        XBase_1.xclass(UObject_1)
    ], UObject);
    return UObject;
}(EvtBase));
exports.default = UObject;
