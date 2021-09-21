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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtocolSystem = exports.Protocol = void 0;
var ProtocolBase = /** @class */ (function () {
    function ProtocolBase() {
        /**
         * 各种数据压缩和解压
         * 归一化
         */
        this.flootRate = 127;
    }
    Object.defineProperty(ProtocolBase.prototype, "byteLength", {
        //返回总长
        get: function () { return this.headLength + this.dataLength; },
        enumerable: false,
        configurable: true
    });
    //重置内存空间到包头
    ProtocolBase.prototype.clear = function () { };
    ;
    //把（-1,1）转换成（0,254）
    ProtocolBase.prototype.zip11 = function (value) {
        return Math.floor(value * this.flootRate + this.flootRate);
    };
    ProtocolBase.prototype.unZip11 = function (value) {
        return (value - this.flootRate) / this.flootRate;
    };
    //把（0,1）转换成（0,127）
    ProtocolBase.prototype.zip01 = function (value) {
        // console.log(value,Math.floor(value * this.flootRate))
        return Math.floor(value * this.flootRate);
    };
    ProtocolBase.prototype.unZip01 = function (value) {
        return value / this.flootRate;
    };
    ProtocolBase.prototype.zipBool = function (v) {
        return v ? 1 : 0;
    };
    ProtocolBase.prototype.unZipBool = function (v) {
        return v == 1 ? true : false;
    };
    return ProtocolBase;
}());
/**
 * 传输子协议，适配器模式，每一个需要传输的Component对应一个
 * ByteLength 4字节
 * ID 4字节
 * Mask 2字节？4字节
 *      TODO 现在依然会有数据段浪费，比如一个协议记录10个数据，但是只有1个更新了，
 *      最后发送的还是10个数据，依靠这个MASK，可以依次记录被改变的数据是哪一个，0更新了就是1,1更新了就是10
 *      如果对于所有协议，都启用这个字段，还是会有浪费，所以既然能通过ID找到对应协议，那么就某些数据多的协议中可以启动掩码模式
 */
