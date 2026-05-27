const { ccclass, property } = cc._decorator;

@ccclass
export default class PipeEnemy extends cc.Component {

    @property
    showOffsetY: number = 20;

    @property
    moveTime: number = 0.8;

    @property
    stayTime: number = 1.0;

    @property
    startDelay: number = 0;

    private startY: number = 0;
    private canHurt: boolean = true;

    onLoad() {
        // 記住 enemy 初始位置
        // 也就是你在編輯器裡擺的位置
        this.startY = this.node.y;
    }

    start() {
        this.scheduleOnce(() => {
            this.startMoveLoop();
        }, this.startDelay);
    }

    private startMoveLoop() {
        cc.tween(this.node)
            // 從初始位置往上伸出
            .to(this.moveTime, { y: this.startY + this.showOffsetY })
            .delay(this.stayTime)

            // 回到初始位置，也就是跟水管一樣的位置
            .to(this.moveTime, { y: this.startY })
            .delay(this.stayTime)

            .call(() => {
                this.startMoveLoop();
            })
            .start();
    }

    onBeginContact(contact, selfCollider, otherCollider) {
        if (!this.canHurt) return;

        if (otherCollider.node.name !== "Player") return;

        let playerScript = otherCollider.node.getComponent("Player") as any;

        if (playerScript && playerScript.hurtPlayer) {
            playerScript.hurtPlayer();
        }

        this.canHurt = false;
        this.scheduleOnce(() => {
            this.canHurt = true;
        }, 0.5);
    }
}