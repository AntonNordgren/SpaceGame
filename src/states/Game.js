import Player from "../prefabs/Player.js";
import Ufo from "../prefabs/Ufo.js";
import NumberBox from "../prefabs/NumberBox.js";
import HealthBar from "../prefabs/Healthbar.js";
import Boulder from "../prefabs/Boulder.js";
import Seeker from "../prefabs/Seeker.js";

export default class Game extends Phaser.State {

  constructor() {
    super();
  }

  create() {
    this.spawnTimer = 10;
    this.highScoreList = [];
    this.highestScore;
    this.lowestScore;

    this.firebase = require('firebase');
    if (!this.firebase.apps.length) {
      this.config = {
        apiKey: "AIzaSyDpvw9J4NQ1_l_U7OuzxLSXBBwfGZXUU2g",
        authDomain: "space-game-71f80.firebaseapp.com",
        databaseURL: "https://space-game-71f80.firebaseio.com",
        projectId: "space-game-71f80",
        storageBucket: "space-game-71f80.appspot.com",
        messagingSenderId: "491452084447"
      }
      this.firebase.initializeApp(this.config);
    }

    this.findLowestScore = (list) => {
      let lowest = list[0].score;
      for (let i = 1; i < list.length; i++) {
        if (list[i].score < lowest) {
          lowest = list[i].score;
        }
      }
      return lowest;
    }

    this.findHighestScore = (list) => {
      let highest = list[0].score;
      for (let i = 1; i < list.length; i++) {
        if (list[i].score > highest) {
          highest = list[i].score;
        }
      }
      return highest;
    }

    this.firebase.database().ref('/players').orderByChild("score").once("value").then((snapshot) => {
      if (snapshot.val() != null) {
        snapshot.forEach((player) => {
          this.highScoreList.push(player.val());
        });
        this.highestScore = this.findHighestScore(this.highScoreList);
        this.lowestScore = this.findLowestScore(this.highScoreList);
      }
      else {
        this.highestScore = undefined;
        this.lowestScore = undefined;
      }
    });

    this.birdSpawnChance = .003;
    this.boulderSpawnChance = .003;
    this.seekerSpawnChance = .003;
    this.score = 0;

    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.bg = this.add.tileSprite(0, 0, 1024, 768, 'space');
    this.bullets = this.add.group();

    this.player = new Player(this.game, this.game.width / 2, this.game.height / 2, this.bullets);
    this.game.add.existing(this.player);

    this.enemies = this.add.group();

    this.seekerExplosions = this.game.add.emitter(0, 1, 100);
    this.seekerExplosions.makeParticles('tinyRock');
    this.seekerExplosions.minParticleScale = 0.1;
    this.seekerExplosions.maxParticleScale = 0.3;
    this.seekerExplosions.setAlpha(1, .5, 3000);

    this.boulderExplosions = this.game.add.emitter(0, 1, 100);
    this.boulderExplosions.makeParticles('smallRock');
    this.boulderExplosions.minParticleScale = 0.1;
    this.boulderExplosions.maxParticleScale = 0.3;
    this.boulderExplosions.setAlpha(1, .5, 2000);

    this.game.load.audio('static', 'assets/audio/seekerDeathSound.mp3');
    this.seekerDeathSound = this.game.add.audio('static');
    this.seekerDeathSound.volume = .5;

    this.game.load.audio('ufoDeath', 'assets/audio/ufoDeath.mp3');
    this.ufoDeathSound = this.game.add.audio('ufoDeath');
    this.ufoDeathSound.volume = .5;

    this.game.load.audio('explosion', 'assets/audio/explosion.mp3');
    this.explosion = this.game.add.audio('explosion');
    this.explosion.volume = .25;

    this.game.load.audio('hit', 'assets/audio/hitSound.mp3');
    this.hitSound = this.game.add.audio('hit');
    this.hitSound.volume = .2;

    this.game.load.audio('gameOver', 'assets/audio/gameover.mp3');
    this.gameOverSound = this.game.add.audio('gameOver');
    this.gameOverSound.volume = .5;

    this.game.load.audio('playerHit', 'assets/audio/damageTaken.mp3');
    this.damageTaken = this.game.add.audio('playerHit');
    this.damageTaken.volume = .5;

    this.game.time.events.loop(Phaser.Timer.SECOND * this.spawnTimer, () => {
      this.birdSpawnChance += 0.001;
      this.boulderSpawnChance += 0.001;
      this.seekerSpawnChance += 0.001;
    }, this);

    this.setupUI();

  }

