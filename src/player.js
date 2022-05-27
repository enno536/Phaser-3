import 'phaser';
class Player extends Phaser.Physics.Arcade.Sprite {
    controls
    score
    scoreText
    highscore
    highscoreText

    constructor(scene, x, y, keys) {
        super(scene, x, y, 'dude');
        this.controls = keys;
    }
}

export default Player;