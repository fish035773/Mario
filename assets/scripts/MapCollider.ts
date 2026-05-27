const { ccclass, property } = cc._decorator;

@ccclass
export default class MapCollider extends cc.Component {

    @property
    objectLayerName: string = "Collisions";

    onLoad() {
        let physicsManager = cc.director.getPhysicsManager();
        physicsManager.enabled = true;
        physicsManager.gravity = cc.v2(0, -1000);

        physicsManager.debugDrawFlags =
            cc.PhysicsManager.DrawBits.e_shapeBit;

        let tiledMap = this.getComponent(cc.TiledMap);

        if (!tiledMap) {
            cc.error("MapCollider 必須掛在有 cc.TiledMap 的節點上");
            return;
        }

        let collisionLayer = tiledMap.getObjectGroup(this.objectLayerName);

        if (!collisionLayer) {
            cc.error("找不到 Tiled Object Layer: " + this.objectLayerName);
            return;
        }

        // 取得地圖總高度 (網格數量 * 單格像素)
        let mapSize = tiledMap.getMapSize();
        let tileSize = tiledMap.getTileSize();
        let mapHeight = mapSize.height * tileSize.height;


        let objects = collisionLayer.getObjects();

        cc.log("Collisions objects count:", objects.length);

        // ⭐ 取得地圖節點的寬高與錨點，計算出左下角到底偏移了多少
        let offsetX = this.node.width * this.node.anchorX;
        let offsetY = this.node.height * this.node.anchorY;

        for (let i = 0; i < objects.length; i++) {
            let obj: any = objects[i];

            let node = new cc.Node(obj.name || "Ground");
            this.node.addChild(node);

            // ⭐ 你的原始邏輯非常正確，只要扣掉錨點偏移量就完美對齊了！
            let x = obj.x + obj.width / 2 - offsetX;
            let y = obj.y - obj.height / 2 - offsetY;

            node.setPosition(x, y);

            let rb = node.addComponent(cc.RigidBody);
            rb.type = cc.RigidBodyType.Static;

            let collider = node.addComponent(cc.PhysicsBoxCollider);
            collider.size = cc.size(obj.width, obj.height);
            collider.offset = cc.v2(0, 0);
            collider.sensor = false;
            collider.apply();

            cc.log(
                "建立碰撞體:",
                node.name,
                "x =", x,
                "y =", y,
                "w =", obj.width,
                "h =", obj.height
            );
        }
    }
}