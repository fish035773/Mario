const { ccclass, property } = cc._decorator;

@ccclass
export default class QuestionBlock extends cc.Component {

    @property(cc.Prefab)
    mushroomPrefab: cc.Prefab = null;

    @property(cc.SpriteFrame)
    usedBlockSprite: cc.SpriteFrame = null;

    private used: boolean = false;

    onBeginContact(contact, selfCollider, otherCollider) {
        if (this.used) return;

        if (otherCollider.node.name !== "Player") return;

        let playerNode = otherCollider.node;
        let playerBody = playerNode.getComponent(cc.RigidBody);

        if (!playerBody) return;

        // 玩家在磚塊下面，而且正在往上撞
        let playerIsBelow = playerNode.y < this.node.y;
        let playerIsJumpingUp = playerBody.linearVelocity.y > 0;

        if (playerIsBelow && playerIsJumpingUp) {
            this.activateBlock();
        }
    }

    private activateBlock() {
        this.used = true;

        cc.log("QuestionBlock 被頂到了，準備生成蘑菇並消失");

        // 生成蘑菇
        if (this.mushroomPrefab) {
            let mushroom = cc.instantiate(this.mushroomPrefab);
            mushroom.parent = this.node.parent;

            // 從磚塊上方出現
            mushroom.setPosition(
                this.node.x,
                this.node.y + this.node.height / 2 + 20
            );
        } else {
            cc.log("沒有拖 Mushroom Prefab！");
        }

        // 方塊彈一下後消失
        let originalY = this.node.y;

        cc.tween(this.node)
            .to(0.08, { y: originalY + 10 })
            .to(0.08, { y: originalY })
            .call(() => {
                this.node.destroy();
            })
            .start();
    }
}