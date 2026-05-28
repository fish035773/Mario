import FirebaseManager from "./FirebaseManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LeaderboardUI extends cc.Component {

    @property(cc.Label)
    displayLabel: cc.Label = null;

    onEnable() {
        if (this.displayLabel) {
            this.displayLabel.string = "Loading...";
        }
        this.fetchData();
    }

    // ⭐ 新增：給「開啟按鈕」呼叫的方法
    public openPanel() {
        this.node.active = true;
    }

    // ⭐ 新增：給「關閉按鈕」呼叫的方法
    public closePanel() {
        this.node.active = false;
    }

    private fetchData() {
        if (FirebaseManager.instance) {
            FirebaseManager.instance.getLeaderboard((data) => {
                let text = "🏆 Leaderboard 🏆\n\n";
                for (let i = 0; i < data.length; i++) {
                    let name = data[i].email.split('@')[0];
                    text += `${i + 1}. ${name} : ${data[i].score} pts\n`;
                }
                
                if (this.displayLabel) {
                    this.displayLabel.string = text;
                }
            });
        }
    }
}