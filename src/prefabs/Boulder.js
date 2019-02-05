export default class Boulder extends Phaser.Sprite {
    constructor(game, x, y, frame) {
        super(game, x, y, 'boulder', frame);

        this.game.physics.enable(this, Phaser.Physics.ARCADE);

        this.outOfBoundsKill = true;
        this.scale.setTo(.5, .5);
        this.anchor.setTo(.5, .5);

        this.rotationSpeed = 4;
        this.fallSpeed = 3;

        this.body.setSize(95, 95, 0, 5);
    }

    update() {
        this.angle += this.rotationSpeed;
        this.body.velocity.y += this.fallSpeed;
    }

}