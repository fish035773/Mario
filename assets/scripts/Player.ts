import SceneManager from "./SceneManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Player extends cc.Component {

    @property([cc.Node])
    hearts: cc.Node[] = [];
    
    @property(cc.Label)
    scoreLabel: cc.Label = null;

    @property(cc.AudioClip)
    shrink: cc.AudioClip = null;

    @property(cc.AudioClip)
    enlarge: cc.AudioClip = null;

    @property(cc.AudioClip)
    died: cc.AudioClip = null;

    @property(cc.AudioClip)
    jump: cc.AudioClip = null;

    private currentScore: number = 0;
    private rb: cc.RigidBody = null;

    private speed: number = 200;
    private jumpSpeed: number = 400;

    private moveLeft: boolean = false;
    private moveRight: boolean = false;
    private canJump: boolean = false;

    private spawnPos: cc.Vec3 = null;
    private isDead: boolean = false;

    private isBig: boolean = false;

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
        if (!SceneManager.instance) return;

        let life = SceneManager.instance.life;

        for (let i = 0; i < this.hearts.length; i++) {
            this.hearts[i].active = i < life;
        }
    }

    public addScore(points: number) {
        this.currentScore += points;
        cc.log("吃到金幣！目前分數：" + this.currentScore);

        if (this.scoreLabel) {
            this.scoreLabel.string = "Score: " + this.currentScore;
        }
    }

    public growBig() {
        if (this.isBig) return;

        if(this.enlarge)
            cc.audioEngine.playEffect(this.enlarge, false);

        this.isBig = true;

        let facingLeft = this.node.scaleX < 0;

        let newScaleX = this.originalScaleX * 1.5;
        let newScaleY = this.originalScaleY * 1.5;

        this.node.scaleX = facingLeft ? -newScaleX : newScaleX;
        this.node.scaleY = newScaleY;
    }

    public hurtPlayer() {
        if (this.isDead) return;

        if (this.isBig) {
            this.shrinkSmall();
            return;
        }

        this.die();
    }

    private shrinkSmall() {
        this.isBig = false;

        if(this.shrink)
            cc.audioEngine.playEffect(this.shrink, false);

        let facingLeft = this.node.scaleX < 0;

        this.node.scaleX = facingLeft ? -this.originalScaleX : this.originalScaleX;
        this.node.scaleY = this.originalScaleY;

        cc.log("Player 變回小的！");
    }

    die() {
        if (this.isDead) return;

        this.isDead = true;

        if(this.died)
            cc.audioEngine.playEffect(this.died, false);
        
        if (SceneManager.instance) {
            SceneManager.instance.playerDie();
            this.updateLifeUI();
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
            if(this.jump)
                cc.audioEngine.playEffect(this.jump, false);
            
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

        let groundNames = ["Ground", "PipeHead", "Wall"];

        if (groundNames.indexOf(otherCollider.node.name) !== -1) {
            let normal = contact.getWorldManifold().normal;

            if (normal.y < 0) {
                this.canJump = true;
            }
        }
    }
}