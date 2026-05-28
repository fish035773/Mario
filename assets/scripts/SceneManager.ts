import FirebaseManager from "./FirebaseManager";
const { ccclass, property } = cc._decorator;

@ccclass
export default class SceneManager extends cc.Component {

    // 在 SceneManager.ts 宣告變數
    @property({ type: cc.AudioClip })
    bgm_level: cc.AudioClip = null;

    @property({ type: cc.AudioClip })
    menuBgm: cc.AudioClip = null;

    public static instance: SceneManager = null;

    public life: number = 3;
    public score: number = 0;
    public currentLevel: string = "Game";

    onLoad() {
        if (SceneManager.instance === null) {
            SceneManager.instance = this;
            cc.game.addPersistRootNode(this.node);
            if (this.menuBgm) {
                cc.audioEngine.playMusic(this.menuBgm, true);
            }
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

    public isDying: boolean = false; 

    public startLevel(levelName: string) {
        this.life = 3;
        this.score = 0; 
        this.eatenCoins = []; 
        this.currentLevel = levelName;
        this.isDying = false; 

        if (this.bgm_level) {
            cc.audioEngine.playMusic(this.bgm_level, true); 
        }
    
        cc.director.loadScene(levelName);
    }

    public playerDie() {
        if (this.isDying) return; 
        this.isDying = true;

        this.life--;
        this.score = 0; 

        cc.director.pause();

        setTimeout(() => {
            
            cc.director.resume();

            if (this.life > 0) {
                this.isDying = false;
                cc.director.loadScene(this.currentLevel);
            } else {
                this.life = 3;

                
                if (FirebaseManager.instance) {
                    FirebaseManager.instance.saveProgress();
                }

                this.score = 0; 
                this.eatenCoins = []; 
                this.isDying = false;
                cc.audioEngine.stopMusic();
                cc.director.loadScene("GameOver");
            }
            
        }, 2000);
    }

    public backToMenu() {
        this.life = 3;
        this.score = 0;

        if (this.menuBgm)
            cc.audioEngine.playMusic(this.menuBgm, true);

        cc.director.loadScene("Start");
    }
}