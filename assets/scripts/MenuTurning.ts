const { ccclass, property } = cc._decorator;

@ccclass
export default class Goal extends cc.Component {

    @property
    rotateSpeed: number = 120;

    @property
    rotateWay: string = "right"

    update(dt: number) {
        
        if(this.rotateWay === "right"){
            this.node.angle += this.rotateSpeed * dt;
        }
        else if(this.rotateWay === "left"){
            this.node.angle += this.rotateSpeed * -dt;
        }
    }

}