export default class StartScreen {

    create() {
        this.bg = this.add.tileSprite(0, 0, 800, 600, 'startScreen');
    }

    update() {
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            this.game.state.start('game');
        }
    }

}