export default class Bird extends Phaser.Sprite {

	constructor(game, x, y, bulletLayer, frame) {
		super(game, x, y, 'bird', frame);

		this.game.physics.enable(this, Phaser.Physics.ARCADE);

		this.bounceTick = Math.random() * 2;

		this.bulletLayer = bulletLayer;

		this.outOfBoundsKill = true;

		this.animations.add("fly");
		this.animations.play("fly", 14, true);

		this.anchor.setTo(.5, .5);
		
		if (Math.random() <= .5) {
			this.scale.setTo(-.5, .5);
			this.body.x + 183;
			this.body.velocity.x = -175;
		}
		else {
			this.scale.setTo(.5, .5);
			this.body.velocity.x = 175;
		}

	}

	update() {
		this.bounceTick += .02;
		this.y += Math.sin(this.bounceTick) * 2;
	}
}