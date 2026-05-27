import SceneManager from "./SceneManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ScoreUI extends cc.Component {

    private label: cc.Label = null;

    onLoad() {
        this.label = this.getComponent(cc.Label);
    }

    update(dt: number) {
        if (this.label && SceneManager.instance) {
            this.label.string = SceneManager.instance.score;
        }
    }
}