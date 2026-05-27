import SceneManager from "./SceneManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SelectLevel extends cc.Component {

    public level1() {
        SceneManager.instance.startLevel("Game");
    }
}