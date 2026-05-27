const { ccclass, property } = cc._decorator;

import SceneManager from "./SceneManager"; // 引入你原本寫好的 SceneManager

@ccclass
export default class GameOverUI extends cc.Component {

    public onBackToMenuClick() {
        if (SceneManager.instance) {
            SceneManager.instance.backToMenu();
        } else {
            // 防呆機制：萬一 SceneManager 遺失，直接強制載入
            cc.director.loadScene("Start");
        }
    }

    public onRestartClick() {
        if (SceneManager.instance) {
            SceneManager.instance.startLevel("Game");
        } else {
            cc.director.loadScene("Game");
        }
    }
}