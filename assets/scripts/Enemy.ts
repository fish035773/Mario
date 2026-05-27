const { ccclass, property } = cc._decorator;

@ccclass
export default class Enemy extends cc.Component {

    @property(cc.AudioClip)
    killed: cc.AudioClip = null;

    private rb: cc.RigidBody = null;

    private speed: number = 80;
    private direction: number = -1;
    private dead: boolean = false;
    private turning: boolean = false;
    
    onLoad() {
        this.rb = this.getComponent(cc.RigidBody);
    }

    update(dt: number) {
        if (this.dead) return;

        let v = this.rb.linearVelocity;
        v.x = this.speed * this.direction;
        this.rb.linearVelocity = v;
    }

    onBeginContact(contact, selfCollider, otherCollider) {
        if (this.dead) return;

        if (otherCollider.node.name === "Wall" || otherCollider.node.name === "PipeBody") {
            let normal = contact.getWorldManifold().normal;
            if (Math.abs(normal.x) > 0.5) {
                this.turnAround();
            }
            return;
        }

        if (otherCollider.node.name === "Player") {
            this.handlePlayerContact(contact, otherCollider);
        }
    }

    private handlePlayerContact(contact, playerCollider) {
        let playerNode = playerCollider.node;
        let playerBody = playerNode.getComponent(cc.RigidBody);

        if (!playerBody) return;

        let normal = contact.getWorldManifold().normal;

        let playerBottom = playerNode.y - (playerNode.height / 2);
        let enemyTop = this.node.y + (this.node.height / 2);
        let tolerance = 8;

        let playerIsFalling = playerBody.linearVelocity.y < 0; 
        let playerIsAbove = playerBottom > (enemyTop - tolerance);

        if (playerIsFalling && playerIsAbove) {
            this.die();
            playerBody.linearVelocity = cc.v2(playerBody.linearVelocity.x, 300);
        } else {
            let playerScript = playerNode.getComponent("Player") as any;
            if (playerScript && playerScript.hurtPlayer) {
                playerScript.hurtPlayer();
            }
        }
    }

    private turnAround() {
        if (this.turning) return;

        this.turning = true;

        this.direction *= -1;

        this.node.scaleX = Math.abs(this.node.scaleX) * -this.direction;

        this.scheduleOnce(() => {
            this.turning = false;
        }, 0.2);
    }

    private die() {

        if(this.killed)
            cc.audioEngine.playEffect(this.killed, false);

        this.dead = true;

        this.rb.linearVelocity = cc.v2(0, 0);

        let collider = this.getComponent(cc.PhysicsBoxCollider);
        if (collider) {
            collider.enabled = false;
        }

        this.node.scaleY = 0.3;

        this.scheduleOnce(() => {
            this.node.destroy();
        }, 0.3);
    }
}