  setupUI() {

    this.UILayer = this.add.group();

    this.scoreField = new NumberBox(this.game, "circle", 0);
    this.UILayer.add(this.scoreField);

    this.healthBar = new HealthBar(this.game, 120, 40, "health_bar", "health_holder");
    this.UILayer.add(this.healthBar);
  }

  update() {

    // Bird
    if (Math.random() < this.birdSpawnChance) {

      let side = Math.random();

      if (side <= .5) {
        this.enemies.add(new Ufo(this.game, -300, Math.random() * this.game.height, 'right'));
      }
      else {
        this.enemies.add(new Ufo(this.game, this.game.width + 100, Math.random() * this.game.height, 'left'));
      }

    }

    // Boudler
    if (Math.random() < this.boulderSpawnChance) {
      let enemy = new Boulder(this.game, (Math.random() * 800), -100);
      this.enemies.add(enemy);
    }

    // Seeker
    if (Math.random() < this.seekerSpawnChance) {
      let enemy;
      let side = Math.random();

      if (side <= .25) {
        enemy = new Seeker(this.game, (Math.random() * 800), -100, this.player);
        this.enemies.add(enemy);
      }
      else if (side <= .5 && side >= .25) {
        enemy = new Seeker(this.game, (Math.random() * 800), this.game.height + 100, this.player);
        this.enemies.add(enemy);
      }
      else if (side <= .75 && side >= .5) {
        enemy = new Seeker(this.game, -100, (Math.random() * 800), this.player);
        this.enemies.add(enemy);
      }
      else if (side <= 1 && side >= .75) {
        enemy = new Seeker(this.game, this.game.width + 100, (Math.random() * 800), this.player);
        this.enemies.add(enemy);
      }
    }

    this.physics.arcade.overlap(this.enemies, this.bullets, this.damageEnemy, null, this);
    this.physics.arcade.overlap(this.player, this.enemies, this.damagePlayer, null, this);

  }

  render() {
    // this.game.debug.body(this.player);
    // this.enemies.forEachAlive(this.game.debug.body, this.game.debug, "yellow", false);
  }

  damageEnemy(enemy, bullet) {

    this.hitSound.play();

    if (enemy.key === 'boulder') {
      this.explosion.play();

      this.boulderExplosions.x = enemy.x;
      this.boulderExplosions.y = enemy.y;

      this.boulderExplosions.explode(1000, 15);
    }
    else if (enemy.key === 'seeker') {
      this.seekerDeathSound.play();

      this.seekerExplosions.x = enemy.x;
      this.seekerExplosions.y = enemy.y;

      this.seekerExplosions.explode(1000, 10);
    }
    else if (enemy.key === 'enemyUfo') {
      this.ufoDeathSound.play();

      this.seekerExplosions.x = enemy.x;
      this.seekerExplosions.y = enemy.y;

      this.seekerExplosions.explode(1000, 10);
    }

    enemy.kill();
    bullet.kill();

    this.score++;
    this.scoreField.setValue(this.score);

  }

  damagePlayer(playerRef, enemyRef) {
    this.damageTaken.play();
    this.player.damage(1);
    this.healthBar.setValue(this.player.health.current / this.player.health.max);
    enemyRef.kill();

    if (this.player.health.current <= 0) {

      this.gameOverSound.play();

      if (this.score > this.lowestScore || this.lowestScore === undefined || this.highScoreList.length < 5) {
        this.game.state.start('newHighScore', 1, 1, this.score);
      }
      else {
        this.game.state.start('gameOver', 1, 1, this.score);
      }
    }
  }
}