import SceneManager from "./SceneManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Coin extends cc.Component {
    @property({ type: cc.AudioClip })
    coinSound: cc.AudioClip = null;

    onBeginContact(contact, selfCollider, otherCollider) {
        if (otherCollider.node.name === "Player") {
            if (this.coinSound){
                cc.audioEngine.playEffect(this.coinSound, false);
            }
            
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