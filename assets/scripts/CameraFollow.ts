const { ccclass, property } = cc._decorator;

@ccclass
export default class CameraFollow extends cc.Component {

    @property(cc.Node)
    player: cc.Node = null;

    protected onLoad(): void {
        this.node.y = this.player.y;
    }

    update(dt: number) {
        if (!this.player) return;

        this.node.x = this.player.x;
    }
}