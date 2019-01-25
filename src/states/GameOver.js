export default class GameOver extends Phaser.State {
    
    init(score) {
        this.score = score;
    }

    create() {
        this.bg = this.add.tileSprite(0, 0, 800, 600, 'redSpace');

        let gameOverstyle = { font: "100px Arial", align: "center", fill: "#fff" };
        let gameOverText = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 40, "Game Over!", gameOverstyle);
        gameOverText.anchor.set(0.5);

        let scoreStyle = { font: "50px Arial", align: "center", fill: "#fff" };
        let scoreText = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 50, "Your Score: " + this.score, scoreStyle);
        scoreText.anchor.set(0.5);

        // let clickStyle = { font: "50px Arial", align: "center", fill: "#fff" };
        // let clickText = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 230, ".", clickStyle);
        // clickText.anchor.set(0.5);

    }

    update() {
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            this.game.state.start('startScreen');
        }
    }

}