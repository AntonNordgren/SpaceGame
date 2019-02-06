export default class Player extends Phaser.Sprite {

  constructor(game, x, y, bullets) {

    super(game, x, y, 'heroship', 0);

    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.drag.x = 250;
    this.body.drag.y = 250;
    this.body.collideWorldBounds = true;
    
    this.speed = 200;
    this.bulletSpeed = 1500;
    this.anchor.setTo(.5, .5);

    this.bullets = bullets;
    this.bulletGate = 0;
    this.shotInterval = 500;

    this.W_Button = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
    this.A_Button = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    this.S_Button = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
    this.D_Button = this.game.input.keyboard.addKey(Phaser.Keyboard.D);

    this.game.load.audio('pew', 'assets/audio/pew.mp3');
    this.pew = this.game.add.audio('pew');
    this.pew.volume = .05;

    this.health = { current: 1, max: 1 };

    this.body.setSize(25, 25, 0, 0);

  }

  update() {

    this.rotation = this.game.physics.arcade.angleToPointer(this);

    if (this.W_Button.isDown) {
      this.body.velocity.y = -this.speed;
    }
    if (this.A_Button.isDown) {
      this.body.velocity.x = -this.speed;
    }
    if (this.S_Button.isDown) {
      this.body.velocity.y = this.speed;
    }
    if (this.D_Button.isDown) {
      this.body.velocity.x = this.speed;
    }
    if (this.game.input.activePointer.isDown) {
      this.fire();
    }

  }

  fire() {
    if (this.game.time.now > this.bulletGate) {
      
      let bullet = this.bullets.getFirstDead();
      
      if (bullet) {
        bullet.x = this.x;
        bullet.y = this.y;
        bullet.revive();
        this.pew.play();
      }
      else {
        bullet = this.bullets.create(this.x, this.y, "playerBullet");
        this.game.physics.enable(bullet, Phaser.Physics.ARCADE);
        bullet.outOfBoundsKill = true;
        bullet.checkWorldBounds = true;
        this.pew.play();
      }
      this.game.physics.arcade.moveToPointer(bullet, this.bulletSpeed);

      this.bulletGate = this.game.time.now + this.shotInterval;
    }
  }

  damage(amt) {
    this.health.current -= amt;
  }

}