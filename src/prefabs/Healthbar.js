export default class HealthBar extends Phaser.Group {

    constructor(game, x, y, barGraphic, holderGraphic) {
        super(game);
        this.x = x;
        this.y = y;

        this.bar = this.create(0, 0, barGraphic);
        this.holder = this.create(0, 0, holderGraphic);
    }

    setValue(value) {
        if(this.tween) this.tween.stop();
        this.tween = this.game.add.tween(this.bar.scale);
        this.tween.to({ x: value }, 350);
        this.tween.start();
    }

}