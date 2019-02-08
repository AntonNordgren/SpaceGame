export default class Ufo extends Phaser.Sprite {

	constructor(game, x, y, side, frame,) {
		super(game, x, y, 'enemyUfo', frame);

		this.game.physics.enable(this, Phaser.Physics.ARCADE);
		this.bounceTick = Math.random() * 2;
		this.outOfBoundsKill = true;
		this.anchor.setTo(.5, .5);
		// this.body.setSize(50, 50, 0, 0);
		
		if (side === 'left') {
			// right to left
			this.scale.setTo(-.35, .35);
			this.body.velocity.x = -175;
		}
		else if(side === 'right') {
			// left to right
			this.scale.setTo(.35, .35);
			// this.scale.setTo(0, 0);
			this.body.velocity.x = 175;
		}

	}

	update() {
		this.bounceTick += .02;
		this.y += Math.sin(this.bounceTick) * 2;
	}
}