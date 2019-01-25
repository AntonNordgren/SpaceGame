import Player from "../prefabs/Player.js";
import Bird from "../prefabs/Bird.js";
import NumberBox from "../prefabs/NumberBox.js";
import Boulder from "../prefabs/Boulder.js";
import Seeker from "../prefabs/Seeker.js";

export default class Game extends Phaser.State {

  constructor() {
    super();
  }

  create() {
    this.birdSpawnChance = .01;
    this.boulderSpawnChance = .01;
    this.seekerSpawnChance = .01;
    this.score = 0;

    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.bg = this.add.tileSprite(0, 0, 1024, 768, 'space');
    this.bullets = this.add.group();

    this.player = new Player(this.game, this.game.width / 2, this.game.height / 2, this.bullets);
    this.game.add.existing(this.player);

    this.enemies = this.add.group();
    // this.enemyBullets = this.add.group();

    this.birdExplosions = this.game.add.emitter(0, 1, 100);
    this.birdExplosions.makeParticles('feather');
    this.birdExplosions.minParticleScale = 0.1;
    this.birdExplosions.maxParticleScale = 0.3;
    this.birdExplosions.setAlpha(1, .5, 2000);

    this.boulderExplosions = this.game.add.emitter(0, 1, 100);
    this.boulderExplosions.makeParticles('smallRock');
    this.boulderExplosions.minParticleScale = 0.1;
    this.boulderExplosions.maxParticleScale = 0.3;
    this.boulderExplosions.setAlpha(1, .5, 2000);

    this.scoreField = new NumberBox(this.game, "circle", 0);
    this.UILayer = this.add.group();
    this.UILayer.add(this.scoreField);

    this.game.load.audio('chicken', 'assets/audio/chicken.mp3');
    this.chicken = this.game.add.audio('chicken');
    this.chicken.volume = .05;

    this.game.load.audio('explosion', 'assets/audio/explosion.mp3');
    this.explosion = this.game.add.audio('explosion');
    this.explosion.volume = .25;

    /*
    this.music = this.game.add.audio('music');
    this.music.play('', 0, .5, true);
    */
  }

  update() {

    this.bg.tilePosition.x -= .1;
    this.bg.tilePosition.y += .2;

    if (Math.random() < this.birdSpawnChance) {

      if (Math.random() <= .5) {
        this.enemies.add(new Bird(this.game, -100, Math.random() * this.game.height));
      }
      else {
        this.enemies.add(new Bird(this.game, this.game.width + 100 + (Math.random() * 400), Math.random() * this.game.height));
      }

    }

    if(Math.random() < this.boulderSpawnChance) {
      let enemy = new Boulder(this.game, (Math.random() * 700), -100);
      this.enemies.add(enemy);
    }

    if(Math.random() < this.seekerSpawnChance) {
      let enemy = new Seeker(this.game, (Math.random() * 700), this.game.height + 100, this.player);
      this.enemies.add(enemy);
    }

    if (Math.random() < .0001) {
      this.birdSpawnChance += 0.05;
      this.boulderSpawnChance += 0.05;
    }

    this.physics.arcade.overlap(this.enemies, this.bullets, this.damageEnemy, null, this);
    this.physics.arcade.overlap(this.player, this.enemies, this.damagePlayer, null, this);

  }

  damageEnemy(enemy, bullet) {

    if (enemy.key === 'boulder') {
      this.explosion.play();

      this.boulderExplosions.x = enemy.x;
      this.boulderExplosions.y = enemy.y;

      this.boulderExplosions.explode(1000, 15);
    }
    else if (enemy.key === 'bird') {
      this.chicken.play();

      this.birdExplosions.x = enemy.x;
      this.birdExplosions.y = enemy.y;

      this.birdExplosions.explode(1000, 10);
    }

    enemy.kill();
    bullet.kill();

    this.score++;
    this.scoreField.setValue(this.score);

  }

  damagePlayer(playerRef, enemyRef) {
    this.player.damage(1);
    enemyRef.kill();

    if (this.player.health.current <= 0) {
      this.game.state.start('gameOver', 1, 1, this.score);
    }

  }

}