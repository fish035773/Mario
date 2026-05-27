import SceneManager from "./SceneManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Coin extends cc.Component {

    onBeginContact(contact, selfCollider, otherCollider) {
        if (otherCollider.node.name === "Player") {
            
            if (SceneManager.instance) {
                if (this.node.name === "Coin_50") {
                    SceneManager.instance.addScore(50);
                } else if (this.node.name === "Coin_10") {
                    SceneManager.instance.addScore(10);
                }
            }

            setTimeout(() => {
                if (cc.isValid(this.node)) this.node.destroy();
            }, 0);
        }
    }
}