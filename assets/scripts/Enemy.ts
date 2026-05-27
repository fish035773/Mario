const { ccclass, property } = cc._decorator;

@ccclass
export default class Enemy extends cc.Component {

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
        cc.log("敵人撞到了節點，名稱是：", otherCollider.node.name);

        if (this.dead) return;

        if (otherCollider.node.name === "Wall") {
            this.turnAround();
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

        /*
            判斷玩家是不是從上面踩到 enemy。

            通常如果 player 正在往下掉：
            playerBody.linearVelocity.y < 0

            而且玩家位置比 enemy 高：
            playerNode.y > this.node.y
        */
        let playerIsFalling = playerBody.linearVelocity.y < 0;
        let playerIsAbove = playerNode.y > this.node.y + 10;

        if (playerIsFalling && playerIsAbove) {
            this.die();

            // 讓玩家踩到敵人後彈一下
            playerBody.linearVelocity = cc.v2(playerBody.linearVelocity.x, 500);
        } else {
            // 側面碰到敵人：玩家扣血
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

        // 圖片也一起左右翻轉
        this.node.scaleX = Math.abs(this.node.scaleX) * -this.direction;

        this.scheduleOnce(() => {
            this.turning = false;
        }, 0.2);
    }

    private die() {
        this.dead = true;

        // 停止移動
        this.rb.linearVelocity = cc.v2(0, 0);

        // 關掉碰撞
        let collider = this.getComponent(cc.PhysicsBoxCollider);
        if (collider) {
            collider.enabled = false;
        }

        // 簡單死亡效果：變扁
        this.node.scaleY = 0.3;

        // 0.3 秒後移除
        this.scheduleOnce(() => {
            this.node.destroy();
        }, 0.3);
    }
}