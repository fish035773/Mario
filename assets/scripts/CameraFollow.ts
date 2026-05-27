const { ccclass, property } = cc._decorator;

@ccclass
export default class CameraFollow extends cc.Component {

    @property(cc.Node)
    playerNode: cc.Node = null;

    @property(cc.Node)
    mapNode: cc.Node = null;

    private camera: cc.Camera = null;

    onLoad() {
        this.camera = this.getComponent(cc.Camera);
    }

    update(dt: number) {
        if (!this.playerNode) {
            cc.warn("沒有綁定 Player");
            return;
        }

        if (!this.mapNode) {
            cc.warn("沒有綁定 Map");
            return;
        }

        let targetX = this.playerNode.x;
        let targetY = this.playerNode.y;

        let zoom = this.camera ? this.camera.zoomRatio : 1;

        let halfViewWidth = cc.winSize.width / 2 / zoom;
        let halfViewHeight = cc.winSize.height / 2 / zoom;

        // mapNode anchor 是 0.5, 0.5
        let mapLeft = this.mapNode.x - this.mapNode.width / 2;
        let mapRight = this.mapNode.x + this.mapNode.width / 2;
        let mapBottom = this.mapNode.y - this.mapNode.height / 2;
        let mapTop = this.mapNode.y + this.mapNode.height / 2;

        let minX = mapLeft + halfViewWidth;
        let maxX = mapRight - halfViewWidth;

        let minY = mapBottom + halfViewHeight;
        let maxY = mapTop - halfViewHeight;

        if (minX > maxX) {
            targetX = (mapLeft + mapRight) / 2;
        } else {
            targetX = cc.misc.clampf(targetX, minX, maxX);
        }

        if (minY > maxY) {
            targetY = (mapBottom + mapTop) / 2;
        } else {
            targetY = cc.misc.clampf(targetY, minY, maxY);
        }

        this.node.x = cc.misc.lerp(this.node.x, targetX, 0.1);
        this.node.y = cc.misc.lerp(this.node.y, targetY, 0.1);
    }
}