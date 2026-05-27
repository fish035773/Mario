import SceneManager from "./SceneManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TimerUI extends cc.Component {

    private label: cc.Label = null;
    private timeRemaining: number = 180; 

    onLoad() {
        this.label = this.getComponent(cc.Label);
    }

    update(dt: number) {
        if (this.timeRemaining <= 0) return;

        this.timeRemaining -= dt;

        if (this.timeRemaining <= 0) {
            this.timeRemaining = 0;
            if (SceneManager.instance) {
                SceneManager.instance.playerDie();
            }
        }

        this.updateDisplay();
    }

    updateDisplay() {
        if (!this.label) return;
        
        let minutes = Math.floor(this.timeRemaining / 60);
        let seconds = Math.floor(this.timeRemaining % 60);

        let minStr = minutes < 10 ? "0" + minutes : minutes;
        let secStr = seconds < 10 ? "0" + seconds : seconds;

        this.label.string = `${minStr}:${secStr}`;
    }
}