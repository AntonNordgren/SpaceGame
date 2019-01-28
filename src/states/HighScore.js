export default class HighScore extends Phaser.State {

    init(firebase) {
        // this.firebase = firebase;
    }

    create() {

        this.firebase = require('firebase');
        if(!this.firebase.apps.length) {
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

        this.bg = this.add.tileSprite(0, 0, 1024, 768, 'highScoreBg');
        this.highScoreList = [];

        this.firebase.database().ref('/players').orderByChild("score").once("value").then((snapshot) => {

            snapshot.forEach((player) => {
                this.highScoreList.push(player.val());
            });
            this.highScoreList.reverse();

            let textStyle = { font: "40px Arial", align: "center", fill: "yellow" };
            let indentation = 130;
            let rank = 1;

            /*
            this.highScoreList.map((player => { 
            }));
            */

            for(let i = 0; i < 5; i++) {
                let highScoreText = this.game.add.text(this.game.world.centerX, indentation, rank + ". " + this.highScoreList[i].name + " - score: " + this.highScoreList[i].score, textStyle);
                highScoreText.anchor.set(0.5);
                indentation += 50;
                rank++;
            }

        })

        this.backButton = this.game.add.button(this.game.world.centerX, this.game.height / 1 - 75, 'backButton', () => {
            this.game.state.start('startScreen');
        }, this, 1, 1, 1);
        this.backButton.anchor.set(0.5);
        this.backButton.scale.setTo(.2);
    }

    update() {

    }

}