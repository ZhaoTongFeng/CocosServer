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
 * ???????????????
 * ????????????????????????
 * ????????? ?????????????????????????????????
 */
var UObject = /** @class */ (function (_super) {
    __extends(UObject, _super);
    function UObject() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._id = UObject_1.GeneateID() + "";
        /**
         * ??????????????????True????????????
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
    //??????????????????
    UObject.prototype.receiveData = function (obj) {
    };
    Object.defineProperty(UObject.prototype, "id", {
        get: function () { return this._id; },
        set: function (value) { this._id = value; },
        enumerable: false,
        configurable: true
    });
    /**
     * ???????????????
     * ????????????????????????????????????
     */
    UObject.prototype.init = function (data) {
        if (data === void 0) { data = null; }
    };
    /**
     * ?????????
     * @param dt
     */
    UObject.prototype.update = function (dt) {
    };
    /**
     * ???????????????
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
    //????????????????????????ID
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
