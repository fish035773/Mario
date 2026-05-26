const { ccclass, property } = cc._decorator;

@ccclass
export default class CameraFollow extends cc.Component {

    @property(cc.Node)
    player: cc.Node = null;

    update(dt: number) {
        if (!this.player) return;

        this.node.x = this.player.x;
    }
}