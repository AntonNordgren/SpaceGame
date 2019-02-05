export default class Seeker extends Phaser.Sprite {

    constructor(game, x, y, player, frame) {
        super(game, x, y, 'seeker', player, frame);

        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.outOfBoundsKill = true;
        this.anchor.setTo(.5, .5);
        this.scale.setTo(.2, .2);
        this.player = player;
        
        this.body.setSize(150, 150, 0, 0);
    }

    update() {

        this.game.physics.arcade.moveToObject(this, this.player);
        this.angle += 1;

    }

}