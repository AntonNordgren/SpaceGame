
import Menu from "../prefabs/Menu.js";

export default class StartScreen extends Phaser.State {

    create() {
        this.bg = this.add.tileSprite(0, 0, 1024, 768, 'space');
        // this.menu = new Menu(this.game);

        /*
        this.button = this.game.add.button(this.game.width / 2 - 50, this.game.height / 3 - 30, 'startButton', () => {
            this.game.state.start('game');
        }, this, 1, 1, 1);
        */
       this.button = this.game.add.button(this.game.world.centerX, this.game.height / 3, 'startButton', () => {
           this.game.state.start('game');
        }, this, 1, 1, 1);
        this.button.anchor.set(0.5);
        // this.button.scale.setTo(1.5);
    }

    update() {

        this.bg.tilePosition.y -= .5;

        if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            this.game.state.start('game');
        }
    }

}