var Protocol = /** @class */ (function (_super) {
    __extends(Protocol, _super);
    function Protocol(id, system) {
        var _this = _super.call(this) || this;
        _this.bUseMask = false;
        _this.mask = 0;
        _this.curByteLength = 0;
        _this.id = 0; //4bit
        _this.system = null;
        //1.申请一段空间
        _this.bReq = false; //是否申请了缓冲区，如果没有申请，在unRequest时会将缓冲区还回去
        _this.headLength = 8;
        _this.dataLength = 0;
        _this.offset = 0;
        _this.id = id;
        _this.system = system;
        _this.init();
        return _this;
    }
    //构造函数之后执行，用在定义协议
    Protocol.prototype.init = function () { };
    //把当前长度清空即可
    Protocol.prototype.clear = function () { this.curByteLength = 0; };
    ;
    Protocol.prototype.requestBufferView = function () {
        this.system.requestBufferView(this);
        var startView = this.getUint32(0, 2);
        //理论上，同一套代码，只需一个ID就能拿到这段数据的长度，似乎不需要在数据包中记录这个长度
        //必须要保证，任何时刻，线上只有一个版本，才能获取正确的数据长度
        var count = 0;
        startView[count++] = this.id;
        startView[count++] = this.byteLength;
        if (this.bUseMask) {
            startView[count++] = this.mask;
        }
        this.bReq = true;
        this.initView();
    };
    Protocol.prototype.unRequestBufferView = function () {
        this.system.unRequestBufferView(this);
        this.bReq = false;
    };
    Protocol.prototype.responseBufferView = function (offset) {
        this.offset = offset;
        this.initView();
    };
    //读写数据前，初始化相同的访问格式
    Protocol.prototype.initView = function () { };
    Protocol.prototype.getUint8 = function (locOffset, length) {
        this.curByteLength += length;
        return new Uint8Array(this.system.binBuffer, this.offset + locOffset, length);
    };
    Protocol.prototype.getUint32 = function (locOffset, length) {
        this.curByteLength += length * 4;
        return new Uint32Array(this.system.binBuffer, this.offset + locOffset, length);
    };
    Protocol.prototype.getInt32 = function (locOffset, length) {
        this.curByteLength += length * 4;
        return new Int32Array(this.system.binBuffer, this.offset + locOffset, length);
    };
    Protocol.prototype.getAll = function () { return new Uint8Array(this.system.binBuffer, this.offset, this.byteLength); };
    return Protocol;
}(ProtocolBase));
exports.Protocol = Protocol;
var ProtocolSystem = /** @class */ (function (_super) {
    __extends(ProtocolSystem, _super);
    function ProtocolSystem(gameInstance) {
        var _this = _super.call(this) || this;
        _this.max = 1024; //缓冲区长度Byte
        _this.gameInstance = null;
        _this._opt = 0; //1bit
        //由于客户端不是立即处理数据，所以在设置binBufferView之后标记为true;
        _this.bSetResponse = false;
        _this.headLength = 12;
        _this.dataLength = 0;
        _this.offset = 0;
        _this.gameInstance = gameInstance;
        _this.binBuffer = new ArrayBuffer(_this.max);
        _this.binBufferView = new Uint8Array(_this.binBuffer);
        _this.clear();
        return _this;
    }
    //是否被填充过数据
    ProtocolSystem.prototype.hasData = function () { return !(this.offset == this.headLength); };
    //获取有效数据段
    ProtocolSystem.prototype.getAll = function () { return new Uint8Array(this.binBuffer, 0, this.byteLength); };
    Object.defineProperty(ProtocolSystem.prototype, "opt", {
        get: function () { return this._opt; },
        set: function (value) {
            this._opt = value;
            this.updateHead();
        },
        enumerable: false,
        configurable: true
    });
    //更新缓冲区头部
    ProtocolSystem.prototype.updateHead = function () {
        var view = new Uint32Array(this.binBuffer, 0, 3);
        view[0] = this._opt; //指令
        view[1] = this.byteLength;
        view[2] = new Date().getTime(); //时间戳
    };
    ProtocolSystem.prototype.clear = function () {
        this.offset = this.headLength;
        this.dataLength = 0;
        var view = new Uint8Array(this.binBuffer);
        view.fill(0);
    };
    //1.申请一段空间
    ProtocolSystem.prototype.requestBufferView = function (protocol) {
        protocol.offset = this.offset;
        this.dataLength += protocol.byteLength;
        this.offset += protocol.byteLength;
    };
    //并没有使用这段空间，还回去
    ProtocolSystem.prototype.unRequestBufferView = function (protocol) {
        this.dataLength -= protocol.byteLength;
        this.offset -= protocol.byteLength;
    };
    ProtocolSystem.prototype.responseBufferView = function () {
        if (!this.bSetResponse) {
            return;
        }
        this.bSetResponse = false;
        this.binBuffer = this.binBufferView.buffer;
        this.dataLength = this.binBufferView.byteLength;
        this.offset = this.headLength;
        if (this.binBufferView.byteOffset != undefined) {
            this.offset += this.binBufferView.byteOffset;
        }
        var maxByte = this.dataLength;
        if (this.binBufferView.byteOffset != undefined) {
            maxByte += this.binBufferView.byteOffset;
        }
        var count = 0;
        while (this.offset < maxByte) {
            //解析每一个协议
            var subView = new Uint32Array(this.binBuffer, this.offset, 2);
            var id = subView[0];
            var subLength = subView[1];
            var world = this.gameInstance.getWorld();
            var obj = world.actorSystem.objMap.get(id + "");
            var pro = obj.getProtocol(id, this);
            if (pro != null) {
                pro.responseBufferView(this.offset);
                obj.receiveBinary(pro);
            }
            else {
                //如果获取失败，则需要用byteLength跳过这段数据
                console.error("获取Protocol失败");
            }
            this.offset += subLength;
            count++;
        }
    };
    return ProtocolSystem;
}(ProtocolBase));
exports.ProtocolSystem = ProtocolSystem;
