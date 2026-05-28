import FirebaseManager from "./FirebaseManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Endings extends cc.Component {

    @property
    rotateSpeed: number = 120;

    @property
    passSceneName: string = "PassScene";

    private isFinished: boolean = false;

    update(dt: number) {
        if (this.node.name === "Cookie") {
            this.node.angle += this.rotateSpeed * dt;
        }
    }

    onBeginContact(contact, selfCollider, otherCollider) {
        // 如果已經觸發過終點，就不要再執行了
        if (this.isFinished) return; 

        if (otherCollider.node.name === "Player") {
            this.isFinished = true; // 鎖定狀態
            
            cc.log(`準備進入結局：${this.passSceneName}，正在存檔...`);
            
            // 1. 呼叫存檔
            if (FirebaseManager.instance) {
                FirebaseManager.instance.saveProgress();
            }

            this.scheduleOnce(() => {
                cc.director.loadScene(this.passSceneName);
            }, 0.5);
        }
    }
}