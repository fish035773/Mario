const { ccclass, property } = cc._decorator;

@ccclass
export default class Goal extends cc.Component {

    @property
    rotateSpeed: number = 120;

    @property
    passSceneName: string = "PassScene";

    update(dt: number) {
        if (this.node.name === "Cookie") {
            this.node.angle += this.rotateSpeed * dt;
        }
    }

    onBeginContact(contact, selfCollider, otherCollider) {
        if (otherCollider.node.name === "Player") {
            
            //cc.log(`玩家碰到了 ${this.node.name}！準備進入結局：${this.passSceneName}`);
            
            cc.director.loadScene(this.passSceneName);
        }
    }
}