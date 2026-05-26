const { ccclass, property } = cc._decorator;

@ccclass
export default class StartMenu extends cc.Component {

    public startGame() {
        cc.director.loadScene("SelectLevel");
    }
}