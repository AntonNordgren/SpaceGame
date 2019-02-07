export default class StartScreen extends Phaser.State {

    init() {
    }

    create() {
        this.bg = this.add.tileSprite(0, 0, 1024, 768, 'startScreenBG');
        this.startButton = this.game.add.button(this.game.world.centerX, this.game.height / 3, 'startButton', () => {
            this.game.state.start('game');
        }, this, 1, 1, 1);
        this.startButton.anchor.set(0.5);

        this.highscoreButton = this.game.add.button(this.game.world.centerX, this.game.height / 2, 'highscoreButton', () => {
            this.game.state.start('highScore');
        }, this, 1, 1, 1);
        this.highscoreButton.anchor.set(0.5);
        this.highscoreButton.scale.setTo(.2);
    }

    update() {

        // this.bg.tilePosition.y -= .5;

        if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            this.game.state.start('game');
        }
    }

}