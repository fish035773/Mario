const { ccclass, property } = cc._decorator;

@ccclass
export default class ButtonAnim extends cc.Component {

    @property
    zoomRatio: number = 1.1; // 放大的倍率 (1.1倍)

    @property
    wobbleAngle: number = 3; // 左右搖擺的角度 (3度)

    @property
    animSpeed: number = 0.5; // 單次動畫的時間 (0.5秒)

    start() {
        // 先記錄按鈕原本的大小，這樣不管你按鈕原本設多大都不會跑版
        let originalScale = this.node.scale;

        cc.tween(this.node)
            // 第一步：放大並向右微微旋轉
            .to(this.animSpeed, 
                { scale: originalScale * this.zoomRatio, angle: this.wobbleAngle }, 
                { easing: 'sineInOut' } // 使用平滑的加減速效果，看起來更像在呼吸
            )
            .to(this.animSpeed, 
                { scale: originalScale, angle: -this.wobbleAngle }, 
                { easing: 'sineInOut' }
            )
            .union()
            // 設定為永遠重複
            .repeatForever()
            // 啟動！
            .start();
    }
}