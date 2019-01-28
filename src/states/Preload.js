export default class Preload {

  constructor() {
    this.asset = null;
    this.ready = false;
  }

  preload() {
    this.load.image('loading_bg', 'assets/images/loading_bg.jpg');
  }

  create() {

    //background for game
    this.add.sprite(0,0, "loading_bg");

    this.asset = this.add.sprite(this.game.width/2,this.game.height/2, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);

    //do all your loading here
    //this.load.image('player', 'assets/images/player.png'); //width and height of sprite

    this.load.image('startButton', 'assets/images/startButton.png');

    this.load.image('bg', 'assets/images/bg.jpg');
    this.load.image('space', 'assets/images/space.png');
    this.load.image('playerBullet', 'assets/images/playerBullet.png');
    this.load.image('enemyBullet', 'assets/images/playerBullet.png');

    this.load.image('heroship', 'assets/images/heroship.png');

    this.load.spritesheet('bird', 'assets/images/bird.png', 184, 169);

    this.load.image('circle', 'assets/images/circle.png');

    this.load.image('feather', 'assets/images/feather.png');

    this.load.audio('pew', 'assets/audio/pew2.mp3');
    this.load.audio('chicken', 'assets/audio/chicken.mp3');

    this.load.audio('music', 'assets/audio/HorribleSong.mp3');
    this.load.audio('explosion', 'assets/audio/explosion.mp3');

    this.load.image('gameOverScreen', 'assets/images/GameOverScreen.png');

    this.load.image('boulder', 'assets/images/boulder.png');
    this.load.image('smallRock', 'assets/images/smallRock.png');

    this.load.image('seeker', 'assets/images/seeker.png');

    this.load.image('redSpace', 'assets/images/redSpace.jpg');

    this.load.image('highScoreBg', 'assets/images/milkyway.jpeg');
    this.load.image('highscoreButton', 'assets/images/highscoreButton.png');

    this.load.image('backButton', 'assets/images/backButton.png');

    this.load.image('purpleSpace', 'assets/images/purpleSpace.jpg');

    this.load.image('submitButton', 'assets/images/submitButton.png');

    //staaaart load
    this.load.start();
  }

  update() {

    if(this.ready) {
      this.game.state.start('startScreen');
    }

  }

  onLoadComplete() {
    this.ready = true;
  }

}