import SceneManager from "./SceneManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Player extends cc.Component {

    @property(cc.Label)
    LifeLabel: cc.Label = null;

    private rb: cc.RigidBody = null;

    private speed: number = 200;
    private jumpSpeed: number = 400;

    private moveLeft: boolean = false;
    private moveRight: boolean = false;
    private canJump: boolean = false;

    private spawnPos: cc.Vec3 = null;
    private isDead: boolean = false;

    // 是否已經吃過蘑菇變大
    private isBig: boolean = false;

    // 記住原本大小，避免翻面時亂掉
    private originalScaleX: number = 1;
    private originalScaleY: number = 1;

    onLoad() {
        this.rb = this.getComponent(cc.RigidBody);
        this.spawnPos = this.node.position.clone();

        this.originalScaleX = Math.abs(this.node.scaleX);
        this.originalScaleY = Math.abs(this.node.scaleY);

        this.updateLifeUI();

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    update(dt: number) {
        if (this.isDead) return;

        let vx = 0;

        if (this.moveLeft) {
            vx = -this.speed;
            this.node.scaleX = -Math.abs(this.node.scaleX);
        }

        if (this.moveRight) {
            vx = this.speed;
            this.node.scaleX = Math.abs(this.node.scaleX);
        }

        this.rb.linearVelocity = cc.v2(vx, this.rb.linearVelocity.y);

        if (this.node.y < -500) {
            this.die();
        }
    }

    updateLifeUI() {
        if (this.LifeLabel && SceneManager.instance) {
            this.LifeLabel.string = "Life: " + SceneManager.instance.life;
        }
    }

    public growBig() {
        if (this.isBig) return;

        this.isBig = true;

        // 保留目前面向
        let facingLeft = this.node.scaleX < 0;

        let newScaleX = this.originalScaleX * 1.5;
        let newScaleY = this.originalScaleY * 1.5;

        this.node.scaleX = facingLeft ? -newScaleX : newScaleX;
        this.node.scaleY = newScaleY;

        cc.log("Player 吃到蘑菇，變大了！");
    }

    public hurtPlayer() {
        if (this.isDead) return;

        // 如果變大狀態碰到敵人，先變回小的，不直接死
        if (this.isBig) {
            this.shrinkSmall();
            return;
        }

        this.die();
    }

    private shrinkSmall() {
        this.isBig = false;

        let facingLeft = this.node.scaleX < 0;

        this.node.scaleX = facingLeft ? -this.originalScaleX : this.originalScaleX;
        this.node.scaleY = this.originalScaleY;

        cc.log("Player 變回小的！");
    }

    die() {
        if (this.isDead) return;

        this.isDead = true;

        if (SceneManager.instance) {
            SceneManager.instance.playerDie();
        } else {
            cc.error("SceneManager.instance is null. 請確認 StartMenu 場景有 SceneManager 節點。");
        }
    }

    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    onKeyDown(event: cc.Event.EventKeyboard) {
        if (this.isDead) return;

        if (event.keyCode === cc.macro.KEY.a || event.keyCode === cc.macro.KEY.left) {
            this.moveLeft = true;
        }

        if (event.keyCode === cc.macro.KEY.d || event.keyCode === cc.macro.KEY.right) {
            this.moveRight = true;
        }

        if (event.keyCode === cc.macro.KEY.space && this.canJump) {
            this.rb.linearVelocity = cc.v2(this.rb.linearVelocity.x, this.jumpSpeed);
            this.canJump = false;
        }
    }

    onKeyUp(event: cc.Event.EventKeyboard) {
        if (event.keyCode === cc.macro.KEY.a || event.keyCode === cc.macro.KEY.left) {
            this.moveLeft = false;
        }

        if (event.keyCode === cc.macro.KEY.d || event.keyCode === cc.macro.KEY.right) {
            this.moveRight = false;
        }
    }

    onBeginContact(contact, selfCollider, otherCollider) {
        if (this.isDead) return;

        let groundNames = ["Ground", "platform", "Wall", "WallGround"];

        if (groundNames.indexOf(otherCollider.node.name) !== -1) {
            let normal = contact.getWorldManifold().normal;

            // 玩家踩在物件上方時，才允許跳
            if (normal.y < 0) {
                this.canJump = true;
            }
        }

        if (otherCollider.node.name === "Enemy") {
            this.hurtPlayer();
        }
    }
}