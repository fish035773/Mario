import SceneManager from "./SceneManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Player extends cc.Component {

    @property(cc.Label)
    LifeLabel: cc.Label = null;

    private rb: cc.RigidBody = null;

    private speed: number = 300;
    private jumpSpeed: number = 1000;

    private moveLeft: boolean = false;
    private moveRight: boolean = false;
    private canJump: boolean = false;

    private spawnPos: cc.Vec3 = null;
    private isDead: boolean = false;

    onLoad() {
        this.rb = this.getComponent(cc.RigidBody);
        this.spawnPos = this.node.position.clone();

        this.updateLifeUI();

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    update(dt: number) {
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
        if (otherCollider.node.name === "Ground") {
            this.canJump = true;
        }

        if (otherCollider.node.name === "Enemy") {
            this.die();
        }
    }
}