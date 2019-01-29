export default class NewHighScore extends Phaser.State {

    init(highScore) {
        this.highScore = highScore;
        console.log(this.highScore);
    }

    create() {

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

        this.bg = this.add.tileSprite(0, 0, 1024, 768, 'purpleSpace');

        let HighScoreText = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 150, "HighScore!",
            { font: "100px Arial", align: "center", fill: "#FFF" });
        HighScoreText.anchor.set(0.5);

        this.game.add.plugin(Fabrique.Plugins.InputField);
        this.game.add.plugin(PhaserInput.Plugin);
        this.inputField = this.game.add.inputField(this.game.world.centerX - 80, this.game.world.centerY - 50, {
            font: '18px Arial',
            fill: '#212121',
            fontWeight: 'bold',
            width: 150,
            padding: 8,
            borderWidth: 1,
            borderColor: '#000',
            borderRadius: 6,
            placeHolder: 'Enter Name',
        });


        this.submitButton = this.game.add.button(this.game.world.centerX, this.game.height - 100, 'submitButton', () => {

            console.log(this.inputField.value);

            if (this.inputField.value != "") {
                this.firebase.database().ref('/players').push({
                    name: this.inputField.value,
                    score: this.highScore
                });

                this.firebase.database().ref('/players').orderByChild("score").once("value").then((snapshot) => {

                    this.highScoreList = [];

                    snapshot.forEach((player) => {
                        this.highScoreList.push(player.val());
                    });

                    
                    this.highScoreList.reverse();
                    this.firebase.database().ref('/players').remove();
                    
                    console.log(this.highScoreList.length);

                    if(this.highScoreList.length < 5) {
                        for (let i = 0; i < this.highScoreList.length; i++) {
                            this.firebase.database().ref('/players').push({
                                name: this.highScoreList[i].name,
                                score: this.highScoreList[i].score,
                            })
                        }
                    }
                    else {
                        for (let i = 0; i < 5; i++) {
                            this.firebase.database().ref('/players').push({
                                name: this.highScoreList[i].name,
                                score: this.highScoreList[i].score,
                            })
                        }
                    }


                }).then(() => {
                    this.game.state.start('startScreen');
                })
            }

        }, this, 1, 1, 1);
        this.submitButton.anchor.set(0.5);
        this.submitButton.scale.setTo(.2);

    }

    update() {

    }

}