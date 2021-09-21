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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Graphic_1 = __importDefault(require("../../../Game1/Cocos/Other/Graphic"));
var JoyStick_1 = __importDefault(require("../../../Game1/Cocos/Other/JoyStick"));
var Enums_1 = require("../Enums");
var InputSystem_1 = require("../InputSystem/InputSystem");
var UMath_1 = require("../UMath");
var UWorldView_1 = __importDefault(require("../UWorldView"));
/**
 * 负责与Cocos适配显示
 *
 */
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var CCWorldViewBase = /** @class */ (function (_super) {
    __extends(CCWorldViewBase, _super);
    function CCWorldViewBase() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * CC相关的部分
         */
        _this.graphic = null;
        //场景根节点
        _this.rootScene = null;
        //抬头显示器根节点
        _this.rootHUD = null;
        //用户界面根节点
        _this.rootUI = null;
        //相机
        _this.cameraScene = null;
        //UI相机
        _this.cameraUI = null;
        //图片Node池
        _this.spritePrefab = null;
        _this.spritePool = new cc.NodePool();
        _this.labelPrefab = null;
        _this.labelPool = new cc.NodePool();
        _this.leftJoyStick = null;
        _this.rightJoyStick = null;
        /**
         * 共享部分
         */
        //客户端显示接口
        _this.worldView = null;
        //网络是游戏内外共享的，GameInstance里面只是指针，真正的位置应该是介于Cocos和引擎之间
        _this.network = null;
        _this.timer = 0;
        _this.fps = 60;
        _this.frameTime = 0;
        _this.frameTimer = 0;
        /**
         * 显示输出
         * 桥接USceneComponent和CC.Node
         */
        _this.nodeMap = new Map();
        _this.spriteMap = new Map();
        _this.SpriteFrameMap = new Map();
        _this.labelMap = new Map();
        _this.cameraMap = new Map();
        _this.camerCompMap = new Map();
        _this.currentCameraComp = null;
        /**
         * 玩家输入
         * 通常采用直接注入的形式，在逻辑那边就能获取到
         */
        _this.touchMap = new Map();
        return _this;
    }
    CCWorldViewBase.prototype.onLoad = function () {
        // cc.macro.ENABLE_CULLING = false
        var _this = this;
        //监听触摸输入
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this); //手指在目标区域外离开
        this.winSize = cc.v2(cc.winSize.width / 2, cc.winSize.height / 2);
        this.worldView = new UWorldView_1.default();
        //绑定属性
        this.worldView.winSize = UMath_1.uu.v2(cc.winSize.width / 2, cc.winSize.height / 2);
        //绑定事件
        this.worldView.updateOnec = function (dt) {
            if (dt === void 0) { dt = 0; }
            _this.updateOnce(dt);
        };
        this.worldView.graphic.begDrawDebug = function () { _this.graphic.begDrawDebug(); };
        this.worldView.graphic.endDrawDebug = function () { _this.graphic.endDrawDebug(); };
        this.worldView.graphic.drawGrid = function () { _this.graphic.drawGrid(); };
        this.worldView.graphic.drawLine = function (beg, end, strokeColor, lineWidth) {
            if (strokeColor === void 0) { strokeColor = UMath_1.UColor.RED(); }
            if (lineWidth === void 0) { lineWidth = 2; }
            _this.graphic.drawLine(beg, end, strokeColor, lineWidth);
        };
        this.worldView.graphic.drawRect = function (x, y, width, height, strokeColor, fillColor, lineWidth) {
            if (strokeColor === void 0) { strokeColor = UMath_1.UColor.RED(); }
            if (fillColor === void 0) { fillColor = UMath_1.UColor.BLACK(); }
            if (lineWidth === void 0) { lineWidth = 5; }
            _this.graphic.drawRect(x, y, width, height, strokeColor, fillColor, lineWidth);
        };
        this.worldView.graphic.drawCircle = function (x, y, radius, strokeColor) {
            if (strokeColor === void 0) { strokeColor = UMath_1.UColor.RED(); }
            _this.graphic.drawCircle(x, y, radius, strokeColor);
        };
        // this.worldView.graphic.drawEllipse = this.graphic.drawEllipse;
        // this.worldView.graphic.drawArc = this.graphic.drawArc;
        // this.worldView.graphic.drawBezierCurve = this.graphic.drawBezierCurve;
        // this.worldView.graphic.drawQuadraticCurve = this.graphic.drawQuadraticCurve;
        this.worldView.addSceneComponent = function (comp) {
            _this.addSceneComponent(comp);
        };
        this.worldView.removeSceneComponent = function (comp) {
            _this.removeSceneComponent(comp);
        };
        this.worldView.addSpriteComponent = function (comp) {
            _this.addSpriteComponent(comp);
        };
        this.worldView.removeSpriteComponent = function (comp) {
            _this.removeSpriteComponent(comp);
        };
        this.worldView.addTextComponent = function (comp) {
            _this.addTextComponent(comp);
        };
        this.worldView.removeTextComponent = function (comp) {
            _this.removeTextComponent(comp);
        };
        // this.worldView.addUINode = this.addUINode;
        // this.worldView.removeUINode = this.removeUINode;
        this.worldView.onSceneCompSetVisible = function (comp) {
            _this.onSceneCompSetVisible(comp);
        };
        this.worldView.onSceneCompComputeTransfor = function (comp) {
            _this.onSceneCompComputeTransfor(comp);
        };
        this.worldView.onSpriteCompSetColor = function (comp) {
            _this.onSpriteCompSetColor(comp);
        };
        this.worldView.onDrawTexture = function (comp) {
            _this.onDrawTexture(comp);
        };
        this.worldView.onDrawText = function (comp) {
            _this.onDrawText(comp);
        };
        this.worldView.onGetSceneCameraProperty = function (comp) {
            _this.onGetSceneCameraProperty(comp);
        };
        this.worldView.addCameraComponent = function (comp) {
            _this.addCameraComponent(comp);
        };
        this.worldView.removeCameraComponent = function (comp) {
            _this.removeCameraComponent(comp);
        };
    };
    CCWorldViewBase.prototype.start = function () {
        this.frameTime = 1 / this.fps;
        //初始化ViewPool
        for (var i = 0; i < 100; i++) {
            var ins = cc.instantiate(this.spritePrefab);
            this.spritePool.put(ins);
            ins = cc.instantiate(this.labelPrefab); // 创建节点
            this.labelPool.put(ins); // 通过 put 接口放入对象池
        }
        cc.log("sprite pool size:", this.spritePool.size());
        cc.log("label pool size:", this.labelPool.size());
    };
    //退出和进入此场景操作
    CCWorldViewBase.prototype.onEnter = function (world, data) {
        if (data === void 0) { data = null; }
        this.worldView.onEnter(world, data);
    };
    CCWorldViewBase.prototype.onExit = function () {
        this.worldView.onExit();
    };
    CCWorldViewBase.prototype.debug = function (dt) {
        this.timer += dt;
        if (this.timer > 1) {
            cc.log("spPool", this.spritePool.size(), "node", this.nodeMap.size, "sprite", this.spriteMap.size);
            this.timer = 0;
        }
    };
    CCWorldViewBase.prototype.update = function (dt) {
        this.updateInput();
        //更新视图层
        this.frameTimer += dt;
        if (this.frameTimer > this.frameTime) {
            this.frameTimer = 0;
            this.updateOnce(dt);
        }
    };
    //子类复写 在世界更新前输入
    CCWorldViewBase.prototype.updateInput = function () {
        if (this.leftJoyStick) {
            this.worldView.gameInstance.input.leftJoyDir = this.leftJoyStick.direction;
            this.worldView.gameInstance.input.leftJoyRate = this.leftJoyStick.rate;
        }
    };
    CCWorldViewBase.prototype.updateOnce = function (dt) {
        this.worldView.gameInstance.update(dt);
        var world = this.worldView.gameInstance.getWorld();
        if (world) {
            //先更新相机Transform，对后面的Sprite进行剔除
            var cameraAABB = null;
            if (this.currentCameraComp != null) {
                var pos = this.currentCameraComp.getPosition();
                this.cameraScene.node.setPosition(pos.x, pos.y);
                this.cameraScene.node.angle = this.currentCameraComp.getRotation();
                this.cameraScene.zoomRatio = this.currentCameraComp.zoomRatio;
                // this.cameraScene.orthoSize = this.currentCameraComp._orthoSize
                cameraAABB = this.currentCameraComp.catAABB;
            }
            if (cameraAABB) {
                world.actorSystem.spriteComponents.forEach(this.catSpriteComp, this);
                world.actorSystem.textComponents.forEach(this.catTextComp, this);
            }
            else {
                cc.warn("cameraAABB==null没有相机，无法剔除");
            }
        }
        this.graphic.begDrawDebug();
        this.worldView.gameInstance.drawDebug(this.worldView.graphic);
    };
    CCWorldViewBase.prototype.intersectBoxBox = function (a, b) {
        var no = a.max.x < b.min.x || a.max.y < b.min.y || b.max.x < a.min.x || b.max.y < a.min.y;
        return !no;
    };
    CCWorldViewBase.prototype.catSpriteComp = function (comp) {
        var cameraAABB = this.currentCameraComp.catAABB;
        var sceneAABB = comp.owner.getCatAABB();
        if (sceneAABB == null) {
            return;
        }
        var key = comp.id;
        var node = this.nodeMap.get(key);
        if (node && comp.state == Enums_1.UpdateState.Dead) {
            this.removeSpriteComponent(comp);
        }
        var newInCamera = this.intersectBoxBox(cameraAABB, sceneAABB);
        if (newInCamera) {
            if (node) {
                this.updateSceneComp(comp);
            }
            else {
                if (!comp.inCamera && comp.visiblity == Enums_1.Visiblity.Visible) {
                    //添加
                    var node_1 = this.addSpriteComponent(comp);
                    if (node_1) {
                        this.onSceneCompComputeTransfor(comp); //初始化位置
                        this.onSpriteCompSetColor(comp, node_1); //颜色
                    }
                }
            }
            if (comp.needUpdateTexture) {
                this.onDrawTexture(comp); //材质
                comp.needUpdateTexture = false;
            }
        }
        else {
            if (node && comp.inCamera) {
                //移除
                this.removeSpriteComponent(comp);
                // console.log(cameraAABB, sceneAABB)
            }
        }
        comp.inCamera = newInCamera;
    };
    CCWorldViewBase.prototype.catTextComp = function (comp) {
        var cameraAABB = this.currentCameraComp.catAABB;
        var sceneAABB = comp.owner.getCatAABB();
        if (sceneAABB == null) {
            return;
        }
        var key = comp.id;
        var node = this.nodeMap.get(key);
        var newInCamera = this.intersectBoxBox(cameraAABB, sceneAABB);
        if (newInCamera) {
            if (node) {
                this.updateSceneComp(comp);
            }
            else {
                if (!comp.inCamera && comp.visiblity == Enums_1.Visiblity.Visible) {
                    //添加
                    var node_2 = this.addTextComponent(comp);
                    if (node_2) {
                        this.onDrawText(comp);
                        this.onSceneCompComputeTransfor(comp); //初始化位置
                    }
                }
            }
        }
        else {
            if (node && comp.inCamera) {
                //移除
                this.removeTextComponent(comp);
                // console.log(cameraAABB, sceneAABB)
            }
        }
        comp.inCamera = newInCamera;
    };
    CCWorldViewBase.prototype.updateSceneComp = function (comp) {
        if (comp.transformDirty && comp.state == Enums_1.UpdateState.Active) {
            this.onSceneCompComputeTransfor(comp);
        }
    };
    CCWorldViewBase.prototype.addSceneComponent = function (comp) {
        //直接在这儿把Node创建好
        var key = comp.id;
        var node = new cc.Node(key);
        node.active = false;
        if (comp.isMainScene()) {
            this.rootScene.addChild(node);
        }
        else {
            var parentComp = comp.owner.getSceneComponent();
            var parentNode = this.nodeMap.get(parentComp.id);
            parentNode.addChild(node);
        }
        this.nodeMap.set(key, node);
    };
    CCWorldViewBase.prototype.removeSceneComponent = function (comp) {
        var key = comp.id;
        var node = this.nodeMap.get(key);
        if (node) {
            node.destroy();
            this.nodeMap.delete(key);
        }
    };
    CCWorldViewBase.prototype.onSceneCompSetVisible = function (comp) {
        var key = comp.id;
        var node = this.nodeMap.get(key);
        if (node) {
            if (comp.visiblity == Enums_1.Visiblity.Hide) {
                node.active = false;
            }
            else {
                node.active = true;
            }
        }
    };
    CCWorldViewBase.prototype.onSceneCompComputeTransfor = function (comp, node) {
        if (node === void 0) { node = null; }
        comp.transformDirty = false;
        var key = comp.id;
        if (node == null) {
            node = this.nodeMap.get(key);
            if (node == null) {
                return false;
            }
        }
        node.setPosition(comp.getPosition().x, comp.getPosition().y);
        node.setScale(comp.getScale().x, comp.getScale().y);
        node.angle = comp.getRotation();
        node.setContentSize(comp.getSize().x, comp.getSize().y);
        if (comp.visiblity == Enums_1.Visiblity.Hide) {
            node.active = false;
        }
        else {
            node.active = true;
        }
        return true;
    };
    CCWorldViewBase.prototype.addSpriteComponent = function (comp) {
        var key = comp.id;
        //TODO
        if (comp.isMainScene() == false && comp.owner.getSceneComponent() == null) {
            cc.error("这个地方有个BUG，如果子节点宽度比父节点大，parentComp会为null，导致添加失败");
            return null;
        }
        var node = null;
        if (this.spritePool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            node = this.spritePool.get();
        }
        else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            node = cc.instantiate(this.spritePrefab);
        }
        node.active = false;
        node.name = key;
        if (comp.isMainScene()) {
            this.rootScene.addChild(node);
        }
        else {
            var parentComp = comp.owner.getSceneComponent();
            var parentNode = this.nodeMap.get(parentComp.id);
            parentNode.addChild(node);
        }
        var sprite = node.getComponent(cc.Sprite);
        this.nodeMap.set(key, node);
        this.spriteMap.set(key, sprite);
        this.onDrawTexture(comp); //材质
        return node;
    };
    CCWorldViewBase.prototype.removeSpriteComponent = function (comp) {
        var key = comp.id;
        var node = this.nodeMap.get(key);
        if (node) {
            this.spritePool.put(node);
            this.nodeMap.delete(key);
            this.spriteMap.delete(key);
        }
    };
    CCWorldViewBase.prototype.onSpriteCompSetColor = function (comp, node) {
        if (node === void 0) { node = null; }
        var key = comp.id;
        if (node == null) {
            node = this.nodeMap.get(key);
            if (node == null) {
                return false;
            }
        }
        var color = comp.color;
        node.color = cc.color(color.r, color.g, color.b, color.a);
        return true;
    };
    CCWorldViewBase.prototype.onDrawTexture = function (comp) {
        var _this = this;
        var sprite = this.spriteMap.get(comp.id);
        if (sprite) {
            var textureName_1 = comp.getTexture();
            if (sprite.spriteFrame != null && textureName_1 == "") {
                sprite.spriteFrame = null;
            }
            else {
                if (this.SpriteFrameMap.has(textureName_1)) {
                    sprite.spriteFrame = this.SpriteFrameMap.get(textureName_1);
                }
                else {
                    //加载资源
                    cc.resources.load(textureName_1, cc.SpriteFrame, function (err, spriteFrame) {
                        if (spriteFrame != null) {
                            sprite.spriteFrame = spriteFrame;
                            _this.SpriteFrameMap.set(textureName_1, spriteFrame);
                            console.log("图片加载", textureName_1);
                        }
                    });
                }
            }
        }
    };
    CCWorldViewBase.prototype.addTextComponent = function (comp) {
        var key = comp.id;
        //TODO
        if (comp.isMainScene() == false && comp.owner.getSceneComponent() == null) {
            cc.error("这个地方有个BUG，如果子节点宽度比父节点大，parentComp会为null，导致添加失败");
            return null;
        }
        var node = null;
        if (this.labelPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            node = this.labelPool.get();
        }
        else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            node = cc.instantiate(this.spritePrefab);
        }
        node.active = false;
        node.name = key;
        if (comp.isMainScene()) {
            this.rootScene.addChild(node);
        }
        else {
            var parentComp = comp.owner.getSceneComponent();
            var parentNode = this.nodeMap.get(parentComp.id);
            parentNode.addChild(node);
        }
        var label = node.getComponent(cc.Label);
        this.nodeMap.set(key, node);
        this.labelMap.set(key, label);
        this.onDrawText(comp);
        return node;
    };
    CCWorldViewBase.prototype.onDrawText = function (comp) {
        var label = this.labelMap.get(comp.id);
        if (!label) {
            return;
        }
        label.string = comp.getText();
    };
    CCWorldViewBase.prototype.removeTextComponent = function (comp) {
        var key = comp.id;
        var node = this.nodeMap.get(key);
        if (node) {
            this.labelPool.put(node);
            this.nodeMap.delete(key);
            this.labelMap.delete(key);
        }
    };
    CCWorldViewBase.prototype.addCameraComponent = function (comp) {
        var key = comp.id;
        this.nodeMap.set(key, this.cameraScene.node);
        this.camerCompMap.set(key, comp);
        this.cameraMap.set(key, comp);
        this.currentCameraComp = comp;
    };
    CCWorldViewBase.prototype.removeCameraComponent = function (comp) {
        var key = comp.id;
        this.cameraMap.delete(key);
        this.camerCompMap.delete(key);
        this.nodeMap.delete(key);
        this.currentCameraComp = null;
    };
    CCWorldViewBase.prototype.onGetSceneCameraProperty = function (comp) {
        var key = comp.id;
        comp.zoomRatio = this.cameraScene.zoomRatio;
        comp.orthoSize = this.cameraScene.orthoSize;
    };
    CCWorldViewBase.prototype.addUINode = function (comp) {
    };
    CCWorldViewBase.prototype.removeUINode = function (comp) {
    };
    CCWorldViewBase.prototype.setClickPos = function (e) {
        // this.cameraCtrl.stop();
        var touch = e.touch;
        //世界坐标
        var pos = this.cameraScene.getScreenToWorldPoint(touch.getLocation());
        ;
        //调整坐标轴到屏幕中间
        pos.x -= this.winSize.x;
        pos.y -= this.winSize.y;
        //点击位置
        //TODO 检查这个坐标必须和服务器保持一致
        this.worldView.gameInstance.input.clickPos.x = pos.x;
        this.worldView.gameInstance.input.clickPos.y = pos.y;
        var touchState = new InputSystem_1.TouchState();
        var id = touch.getID();
        var delta = touch.getDelta();
        touchState.delta = UMath_1.uu.v2(delta.x, delta.y);
        touchState.pos = UMath_1.uu.v2(pos.x, pos.y);
        this.touchMap.set(id + "", touchState);
        // console.log(this.touchMap.get(id + ""));
        if (this.touchMap.size == 2) {
            var arr_1 = [];
            this.touchMap.forEach(function (v, k) {
                arr_1.push(v);
            });
            var finger1 = arr_1[0];
            var finger2 = arr_1[1];
            var offset = finger1.pos.sub(finger2.pos);
        }
        //是否触摸
        this.worldView.gameInstance.input.isTouch = true;
    };
    CCWorldViewBase.prototype.onTouchStart = function (e) {
        this.setClickPos(e);
    };
    CCWorldViewBase.prototype.onTouchMove = function (e) {
        this.setClickPos(e);
        //是否触摸移动
        this.worldView.gameInstance.input.isTouchMove = true;
        // //世界坐标
        // let vector: cc.Vec2 = cc.v2(e.touch.getLocationX(), e.touch.getLocationY());
        // vector.subSelf(UWorldView.winSize);
        // vector.addSelf(this.cameraScene.node.getPosition());
        // console.log(vector);
        //立即移动相机，不做平滑处理
        // let pos = this.cameraScene.node.getPosition();
        // let offset = touch.getDelta();
        // offset.mulSelf(1);
        // pos.addSelf(offset);
        // this.cameraScene.node.setPosition(pos);
        // this.cameraCtrl.addAcc(touch.getDelta());
        // let character = UGameInstance.world.spawn(ACharacter);
        // character.setPosition(vector);
        // console.log(vector);
    };
    CCWorldViewBase.prototype.onTouchEnd = function (e) {
        var touch = e.touch;
        var id = touch.getID();
        this.touchMap.delete(id + "");
        this.worldView.gameInstance.input.isTouch = false;
        // console.log(this.touchMap);
        // this.testLabel.string = this.touchMap.size + "";
    };
    CCWorldViewBase.prototype.onTouchCancel = function (e) {
        var touch = e.touch;
        var id = touch.getID();
        this.touchMap.delete(id + "");
        this.worldView.gameInstance.input.isTouch = false;
        // console.log(this.touchMap);
        // this.testLabel.string = this.touchMap.size + "";
    };
    __decorate([
        property(Graphic_1.default)
    ], CCWorldViewBase.prototype, "graphic", void 0);
    __decorate([
        property(cc.Node)
    ], CCWorldViewBase.prototype, "rootScene", void 0);
    __decorate([
        property(cc.Node)
    ], CCWorldViewBase.prototype, "rootHUD", void 0);
    __decorate([
        property(cc.Node)
    ], CCWorldViewBase.prototype, "rootUI", void 0);
    __decorate([
        property(cc.Camera)
    ], CCWorldViewBase.prototype, "cameraScene", void 0);
    __decorate([
        property(cc.Camera)
    ], CCWorldViewBase.prototype, "cameraUI", void 0);
    __decorate([
        property(cc.Prefab)
    ], CCWorldViewBase.prototype, "spritePrefab", void 0);
    __decorate([
        property(cc.Prefab)
    ], CCWorldViewBase.prototype, "labelPrefab", void 0);
    __decorate([
        property(JoyStick_1.default)
    ], CCWorldViewBase.prototype, "leftJoyStick", void 0);
    __decorate([
        property(JoyStick_1.default)
    ], CCWorldViewBase.prototype, "rightJoyStick", void 0);
    CCWorldViewBase = __decorate([
        ccclass
    ], CCWorldViewBase);
    return CCWorldViewBase;
}(cc.Component));
exports.default = CCWorldViewBase;
