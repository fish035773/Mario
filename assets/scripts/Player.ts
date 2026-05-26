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

    private life: number = 3;
    private spawnPos: cc.Vec3 = null;

    onLoad() {
        this.rb = this.getComponent(cc.RigidBody);
        this.spawnPos = this.node.position.clone();

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
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
        
        if(this.node.y < 0){
            this.die();
        }

    }
    
    updateLifeUI(){
        if(this.LifeLabel){
            this.LifeLabel.string = "Life: " + this.life;
        }
    }
    
    die(){
        this.life--;
        this.updateLifeUI();
        
        if(this.life > 0){
            this.respawn();
        }else {
            cc.director.loadScene("GameOver");
        }
    }

    respawn(){
        this.node.setPosition(this.spawnPos);
        this.rb.linearVelocity = cc.v2(0, 0);
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
    }
}