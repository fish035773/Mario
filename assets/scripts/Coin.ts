const { ccclass, property } = cc._decorator;

@ccclass
export default class Coin extends cc.Component {

    // 當有東西碰到金幣時觸發
    onBeginContact(contact, selfCollider, otherCollider) {
        
        // 判斷碰到金幣的是不是玩家
        if (otherCollider.node.name === "Player") {
            
            // 抓取玩家身上的 Player.ts 腳本
            let playerScript = otherCollider.node.getComponent("Player") as any;
            
            // 呼叫玩家腳本裡的加分功能 (我們等一下會在 Player 裡寫這個功能)
            if (playerScript && playerScript.addScore) {
                playerScript.addScore(10); // 假設一顆金幣 10 分
            }

            // 銷毀金幣自己 (讓金幣從畫面上消失)
            // 寫在 setTimeout 裡是為了避免在物理運算途中直接刪除節點導致引擎報錯
            setTimeout(() => {
                if (this.node) this.node.destroy();
            }, 0);
        }
    }
}