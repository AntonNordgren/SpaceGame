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
  
        console.log(this.highScoreList);
  
        this.highestScore = this.findHighestScore(this.highScoreList);
        this.lowestScore = this.findLowestScore(this.highScoreList);
  
        console.log("Highest: " + this.highestScore);
        console.log("Lowest: " + this.lowestScore);
      }
      else {
        this.highestScore = undefined;
        this.lowestScore = undefined;
      }


    });

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
  }

  update() {

    if (Math.random() < this.birdSpawnChance) {

      if (Math.random() <= .5) {
        this.enemies.add(new Bird(this.game, -100, Math.random() * this.game.height));
      }
      else {
        this.enemies.add(new Bird(this.game, this.game.width + 100 + (Math.random() * 400), Math.random() * this.game.height));
      }

    }

    if (Math.random() < this.boulderSpawnChance) {
      let enemy = new Boulder(this.game, (Math.random() * 700), -100);
      this.enemies.add(enemy);
    }

    if (Math.random() < this.seekerSpawnChance) {
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

  render() {
    // this.game.debug.body(this.player);
    // this.enemies.forEachAlive(this.game.debug.body, this.game.debug, "yellow", false);
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

      console.log(this.highScoreList.length);

      if (this.score > this.lowestScore || this.lowestScore === undefined || this.highScoreList.length < 5) {

        this.game.state.start('newHighScore', 1, 1, this.score);

      }
      else {
        this.game.state.start('gameOver', 1, 1, this.score);

      }
    }
  }
}