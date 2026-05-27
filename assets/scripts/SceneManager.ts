const { ccclass, property } = cc._decorator;

@ccclass
export default class SceneManager extends cc.Component {

    public static instance: SceneManager = null;

    public life: number = 3;
    public currentLevel: string = "Game";

    onLoad() {
        if (SceneManager.instance === null) {
            SceneManager.instance = this;
            cc.game.addPersistRootNode(this.node);
            cc.log("✅ 成功建立常駐節點：" + this.node.name);
        } else {
            // ⭐ 加上這行，看看是哪個倒楣的節點被刪除了！
            cc.log("❌ 發現重複的 SceneManager，正在摧毀節點：" + this.node.name); 
            this.node.destroy();
        }
    }

    public loadScene(sceneName: string) {
        cc.director.loadScene(sceneName);
    }

    public startLevel(levelName: string) {
        this.life = 3;
        this.currentLevel = levelName;
        cc.director.loadScene(levelName);
    }

    public playerDie() {
        this.life--;

        if (this.life > 0) {
            cc.director.loadScene(this.currentLevel);
        } else {
            this.life = 3;
            cc.director.loadScene("GameOver");
        }
    }

    public backToMenu() {
        this.life = 3;
        cc.director.loadScene("Start");
    }
}