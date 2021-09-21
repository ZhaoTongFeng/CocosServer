import UGameInstance from "../../GameInstance";


class ProtocolBase {
    headLength: number;
    dataLength: number;
    offset: number;//在总buffer中的位置

    //返回总长
    public get byteLength() { return this.headLength + this.dataLength; }

    //重置内存空间到包头
    public clear() { };

    /**
     * 各种数据压缩和解压
     * 归一化
     */

    flootRate = 127;
    //把（-1,1）转换成（0,254）
    zip11(value) {
        return Math.floor(value * this.flootRate + this.flootRate);
    }
    unZip11(value) {
        return (value - this.flootRate) / this.flootRate;
    }

    //把（0,1）转换成（0,127）
    zip01(value) {
        // console.log(value,Math.floor(value * this.flootRate))
        return Math.floor(value * this.flootRate);
    }
    unZip01(value) {
        return value / this.flootRate;
    }

    zipBool(v: boolean) {
        return v ? 1 : 0
    }
    unZipBool(v: number) {
        return v == 1 ? true : false;
    }
}


/**
 * 传输子协议，适配器模式，每一个需要传输的Component对应一个
 * ByteLength 4字节
 * ID 4字节
 * Mask 2字节？4字节 
 *      TODO 现在依然会有数据段浪费，比如一个协议记录10个数据，但是只有1个更新了，
 *      最后发送的还是10个数据，依靠这个MASK，可以依次记录被改变的数据是哪一个，0更新了就是1,1更新了就是10
 *      如果对于所有协议，都启用这个字段，还是会有浪费，所以既然能通过ID找到对应协议，那么就某些数据多的协议中可以启动掩码模式
 */
export class Protocol extends ProtocolBase {
    bUseMask: boolean = false;
    mask: number = 0;
    curByteLength = 0;

    id = 0;//4bit
    system: ProtocolSystem = null;
    constructor(id, system) {
        super();
        this.headLength = 8;
        this.dataLength = 0;
        this.offset = 0;
        this.id = id;
        this.system = system;
        this.init();
    }
    //构造函数之后执行，用在定义协议
    init() { }

    //把当前长度清空即可
    public clear() { this.curByteLength = 0; };

    //1.申请一段空间
    bReq = false;//是否申请了缓冲区，如果没有申请，在unRequest时会将缓冲区还回去
    requestBufferView() {
        this.system.requestBufferView(this);
        let startView = this.getUint32(0, 2);
        //理论上，同一套代码，只需一个ID就能拿到这段数据的长度，似乎不需要在数据包中记录这个长度
        //必须要保证，任何时刻，线上只有一个版本，才能获取正确的数据长度
        let count = 0;
        startView[count++] = this.id;
        startView[count++] = this.byteLength;
        if (this.bUseMask) {
            startView[count++] = this.mask;
        }
        this.bReq = true;
        this.initView();
    }
    unRequestBufferView() {
        this.system.unRequestBufferView(this);
        this.bReq = false;
    }

    responseBufferView(offset) {
        this.offset = offset;
        this.initView();
    }
    //读写数据前，初始化相同的访问格式
    initView() { }

    getUint8(locOffset, length) {
        this.curByteLength += length;
        return new Uint8Array(this.system.binBuffer, this.offset + locOffset, length)
    }
    getUint32(locOffset, length) {
        this.curByteLength += length * 4;
        return new Uint32Array(this.system.binBuffer, this.offset + locOffset, length);
    }
    getInt32(locOffset, length) {
        this.curByteLength += length * 4;
        return new Int32Array(this.system.binBuffer, this.offset + locOffset, length);
    }

    getAll() { return new Uint8Array(this.system.binBuffer, this.offset, this.byteLength); }
}

export class ProtocolSystem extends ProtocolBase {
    max = 1024;//缓冲区长度Byte
    gameInstance: UGameInstance = null;
    binBuffer: ArrayBuffer;
    binBufferView: Uint8Array;
    //是否被填充过数据
    hasData() { return !(this.offset == this.headLength); }
    //获取有效数据段
    getAll() { return new Uint8Array(this.binBuffer, 0, this.byteLength); }

    private _opt: number = 0;//1bit
    public get opt(): number { return this._opt; }
    public set opt(value: number) {
        this._opt = value;
        this.updateHead();
    }

    //更新缓冲区头部
    private updateHead() {
        let view = new Uint32Array(this.binBuffer, 0, 3);
        view[0] = this._opt;//指令
        view[1] = this.byteLength;
        view[2] = new Date().getTime();//时间戳
    }

    constructor(gameInstance) {
        super();
        this.headLength = 12;
        this.dataLength = 0;
        this.offset = 0;
        this.gameInstance = gameInstance;
        this.binBuffer = new ArrayBuffer(this.max);
        this.binBufferView = new Uint8Array(this.binBuffer);
        this.clear();
    }

    clear() {
        this.offset = this.headLength;
        this.dataLength = 0;
        let view = new Uint8Array(this.binBuffer);
        view.fill(0);
    }



    //1.申请一段空间
    requestBufferView(protocol: Protocol) {
        protocol.offset = this.offset;
        this.dataLength += protocol.byteLength;
        this.offset += protocol.byteLength;
    }

    //并没有使用这段空间，还回去
    unRequestBufferView(protocol: Protocol) {
        this.dataLength -= protocol.byteLength;
        this.offset -= protocol.byteLength;
    }

    //由于客户端不是立即处理数据，所以在设置binBufferView之后标记为true;
    bSetResponse = false;
    responseBufferView() {
        if (!this.bSetResponse) { return; }
        this.bSetResponse = false;

        this.binBuffer = this.binBufferView.buffer;
        this.dataLength = this.binBufferView.byteLength;
        this.offset = this.headLength;

        if (this.binBufferView.byteOffset != undefined) {
            this.offset += this.binBufferView.byteOffset;
        }
        let maxByte = this.dataLength;
        if (this.binBufferView.byteOffset != undefined) {
            maxByte += this.binBufferView.byteOffset;
        }

        let count = 0;

        while (this.offset < maxByte) {
            //解析每一个协议
            let subView = new Uint32Array(this.binBuffer, this.offset, 2);
            let id = subView[0];
            let subLength = subView[1];
            let world = this.gameInstance.getWorld();
            let obj = world.actorSystem.objMap.get(id + "");
            let pro: Protocol = obj.getProtocol(id, this);
            if (pro != null) {
                pro.responseBufferView(this.offset);
                obj.receiveBinary(pro);
            } else {
                //如果获取失败，则需要用byteLength跳过这段数据
                console.error("获取Protocol失败");
            }
            this.offset += subLength;
            count++;
        }
    }
}