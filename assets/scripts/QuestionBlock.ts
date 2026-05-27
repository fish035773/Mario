const { ccclass, property } = cc._decorator;

@ccclass
export default class QuestionBlock extends cc.Component {

    @property(cc.Prefab)
    mushroomPrefab: cc.Prefab = null;

    @property(cc.SpriteFrame)
    usedBlockSprite: cc.SpriteFrame = null;

    @property(cc.AudioClip)
    hitSound: cc.AudioClip = null;

    
    private used: boolean = false;

    onBeginContact(contact, selfCollider, otherCollider) {
        if (this.used) return;

        if (otherCollider.node.name !== "Player") return;

        let playerNode = otherCollider.node;
        let playerBody = playerNode.getComponent(cc.RigidBody);

        if (!playerBody) return;

        let playerIsBelow = playerNode.y < this.node.y;
        let playerIsJumpingUp = playerBody.linearVelocity.y > 0;

        if (playerIsBelow && playerIsJumpingUp) {
            this.activateBlock();
        }
    }

    private activateBlock() {
        this.used = true;

        cc.log("QuestionBlock 被頂到了，準備生成蘑菇並消失");

        if(this.hitSound)
            cc.audioEngine.playEffect(this.hitSound, false);
        
        if (this.mushroomPrefab) {
            let mushroom = cc.instantiate(this.mushroomPrefab);
            mushroom.parent = this.node.parent;

            mushroom.setPosition(
                this.node.x,
                this.node.y + this.node.height / 2 + 20
            );
        } else {
            cc.log("沒有拖 Mushroom Prefab！");
        }

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