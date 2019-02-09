export default class GameOver extends Phaser.State {
    init(score) {
        this.score = score;
    }

    create() {
        this.bg = this.add.tileSprite(0, 0, 800, 600, 'redSpace');

        let gameOverText = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 40, "Game Over!",
            { font: "100px Arial", align: "center", fill: "#fff" });
        gameOverText.anchor.set(0.5);

        let scoreText = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 50, "Your Score: " + this.score,
            { font: "50px Arial", align: "center", fill: "#fff" });
        scoreText.anchor.set(0.5);

        let clickText = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 230, "Press spacebar to return to the menu",
            { font: "40px Arial", align: "center", fill: "#fff" });
        clickText.anchor.set(0.5);
    }

    update() {
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            this.game.state.start('startScreen');
        }
    }

}