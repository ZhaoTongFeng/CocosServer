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
var Pawn_1 = __importDefault(require("../Engine/Actor/Pawn/Pawn"));
var SphereComponent_1 = __importDefault(require("../Engine/Component/Collision/SphereComponent"));
var CameraComponent_1 = __importDefault(require("../Engine/Component/SceneComponent/CameraComponent"));
var SpriteAnimationComponent_1 = __importDefault(require("../Engine/Component/SceneComponent/SpriteAnimationComponent"));
var SpriteComponent_1 = __importDefault(require("../Engine/Component/SceneComponent/SpriteComponent"));
var XBase_1 = require("../Engine/Engine/ReflectSystem/XBase");
var UMath_1 = require("../Engine/Engine/UMath");
var World_1 = __importDefault(require("../Engine/Engine/World"));
var BulletProject_1 = __importDefault(require("./Engine/Actor/BulletProject"));
var ExplodeActor_1 = __importDefault(require("./Engine/Actor/ExplodeActor"));
var CharacterMovement_1 = __importDefault(require("./Engine/Component/CharacterMovement"));
var ShipShield_1 = __importDefault(require("./Engine/Component/ShipShield"));
var ShipWeaponProject_1 = __importDefault(require("./Engine/Component/ShipWeaponProject"));
var PlayerShipController_1 = __importDefault(require("./Engine/Controller/PlayerShipController"));
var BattleComponent_1 = __importDefault(require("./Engine/Info/BattleComponent"));
var PlayerBattleComponent_1 = __importDefault(require("./Engine/Info/PlayerBattleComponent"));
var Ship_1 = __importDefault(require("./Engine/Pawn/Ship"));
//游戏关卡一
var World1 = /** @class */ (function (_super) {
    __extends(World1, _super);
    function World1() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    World1_1 = World1;
    World1.prototype.init = function (levelData) {
        var _this = this;
        if (levelData === void 0) { levelData = null; }
        _super.prototype.init.call(this, levelData);
        this.isDebug = true;
        if (this.isClient) {
            SpriteAnimationComponent_1.default.RegisterAllAnimation();
            console.log("注册所有动画序列名称");
            //客户端恢复关卡数据
            this.fromJSON(levelData);
            this.actors.forEach(function (ac) {
                ac.onLoad(_this);
                ac.components.forEach(function (comp) {
                    comp.onLoad(ac);
                });
            });
            this.actorSystem.registerAll();
            this.pUserControllerMap.forEach(function (con, id_user) {
                con.process(_this.actorSystem.objMap.get(con.id_pawn));
            });
            this.bindLocController();
        }
        else {
            //服务器生成关卡数据
            this.initPlayerControllers();
            this.initPlayerActors();
            // this.initOtherActors();
        }
    };
    World1.prototype.updateWorld = function (dt) {
        if (!this.isClient) {
            // this.checkCollections();
        }
    };
    World1.prototype.initPlayerControllers = function () {
        var _this = this;
        var users = this.users;
        users.forEach(function (user) {
            var userName = user.id_user;
            var con = _this.spawn(PlayerShipController_1.default);
            user.id_controller = con.id;
            con.id_user = userName;
            _this.pUserControllerMap.set(user.id_user, con);
            _this.pControllerUserMap.set(con.id, user);
        });
        console.log("初始化玩家控制器，玩家数量：", users.length);
    };
    World1.prototype.initPlayerActors = function () {
        var _this = this;
        var i = 0;
        this.pUserControllerMap.forEach(function (con, id_user) {
            var ac = _this.spawn(Ship_1.default);
            // 输入
            con.id_pawn = ac.id;
            con.process(ac);
            //输出
            var spriteComp = ac.spawnComponent(SpriteComponent_1.default);
            spriteComp.setTexture("ship/character");
            //更新
            ac.spawnComponent(CharacterMovement_1.default);
            ac.spawnComponent(SphereComponent_1.default);
            //战斗属性
            var battle = ac.spawnComponent(PlayerBattleComponent_1.default);
            var teamId = i;
            battle.setTeamId(teamId + "");
            var shield = ac.spawnComponent(ShipShield_1.default);
            var weapon2 = ac.spawnComponent(ShipWeaponProject_1.default);
            weapon2.setItemPosition(0, 1);
            ac.addItem(weapon2);
            //设置位置
            ac.setPosition(UMath_1.uu.v2(i * 200, 0));
            i++;
        });
        console.log("初始化玩家Actor");
    };
    /**
     * 正常开始||重新连接
     * 加载好服务器传回的关卡数据之后，用这个绑定当前控制器
     */
    World1.prototype.bindLocController = function () {
        var userMng = this.gameInstance.network.userManager;
        var con = this.pUserControllerMap.get(userMng.id_loc);
        this.playerController = con;
        this.player = con.pawn;
        this.player.spawnComponent(CameraComponent_1.default);
        console.log("本地AC", con.id_user);
    };
    World1.prototype.initOtherActors = function () {
        var count = 1;
        for (var i = 0; i < count; i++) {
            var ac2 = this.spawn(Ship_1.default);
            // let aiController = this.spawn(AAIShipController);
            // aiController.process(ac2);
            var spriteComp = ac2.spawnComponent(SpriteComponent_1.default);
            ;
            spriteComp.setTexture("ship/character");
            // let shield = ac2.spawnComponent(UShipShield);
            // let movement = ac2.spawnComponent(UCharacterMovement);
            var collision = ac2.spawnComponent(SphereComponent_1.default);
            var battle = ac2.spawnComponent(BattleComponent_1.default);
            var teamId = i;
            battle.setTeamId(teamId + "");
            // let weapon = ac2.spawnComponent(UShipWeaponLaser);
            // weapon.setItemPosition(0, 0);
            // ac2.addItem(weapon);
            // weapon.startFire();
            var weapon2 = ac2.spawnComponent(ShipWeaponProject_1.default);
            weapon2.setItemPosition(0, 1);
            ac2.addItem(weapon2);
            weapon2.startFire();
            var winSize = this.gameInstance.getWorldView().winSize;
            ac2.setPosition(UMath_1.uu.v2(winSize.x * (Math.random() - 0.5) * 2, winSize.y * (Math.random() - 0.5) * 2));
        }
        // console.log(UBattleComponent.Teams);
    };
    //执行碰撞检测
    //TODO 这部分代码还可以优化，用掩码去判断是否需要碰撞，以及检测
    World1.prototype.checkCollections = function () {
        var _this = this;
        this.collisionSystem.test(function (a, b) {
            var actor1 = a.owner;
            var actor2 = b.owner;
            if (actor1 instanceof Pawn_1.default && actor2 instanceof Pawn_1.default) {
                // this.onPawnCollected(actor1, actor2);
            }
            else if (actor1 instanceof BulletProject_1.default && actor2 instanceof BulletProject_1.default) {
                _this.onBulletCollected(actor1, actor2);
            }
            else if (actor1 instanceof Pawn_1.default && actor2 instanceof BulletProject_1.default) {
                _this.onBulletCollectedPawn(actor2, actor1);
            }
            else if (actor1 instanceof BulletProject_1.default && actor2 instanceof Pawn_1.default) {
                _this.onBulletCollectedPawn(actor1, actor2);
            }
        });
    };
    World1.prototype.onPawnCollected = function (actor1, actor2) {
        var dir = actor1.getPosition().sub(actor2.getPosition()).normalize();
        actor1.getMovement().velocity = dir.mul(100);
        actor2.getMovement().velocity = dir.mul(-100);
    };
    World1.prototype.onBulletCollected = function (actor1, actor2) {
        if (actor1 == actor2) {
            return;
        }
        var ship1 = actor1.getOwner();
        var ship2 = actor2.getOwner();
        if (ship1 == ship2) {
            return;
        }
        if (ship1 instanceof Ship_1.default && ship2 instanceof Ship_1.default) {
            var battle1 = ship1.getBattleComp();
            var battle2 = ship2.getBattleComp();
            if (battle1.getTreamId() == battle2.getTreamId()) {
                return;
            }
            // //爆炸动画
            var pos = actor1.getPosition().add(actor2.getPosition()).mul(0.5);
            this.spawnExplode(pos);
            actor2.destory();
            actor1.destory();
        }
    };
    //球打到敌人
    World1.prototype.onBulletCollectedPawn = function (actor1, actor2) {
        if (actor1.getOwner() != actor2) {
            // let dir = actor1.movementComponent.velocity.normalize();
            // actor2.getMovement().velocity = dir.mul(1000);
            // let comp = actor2.spawnComponent(UExplodeComponent);
            // comp.offset = actor1.getPosition().clone();
            this.spawnExplode(actor1.getPosition());
            if (actor2 instanceof Ship_1.default) {
                var shield = actor2.getShield();
                if (shield) {
                    shield.onHit();
                }
            }
            actor1.destory();
        }
    };
    World1.prototype.spawnExplode = function (pos) {
        //爆炸动画
        var ac = this.spawn(ExplodeActor_1.default);
        ac.deadTime = 1;
        // ac.spawnComponent(UExplodeComponent);
        var spriteAniComp = ac.spawnComponent(SpriteAnimationComponent_1.default);
        if (spriteAniComp) {
            spriteAniComp.setAnimation(SpriteAnimationComponent_1.default.Ani_Explostion);
            spriteAniComp.setScale(UMath_1.uu.v2(2, 2));
            // spriteAniComp.setFPS(16);
            spriteAniComp.play(true);
        }
        ac.setPosition(pos.clone());
    };
    var World1_1;
    World1 = World1_1 = __decorate([
        XBase_1.xclass(World1_1)
    ], World1);
    return World1;
}(World_1.default));
exports.default = World1;
