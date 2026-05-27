const { ccclass, property } = cc._decorator;

@ccclass
export default class SuperMushroom extends cc.Component {

    onBeginContact(contact, selfCollider, otherCollider) {
        if (otherCollider.node.name !== "Player") return;

        let playerScript = otherCollider.node.getComponent("Player") as any;

        if (playerScript && playerScript.growBig) {
            playerScript.growBig();
        }

        this.node.destroy();
    }
}