const { ccclass, property } = cc._decorator;

@ccclass
export default class SceneManager extends cc.Component {

    public static instance: SceneManager = null;

    public life: number = 3;
    public score: number = 0;
    public currentLevel: string = "Game";

    onLoad() {
        if (SceneManager.instance === null) {
            SceneManager.instance = this;
            cc.game.addPersistRootNode(this.node);
        } else {
            this.node.destroy();
        }
    }

    public addScore(points: number) {
        this.score += points;
    }

    public loadScene(sceneName: string) {
        cc.director.loadScene(sceneName);
    }

    public startLevel(levelName: string) {
        this.life = 3;
        this.score = 0; 
        this.currentLevel = levelName;
        cc.director.loadScene(levelName);
    }

    public playerDie() {
        this.life--;
        this.score = 0;
        if (this.life > 0) {
            cc.director.loadScene(this.currentLevel);
        } else {
            this.life = 3;
            cc.director.loadScene("GameOver");
        }
    }

    public backToMenu() {
        this.life = 3;
        this.score = 0;
        cc.director.loadScene("Start");
    }
}